import sqlite3 from "sqlite3"
import url from "node:url"
import path from "node:path"
import fs from "node:fs"

/**
 * Creates the internal SQLite database file
 */
const filePath = url.fileURLToPath(import.meta.url)
const scriptDir = path.dirname(filePath)
const dataPath = path.join(scriptDir, "../../data/")
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath)
}
const dbPath = path.join(dataPath, "internal.db")
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  const createTables = `
    BEGIN TRANSACTION;

    -- Tables
    
    CREATE TABLE IF NOT EXISTS "influencers" (
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "first_name"	TEXT NOT NULL,
      "last_name"	TEXT NOT NULL,
      "name" TEXT GENERATED ALWAYS AS (first_name || " " || last_name) VIRTUAL
    );

    CREATE TABLE IF NOT EXISTS "social_medias" (
      "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "slug"	TEXT NOT NULL,
      "title"	TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "influencers_social_medias" (
      "influencer_id" INTEGER NOT NULL,
      "social_media_id" INTEGER NOT NULL,
      "name" TEXT NOT NULL,
      PRIMARY KEY("influencer_id","social_media_id","name")
    );

    -- Seeding

    INSERT INTO social_medias ("slug", "title") VALUES ("tiktok", "Tiktok"), ("instagram", "Instagram");
    
    COMMIT;
  `

  db.exec(createTables, (err) => {
    if (!err) {
      console.log("Database created")
      return
    }

    console.error("Failed to create tables", err)
    process.exit(1)
  })
})
