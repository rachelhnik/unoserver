import { ObjectId } from "mongoose";
import BadRequestError from "../errors/BadRequestError";
import Room from "../models/roomModel";

export const findRoom = async (id: any) => {
  const room = await Room.findById({ _id: id });
  if (room) {
    return room;
  } else {
    throw new BadRequestError({ code: 404, message: "Room not found." });
  }
};
