import ViteExpress from "vite-express"
import express from "express"
import sqlite3 from "sqlite3"
import { open as sqliteOpen } from "sqlite"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { ApiRouter } from "./api/index.js"

const dir = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(dir, "../../data/", "internal.db")
const db = await sqliteOpen({
  filename: dbPath,
  driver: sqlite3.Database,
})

const app = express()

app.use("/api", ApiRouter(db))

ViteExpress.listen(app, 3000, () =>
  console.log(`Server is listening on port 3000...`),
)
