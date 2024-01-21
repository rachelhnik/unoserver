import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";

const ErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;

    return res.status(statusCode).send({ errors });
  }

  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};

export default ErrorHandler;
