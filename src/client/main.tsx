import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"

import { createBrowserRouter, RouterProvider } from "react-router"
import { InfluencersRoutes } from "./routes/influencers"
import { NotificationContextProvider } from "./contexts/NotificationContext"

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
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
