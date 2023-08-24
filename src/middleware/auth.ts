import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { __jwt_secret } from "../config/credentials";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "src/types";
export interface CustomRequest extends Request {
  user: string | JwtPayload | undefined;
}

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  try {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
      throw Error();
    }

    const token = authHeader.split(" ")[1];

    const secretKey = __jwt_secret ?? "";

    const decoded = jwt.verify(token, secretKey);
    (context.req as CustomRequest).user = decoded;

    next();
  } catch (e) {
    context.res.status(401).send({ message: "Unauthorized" });
  }
};
