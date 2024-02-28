import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IO, getIO } from "../utils/socket";
import { onConnect } from "./gameController";
import { Server, Socket } from "socket.io";
import { GameEvent } from "../types/interfaces";
import Room from "../models/roomModel";

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
}
