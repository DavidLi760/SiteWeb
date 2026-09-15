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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        order_type TEXT NOT NULL CHECK (order_type IN ('takeaway', 'delivery')),
        items JSONB NOT NULL,
        total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
        delivery_address JSONB,
        email_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'incomplete')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders (user_id, created_at DESC);
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