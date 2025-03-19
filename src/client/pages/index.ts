import { createBrowserRouter } from "react-router"
import { Root } from "./root"
import { InfluencersRoutes, SocialMedia } from "./influencers"
import { NotFound } from "../components/NotFound"

const socialMediasLoader = async (): Promise<SocialMedia[]> => {
  const response = await fetch("/api/social_medias", {
    method: "GET",
  }).then((res) => res.json())

  return response.data
}

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Root,
    loader: async () => {
      return { socialMedias: await socialMediasLoader() }
    },
    children: [
      ...InfluencersRoutes,
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
])
