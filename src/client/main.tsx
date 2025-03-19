import React from "react"
import ReactDOM from "react-dom/client"
import { Root } from "./routes/root"
import "bootstrap/dist/css/bootstrap.min.css"

import { createBrowserRouter, RouterProvider } from "react-router"
import { InfluencersRoutes, SocialMedia } from "./routes/influencers"
import { NotificationContextProvider } from "./contexts/NotificationContext"

const socialMediasLoader = async (): Promise<SocialMedia[]> => {
  const response = await fetch("/api/social_medias", {
    method: "GET",
  }).then((res) => res.json())

  return response.data
}

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Root,
    loader: async () => {
      return { socialMedias: await socialMediasLoader() }
    },
    children: [...InfluencersRoutes],
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NotificationContextProvider>
      <RouterProvider router={router} />
    </NotificationContextProvider>
  </React.StrictMode>,
)
