import type { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";

// Banco de preguntas con respuestas numéricas para el Land Cruiser
const PREGUNTAS = [
  { texto: "¿Cuántos kilómetros hay en carretera de Aguadulce a Madrid?", valor: 545 },
  { texto: "¿Cuántos caballos de vapor (CV) tiene un Toyota Land Cruiser clásico?", valor: 177 },
  { texto: "¿En qué año se lanzó el primer Toyota Land Cruiser?", valor: 1951 },
  { texto: "¿Cuántos peldaños tiene la subida al cerro de San Cristóbal en Almería?", valor: 140 },
  { texto: "¿Cuántos episodios tiene en total la serie 'Aquí no hay quien viva'?", valor: 91 },
  { texto: "¿A qué velocidad máxima teórica (km/h) puede ponerse un Land Cruiser cuesta abajo?", valor: 175 },
  { texto: "¿Cuántos municipios tiene la provincia de Almería?", valor: 103 },
  { texto: "¿Cuántos metros de longitud tiene la muralla de la Alcazaba de Almería?", valor: 1430 },
  { texto: "¿Cuántos huesos tiene el cuerpo humano adulto?", valor: 206 },
  { texto: "¿Cuántos litros de combustible caben en el depósito de un Land Cruiser?", valor: 87 }
];

interface Player {
  id: string;
  name: string;
  socketId: string;
}

interface EstadoJuego {
  preguntaActual: string;
  numeroActual: number;
  esTriplazo: boolean;
  capitanActual: string;
  jugadores: string[];
  turnoIndex: number;
  puntuaciones: Record<string, number>;
}

interface Room {
  code: string;
  players: Player[];
  phase: "LOBBY" | "BETTING" | "DECISION" | "RESULTS";
  startTimer: NodeJS.Timeout | null;
  preguntaObj: { texto: string; valor: number } | null;
  decisiones: Record<string, "STAY" | "LEAVE">;
  estadoJuego: EstadoJuego;
}

const rooms: Record<string, Room> = {};
let gameIo: Server | undefined;

// Exportación auxiliar por compatibilidad
export function broadcastRoom(roomCode: string) {
  const room = rooms[roomCode];
  if (room && gameIo) {
    gameIo.to(roomCode).emit("roomUpdated", { code: room.code, players: room.players });
  }
}

// Genera un código de 9 letras empezando por TOLAS (ej: TOLAS7B2A)
function generarCodigoSala(): string {
  const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = `TOLAS${suffix}`;
  return rooms[code] ? generarCodigoSala() : code;
}

function empezarPartida(roomCode: string) {
  const room = rooms[roomCode];
  if (!room || !gameIo) return;

  const pregunta = PREGUNTAS[Math.floor(Math.random() * PREGUNTAS.length)];
  room.phase = "BETTING";
  room.preguntaObj = pregunta;
  room.decisiones = {};

  room.estadoJuego.preguntaActual = pregunta.texto;
  room.estadoJuego.numeroActual = 0;
  room.estadoJuego.esTriplazo = false;
  room.estadoJuego.capitanActual = "";
  room.estadoJuego.turnoIndex = 0;

  gameIo.to(roomCode).emit("gameStarted", {
    estadoJuego: room.estadoJuego
  });
}

function pasarAFaseDecision(roomCode: string) {
  const room = rooms[roomCode];
  if (!room || !gameIo) return;

  room.phase = "DECISION";
  room.decisiones = {};

  gameIo.to(roomCode).emit("votingPhase", {
    estadoJuego: room.estadoJuego
  });
}

function resolverRonda(roomCode: string) {
  const room = rooms[roomCode];
  if (!room || !room.preguntaObj || !gameIo) return;

  room.phase = "RESULTS";

  const valorReal = room.preguntaObj.valor;
  const numeroApostado = room.estadoJuego.numeroActual;
  const capitanNombre = room.estadoJuego.capitanActual;
  const esTriplazo = room.estadoJuego.esTriplazo;

  // Si la puja no supera el número real, el coche NO se estrella
  const haTenidoExito = numeroApostado <= valorReal;

  const resultados = room.players.map((player) => {
    const esCapitan = player.name === capitanNombre;
    const eleccion = room.decisiones[player.id] || (esCapitan ? "STAY" : "LEAVE");
    let puntosGanados = 0;

    if (haTenidoExito) {
      // ÉXITO: El coche llega a destino
      if (eleccion === "STAY") {
        puntosGanados = esCapitan ? (esTriplazo ? 5 : 3) : (esTriplazo ? 3 : 2);
      } else {
        puntosGanados = 0; // Cobarde: no arriesgó, 0 puntos
      }
    } else {
      // SINIESTRO: El coche se estrella
      if (eleccion === "STAY") {
        puntosGanados = esCapitan ? (esTriplazo ? -4 : -2) : -2;
      } else {
        puntosGanados = 2; // Vio venir el golpe y saltó: se salva
      }
    }

    room.estadoJuego.puntuaciones[player.name] = (room.estadoJuego.puntuaciones[player.name] || 0) + puntosGanados;

    return {
      name: player.name,
      isCaptain: esCapitan,
      decision: eleccion,
      puntosGanados: puntosGanados,
      scoreTotal: room.estadoJuego.puntuaciones[player.name]
    };
  });

  gameIo.to(roomCode).emit("roundResolved", {
    resultados: resultados,
    valorReal: valorReal,
    numeroActual: numeroApostado,
    preguntaTexto: room.estadoJuego.preguntaActual
  });
}

export function attachGameSocket(server: HttpServer) {
  gameIo = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  gameIo.on("connection", (socket: Socket) => {
    // 1. CREAR SALA
    socket.on("createRoom", ({ playerName }: { playerName: string }) => {
      const code = generarCodigoSala();
      const nombre = playerName || "Conductor";

      rooms[code] = {
        code,
        players: [{ id: socket.id, name: nombre, socketId: socket.id }],
        phase: "LOBBY",
        startTimer: null,
        preguntaObj: null,
        decisiones: {},
        estadoJuego: {
          preguntaActual: "",
          numeroActual: 0,
          esTriplazo: false,
          capitanActual: "",
          jugadores: [nombre],
          turnoIndex: 0,
          puntuaciones: { [nombre]: 0 }
        }
      };

      socket.join(code);

      socket.emit("roomUpdated", {
        code: code,
        players: rooms[code].players
      });
    });

    // 2. UNIRSE A SALA
    socket.on("joinRoom", ({ roomCode, playerName }, callback) => {
      const room = rooms[roomCode];

      if (!room) {
        return callback && callback({ success: false, message: "¡Ese Land Cruiser no existe, tolai!" });
      }

      if (room.players.length >= 8) {
        return callback && callback({ success: false, message: "¡El coche va a tope (máx 8)!" });
      }

      if (room.phase !== "LOBBY") {
        return callback && callback({ success: false, message: "¡El viaje ya ha empezado!" });
      }

      const finalName = playerName || `Pasajero_${room.players.length + 1}`;

      room.players.push({ id: socket.id, name: finalName, socketId: socket.id });
      room.estadoJuego.jugadores.push(finalName);
      room.estadoJuego.puntuaciones[finalName] = 0;

      socket.join(roomCode);

      if (callback) callback({ success: true, playerId: socket.id });

      // Actualizar a los pasajeros
      gameIo?.to(roomCode).emit("roomUpdated", {
        code: room.code,
        players: room.players
      });

      // Si ya hay al menos 2 personas, arranca a los 4 segundos
      if (room.players.length >= 2 && !room.startTimer) {
        room.startTimer = setTimeout(() => {
          empezarPartida(roomCode);
        }, 4000);
      }
    });

    // 3. APUESTAS (NORMAL O TRIPLAZO)
    socket.on("playerBet", ({ roomCode, bet, isTriplazo }: { roomCode: string; bet: number; isTriplazo: boolean }) => {
      const room = rooms[roomCode];
      if (!room || room.phase !== "BETTING") return;

      const jugadorTurnoNombre = room.estadoJuego.jugadores[room.estadoJuego.turnoIndex];
      const jugadorActual = room.players.find((p) => p.socketId === socket.id);

      if (!jugadorActual || jugadorActual.name !== jugadorTurnoNombre) return;

      const apuesta = parseInt(bet as any, 10);
      if (isNaN(apuesta) || apuesta <= room.estadoJuego.numeroActual) return;

      room.estadoJuego.numeroActual = apuesta;
      room.estadoJuego.capitanActual = jugadorActual.name;
      room.estadoJuego.esTriplazo = Boolean(isTriplazo);

      if (isTriplazo) {
        pasarAFaseDecision(roomCode);
      } else {
        room.estadoJuego.turnoIndex = (room.estadoJuego.turnoIndex + 1) % room.estadoJuego.jugadores.length;
        gameIo?.to(roomCode).emit("turnUpdated", {
          estadoJuego: room.estadoJuego
        });
      }
    });

    // 4. DECISIÓN: QUEDARSE O BAJARSE
    socket.on("submitDecision", ({ roomCode, decision }: { roomCode: string; decision: "STAY" | "LEAVE" }) => {
      const room = rooms[roomCode];
      if (!room || room.phase !== "DECISION") return;

      const jugador = room.players.find((p) => p.socketId === socket.id);
      if (!jugador) return;

      room.decisiones[jugador.id] = decision;

      if (Object.keys(room.decisiones).length >= room.players.length) {
        resolverRonda(roomCode);
      }
    });

    // 5. DESCONEXIÓN
    socket.on("disconnect", () => {
      for (const code in rooms) {
        const room = rooms[code];
        const index = room.players.findIndex((p) => p.socketId === socket.id);

        if (index !== -1) {
          room.players.splice(index, 1);
          if (room.players.length === 0) {
            if (room.startTimer) clearTimeout(room.startTimer);
            delete rooms[code];
          } else if (room.phase === "LOBBY") {
            room.estadoJuego.jugadores = room.players.map((p) => p.name);
            gameIo?.to(code).emit("roomUpdated", { code: room.code, players: room.players });
          }
          break;
        }
      }
    });
  });

  return gameIo;
}