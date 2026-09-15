import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});


import pool from "../lib/db";

async function initDatabase() {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        password_hash TEXT NOT NULL,

        email_verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT UNIQUE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    await pool.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS reset_token_hash TEXT,
        ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS reset_requested_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS password_version INTEGER NOT NULL DEFAULT 0;
      CREATE UNIQUE INDEX IF NOT EXISTS users_reset_token_hash_idx
        ON users (reset_token_hash) WHERE reset_token_hash IS NOT NULL;
    `);

    console.log("Table users créée ou déjà existante.");


  } catch (error) {

    console.error(
      "Erreur création database:",
      error
    );

    process.exitCode = 1;
  } finally {

    await pool.end();

  }
}


initDatabase();