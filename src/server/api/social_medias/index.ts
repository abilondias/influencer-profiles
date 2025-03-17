import { Router } from "express"
import { constants as httpConstants } from "node:http2"
import { Database } from "sqlite"
import { SocialMediaService } from "./service.js"

export const SocialMediaRouter = (db: Database) => {
  const router = Router()
  const socialMediaService = new SocialMediaService(db)

  router.get("/social_medias", async (req, res, next) => {
    try {
      const data = await socialMediaService.findAll()
      res.status(httpConstants.HTTP_STATUS_OK).send({ data })
    } catch (error) {
      next(error)
    }
  })

  return router
}
