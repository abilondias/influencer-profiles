import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./App.css"

import { createBrowserRouter, RouterProvider } from "react-router"
import { InfluencersRoutes } from "./routes/influencers"

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [...InfluencersRoutes],
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
