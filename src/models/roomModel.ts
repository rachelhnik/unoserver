import mongoose, { Schema } from "mongoose";
import { IRoom, Status } from "../types/interfaces";
import userModel from "./userModel";

const roomSchema: Schema<IRoom> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    socketId: { type: String },
    ownerId: { type: String },
    currentCard: {
      type: { color: String, cardNumber: Number, cardName: String },
    },
    currentPlayerId: { type: String },
    winnerId: { type: String },
    cards: {
      type: [
        { color: String, cardNumber: Number, cardName: String, mark: Number },
      ],
    },
    clockwiseDirection: { type: Boolean, default: true },
    firstTurn: { type: Boolean, default: true },
    cardsToDraw: { type: Number, default: 0 },
    players: {
      type: [
        {
          id: Number,
          playerId: String,
          playerName: String,
          cards: [
            {
              color: String,
              cardNumber: Number,
              cardName: String,
              mark: Number,
            },
          ],
          isPlayerTurn: { type: Boolean, default: false },
          mark: { type: Number, default: 0 },
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
