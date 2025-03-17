import { InfluencerForm } from "./InfluencerForm"
import { Influencers } from "./Influencers"

export type SocialMedia = {
  id: number
  title: string
  slug: string
}

export type Account = {
  social_media_id: number
  name: string
}

export type Influencer = {
  id: number
  first_name: string
  last_name: string
  accounts: {
    social_media_id: number
    name: string
  }[]
}

const influencersLoader = async () => {
  const response = await fetch("/api/influencers", { method: "GET" }).then(
    (res) => res.json(),
  )

  return response.data
}

const socialMediasLoader = async () => {
  const response = await fetch("/api/social_medias", {
    method: "GET",
  }).then((res) => res.json())

  return response.data
}

export const InfluencersRoutes = [
  {
    path: "/influencers",
    Component: Influencers,
    loader: async () => {
      return { influencers: await influencersLoader() }
    },
  },
  {
    path: "/influencers/new",
    Component: InfluencerForm,
    loader: async function () {
      return { socialMedias: await socialMediasLoader() }
    },
  },
]
