import { Outlet, Link } from "react-router-dom"
import { Button } from "antd"
import Dialog from "./components/Modal"
import React from "react"
import styles from "./Layout.module.scss"
import { useBoolean, useScroll, useUpdateEffect, useSetState } from "ahooks"
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

  const { globalInfo } = React
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
      <Button className={styles["op-btn"]} ghost onClick={() => setDialog(() => ({ show: true }))}>
        登陆
      </Button>
      <Button className={styles["op-btn"]} ghost onClick={() => setDialog(() => ({ show: true }))}>
        注册
      </Button>
    </>
  )
  // 对话框
  const [dialog, setDialog] = useSetState({
    show: false,
    title: "编辑个人信息",
    buttons: [
      {
        type: "primary",
        text: "确定",
        click: () => {
          console.log('123456');
        },
      },
    ],
  })
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
      <Dialog
        onClose={() => setDialog(() => ({ show: false }))}
        show={dialog.show}
        title={dialog.title}
        buttons={dialog.buttons}
        showCancel={true}
      >
        <div style={{height:800}}>妹子真好看</div>
      </Dialog>
      <div className={styles["body-content"]}>
        <Outlet />
      </div>
    </>
  )
}

export default Layout
