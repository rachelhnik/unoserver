import mongoose, { Schema } from "mongoose";
import { IRoom, Status } from "../types/interfaces";

const roomSchema: Schema<IRoom> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    socketId: { type: String },
    playersIds: { type: [String] },
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
