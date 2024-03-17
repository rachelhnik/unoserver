import { Server, Socket } from "socket.io";
import { IO } from "../utils/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameEvent, RoomEvent } from "../types/interfaces";
import User from "../models/userModel";
import { handleCardDraw, handleGame } from "../services/gameService";

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
  color,
  isStart,
}: {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  roomId: string;
  cardId: string;
  userId: string;
  event: string;
  droppableId: string;
  color?: string;
  isStart?: boolean;
}) => {
  const currentMark = (await handleGame({
    roomId,
    cardId,
    userId,
    event: event,
    color,
  })) as number;

  currentMark >= 500
    ? io.to(roomId).emit(GameEvent.END, { userId })
    : io.to(roomId).emit("gameupdated", {
        cardId,
        userId,
        droppableId,
        event,
      });
};

export const handleDrawCard = async ({
  io,
  roomId,
  userId,
  droppableId,
  uno,
}: {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  roomId: string;
  userId: string;
  droppableId: string;
  uno: boolean;
}) => {
  const isCardUsable = await handleCardDraw({
    roomId,
    userId,
    droppableId,
    uno,
  });
  io.to(roomId).emit(GameEvent.DRAWCARD, {
    userId,
    droppableId,
    roomId,
    isCardUsable,
  });
};
