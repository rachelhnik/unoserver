import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IO, getIO } from "../utils/socket";
import { onConnect } from "./gameController";
import { Socket } from "socket.io";

export default async function startSockets(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  //   socket?.on("join-room", (roomId) => {
  //     console.log("connect");
  //     onConnect(socket, roomId);
  //   });
  socket.on("join-room", (roomId, cb) => {
    socket.join(roomId);
    onConnect(socket, roomId);
  });
}
