import dotenv from "dotenv";

dotenv.config();

export const __prod__ = process.env.NODE_ENV === "production";
export const __port = process.env.PORT;
export const __jwt_secret = process.env.JWT_SECRET_KEY;

export const __db_port = process.env.DB_PORT;
export const __db_host = process.env.DB_HOST;
export const __db_user = process.env.DB_USER;
export const __db_password = process.env.DB_PASSWORD;
export const __db_database = process.env.DB_DATABASE;
