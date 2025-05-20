import { Client } from "pg";
import env from "dotenv";

env.config();

const db = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default db;