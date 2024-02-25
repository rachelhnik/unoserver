import { Socket } from "socket.io";
import { IO } from "../utils/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const onConnect = async (
  io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  roomId: string
) => {
  console.log("io", io.rooms);
  io.emit("hello", roomId);
};
