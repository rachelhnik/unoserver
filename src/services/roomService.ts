import { ObjectId } from "mongoose";
import BadRequestError from "../errors/BadRequestError";
import Room from "../models/roomModel";
import { Card } from "../types/interfaces";

export const findRoom = async (id: any) => {
  const room = await Room.findById({ _id: id });
  console.log("room", room);
  if (room) {
    return room;
  } else {
    throw new BadRequestError({ code: 404, message: "Room not found." });
  }
};

export const updateRoom = async (cards: Card[], id: string, data: any) => {
  const defaultCard = cards.splice(0, 1)[0];
  const room = await Room.findByIdAndUpdate(
    id,
    {
      playersIds: data,
      cards: cards,
      status: "PLAYING",
      currentCard: defaultCard,
    },
    { new: true }
  );

  if (room) {
    return room;
  } else {
    throw new BadRequestError({ code: 404, message: "Something went worng." });
  }
};
