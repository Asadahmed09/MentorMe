import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("PostgreSQL error:", err);
  process.exit(-1);
});

// export const ensureProfileContactColumns = async () => {
//   await pool.query(`
//     ALTER TABLE users
//       ADD COLUMN IF NOT EXISTS phone TEXT,
//       ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
//       ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
//       ADD COLUMN IF NOT EXISTS github_url TEXT,
//       ADD COLUMN IF NOT EXISTS website_url TEXT
//   `);

//   await pool.query(`
//     ALTER TABLE mentor_profiles
//       ADD COLUMN IF NOT EXISTS phone TEXT
//   `);
// };

export default pool;
