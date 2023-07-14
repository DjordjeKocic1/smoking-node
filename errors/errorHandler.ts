export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  UNPROCESSABLE_ENTITY = 422,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export const baseError = class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpStatusCode;

  constructor(name: string, statusCode: HttpStatusCode, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this);
  }
};

export const http422Error = class HTTP400Error extends baseError {
  constructor(message: string) {
    super("BAD REQUEST", HttpStatusCode.UNPROCESSABLE_ENTITY, message);
  }
};

export const http404Error = class HTTP500Error extends baseError {
  constructor() {
    super("PAGE NOT FOUND", HttpStatusCode.NOT_FOUND, "Page not found.");
  }
};

export const http500Error = class HTTP500Error extends baseError {
  constructor() {
    super(
      "SERVER ERROR",
      HttpStatusCode.INTERNAL_SERVER,
      "Something went wrong with a server. Please try again later."
    );
  }
};
