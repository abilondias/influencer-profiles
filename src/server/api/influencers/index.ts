import { Router } from "express"
import { constants as httpConstants } from "node:http2"
import { Database } from "sqlite"
import { InfluencerService } from "./service.js"
import { z } from "zod"

export const InfluencerRouter = (db: Database) => {
  const router = Router()
  const influencersService = new InfluencerService(db)

  router.get("/influencers", async (req, res, next) => {
    try {
      const { name } = req.query
      if (name && name != "") {
        const data = await influencersService.findByName(name as string)
        res.status(httpConstants.HTTP_STATUS_OK).send({ data })
        return
      }

      const data = await influencersService.findAll()
      res.status(httpConstants.HTTP_STATUS_OK).send({ data })
    } catch (error) {
      next(error)
    }
  })

  const NewInfluencer = z.object({
    first_name: z
      .string()
      .min(2, "First name needs to have at least 2 characters")
      .max(50, "First name can be at most 50 characters"),
    last_name: z
      .string()
      .min(2, "Last name needs to have at least 2 characters")
      .max(50, "Last name can be at most 50 characters"),
    accounts: z.array(
      z.object({
        social_media_id: z.number(),
        name: z
          .string()
          .min(1, "Account name needs to have at least 1 character"),
      }),
    ),
  })

  router.post("/influencers", async (req, res, next) => {
    try {
      const influencer = await influencersService.create(
        NewInfluencer.parse(req.body),
      )

      res.status(httpConstants.HTTP_STATUS_CREATED).send(influencer)
    } catch (error) {
      next(error)
    }
  })

  return router
}
