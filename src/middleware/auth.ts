import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";
import jwt from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new Error("Not authenticated");
  }

  const token = authHeader.split(" ")[1];

  const decoded: jwt.JwtPayload = () => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  };

  context.req.body.user = decoded.id;

  return next();
};
