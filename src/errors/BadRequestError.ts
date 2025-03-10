import { CustomError } from "./CustomError";

export default class BadRequestError extends CustomError {
  private static readonly _statusCode = 400;
  private readonly _code: number;
  private static readonly errors: { message: string };

  constructor(params?: { code?: number; message?: string }) {
    const { code, message } = params || {};

    super(message || "Bad request");
    this._code = code || BadRequestError._statusCode;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  get errors() {
    return { message: this.message };
  }

  get statusCode() {
    return this._code;
  }
}
