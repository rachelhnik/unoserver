import app from "./app";
import dotenv from "dotenv";
import connectDb from "./utils/db";
import { createServer } from "http";
import { Server } from "socket.io";
import { init } from "./utils/socket";
import startSockets from "./controllers/socketController";

dotenv.config();

const port = process.env.PORT;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
//app.set("socketio", io);

if (io) {
  init(io);
  console.log("hi");
  io.on("connect", startSockets);
}

server.listen(8000, () => {
  console.log(`[server]: Server is running at http://localhost:${8000}`);
  connectDb();
});
