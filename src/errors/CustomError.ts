export abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errors: { message: string };

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
