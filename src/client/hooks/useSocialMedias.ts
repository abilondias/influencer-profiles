import { useRouteLoaderData } from "react-router"
import { SocialMedia } from "../pages/influencers"
import { useMemo } from "react"

export const useSocialMedias = () => {
  const { socialMedias } = useRouteLoaderData("root") as {
    socialMedias: SocialMedia[]
  }
  const socialMediasMap = useMemo(() => {
    return new Map(socialMedias.map((sm) => [sm.id, sm]))
  }, [socialMedias])

  const socialMediaById = (id: number) => socialMediasMap.get(id)

  return { socialMedias, socialMediaById }
}
