export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export type HttpStatusCodeType = (typeof HttpStatus)[keyof typeof HttpStatus];
