import { Server, Socket } from "socket.io";
import { IO } from "../utils/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameEvent, RoomEvent } from "../types/interfaces";
import User from "../models/userModel";
import {
  handleCardDraw,
  handleGame,
  handleStartGame,
} from "../services/gameService";

export const onConnect = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  roomId: string,
  userId: string
) => {
  const user = await User.findById(userId).select("name");
  io.to(roomId).emit(RoomEvent.NEWUSER, { username: user?.name });
};

export const handleRoomData = async ({
  io,
  roomId,
  cardId,
  userId,
  event,
  droppableId,
  isStart,
  color,
}: {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  roomId: string;
  cardId: string;
  userId: string;
  event: string;
  droppableId: string;
  isStart: boolean;
  color?: string;
}) => {
  isStart
    ? await handleStartGame({ roomId, cardId, userId, event: event, color })
    : await handleGame({
        roomId,
        cardId,
        userId,
        event: event,
        color,
      });

  console.log("hlllo");

  io.to(roomId).emit("gameupdated", {
    cardId,
    userId,
    droppableId,
    event,
    isStart,
  });
};

export const handleDrawCard = async ({
  io,
  roomId,
  userId,
  droppableId,
}: {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  roomId: string;
  userId: string;
  droppableId: string;
}) => {
  const isCardUsable = await handleCardDraw({ roomId, userId, droppableId });
  io.to(roomId).emit(GameEvent.DRAWCARD, {
    userId,
    droppableId,
    roomId,
    isCardUsable,
  });
};
