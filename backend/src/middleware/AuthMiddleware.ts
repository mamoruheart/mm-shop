import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET!, (err, authData: any) => {
      console.log(!!err);
      if (!!err) {
        res.status(403).json({ msg: "Cookie expired" });
      } else {
        if (authData) next();
        else res.status(401).json({ msg: "You are not logged in" });
      }
    });
  } else res.status(401);
};
