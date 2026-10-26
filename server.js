"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const express = require("express");
const WebSocket = require("ws");

const PORT = Number(process.env.PORT) || 3000;
const ROOM_TTL_MS = 30 * 60 * 1000;
const MAX_MESSAGE_BYTES = 32 * 1024;
const MAX_MESSAGES_PER_SECOND = 20;
const ROOT = __dirname;
const INDEX_FILE = path.join(ROOT, "index.html");
const RULES_FILE = path.join(ROOT, "Reglas del Juego - El Presidente (Edición Personalizada).pdf");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true, maxPayload: MAX_MESSAGE_BYTES });
const rooms = new Map();

app.disable("x-powered-by");
app.get("/", (_request, response) => response.sendFile(INDEX_FILE));
app.get("/Reglas del Juego - El Presidente (Edición Personalizada).pdf", (_request, response) => {
    if (!fs.existsSync(RULES_FILE)) {
        response.sendStatus(404);
        return;
    }
    response.sendFile(RULES_FILE);
});
app.get("/healthz", (_request, response) => response.status(200).json({ status: "ok" }));
app.use((_request, response) => response.sendStatus(404));

function send(socket, message) {
    if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

function sendError(socket, message) {
    send(socket, { type: "error", message });
}

function makeToken() {
    return crypto.randomBytes(32).toString("hex");
}

function makeRoomCode() {
    let code;
    do {
        code = "TOLAS" + String(crypto.randomInt(1000, 10000));
    } while (rooms.has(code));
    return code;
}

function publicRoster(room) {
    return room.players
        .map((player, seat) => ({ player, seat }))
        .filter((entry) => Boolean(entry.player))
        .map(({ player, seat }) => ({
            seat,
            name: player.name,
            connected: Boolean(player.isCpu || player.socket && player.socket.readyState === WebSocket.OPEN),
            cpu: Boolean(player.isCpu)
        }));
}

function sendLobby(room) {
    const message = {
        type: "lobby",
        room: room.code,
        maxPlayers: room.maxPlayers,
        players: publicRoster(room)
    };
    room.players.filter(Boolean).forEach((player) => send(player.socket, message));
}

function viewForPlayer(snapshot, seat) {
    const view = JSON.parse(JSON.stringify(snapshot));
    view.jugadores.forEach((player, playerSeat) => {
        if (playerSeat !== seat) {
            player.mano = player.mano.map(() => ({ oculta: true }));
        }
    });
    if (view.resumenIntercambioCulo && view.resumenIntercambioCulo.seat !== seat) {
        view.resumenIntercambioCulo = null;
    }
    if (view.resumenIntercambioViceCulo && view.resumenIntercambioViceCulo.seat !== seat) {
        view.resumenIntercambioViceCulo = null;
    }
    if (view.intercambioCuloEnCurso && view.intercambioCuloEnCurso.seatCulo !== seat) {
        view.intercambioCuloEnCurso = null;
    }
    if (view.intercambioViceCuloEnCurso && view.intercambioViceCuloEnCurso.seatViceCulo !== seat) {
        view.intercambioViceCuloEnCurso = null;
    }
    return view;
}

function sendSnapshot(room, player) {
    if (!room.snapshot || !player.socket) return;
    const snapshot = player.isHost ? room.snapshot : viewForPlayer(room.snapshot, player.seat);
    send(player.socket, { type: "state", state: snapshot, hostConnected: Boolean(room.players[0]?.socket) });
}

function broadcastSnapshot(room) {
    room.players.filter(Boolean).forEach((player) => sendSnapshot(room, player));
}

function sendRoomStateTo(room, player) {
    send(player.socket, {
        type: "assigned",
        room: room.code,
        seat: player.seat,
        token: player.token,
        isHost: player.isHost,
        maxPlayers: room.maxPlayers,
        players: publicRoster(room),
        phase: room.phase
    });
    if (room.phase === "running") {
        if (room.snapshot) sendSnapshot(room, player);
        else if (player.isHost) {
            send(player.socket, {
                type: "start",
                room: room.code,
                maxPlayers: room.maxPlayers,
                players: publicRoster(room)
            });
        }
    } else sendLobby(room);
}

function detachSocket(socket) {
    if (!socket.roomCode) return;
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players[socket.seat];
    if (!player || player.socket !== socket) return;
    player.socket = null;

    room.players.filter(Boolean).forEach((recipient) => {
        send(recipient.socket, {
            type: "player-status",
            seat: socket.seat,
            connected: false,
            hostConnected: Boolean(room.players[0]?.socket)
        });
    });

    if (room.players.every((entry) => !entry || !entry.socket)) {
        clearTimeout(room.cleanupTimer);
        room.cleanupTimer = setTimeout(() => {
            if (room.players.every((entry) => !entry || !entry.socket)) rooms.delete(room.code);
        }, ROOM_TTL_MS);
        room.cleanupTimer.unref();
    }
}

function validateName(value) {
    if (typeof value !== "string") return null;
    const name = value.trim().replace(/\s+/g, " ");
    if (!name || name.length > 24 || /[\u0000-\u001f\u007f]/.test(name)) return null;
    return name;
}

function attachPlayer(socket, room, player) {
    clearTimeout(room.cleanupTimer);
    room.cleanupTimer = null;
    if (player.socket && player.socket !== socket) {
        const oldSocket = player.socket;
        player.socket = null;
        oldSocket.close(4001, "Replaced by a reconnecting session");
    }
    player.socket = socket;
    socket.roomCode = room.code;
    socket.seat = player.seat;
    socket.isHost = player.isHost;
    sendRoomStateTo(room, player);
    room.players.filter(Boolean).forEach((recipient) => {
        send(recipient.socket, {
            type: "player-status",
            seat: player.seat,
            connected: true,
            hostConnected: Boolean(room.players[0]?.socket)
        });
    });
    startRoomIfFull(room);
}

function createRoom(socket, message) {
    const name = validateName(message.name);
    const maxPlayers = Number(message.maxPlayers);
    if (!name || ![3, 4, 5, 6].includes(maxPlayers)) {
        sendError(socket, "Nombre o número de jugadores no válido.");
        return;
    }

    const code = makeRoomCode();
    const host = { seat: 0, name, token: makeToken(), isHost: true, socket };
    const room = {
        code,
        maxPlayers,
        phase: "lobby",
        players: [host],
        snapshot: null,
        cleanupTimer: null
    };
    rooms.set(code, room);
    attachPlayer(socket, room, host);
}

function joinRoom(socket, message) {
    const code = typeof message.room === "string" ? message.room.trim().toUpperCase() : "";
    const room = rooms.get(code);
    const name = validateName(message.name);
    if (!/^TOLAS\d{4}$/.test(code) || !room) {
        sendError(socket, "No se encontró esa sala. Comprueba el código.");
        return;
    }
    if (!name) {
        sendError(socket, "Escribe un nombre válido (máximo 24 caracteres).");
        return;
    }

    if (typeof message.token === "string") {
        const returningPlayer = room.players.find((player) => player && player.token === message.token);
        if (returningPlayer) {
            attachPlayer(socket, room, returningPlayer);
            return;
        }
    }

    if (room.phase !== "lobby") {
        sendError(socket, "La partida ya ha empezado. Usa el mismo navegador para reconectarte.");
        return;
    }
    let seat = room.players.findIndex((player) => !player ||
        !player.isCpu && (!player.socket || player.socket.readyState !== WebSocket.OPEN));
    if (seat < 0 && room.players.length < room.maxPlayers) seat = room.players.length;
    if (seat < 0 || seat >= room.maxPlayers) {
        sendError(socket, "La sala está completa.");
        return;
    }
    const player = { seat, name, token: makeToken(), isHost: false, socket };
    room.players[seat] = player;
    attachPlayer(socket, room, player);
}

function addCpuPlayer(socket, room, player) {
    if (!player.isHost) {
        sendError(socket, "Solo quien creó la sala puede añadir una CPU.");
        return;
    }
    if (room.phase !== "lobby" || room.players.some((entry) => entry && entry.isCpu)) {
        sendError(socket, "No se puede añadir a Cademir en este momento.");
        return;
    }
    let seat = room.players.findIndex((entry) => !entry);
    if (seat < 0 && room.players.length < room.maxPlayers) seat = room.players.length;
    if (seat < 0 || seat >= room.maxPlayers) {
        sendError(socket, "No hay sitio libre para añadir a Cademir.");
        return;
    }
    room.players[seat] = {
        seat,
        name: "Cademir (CPU)",
        token: null,
        isHost: false,
        isCpu: true,
        socket: null
    };
    sendLobby(room);
    startRoomIfFull(room);
}

function leaveRoom(socket, room, player) {
    clearTimeout(room.cleanupTimer);
    room.cleanupTimer = null;
    if (player.isHost) {
        rooms.delete(room.code);
        room.players.filter(Boolean).forEach((recipient) => {
            if (recipient === player) return;
            send(recipient.socket, { type: "room-closed" });
            if (recipient.socket) recipient.socket.close(4002, "The room host left");
        });
    } else {
        room.players[player.seat] = null;
        socket.roomCode = null;
        socket.seat = null;
        socket.isHost = false;
        send(socket, { type: "left" });
        sendLobby(room);
        if (room.players.every((entry) => !entry || !entry.socket)) {
            room.cleanupTimer = setTimeout(() => {
                if (room.players.every((entry) => !entry || !entry.socket)) rooms.delete(room.code);
            }, ROOM_TTL_MS);
            room.cleanupTimer.unref();
        }
        return;
    }
    socket.roomCode = null;
    socket.seat = null;
    socket.isHost = false;
    send(socket, { type: "left" });
}

function startRoomIfFull(room) {
    if (room.phase !== "lobby" || !room.players[0]?.socket ||
        !Array.from({ length: room.maxPlayers }, (_, seat) => room.players[seat]).every((player) =>
            player && (player.isCpu || player.socket && player.socket.readyState === WebSocket.OPEN))) return;
    room.phase = "running";
    const message = {
        type: "start",
        room: room.code,
        maxPlayers: room.maxPlayers,
        players: publicRoster(room)
    };
    room.players.forEach((player) => send(player.socket, message));
}

function validateSnapshot(snapshot, room) {
    if (!snapshot || typeof snapshot !== "object" || !Array.isArray(snapshot.jugadores) ||
        snapshot.jugadores.length !== room.maxPlayers || !Number.isInteger(snapshot.turnoActivo) ||
        snapshot.turnoActivo < 0 || snapshot.turnoActivo >= room.maxPlayers ||
        !Array.isArray(snapshot.jugadoresPasados) || !Array.isArray(snapshot.ordenDescarteHistorico) ||
        snapshot.jugadores.some((player) => !player || !Array.isArray(player.mano) ||
            !player.conteoRoles || typeof player.conteoRoles !== "object" || Array.isArray(player.conteoRoles))) {
        return false;
    }
    const exchange = snapshot.solicitudIntercambioFuria;
    if (exchange && (typeof exchange !== "object" || Array.isArray(exchange) ||
        typeof exchange.requestId !== "string" || exchange.requestId.length > 100 ||
        !Number.isInteger(exchange.seatOrigen) || exchange.seatOrigen < 0 || exchange.seatOrigen >= room.maxPlayers ||
        !Number.isInteger(exchange.seatDestino) || exchange.seatDestino < 0 || exchange.seatDestino >= room.maxPlayers ||
        exchange.seatOrigen === exchange.seatDestino || ![1, 2].includes(exchange.cantidad) ||
        typeof exchange.instruccion !== "string" || exchange.instruccion.length > 120)) {
        return false;
    }
    const summaries = [
        [snapshot.resumenIntercambioCulo, "Culo"],
        [snapshot.resumenIntercambioViceCulo, "Vice-Culo"]
    ];
    for (const [summary, role] of summaries) {
        if (summary && (typeof summary !== "object" || Array.isArray(summary) ||
            typeof summary.id !== "string" || summary.id.length > 100 ||
            summary.rol !== role ||
            !Number.isInteger(summary.seat) || summary.seat < 0 || summary.seat >= room.maxPlayers ||
            !Array.isArray(summary.enviadas) || summary.enviadas.length > 2 ||
            !Array.isArray(summary.recibidas) || summary.recibidas.length > 2 ||
            [...summary.enviadas, ...summary.recibidas].some((card) =>
                !card || typeof card !== "object" || typeof card.uid !== "string" || card.uid.length > 80))) {
            return false;
        }
    }
    return JSON.stringify(snapshot).length <= MAX_MESSAGE_BYTES;
}

function handleMessage(socket, message) {
    if (!message || typeof message !== "object" || Array.isArray(message)) {
        sendError(socket, "Mensaje no válido.");
        return;
    }
    if (typeof message.type !== "string") {
        sendError(socket, "Tipo de mensaje no válido.");
        return;
    }
    if (!new Set(["create", "join", "start", "state", "action", "exchange-response", "add-cpu", "leave"]).has(message.type)) {
        sendError(socket, "Tipo de mensaje no soportado.");
        return;
    }
    if (message.type === "create") {
        if (socket.roomCode) return sendError(socket, "Ya estás en una sala.");
        createRoom(socket, message);
        return;
    }
    if (message.type === "join") {
        if (socket.roomCode) return sendError(socket, "Ya estás en una sala.");
        joinRoom(socket, message);
        return;
    }
    if (message.type === "leave") {
        const room = rooms.get(socket.roomCode);
        const player = room && room.players[socket.seat];
        if (!room || !player || player.socket !== socket) {
            sendError(socket, "La conexión ya no pertenece a una sala activa.");
            return;
        }
        leaveRoom(socket, room, player);
        return;
    }

    const room = rooms.get(socket.roomCode);
    const player = room && room.players[socket.seat];
    if (!room || !player || player.socket !== socket) {
        sendError(socket, "La conexión ya no pertenece a una sala activa.");
        return;
    }

    if (message.type === "start") {
        if (!player.isHost) return sendError(socket, "Solo quien creó la sala puede iniciar.");
        startRoomIfFull(room);
        return;
    }

    if (message.type === "add-cpu") {
        addCpuPlayer(socket, room, player);
        return;
    }

    if (message.type === "state") {
        if (!player.isHost || room.phase !== "running" || !validateSnapshot(message.state, room)) {
            sendError(socket, "No se pudo sincronizar el estado de la partida.");
            return;
        }
        room.snapshot = message.state;
        broadcastSnapshot(room);
        return;
    }

    if (message.type === "action") {
        if (room.phase !== "running" || player.isHost || !room.snapshot ||
            room.snapshot.faseIntercambioFuria ||
            room.snapshot.turnoActivo !== player.seat ||
            room.snapshot.jugadoresPasados.includes(player.seat) ||
            !["play", "pass"].includes(message.action) ||
            (message.action === "play" && (!Array.isArray(message.cardUids) ||
                message.cardUids.length < 1 || message.cardUids.length > 4 ||
                message.cardUids.some((uid) => typeof uid !== "string" || uid.length > 80)))) {
            sendError(socket, "No es tu turno o la jugada no es válida.");
            return;
        }
        const host = room.players[0];
        if (!host || !host.socket) {
            sendError(socket, "El anfitrión se ha desconectado. Esperando su reconexión.");
            return;
        }
        send(host.socket, { type: "action", seat: player.seat, action: message.action, cardUids: message.cardUids || [] });
        return;
    }

    if (message.type === "exchange-response") {
        const exchange = room.snapshot && room.snapshot.solicitudIntercambioFuria;
        if (room.phase !== "running" || player.isHost || !exchange ||
            exchange.seatOrigen !== player.seat || message.requestId !== exchange.requestId ||
            !Array.isArray(message.cardUids) || message.cardUids.length !== exchange.cantidad ||
            message.cardUids.some((uid) => typeof uid !== "string" || uid.length > 80) ||
            new Set(message.cardUids).size !== exchange.cantidad ||
            message.cardUids.some((uid) => !room.snapshot.jugadores[player.seat].mano.some((card) => card.uid === uid))) {
            sendError(socket, "La selección del intercambio no es válida o ya ha caducado.");
            return;
        }
        const host = room.players[0];
        if (!host || !host.socket) {
            sendError(socket, "El anfitrión se ha desconectado. Esperando su reconexión.");
            return;
        }
        send(host.socket, {
            type: "exchange-response",
            seat: player.seat,
            requestId: message.requestId,
            cardUids: message.cardUids
        });
        return;
    }

    sendError(socket, "Tipo de mensaje no soportado.");
}

server.on("upgrade", (request, socket, head) => {
    const origin = request.headers.origin;
    if (origin) {
        let originHost;
        try {
            originHost = new URL(origin).host;
        } catch (_error) {
            socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
            socket.destroy();
            return;
        }
        if (originHost !== request.headers.host) {
            socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
            socket.destroy();
            return;
        }
    }
    if (request.url !== "/ws") {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.destroy();
        return;
    }
    wss.handleUpgrade(request, socket, head, (webSocket) => wss.emit("connection", webSocket, request));
});

wss.on("connection", (socket) => {
    socket.messageTimes = [];
    socket.isAlive = true;
    socket.on("pong", () => { socket.isAlive = true; });
    socket.on("message", (data) => {
        const now = Date.now();
        socket.messageTimes = socket.messageTimes.filter((time) => now - time < 1000);
        socket.messageTimes.push(now);
        if (socket.messageTimes.length > MAX_MESSAGES_PER_SECOND) {
            socket.close(1008, "Too many messages");
            return;
        }
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (_error) {
            sendError(socket, "El mensaje no tiene un formato válido.");
            return;
        }
        handleMessage(socket, message);
    });
    socket.on("close", () => detachSocket(socket));
    socket.on("error", (error) => console.error("WebSocket error:", error.message));
});

const heartbeat = setInterval(() => {
    wss.clients.forEach((socket) => {
        if (!socket.isAlive) {
            socket.terminate();
            return;
        }
        socket.isAlive = false;
        socket.ping();
    });
}, 30_000);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`El Presidente listening on port ${PORT}`);
});

server.on("close", () => clearInterval(heartbeat));
