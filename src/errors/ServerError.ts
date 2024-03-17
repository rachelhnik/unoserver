import { CustomError } from "./CustomError";

export default class ServerError extends CustomError {
  private static readonly _statusCode = 500;
  private readonly _code: number;
  private static readonly errors: { message: string };

  constructor(params?: { code?: number; message?: string }) {
    const { code, message } = params || {};

    super(message || "Internal Server Error");
    this._code = code || ServerError._statusCode;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
  get errors() {
    return { message: this.message };
  }

  get statusCode() {
    return this._code;
  }
}
