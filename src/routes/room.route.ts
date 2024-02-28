import express from "express";
import {
  createRoom,
  enterRoom,
  getRoom,
  startGame,
} from "../controllers/roomController";

export const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.post("/enter", enterRoom);
roomRouter.get("/:id/:userId", getRoom);
roomRouter.put("/start-game", startGame);
