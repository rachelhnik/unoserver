import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  avatar: string;
  userId: string;
}

export interface IRoom {
  _id: ObjectId;
  name: string;
  password: string;
  socketId: string;
  playersIds: string[];
  status: Status;
}

export enum Status {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}
