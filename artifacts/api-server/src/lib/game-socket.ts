import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { getRoom, getRoomForPlayer, setPlayerConnected } from "./rooms";

let gameIo: Server | undefined;
const playerSockets = new Map<string, Set<string>>();

export function broadcastRoom(roomCode: string) {
  const room = gameIo && getRoom(roomCode);
  if (room) gameIo?.to(roomCode).emit("room:update", room);
}

export function attachGameSocket(server: HttpServer) {
  gameIo = new Server(server, {
    path: "/ws/game",
  });

  gameIo.on("connection", (socket) => {
    const { roomCode, playerId } = socket.handshake.auth as {
      roomCode?: unknown;
      playerId?: unknown;
    };

    if (typeof roomCode !== "string" || typeof playerId !== "string") {
      socket.disconnect(true);
      return;
    }

    const initialRoom = getRoomForPlayer(roomCode, playerId);
    if (!initialRoom) {
      socket.disconnect(true);
      return;
    }

    socket.join(initialRoom.code);
    const activeSockets = playerSockets.get(playerId) ?? new Set<string>();
    activeSockets.add(socket.id);
    playerSockets.set(playerId, activeSockets);

    const room = setPlayerConnected(initialRoom.code, playerId, true);
    if (room) {
      socket.emit("room:state", room);
      gameIo?.to(room.code).emit("room:update", room);
    }

    socket.on("disconnect", () => {
      const activeSockets = playerSockets.get(playerId);
      activeSockets?.delete(socket.id);
      if (activeSockets?.size) return;
      playerSockets.delete(playerId);

      const updatedRoom = setPlayerConnected(initialRoom.code, playerId, false);
      if (updatedRoom) {
        gameIo?.to(updatedRoom.code).emit("room:update", updatedRoom);
      }
    });
  });

  return gameIo;
}
