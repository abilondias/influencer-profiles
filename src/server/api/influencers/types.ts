export type InfluencerData = {
  id: number
  first_name: string
  last_name: string
  social_media_id: number
  account_name: string
}

export type Account = {
  social_media_id: number
  name: string
}

export type Influencer = {
  id: number
  first_name: string
  last_name: string
  accounts: Account[]
}
