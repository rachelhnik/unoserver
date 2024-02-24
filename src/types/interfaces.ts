import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  avatar: string;
  userId: string;
}

interface PlayerData {
  id: number;
  playerId: String;
  playerName: String;
}

export interface IRoom {
  _id: ObjectId;
  name: string;
  password: string;
  socketId: string;
  ownerId: string;
  playersIds: PlayerData[];
  status: Status;
}

export enum Status {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}
