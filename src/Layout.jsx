import { Outlet, Link } from "react-router-dom"
import { Button } from "antd"
import LoginAndRegister from "./pages/LoginAndRegister"
import React, { useRef } from "react"
import styles from "./Layout.module.scss"

import { useBoolean, useScroll, useUpdateEffect } from "ahooks"
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
const getScrollTop = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  return scrollTop
}
function Layout() {
  const { globalInfo } = React
  // 获取浏览器滚动条位置监听滚动往下时是否显示顶部导航栏
  const [showHeader, { setTrue, setFalse }] = useBoolean(true)
  const scroll = useScroll(document)
  const initScroll = () => {
    const current = getScrollTop()
    if (scroll.top > 100 && scroll.top < current) {
      setFalse()
    } else {
      setTrue()
    }
  }

  useUpdateEffect(() => {
    window.addEventListener("scroll", initScroll)
    return () => {
      window.removeEventListener("scroll", initScroll())
    }
  })

  // 渲染logo标签
  const renderLogo = () =>
    logoInfo.map((item, index) => (
      <span key={index} style={{ color: item.color }}>
        {item.letter}
      </span>
    ))
  // 渲染板块栏
  // 渲染按钮组件
  const renderButton = () => (
    <>
      <Button
        type="primary"
        className={styles["op-btn"]}
        icon={<span className="iconfont icon-add"></span>}
      >
        发贴
      </Button>
      <Button
        type="primary"
        className={styles["op-btn"]}
        icon={<span className="iconfont icon-search"></span>}
      >
        搜索
      </Button>
      <Button className={styles["op-btn"]} ghost onClick={()=>loginAndRegister(1)}>
        登陆
      </Button>
      <Button className={styles["op-btn"]} ghost onClick={()=>loginAndRegister(0)}>
        注册
      </Button>
    </>
  )
  // 登陆注册对话框
  const loginAndRegisterRef = useRef(null)
  const loginAndRegister=(type)=>{
    loginAndRegisterRef.current.showDialog(type)
  }
  return (
    <>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles["header-content"]} style={{ width: globalInfo.bodyWidth }}>
            <Link to="/" className={styles.logo}>
              {renderLogo()}
            </Link>
            <div className={styles["menu-panel"]}></div>
            <div className={styles["user-info-panel"]}>
              {/* 右侧登陆按钮组 */}
              {renderButton()}
            </div>
          </div>
        </div>
      )}

      <div className={styles["body-content"]}>
        <Outlet />
      </div>
      <LoginAndRegister ref={loginAndRegisterRef} />
    </>
  )
}

export default Layout
