import { NextFunction, Request, Response } from "express";
import Room from "../models/roomModel";
import BadRequestError from "../errors/BadRequestError";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const io = req.app.get("socketio");

    io.on("connection", (socket: any) => {
      socket.on("create", async (data: any) => {
        const { name, password, userId } = req.body;
        const alreadyExistingPassword = await Room.findOne({
          password: password,
        });
        if (alreadyExistingPassword) {
          throw new BadRequestError({
            code: 409,
            message: "Please use different password",
          });
        }
        const room = await Room.create({
          name: name,
          socketId: socket.id,
          password: password,
          playersIds: [userId],
          status: "WAITING",
        });
        if (room) {
          socket.emit("room-created", {
            roomId: room._id,
            socketId: socket.id,
          });

          res.status(200).send(room);
        }
      });

      socket.on("disconnect", () => {
        console.log("connection ended");
      });
    });
  } catch (error) {
    console.log("error");
  }
};

export const maintainRoomConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const io = req.app.get("socketio");
    io.on("connection", (socket: any) => {
      socket.on("id", (id: any) => {
        const targetSocket = io.sockets.sockets.get(id);
        if (targetSocket) {
          socket.emit("heelo");
        }
      });
    });
    res.sendStatus(200);
  } catch (error) {
    console.log("error");
  }
};

export const enterRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, userId } = req.body;
    const room = await Room.find({ password });
    if (room) {
      const updatedRoom = await Room.findByIdAndUpdate(
        { _id: room[0]._id },
        {
          playersIds: [...room[0].playersIds, userId],
        },
        { new: true }
      );
      res.status(200).send(updatedRoom);
    }
  } catch (error) {
    console.log("error", error);
  }
};
