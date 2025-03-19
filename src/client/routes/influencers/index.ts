import { LoaderFunctionArgs } from "react-router"
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

const influencersByNameLoader = async (name: string): Promise<Influencer[]> => {
  const qs = new URLSearchParams()
  qs.append("name", name)

  const response = await fetch(`/api/influencers?${qs}`, {
    method: "GET",
  }).then((res) => res.json())

  return response.data
}

const influencersLoader = async (): Promise<Influencer[]> => {
  const response = await fetch("/api/influencers", { method: "GET" }).then(
    (res) => res.json(),
  )

  return response.data
}

export const InfluencersRoutes = [
  {
    path: "/influencers",
    Component: Influencers,
    loader: async (loader: LoaderFunctionArgs) => {
      const url = new URL(loader.request.url)
      const name = url.searchParams.get("name")
      if (!name || name === "") {
        return { influencers: await influencersLoader() }
      }

      return { influencers: await influencersByNameLoader(name) }
    },
  },
  {
    path: "/influencers/new",
    Component: InfluencerForm,
  },
]
