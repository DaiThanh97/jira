import { Request } from "express";

export interface IRequestUser extends Request {
  user: {
    id: string;
  };
}

export interface IListResponse<T> {
  total: number;
  data: T[];
}
