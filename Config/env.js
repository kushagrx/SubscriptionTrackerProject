import { config } from "dotenv";

// Loads environment variables from a file based on NODE_ENV (or default)
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {PORT} = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;