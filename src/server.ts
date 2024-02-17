import app from "./app";
import dotenv from "dotenv";
import connectDb from "./utils/db";
import { createServer } from "http";
import { Server } from "socket.io";

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
app.set("socketio", io);

// io.on("connection", (socket: any) => {
//   socket.on("id", (id: any) => {
//     const targetSocket = io.sockets.sockets.get(id);
//     if (targetSocket) {
//       socket.emit("heelo");
//     }
//   });
// });

server.listen(8000, () => {
  console.log(`[server]: Server is running at http://localhost:${8000}`);
  connectDb();
});
