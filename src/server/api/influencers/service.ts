import { Database } from "sqlite"
import { Influencer, InfluencerData } from "./types.js"

export class InfluencerService {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  async create(influencer: Omit<Influencer, "id">): Promise<Influencer> {
    try {
      await this.db.exec("BEGIN TRANSACTION")

      const { id: influencerId } = await this.db.get(
        "INSERT INTO influencers (first_name, last_name) VALUES(?, ?) RETURNING id",
        [influencer.first_name, influencer.last_name],
      )

      for (const account of influencer.accounts) {
        await this.db.run(
          "INSERT INTO influencers_social_medias (influencer_id, social_media_id, name) VALUES(?, ?, ?)",
          [influencerId, account.social_media_id, account.name],
        )
      }

      await this.db.exec("COMMIT")

      return {
        id: influencerId,
        ...influencer,
      }
    } catch (error) {
      await this.db.exec("ROLLBACK")

      throw error
    }
  }

  async findAll(): Promise<Influencer[]> {
    const query = `
      SELECT i.id, i.first_name, i.last_name, sm.id as social_media_id, ism.name as account_name
      FROM influencers i, social_medias sm, influencers_social_medias ism
      WHERE i.id = ism.influencer_id
      AND sm.id = ism.social_media_id
    `

    const influencersData: InfluencerData[] = await this.db.all(query)

    return this.formatRows(influencersData)
  }

  async findByName(name: string): Promise<Influencer[]> {
    const query = `
      SELECT i.id, i.first_name, i.last_name, sm.id as social_media_id, ism.name as account_name
      FROM influencers i, social_medias sm, influencers_social_medias ism
      WHERE i.id = ism.influencer_id
      AND sm.id = ism.social_media_id
      AND i.name LIKE ?
    `

    const influencersData: InfluencerData[] = await this.db.all(query, [
      `${name}%`,
    ])

    return this.formatRows(influencersData)
  }

  private formatRows(influencers: InfluencerData[]): Influencer[] {
    return influencers.reduce((result: Influencer[], row) => {
      let influencer = result.find((influencer) => influencer.id === row.id)

      if (!influencer) {
        influencer = {
          id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          accounts: [],
        }
        result.push(influencer)
      }

      influencer.accounts.push({
        social_media_id: row.social_media_id,
        name: row.account_name,
      })

      return result
    }, [])
  }
}
