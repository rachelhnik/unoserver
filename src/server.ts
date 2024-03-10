import app from "./app";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { init } from "./utils/socket";
import startSockets from "./controllers/socketController";
import { connectDb, conn } from "./utils/db";

dotenv.config();

const port = process.env.PORT;
console.log("port", port);
const server = createServer(app);
const io = new Server(server, {
  path: `/api/v1/uno-game`,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

console.log("uo", io.path());
//app.set("socketio", io);

if (io) {
  init(io);
  console.log("hi");
  io.on("connect", (socket) => {
    startSockets(io, socket);
  });
}

server.listen(8000, () => {
  console.log(`[server]: Server is running at http://localhost:${8000}`);
  connectDb();
});
