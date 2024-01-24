import { randomUUID } from "crypto";
import User from "../models/userModel";
import { IUser } from "../types/interfaces";
import BadRequestError from "../errors/BadRequestError";

export const generateUserId = (name: string) => {
  return name.substring(0, 2) + randomUUID().substring(0, 6);
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserByUserId = async (userId: string) => {
  return await User.findOne({ userId });
};

export const checkInvalidRequest = async (email: string, name: string) => {
  if (!email || !name) {
    throw new BadRequestError({
      code: 400,
      message: "Provide correct information",
    });
  }
  const isEmailAlreadyExisted = await findUserByEmail(email);
  if (isEmailAlreadyExisted) {
    throw new BadRequestError({
      code: 400,
      message: "Email already existed",
    });
  }
};

export const addUser = async (
  name: string,
  email: string,
  image: string
): Promise<IUser> => {
  let userId = generateUserId(name);
  const isUserIdAlreadyExisted = await findUserByUserId(userId);
  if (isUserIdAlreadyExisted) {
    userId = generateUserId(name);
  }
  return await User.create({ name, email, avatar: image, userId });
};

export const editUserData = async (
  name: string,
  email: string,
  image: string,
  userId: string
) => {
  let user = await findUserByEmail(email);

  if (user?.name !== name) {
    user = await User.findByIdAndUpdate(user?._id, { name: name });
  }
  if (user?.avatar !== image) {
    //upload to server
  }
  if (user?.userId !== userId) {
    const isExistingId = await findUserByUserId(userId);
    console.log("is", isExistingId);
    if (isExistingId) {
      throw new BadRequestError({
        code: 400,
        message: "userId already in use",
      });
    }
    user = await User.findByIdAndUpdate(user?.id, { userId: userId });
  }

  return findUserByEmail(email);
};
