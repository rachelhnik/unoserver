import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type IO = null | Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
let io: IO;

export function init(ioServer: IO) {
  io = ioServer;
}

export function getIO(): IO {
  return io;
}
