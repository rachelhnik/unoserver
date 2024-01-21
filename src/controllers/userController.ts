import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { generateUserId } from "../services/userService";
import BadRequestError from "../errors/BadRequestError";

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

    res.status(200).send({ message: "User successfully created", user: user });
  } catch (error) {
    next(error);
  }
};
