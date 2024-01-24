import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import {
  addUser,
  checkInvalidRequest,
  editUserData,
} from "../services/userService";
import { redis } from "../utils/redis";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, email } = req.query;
    let user = await redis.get(String(id));
    if (user) {
      return res.status(200).send(user);
    }
    user = await User.findOne({ email });
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, image } = req.body;
    await checkInvalidRequest(email, name);
    const user = await addUser(name, email, image);
    await redis.set(String(user._id), JSON.stringify(user));
    res.status(201).send({ message: "User successfully created", user: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, image, userId } = req.body;
    const updatedUser = await editUserData(name, email, image, userId);
    await redis.set(String(updatedUser?._id), JSON.stringify(updatedUser));
    res.status(201).send(updatedUser);
  } catch (error) {
    next(error);
  }
};
