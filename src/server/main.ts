import ViteExpress from "vite-express"
import express, { Router } from "express"
import { constants as httpConstants } from "node:http2"

const app = express()

const apiRouter = Router()

apiRouter.use(express.json())

apiRouter.get("/ok", (_, res) => {
  res.status(httpConstants.HTTP_STATUS_OK).send("OK")
})

app.use("/api", apiRouter)

ViteExpress.listen(app, 3000, () =>
  console.log(`Server is listening on port 3000...`),
)
