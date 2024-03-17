import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

const ErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const { statusCode, errors } = err;
    console.log("error", errors);
    return res.status(statusCode).send({ errors });
  }

  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};

export default ErrorHandler;
