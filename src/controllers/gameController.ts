import { Server, Socket } from "socket.io";
import { IO } from "../utils/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { RoomEvent } from "../types/interfaces";
import User from "../models/userModel";

export const onConnect = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  roomId: string,
  userId: string
) => {
  const user = await User.findById(userId).select("name");
  io.to(roomId).emit(RoomEvent.NEWUSER, { username: user?.name });
};
