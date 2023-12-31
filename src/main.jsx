import React from "react"
import ReactDOM from "react-dom/client"
import zhCN from "antd/locale/zh_CN"
import { ConfigProvider } from "antd"

import "@/assets/icon/iconfont.css"
import "./index.scss"
import router from "./router/index.jsx"
import { RouterProvider } from "react-router-dom"
React.globalInfo = {
  bodyWidth: 1200,
  avatarUrl:"/api/file/getAvatar/",
  imageUrl:'/api/file/getImage/'
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
)
