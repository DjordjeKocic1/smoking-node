export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  UNPROCESSABLE_ENTITY = 422,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export const baseError = class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpStatusCode;
  public readonly type: string;

  constructor(
    name: string,
    statusCode: HttpStatusCode,
    message: string,
    type: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;
    this.type = type;

    Error.captureStackTrace(this);
  }
};
export const http403Error = class HTTP403Error extends baseError {
  constructor(message: string) {
    super("FORBIDDEN", HttpStatusCode.FORBIDDEN, message, "FORBIDDEN");
  }
};
export const http404Error = class HTTP404Error extends baseError {
  constructor(message: string) {
    super("PAGE NOT FOUND", HttpStatusCode.NOT_FOUND, message, "NOT FOUND");
  }
};

export const http422Error = class HTTP422Error extends baseError {
  constructor(message: string) {
    super(
      "BAD REQUEST",
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      message,
      "UNPROCESSABLE ENTITY"
    );
  }
};

export const http500Error = class HTTP500Error extends baseError {
  constructor() {
    super(
      "SERVER ERROR",
      HttpStatusCode.INTERNAL_SERVER,
      "Something went wrong with a server. Please try again later.",
      "INTERNAL SERVER ERROR"
    );
  }
};
