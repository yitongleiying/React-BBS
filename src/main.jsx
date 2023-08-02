import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import "@/assets/icon/iconfont.css"
import router from "./router/index.jsx"
import { RouterProvider } from "react-router-dom"
React.globalInfo={
  bodyWidth:1300
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
)
