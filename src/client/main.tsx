import React from "react"
import ReactDOM from "react-dom/client"
import "bootstrap/dist/css/bootstrap.min.css"

import { NotificationContextProvider } from "./contexts/NotificationContext"
import { router } from "./routes"
import { RouterProvider } from "react-router"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NotificationContextProvider>
      <RouterProvider router={router} />
    </NotificationContextProvider>
  </React.StrictMode>,
)
