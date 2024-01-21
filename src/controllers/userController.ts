import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { generateUserId } from "../services/userService";
import BadRequestError from "../errors/BadRequestError";
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

    if (!email || !name) {
      throw new BadRequestError({
        code: 400,
        message: "Provide correct information",
      });
    }

    const isEmailAlreadyExisted = await User.findOne({ email });
    if (isEmailAlreadyExisted) {
      throw new BadRequestError({
        code: 400,
        message: "Email already existed",
      });
    }

    let userId = generateUserId(name);
    const isUserIdAlreadyExisted = await User.findOne({ userId });
    if (isUserIdAlreadyExisted) {
      userId = generateUserId(name);
    }

    const user = await User.create({ name, email, avatar: image, userId });
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
    console.log(req.body);

    let user = await User.findOne({ email });

    if (user?.name !== name) {
      user = await User.findByIdAndUpdate(user?._id, { name: name });
    }
    if (user?.avatar !== image) {
      //upload to server
    }
    if (user?.userId !== userId) {
      const isExistingId = await User.findOne({ userId: userId });
      if (isExistingId) {
        throw new BadRequestError({
          code: 400,
          message: "userId already in use",
        });
      }

      user = await User.findByIdAndUpdate(user?.id, { userId: userId });
      console.log("string", String(user?._id));
      await redis.set(String(user?._id), JSON.stringify(user));
    }

    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
};
