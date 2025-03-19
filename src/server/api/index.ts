import express, { Router } from "express"
import { ZodError } from "zod"
import { constants as httpConstants } from "node:http2"
import type { Database } from "sqlite"
import { InfluencerRouter } from "./influencers/index.js"
import { SocialMediaRouter } from "./social_medias/index.js"
import { ApiError } from "./utils/http.js"

const errorHandler: express.ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).send({
      message: error.message,
    })
    return
  }

  if (error instanceof ZodError && "issues" in error) {
    res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
      message: "Invalid payload information",
      details: error.issues.map((issue) => ({
        message: issue.message,
        field: issue.path.join("."),
      })),
    })
    return
  }

  if (error instanceof SyntaxError && "body" in error) {
    res
      .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: "Invalid JSON payload" })
    return
  }

  console.error("Unexpected server error", error)

  res
    .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: "Unexpected server error" })
}

export const ApiRouter = (db: Database) => {
  const router = Router()

  router.use(express.json())

  router.use(InfluencerRouter(db))
  router.use(SocialMediaRouter(db))

  router.use(errorHandler)

  return router
}
