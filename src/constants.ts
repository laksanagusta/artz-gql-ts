import dotenv from "dotenv";

dotenv.config();

export const __prod__ = process.env.NODE_ENV === "production";
export const __db_url = process.env.DB_URL;
export const __port = process.env.PORT;
