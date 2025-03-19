import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/error";
import { Enviroment } from "../utils/environment";
import { IJwtPayload } from "../modules/auth/auth.interface";
import { IRequestUser } from "../common/interfaces";

const isAuthenticated = (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  // Check if user is authenticated
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedException("Unauthorzied Access");
  }

  const decodedUser = jwt.verify(
    token,
    Enviroment.JWT_SECRET_KEY
  ) as IJwtPayload;
  if (!decodedUser) {
    throw new UnauthorizedException("Unauthorzied Access");
  }

  req.user = { id: decodedUser.id };
  next();
};

export default isAuthenticated;
