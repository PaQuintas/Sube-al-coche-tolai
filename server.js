Aquí tienes el backend completo en Node.js con Socket.io.

Está diseñado para encajar al 100% con tu cliente: genera códigos de sala de 9
caracteres con el prefijo TOLAS, gestiona las rondas de turnos circulares, el
pase a fase de votación (por TRIPLAZO o resolución), y computa minuciosamente
las puntuaciones de cada pasajero.

server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Banco de preguntas con respuestas numéricas
const PREGUNTAS = [
  { texto: "¿Cuántos kilómetros hay en carretera de Aguadulce a Madrid?", valor: 545 },
  { texto: "¿Cuántos caballos de vapor (CV) tiene un Toyota Land Cruiser clásico?", valor: 177 },
  { texto: "¿En qué año se lanzó el primer Toyota Land Cruiser?", valor: 1951 },
  { texto: "¿Cuántos peldaños tiene la subida al cerro de San Cristóbal en Almería?", valor: 140 },
  { texto: "¿Cuántos episodios tiene en total la serie 'Aquí no hay quien viva'?", valor: 91 },
  { texto: "¿A qué velocidad máxima teórica (km/h) puede llegar un Land Cruiser cuesta abajo?", valor: 175 },
  { texto: "¿Cuántos municipios tiene la provincia de Almería?", valor: 103 },
  { texto: "¿Cuántos metros de longitud tiene la muralla de la Alcazaba de Almería?", valor: 1430 },
  { texto: "¿Cuántos huesos tiene el cuerpo humano adulto?", valor: 206 },
  { texto: "¿Cuántos días dura una vuelta completa al mundo en el clásico de Julio Verne?", valor: 80 },
  { texto: "¿Cuántos litros de gasolina caben de media en el depósito de un Land Cruiser?", valor: 87 }
];

// Almacén de salas en memoria
const rooms = {};

// Genera un código de 9 caracteres: TOLAS + 4 caracteres alfanuméricos en mayúsculas
function generarCodigoSala() {
  const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = `TOLAS${suffix}`;
  return rooms[code] ? generarCodigoSala() : code;
}

function obtenerPreguntaAleatoria() {
  const indice = Math.floor(Math.random() * PREGUNTAS.length);
  return PREGUNTAS[indice];
}

io.on("connection", (socket) => {
  console.log(`[+] Conexión establecida: ${socket.id}`);

  // 1. CREAR SALA
  socket.on("createRoom", ({ playerName }) => {
    const code = generarCodigoSala();
    const playerId = socket.id;

    rooms[code] = {
      code,
      players: [{ id: playerId, name: playerName || "Tolai Anónimo", socketId: socket.id }],
      phase: "LOBBY", // LOBBY, BETTING, DECISION, RESULTS
      startTimer: null,
      preguntaObj: null,
      decisiones: {}, // { playerId: "STAY" | "LEAVE" }
      estadoJuego: {
        preguntaActual: "",
        numeroActual: 0,
        esTriplazo: false,
        capitanActual: "",
        jugadores: [playerName],
        turnoIndex: 0,
        puntuaciones: { [playerName]: 0 }
      }
    };

    socket.join(code);

    // Notificar al creador de la sala
    socket.emit("roomUpdated", {
      code: code,
      players: rooms[code].players
    });

    console.log(`[SALA CREADA] ${code} por ${playerName}`);
  });

  // 2. UNIRSE A SALA
  socket.on("joinRoom", ({ roomCode, playerName }, callback) => {
    const room = rooms[roomCode];

    if (!room) {
      return callback({ success: false, message: "¡Ese coche no existe, tolai!" });
    }

    if (room.players.length >= 8) {
      return callback({ success: false, message: "¡El Land Cruiser está hasta arriba (máx. 8)!" });
    }

    if (room.phase !== "LOBBY") {
      return callback({ success: false, message: "¡El Land Cruiser ya ha arrancado!" });
    }

    const playerId = socket.id;
    const finalName = playerName || `Pasajero_${room.players.length + 1}`;

    room.players.push({ id: playerId, name: finalName, socketId: socket.id });
    room.estadoJuego.jugadores.push(finalName);
    room.estadoJuego.puntuaciones[finalName] = 0;

    socket.join(roomCode);

    callback({ success: true, playerId });

    // Actualizar sala de espera para todos
    io.to(roomCode).emit("roomUpdated", {
      code: room.code,
      players: room.players
    });

    // Si hay 2 o más pasajeros y no hay cuenta atrás activa, iniciar cuenta para arrancar
    if (room.players.length >= 2 && !room.startTimer) {
      iniciarCuentaAtrasArranque(roomCode);
    }
  });

  // 3. APUESTAS Y TURNOS CIRCULARES
  socket.on("playerBet", ({ roomCode, bet, isTriplazo }) => {
    const room = rooms[roomCode];
    if (!room || room.phase !== "BETTING") return;

    const jugadorTurnoNombre = room.estadoJuego.jugadores[room.estadoJuego.turnoIndex];
    const jugadorActual = room.players.find((p) => p.socketId === socket.id);

    // Validar que sea el turno del jugador que emite
    if (!jugadorActual || jugadorActual.name !== jugadorTurnoNombre) {
      return;
    }

    const apuesta = parseInt(bet, 10);
    if (isNaN(apuesta) || apuesta <= room.estadoJuego.numeroActual) {
      return;
    }

    // Actualizar el estado con la nueva puja
    room.estadoJuego.numeroActual = apuesta;
    room.estadoJuego.capitanActual = jugadorActual.name;
    room.estadoJuego.esTriplazo = Boolean(isTriplazo);

    if (isTriplazo) {
      // Un TRIPLAZO bloquea la puja directamente y pasa a la fase de decisión
      pasarAFaseDecision(roomCode);
    } else {
      // Turno circular al siguiente pasajero
      room.estadoJuego.turnoIndex = (room.estadoJuego.turnoIndex + 1) % room.estadoJuego.jugadores.length;

      io.to(roomCode).emit("turnUpdated", {
        estadoJuego: room.estadoJuego
      });
    }
  });

  // 4. ENVÍO DE DECISIÓN (QUEDARSE DENTRO O BAJARSE)
  socket.on("submitDecision", ({ roomCode, decision }) => {
    const room = rooms[roomCode];
    if (!room || room.phase !== "DECISION") return;

    const jugador = room.players.find((p) => p.socketId === socket.id);
    if (!jugador) return;

    // Guardar voto ('STAY' o 'LEAVE')
    room.decisiones[jugador.id] = decision;

    // Si todos los jugadores conectados han tomado su decisión, resolvemos la ronda
    const totalJugadores = room.players.length;
    const totalDecisiones = Object.keys(room.decisiones).length;

    if (totalDecisiones >= totalJugadores) {
      resolverRonda(roomCode);
    }
  });

  // Desconexión de jugadores
  socket.on("disconnect", () => {
    for (const code in rooms) {
      const room = rooms[code];
      const index = room.players.findIndex((p) => p.socketId === socket.id);

      if (index !== -1) {
        const removed = room.players.splice(index, 1)[0];
        console.log(`[-] ${removed.name} se bajó del coche (${code})`);

        if (room.players.length === 0) {
          if (room.startTimer) clearTimeout(room.startTimer);
          delete rooms[code];
        } else if (room.phase === "LOBBY") {
          room.estadoJuego.jugadores = room.players.map((p) => p.name);
          io.to(code).emit("roomUpdated", { code: room.code, players: room.players });
        }
        break;
      }
    }
  });
});

// Arranca la partida tras unos segundos para que se unan más si quieren
function iniciarCuentaAtrasArranque(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  // 4 segundos de cortesía tras llegar al mínimo de 2 jugadores
  room.startTimer = setTimeout(() => {
    if (room && room.players.length >= 2) {
      empezarPartida(roomCode);
    }
  }, 4000);
}

function empezarPartida(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  room.phase = "BETTING";
  room.preguntaObj = obtenerPreguntaAleatoria();
  room.decisiones = {};

  room.estadoJuego.preguntaActual = room.preguntaObj.texto;
  room.estadoJuego.numeroActual = 0;
  room.estadoJuego.esTriplazo = false;
  room.estadoJuego.capitanActual = "";
  room.estadoJuego.turnoIndex = 0;

  io.to(roomCode).emit("gameStarted", {
    estadoJuego: room.estadoJuego
  });
}

function pasarAFaseDecision(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  room.phase = "DECISION";
  room.decisiones = {};

  io.to(roomCode).emit("votingPhase", {
    estadoJuego: room.estadoJuego
  });
}

// 5. LÓGICA DE PUNTUACIONES EXACTA
function resolverRonda(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  room.phase = "RESULTS";

  const valorReal = room.preguntaObj.valor;
  const numeroApostado = room.estadoJuego.numeroActual;
  const capitanNombre = room.estadoJuego.capitanActual;
  const esTriplazo = room.estadoJuego.esTriplazo;

  // Condición de éxito: El coche no se estrella si la puja NO supera el valor real
  const haTenidoExito = numeroApostado <= valorReal;

  const resultados = [];

  room.players.forEach((player) => {
    const esCapitan = player.name === capitanNombre;
    // Si alguien no votó a tiempo, por defecto se considera STAY si es el capitán, o LEAVE
    const eleccion = room.decisiones[player.id] || (esCapitan ? "STAY" : "LEAVE");
    let puntosGanados = 0;

    if (haTenidoExito) {
      // EL COCHE LLEGÓ A DESTINO (Éxito)
      if (eleccion === "STAY") {
        if (esCapitan) {
          // El capitán se corona: +5 si fue TRIPLAZO, +3 si fue subida normal
          puntosGanados = esTriplazo ? 5 : 3;
        } else {
          // Pasajero fiel que confió y se quedó dentro
          puntosGanados = esTriplazo ? 3 : 2;
        }
      } else {
        // Se bajó por miedo y el coche llegó bien: 0 puntos de cobarde
        puntosGanados = 0;
      }
    } else {
      // EL COCHE SE ESTRELLÓ (Se pasó del número real)
      if (eleccion === "STAY") {
        if (esCapitan) {
          // El capitán estrella el coche: penalización doble si fue triplazo
          puntosGanados = esTriplazo ? -4 : -2;
        } else {
          // Los que se quedaron dentro se comen el siniestro
          puntosGanados = -2;
        }
      } else {
        // Los que se bajaron vieron venir el golpe y se salvaron: premio por listos
        puntosGanados = 2;
      }
    }

    // Actualizar acumulado total
    room.estadoJuego.puntuaciones[player.name] = (room.estadoJuego.puntuaciones[player.name] || 0) + puntosGanados;

    resultados.push({
      name: player.name,
      isCaptain: esCapitan,
      decision: eleccion,
      puntosGanados: puntosGanados,
      scoreTotal: room.estadoJuego.puntuaciones[player.name]
    });
  });

  io.to(roomCode).emit("roundResolved", {
    resultados: resultados,
    valorReal: valorReal,
    numeroActual: numeroApostado,
    preguntaTexto: room.estadoJuego.preguntaActual
  });
}

server.listen(PORT, () => {
  console.log(`🚗 Servidor de ¡Sube al coche, tolai! escuchando en http://localhost:${PORT}`);
});

Cómo ponerlo en marcha

1.  En la carpeta de tu servidor, inicializa e instala las dependencias:
    npm init -y
    npm install express socket.io cors
2.  Guarda el código anterior como server.js.
3.  Inícialo:
    node server.js

Características implementadas:

  - Compatibilidad con prefijo TOLAS: Valida y crea salas con el formato
    TOLASXXXX que espera el frontend.
  - Turnos Circulares: estadoJuego.turnoIndex rota correlativamente entre los
    nombres de los jugadores hasta que alguien pulsa TRIPLAZO.
  - TRIPLAZO Directo: Congela la puja y lanza a toda la sala a la pantalla de
    decisión (activarMenuDecision).
  - Sistema de Puntuaciones:
      - Llegada con éxito (puja <= real):
          - Capitán: +5 pts (con Triplazo) o +3 pts (normal).
          - Pasajeros que se quedaron (STAY): +3 pts (si hubo Triplazo) o +2
            pts.
          - Pasajeros que se bajaron (LEAVE): 0 pts.
      - Siniestro (puja > real):
          - Capitán: -4 pts (si fue Triplazo) o -2 pts.
          - Pasajeros que se quedaron (STAY): -2 pts.
          - Pasajeros que saltaron a tiempo (LEAVE): +2 pts.
