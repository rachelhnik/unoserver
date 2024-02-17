import express from "express";
import {
  createRoom,
  enterRoom,
  maintainRoomConnection,
} from "../controllers/roomController";

export const roomRouter = express.Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", maintainRoomConnection);
roomRouter.post("/enter", enterRoom);
