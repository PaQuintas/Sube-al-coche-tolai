import { Router, type IRouter } from "express";
import {
  CreateRoomBody,
  CreateRoomResponse,
  GetRoomParams,
  GetRoomResponse,
  JoinRoomBody,
  JoinRoomParams,
  JoinRoomResponse,
} from "@workspace/api-zod";
import { broadcastRoom } from "../lib/game-socket";
import { createRoom, getRoom, joinRoom } from "../lib/rooms";

const router: IRouter = Router();

function parsePlayerName(
  value: unknown,
  schema: typeof CreateRoomBody | typeof JoinRoomBody,
): string | undefined {
  const result = schema.safeParse(value);
  if (!result.success) return undefined;
  const playerName = result.data.playerName.trim();
  return playerName.length > 0 ? playerName : undefined;
}

router.post("/rooms", (req, res) => {
  const playerName = parsePlayerName(req.body, CreateRoomBody);
  if (!playerName) {
    res.status(400).json({ error: "Escribe un nombre de entre 1 y 24 caracteres." });
    return;
  }

  const entry = createRoom(playerName);
  res.status(201).json(CreateRoomResponse.parse(entry));
});

router.get("/rooms/:code", (req, res) => {
  const { code } = GetRoomParams.parse(req.params);
  const room = getRoom(code);
  if (!room) {
    res.status(404).json({ error: "No encontramos esa sala." });
    return;
  }

  res.json(GetRoomResponse.parse(room));
});

router.post("/rooms/:code/join", (req, res) => {
  const { code } = JoinRoomParams.parse(req.params);
  const playerName = parsePlayerName(req.body, JoinRoomBody);
  if (!playerName) {
    res.status(400).json({ error: "Escribe un nombre de entre 1 y 24 caracteres." });
    return;
  }

  const result = joinRoom(code, playerName);
  if (!result.ok) {
    const status = result.reason === "full" ? 409 : 404;
    const message = result.reason === "full"
      ? "El coche ya está lleno."
      : "No encontramos esa sala.";
    res.status(status).json({ error: message });
    return;
  }

  res.json(JoinRoomResponse.parse(result.entry));
  broadcastRoom(result.entry.room.code);
});

export default router;
