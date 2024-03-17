import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { handleDrawCard, handleRoomData, onConnect } from "./gameController";
import { Server, Socket } from "socket.io";
import { GameEvent } from "../types/interfaces";
import Room from "../models/roomModel";
import { handleEndGame } from "../services/gameService";

export default async function startSockets(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    onConnect(io, roomId, userId);
  });

  socket.on(GameEvent.START, async ({ roomId }) => {
    setTimeout(async () => {
      const room = await Room.findById({ _id: roomId });

      const hasCard = room?.players[0].cards.find(
        (card) =>
          card.cardNumber === room.currentCard.cardNumber ||
          card.cardNumber === 4444
      )
        ? true
        : false;

      io.to(roomId).emit(GameEvent.START, {
        currentCard: room?.currentCard,
        hasCard,
        playerId: room?.players[0].playerId,
      });
    }, 2000);
  });

  socket.on(
    GameEvent.CHANGECOLOR,
    async ({ roomId, cardId, userId, droppableId, color, isStart }) => {
      handleRoomData({
        io,
        roomId,
        cardId,
        userId,
        event: GameEvent.CHANGECOLOR,
        droppableId,
        color,
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
        isStart: false,
      });
    }
  );

  socket.on(GameEvent.DRAW, async ({ roomId, cardId, userId, droppableId }) => {
    handleRoomData({
      io,
      roomId,
      cardId,
      userId,
      event: GameEvent.DRAWFOUR,
      droppableId,
      isStart: false,
    });
  });

  socket.on(GameEvent.DRAWCARD, ({ roomId, userId, droppableId, uno }) => {
    handleDrawCard({ io, roomId, userId, droppableId, uno });
  });

  socket.on(GameEvent.END, async ({ roomId, cardId, userId, droppableId }) => {
    handleEndGame({ roomId, cardId, userId, droppableId });
    io.to(roomId).emit(GameEvent.END, { userId });
  });

  socket.on(GameEvent.UNO, ({ userId, userName, roomId }) => {
    io.to(roomId).emit(GameEvent.UNO, { userId, userName });
  });
}
