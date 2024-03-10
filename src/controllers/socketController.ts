import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IO, getIO } from "../utils/socket";
import { handleDrawCard, handleRoomData, onConnect } from "./gameController";
import { Server, Socket } from "socket.io";
import { GameEvent } from "../types/interfaces";
import Room from "../models/roomModel";
import { handleGame } from "../services/gameService";

export default async function startSockets(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    onConnect(io, roomId, userId);
  });

  socket.on(GameEvent.START, async ({ roomId }) => {
    const room = await Room.findById({ _id: roomId }).select("ownerId");
    io.to(roomId).emit(GameEvent.START, room?.ownerId);
  });

  socket.on(
    GameEvent.CHANGECOLOR,
    async ({ roomId, cardId, userId, droppableId, isStart }) => {
      handleRoomData({
        io,
        roomId,
        cardId,
        userId,
        event: GameEvent.CHANGECOLOR,
        droppableId,
        isStart,
      });
    }
  );

  socket.on(
    GameEvent.DRAWFOUR,
    async ({ roomId, cardId, userId, droppableId, isStart }) => {
      handleRoomData({
        io,
        roomId,
        cardId,
        userId,
        event: GameEvent.DRAWFOUR,
        droppableId,
        isStart,
      });
    }
  );

  socket.on(
    GameEvent.DRAWTWO,
    async ({ roomId, cardId, userId, droppableId, isStart }) => {
      handleRoomData({
        io,
        roomId,
        cardId,
        userId,
        event: GameEvent.DRAWTWO,
        droppableId,
        isStart,
      });
    }
  );

  socket.on(
    GameEvent.REVERSE,
    async ({ roomId, cardId, userId, droppableId, isStart }) => {
      handleRoomData({
        io,
        roomId,
        cardId,
        userId,
        event: GameEvent.REVERSE,
        droppableId,
        isStart,
      });
    }
  );

  socket.on(
    GameEvent.SKIP,
    async ({ roomId, cardId, userId, droppableId, isStart }) => {
      handleRoomData({
        io,
        roomId,
        cardId,
        userId,
        event: GameEvent.SKIP,
        droppableId,
        isStart,
      });
    }
  );

  socket.on(
    GameEvent.NORMAL,
    async ({ roomId, cardId, userId, droppableId, isStart }) => {
      handleRoomData({
        io,
        roomId,
        cardId,
        userId,
        event: GameEvent.NORMAL,
        droppableId,
        isStart,
      });
    }
  );

  socket.on(GameEvent.DRAWCARD, ({ roomId, userId, droppableId }) => {
    handleDrawCard({ io, roomId, userId, droppableId });
  });
}
