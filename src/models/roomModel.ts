import mongoose, { Schema } from "mongoose";
import { IRoom, Status } from "../types/interfaces";

const roomSchema: Schema<IRoom> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    socketId: { type: String },
    ownerId: { type: String },
    currentCard: {
      type: { color: String, cardNumber: Number, cardName: String },
    },
    cards: {
      type: [{ color: String, cardNumber: Number, cardName: String }],
    },
    playersIds: {
      type: [
        {
          id: Number,
          playerId: String,
          playerName: String,
          cards: [{ color: String, cardNumber: Number, cardName: String }],
        },
      ],
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.WAITING,
    },
  },
  { timestamps: true }
);

const roomModel = mongoose.model<IRoom>("Room", roomSchema);

export default roomModel;
