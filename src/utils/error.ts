import { HttpStatus, HttpStatusCodeType } from "../configs/http.config";

export class AppError extends Error {
  public statusCode: HttpStatusCodeType;

  constructor(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends AppError {
  constructor(
    message = "Http Exception Error",
    statusCode: HttpStatusCodeType
  ) {
    super(message, statusCode);
  }
}

export class InternalServerException extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Resource not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorzied Access") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
