import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  avatar: string;
  userId: string;
}
