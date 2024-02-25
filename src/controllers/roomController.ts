import { NextFunction, Request, Response } from "express";
import Room from "../models/roomModel";
import BadRequestError from "../errors/BadRequestError";
import { findRoom, updateRoom } from "../services/roomService";
import User from "../models/userModel";
import { generateCards, shuffle } from "../utils/cards";
import { Card } from "../types/interfaces";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const io = req.app.get("socketio");

    // io.on("connection", (socket: any) => {
    //   socket.on("create", async (data: any) => {
    const { name, password, userId, username } = req.body;
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
      socketId: "",
      password: password,
      ownerId: userId,
      playersIds: [{ id: 1, playerId: userId, playerName: username }],
      status: "WAITING",
    });
    if (room) {
      // socket.emit("room-created", {
      //   roomId: room._id,
      //   socketId: socket.id,
      // });

      res.status(200).send(room);
    }
    // });

    // socket.on("disconnect", () => {
    //   console.log("connection ended");
    // });
    // });
  } catch (error) {
    next(error);
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
      socket.on(
        "room-data",
        async (data: { socketId: string; userId: string }) => {
          const newUser = await User.findById({ _id: data.userId }).select({
            name: true,
          });
          const targetSocket = io.sockets.sockets.get(data.socketId);
          if (targetSocket) {
            socket.emit("heelo");
            socket.broadcast.emit("new-user", newUser?.name);
          }
        }
      );
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
    const { password, userId, username } = req.body;

    const room = await Room.find({ password });
    console.log("roomdata", room);
    if (room) {
      const newArr = [...room[0].playersIds].filter(
        (data) => data.playerId !== userId
      );
      const updatedPlayersArr = [
        ...newArr,
        {
          id: newArr.length + 1,
          playerId: userId,
          playerName: username,
        },
      ];

      const updatedRoom = await Room.findByIdAndUpdate(
        { _id: room[0]._id },
        {
          playersIds: updatedPlayersArr,
        },
        { new: true }
      );
      res.status(200).send(updatedRoom);
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const room = await findRoom(id);
    res.status(200).send(room);
  } catch (error) {
    console.log("err", error);
    next(error);
  }
};

export const startGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { socketId, roomId } = req.body;
    const io = req.app.get("socketio");

    const targetSocket = io.sockets.sockets.get(socketId);

    const room = await findRoom(roomId);

    if (room) {
      const cards = shuffle(generateCards()) as Card[];
      const playerArr = room.playersIds;
      const data = playerArr.map((player, index) => {
        return {
          id: index,
          playerId: player.playerId,
          playerName: player.playerName,
          cards: cards.splice(0, 7),
        };
      });
      io.on("connection", (socket: any) => {
        console.log("hllo*******************");
        socket.emit("newData");
      });

      const updatedRoom = await updateRoom(cards, roomId, data);

      res.status(200).send(updateRoom);
    }
  } catch (error) {
    next(error);
  }
};
