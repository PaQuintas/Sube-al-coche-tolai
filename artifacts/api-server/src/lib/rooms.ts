import { randomInt, randomUUID } from "node:crypto";

export interface GamePlayer {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
}

export interface GameRoom {
  code: string;
  players: GamePlayer[];
  maxPlayers: number;
  status: "waiting" | "started";
}

interface StoredRoom extends GameRoom {
  lastActivityAt: number;
}

export interface RoomEntry {
  playerId: string;
  room: GameRoom;
}

const rooms = new Map<string, StoredRoom>();
const MAX_PLAYERS = 8;
const ROOM_TTL_MS = 12 * 60 * 60 * 1000;

function cleanOldRooms() {
  const cutoff = Date.now() - ROOM_TTL_MS;
  for (const [code, room] of rooms) {
    if (room.lastActivityAt < cutoff) rooms.delete(code);
  }
}

function createRoomCode(): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  do {
    const suffix = Array.from({ length: 4 }, () => alphabet[randomInt(alphabet.length)]).join("");
    code = `TOLAS${suffix}`;
  } while (rooms.has(code));
  return code;
}

function snapshot(room: StoredRoom): GameRoom {
  return {
    code: room.code,
    players: room.players.map((player) => ({ ...player })),
    maxPlayers: room.maxPlayers,
    status: room.status,
  };
}

function touch(room: StoredRoom) {
  room.lastActivityAt = Date.now();
}

export function createRoom(playerName: string): RoomEntry {
  cleanOldRooms();
  const code = createRoomCode();
  const playerId = randomUUID();
  const room: StoredRoom = {
    code,
    players: [
      {
        id: playerId,
        name: playerName,
        isHost: true,
        connected: false,
      },
    ],
    maxPlayers: MAX_PLAYERS,
    status: "waiting",
    lastActivityAt: Date.now(),
  };
  rooms.set(code, room);
  return { playerId, room: snapshot(room) };
}

export function joinRoom(code: string, playerName: string):
  | { ok: true; entry: RoomEntry }
  | { ok: false; reason: "not_found" | "full" | "started" } {
  const normalizedCode = code.trim().toUpperCase();
  const room = rooms.get(normalizedCode);
  if (!room) return { ok: false, reason: "not_found" };
  if (room.status === "started") return { ok: false, reason: "started" };
  if (room.players.length >= room.maxPlayers) return { ok: false, reason: "full" };

  const playerId = randomUUID();
  room.players.push({
    id: playerId,
    name: playerName,
    isHost: false,
    connected: false,
  });
  touch(room);
  return { ok: true, entry: { playerId, room: snapshot(room) } };
}

export function startRoom(
  code: string,
  playerId: string,
):
  | { ok: true; room: GameRoom }
  | { ok: false; reason: "not_found" | "not_host" | "already_started" } {
  const room = rooms.get(code.trim().toUpperCase());
  if (!room || !room.players.some((player) => player.id === playerId)) {
    return { ok: false, reason: "not_found" };
  }
  if (!room.players.some((player) => player.id === playerId && player.isHost)) {
    return { ok: false, reason: "not_host" };
  }
  if (room.status === "started") return { ok: false, reason: "already_started" };

  room.status = "started";
  touch(room);
  return { ok: true, room: snapshot(room) };
}

export function getRoom(code: string): GameRoom | undefined {
  const room = rooms.get(code.trim().toUpperCase());
  if (!room) return undefined;
  touch(room);
  return snapshot(room);
}

export function getRoomForPlayer(
  code: string,
  playerId: string,
): GameRoom | undefined {
  const room = rooms.get(code.trim().toUpperCase());
  if (!room || !room.players.some((player) => player.id === playerId)) {
    return undefined;
  }
  touch(room);
  return snapshot(room);
}

export function setPlayerConnected(
  code: string,
  playerId: string,
  connected: boolean,
): GameRoom | undefined {
  const room = rooms.get(code.trim().toUpperCase());
  const player = room?.players.find((item) => item.id === playerId);
  if (!room || !player) return undefined;
  player.connected = connected;
  touch(room);
  return snapshot(room);
}
