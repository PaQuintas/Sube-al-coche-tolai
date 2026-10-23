import { randomInt, randomUUID } from "node:crypto";
import type { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";

const QUESTIONS = [
  { text: "¿Cuántos kilómetros hay en carretera de Aguadulce a Madrid?", answer: 545 },
  { text: "¿Cuántos caballos de vapor tiene un Toyota Land Cruiser clásico?", answer: 177 },
  { text: "¿En qué año se lanzó el primer Toyota Land Cruiser?", answer: 1951 },
  { text: "¿Cuántos peldaños tiene la subida al cerro de San Cristóbal en Almería?", answer: 140 },
  { text: "¿Cuántos episodios tiene en total la serie «Aquí no hay quien viva»?", answer: 91 },
  { text: "¿Cuántos municipios tiene la provincia de Almería?", answer: 103 },
  { text: "¿Cuántos metros de longitud tiene la muralla de la Alcazaba de Almería?", answer: 1430 },
  { text: "¿Cuántos huesos tiene el cuerpo humano adulto?", answer: 206 },
  { text: "¿Cuántos litros de combustible caben en el depósito de un Land Cruiser?", answer: 87 },
];

type Phase = "LOBBY" | "BETTING" | "DECISION" | "RESULTS";
type Decision = "STAY" | "LEAVE";

interface Player {
  id: string;
  name: string;
  socketId: string;
  connected: boolean;
}

interface RoundScore {
  playerId: string;
  name: string;
  isCaptain: boolean;
  decision: Decision;
  pointsEarned: number;
  scoreTotal: number;
}

interface Room {
  code: string;
  hostPlayerId: string;
  players: Player[];
  phase: Phase;
  question: (typeof QUESTIONS)[number] | null;
  currentBid: number;
  isTriplazo: boolean;
  captainId: string | null;
  turnPlayerId: string | null;
  roundStarterId: string | null;
  roundNumber: number;
  scores: Record<string, number>;
  decisions: Record<string, Decision>;
  latestResults: RoundScore[] | null;
  latestOutcome: "SUCCESS" | "CRASH" | null;
}

interface AckResult {
  success: boolean;
  message?: string;
  playerId?: string;
  room?: ReturnType<typeof roomSnapshot>;
}

type Ack = (result: AckResult) => void;

const rooms = new Map<string, Room>();
let gameIo: Server | undefined;
const codeAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function createRoomCode(): string {
  let code = "";
  do {
    let suffix = "";
    for (let index = 0; index < 4; index += 1) {
      suffix += codeAlphabet[randomInt(codeAlphabet.length)];
    }
    code = `TOLAS${suffix}`;
  } while (rooms.has(code));
  return code;
}

function cleanPlayerName(value: unknown): string {
  if (typeof value !== "string") return "Pasajero";
  return value.trim().slice(0, 24) || "Pasajero";
}

function roomSnapshot(room: Room) {
  const captain = room.players.find((player) => player.id === room.captainId);
  const currentTurn = room.players.find((player) => player.id === room.turnPlayerId);

  return {
    code: room.code,
    hostPlayerId: room.hostPlayerId,
    phase: room.phase,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      connected: player.connected,
      isHost: player.id === room.hostPlayerId,
    })),
    game: {
      question: room.question?.text ?? "",
      currentBid: room.currentBid,
      isTriplazo: room.isTriplazo,
      captainId: room.captainId,
      captainName: captain?.name ?? "",
      turnPlayerId: room.turnPlayerId,
      turnPlayerName: currentTurn?.name ?? "",
      roundNumber: room.roundNumber,
      scores: { ...room.scores },
      submittedPlayerIds: Object.keys(room.decisions),
      results: room.latestResults,
      outcome: room.latestOutcome,
      // The answer is deliberately sent only after the round is resolved.
      actualValue: room.phase === "RESULTS" ? room.question?.answer ?? null : null,
    },
  };
}

function emitRoomState(room: Room) {
  if (!gameIo) return;
  const snapshot = roomSnapshot(room);
  gameIo.to(room.code).emit("roomState", snapshot);
  // Keep the original lobby event available for any older clients.
  gameIo.to(room.code).emit("roomUpdated", snapshot);
}

function reply(ack: Ack | undefined, result: AckResult) {
  ack?.(result);
}

function playerForSocket(room: Room, socketId: string) {
  return room.players.find((player) => player.socketId === socketId && player.connected);
}

function nextConnectedIndex(room: Room, fromIndex: number): number {
  for (let offset = 1; offset <= room.players.length; offset += 1) {
    const index = (fromIndex + offset + room.players.length) % room.players.length;
    if (room.players[index]?.connected) return index;
  }
  return -1;
}

function decisionsAreComplete(room: Room): boolean {
  return room.players
    .filter((player) => player.id !== room.captainId)
    .every((player) => room.decisions[player.id] !== undefined);
}

function resolveRound(room: Room) {
  if (!gameIo || !room.question || !room.captainId) return;
  room.phase = "RESULTS";
  const success = room.currentBid <= room.question.answer;
  room.latestOutcome = success ? "SUCCESS" : "CRASH";

  room.latestResults = room.players.map((player) => {
    const isCaptain = player.id === room.captainId;
    const decision = isCaptain ? "STAY" : (room.decisions[player.id] ?? "LEAVE");
    let pointsEarned: number;

    if (success) {
      pointsEarned = isCaptain
        ? (room.isTriplazo ? 5 : 3)
        : decision === "STAY"
          ? (room.isTriplazo ? 3 : 2)
          : 0;
    } else {
      pointsEarned = isCaptain
        ? (room.isTriplazo ? -4 : -2)
        : decision === "STAY"
          ? -2
          : 2;
    }

    room.scores[player.id] = (room.scores[player.id] ?? 0) + pointsEarned;
    return {
      playerId: player.id,
      name: player.name,
      isCaptain,
      decision,
      pointsEarned,
      scoreTotal: room.scores[player.id],
    };
  });

  emitRoomState(room);
}

function enterDecisionPhase(room: Room) {
  room.phase = "DECISION";
  room.decisions = {};
  if (room.captainId) room.decisions[room.captainId] = "STAY";
  for (const player of room.players) {
    if (!player.connected && player.id !== room.captainId) {
      room.decisions[player.id] = "LEAVE";
    }
  }
  if (decisionsAreComplete(room)) {
    resolveRound(room);
    return;
  }
  emitRoomState(room);
}

function startRound(room: Room, starterId: string) {
  const connectedPlayers = room.players.filter((player) => player.connected);
  if (connectedPlayers.length < 2) return false;

  const starter = room.players.find((player) => player.id === starterId && player.connected)
    ?? connectedPlayers[0];
  const question = QUESTIONS[randomInt(QUESTIONS.length)];
  if (!starter || !question) return false;

  room.phase = "BETTING";
  room.question = question;
  room.currentBid = 0;
  room.isTriplazo = false;
  room.captainId = null;
  room.turnPlayerId = starter.id;
  room.roundStarterId = starter.id;
  room.roundNumber += 1;
  room.decisions = {};
  room.latestResults = null;
  room.latestOutcome = null;
  emitRoomState(room);
  return true;
}

function setRoomHost(room: Room) {
  if (room.players.some((player) => player.id === room.hostPlayerId && player.connected)) return;
  room.hostPlayerId =
    room.players.find((player) => player.connected)?.id ?? room.players[0]?.id ?? "";
}

function removePlayer(room: Room, playerId: string) {
  const playerIndex = room.players.findIndex((player) => player.id === playerId);
  if (playerIndex < 0) return;
  const wasTurn = room.turnPlayerId === playerId;
  const previousTurnIndex = room.players.findIndex((player) => player.id === room.turnPlayerId);
  room.players.splice(playerIndex, 1);
  delete room.scores[playerId];
  delete room.decisions[playerId];
  setRoomHost(room);

  if (room.players.length === 0) {
    rooms.delete(room.code);
    return;
  }

  if (room.phase === "BETTING" && wasTurn) {
    const fromIndex = Math.min(playerIndex, room.players.length - 1);
    const nextIndex = nextConnectedIndex(room, fromIndex - 1);
    room.turnPlayerId = room.players[nextIndex]?.id ?? null;
  } else if (room.phase === "BETTING" && playerIndex < previousTurnIndex) {
    const adjustedIndex = Math.max(0, previousTurnIndex - 1);
    room.turnPlayerId = room.players[adjustedIndex]?.id ?? null;
  }

  if (room.phase === "DECISION" && decisionsAreComplete(room)) {
    resolveRound(room);
    return;
  }
  emitRoomState(room);
}

export function broadcastRoom(roomCode: string) {
  const room = rooms.get(roomCode);
  if (room) emitRoomState(room);
}

export function attachGameSocket(server: HttpServer) {
  gameIo = new Server(server, {
    path: "/ws/game",
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  gameIo.on("connection", (socket: Socket) => {
    socket.on(
      "createRoom",
      (payload: { playerName?: unknown }, ack?: Ack) => {
        const code = createRoomCode();
        const playerId = randomUUID();
        const playerName = cleanPlayerName(payload?.playerName);
        const room: Room = {
          code,
          hostPlayerId: playerId,
          players: [{ id: playerId, name: playerName, socketId: socket.id, connected: true }],
          phase: "LOBBY",
          question: null,
          currentBid: 0,
          isTriplazo: false,
          captainId: null,
          turnPlayerId: null,
          roundStarterId: playerId,
          roundNumber: 0,
          scores: { [playerId]: 0 },
          decisions: {},
          latestResults: null,
          latestOutcome: null,
        };
        rooms.set(code, room);
        socket.join(code);
        reply(ack, { success: true, playerId, room: roomSnapshot(room) });
        emitRoomState(room);
      },
    );

    socket.on(
      "joinRoom",
      (
        payload: { roomCode?: unknown; playerName?: unknown },
        ack?: Ack,
      ) => {
        const roomCode = typeof payload?.roomCode === "string"
          ? payload.roomCode.trim().toUpperCase()
          : "";
        const room = rooms.get(roomCode);
        if (!room) {
          reply(ack, { success: false, message: "No existe una sala con ese código." });
          return;
        }
        if (room.phase !== "LOBBY") {
          reply(ack, { success: false, message: "La partida ya ha empezado." });
          return;
        }
        if (room.players.length >= 8) {
          reply(ack, { success: false, message: "La sala está llena (máximo 8 jugadores)." });
          return;
        }

        const playerId = randomUUID();
        const player: Player = {
          id: playerId,
          name: cleanPlayerName(payload?.playerName),
          socketId: socket.id,
          connected: true,
        };
        room.players.push(player);
        room.scores[playerId] = 0;
        socket.join(room.code);
        reply(ack, { success: true, playerId, room: roomSnapshot(room) });
        emitRoomState(room);
      },
    );

    socket.on(
      "resumeRoom",
      (payload: { roomCode?: unknown; playerId?: unknown }, ack?: Ack) => {
        const code = typeof payload?.roomCode === "string"
          ? payload.roomCode.trim().toUpperCase()
          : "";
        const playerId = typeof payload?.playerId === "string" ? payload.playerId : "";
        const room = rooms.get(code);
        const player = room?.players.find((entry) => entry.id === playerId);
        if (!room || !player) {
          reply(ack, { success: false, message: "La sala o el pasajero ya no existen." });
          return;
        }

        player.connected = true;
        player.socketId = socket.id;
        setRoomHost(room);
        if (room.phase === "BETTING" && !room.turnPlayerId) {
          room.turnPlayerId = player.id;
        }
        socket.join(room.code);
        reply(ack, { success: true, playerId: player.id, room: roomSnapshot(room) });
        emitRoomState(room);
      },
    );

    socket.on("startGame", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || !player) {
        reply(ack, { success: false, message: "No estás en esa sala." });
        return;
      }
      if (player.id !== room.hostPlayerId) {
        reply(ack, { success: false, message: "Solo el anfitrión puede empezar la partida." });
        return;
      }
      if (!startRound(room, room.hostPlayerId)) {
        reply(ack, { success: false, message: "Hacen falta al menos 2 jugadores conectados." });
        return;
      }
      reply(ack, { success: true, room: roomSnapshot(room) });
    });

    socket.on(
      "playerBet",
      (
        payload: { roomCode?: unknown; bet?: unknown; isTriplazo?: unknown },
        ack?: Ack,
      ) => {
        const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
        const player = room && playerForSocket(room, socket.id);
        const bet = Number(payload?.bet);
        if (!room || room.phase !== "BETTING" || !player) {
          reply(ack, { success: false, message: "La puja ya no está abierta." });
          return;
        }
        if (player.id !== room.turnPlayerId) {
          reply(ack, { success: false, message: "Espera a que llegue tu turno." });
          return;
        }
        if (!Number.isSafeInteger(bet) || bet <= room.currentBid || bet < 1) {
          reply(ack, { success: false, message: "La apuesta debe ser un número mayor que la actual." });
          return;
        }

        const isTriplazo = payload?.isTriplazo === true;
        room.currentBid = bet;
        room.captainId = player.id;
        room.isTriplazo = isTriplazo;

        if (isTriplazo) {
          enterDecisionPhase(room);
        } else {
          const playerIndex = room.players.findIndex((entry) => entry.id === player.id);
          const nextIndex = nextConnectedIndex(room, playerIndex);
          room.turnPlayerId = room.players[nextIndex]?.id ?? null;
          emitRoomState(room);
        }
        reply(ack, { success: true, room: roomSnapshot(room) });
      },
    );

    socket.on("closeAuction", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || room.phase !== "BETTING" || !player) {
        reply(ack, { success: false, message: "La puja no está abierta." });
        return;
      }
      if (player.id !== room.turnPlayerId) {
        reply(ack, { success: false, message: "Solo quien tiene el turno puede cerrar la puja." });
        return;
      }
      if (!room.captainId || room.currentBid < 1) {
        reply(ack, { success: false, message: "Primero alguien tiene que subir la apuesta." });
        return;
      }

      enterDecisionPhase(room);
      reply(ack, { success: true, room: roomSnapshot(room) });
    });

    socket.on(
      "submitDecision",
      (payload: { roomCode?: unknown; decision?: unknown }, ack?: Ack) => {
        const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
        const player = room && playerForSocket(room, socket.id);
        if (!room || room.phase !== "DECISION" || !player || player.id === room.captainId) {
          reply(ack, { success: false, message: "No puedes registrar esa decisión." });
          return;
        }
        if (payload?.decision !== "STAY" && payload?.decision !== "LEAVE") {
          reply(ack, { success: false, message: "Elige quedarte dentro o bajarte." });
          return;
        }
        if (room.decisions[player.id]) {
          reply(ack, { success: false, message: "Ya has registrado tu decisión." });
          return;
        }

        room.decisions[player.id] = payload.decision;
        if (decisionsAreComplete(room)) {
          resolveRound(room);
        } else {
          emitRoomState(room);
        }
        reply(ack, { success: true, room: roomSnapshot(room) });
      },
    );

    socket.on("nextRound", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || room.phase !== "RESULTS" || !player) {
        reply(ack, { success: false, message: "La ronda todavía no ha terminado." });
        return;
      }
      if (player.id !== room.hostPlayerId) {
        reply(ack, { success: false, message: "Solo el anfitrión puede abrir la siguiente ronda." });
        return;
      }
      const previousStarterIndex = room.players.findIndex((entry) => entry.id === room.roundStarterId);
      const nextStarterIndex = nextConnectedIndex(room, previousStarterIndex < 0 ? -1 : previousStarterIndex);
      const nextStarterId = room.players[nextStarterIndex]?.id;
      if (!nextStarterId || !startRound(room, nextStarterId)) {
        reply(ack, { success: false, message: "Hacen falta al menos 2 jugadores conectados." });
        return;
      }
      reply(ack, { success: true, room: roomSnapshot(room) });
    });

    socket.on("leaveRoom", (payload: { roomCode?: unknown }, ack?: Ack) => {
      const room = typeof payload?.roomCode === "string" ? rooms.get(payload.roomCode) : undefined;
      const player = room && playerForSocket(room, socket.id);
      if (!room || !player) {
        reply(ack, { success: false, message: "No estás en esa sala." });
        return;
      }
      socket.leave(room.code);
      removePlayer(room, player.id);
      reply(ack, { success: true });
    });

    socket.on("disconnect", () => {
      for (const room of rooms.values()) {
        const player = room.players.find((entry) => entry.socketId === socket.id);
        if (!player) continue;
        player.connected = false;

        if (room.phase === "BETTING" && room.turnPlayerId === player.id) {
          const playerIndex = room.players.findIndex((entry) => entry.id === player.id);
          const nextIndex = nextConnectedIndex(room, playerIndex);
          room.turnPlayerId = room.players[nextIndex]?.id ?? null;
        } else if (room.phase === "DECISION" && player.id !== room.captainId) {
          room.decisions[player.id] = "LEAVE";
        }

        setRoomHost(room);
        if (room.phase === "DECISION" && decisionsAreComplete(room)) resolveRound(room);
        else emitRoomState(room);
        break;
      }
    });
  });

  return gameIo;
}
