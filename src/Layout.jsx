import { Outlet, Link } from "react-router-dom"
import React from "react"
import styles from "./Layout.module.scss"
const logoInfo = [
  {
    letter: "E",
    color: "#3285FF",
  },
  {
    letter: "a",
    color: "#FB3624",
  },
  {
    letter: "s",
    color: "#FFBA02",
  },
  {
    letter: "y",
    color: "#3285FF",
  },
  {
    letter: "b",
    color: "#25B24E",
  },
  {
    letter: "b",
    color: "#FD3224",
  },
  {
    letter: "s",
    color: "#FFBA02",
  },
]
function Layout() {
  const { globalInfo } = React
  // 渲染logo标签
  const renderLogo = () =>
    logoInfo.map((item, index) => (
      <span key={index} style={{ color: item.color }}>
        {item.letter}
      </span>
    ))
  return (
    <>
      <div className={styles.header}>
        <div className={styles["header-content"]} style={{ width: globalInfo.bodyWidth }}>
          <Link to="/" className={styles.logo}>
            {renderLogo()}
          </Link>
        </div>
        <div className={styles["menu-panel"]}></div>
      </div>
      <div className={styles["body-content"]}>
        <Outlet />
      </div>
    </>
  )
}

export default Layout
