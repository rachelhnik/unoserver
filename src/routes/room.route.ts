import express from "express";
import {
  createRoom,
  enterRoom,
  getRoom,
  maintainRoomConnection,
  startGame,
} from "../controllers/roomController";

export const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", maintainRoomConnection);
roomRouter.post("/enter", enterRoom);
roomRouter.get("/:id", getRoom);
roomRouter.put("/start-game", startGame);
