import { Database } from "sqlite"
import { SocialMedia } from "./types.js"

export class SocialMediaService {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  async findAll(): Promise<SocialMedia[]> {
    return this.db.all("SELECT * FROM social_medias")
  }
}
