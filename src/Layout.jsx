import { Outlet, Link } from "react-router-dom"
import { Button, Popover, Badge } from "antd"
import React, { useRef, useEffect } from "react"
import { useRequest } from "ahooks"
import { observer } from "mobx-react-lite"
import useStore from "@/store/index"
import styles from "./Layout.module.scss"
import Request from "./utils/Request"
import AvataR from "./components/Avatar"
import LoginAndRegister from "./pages/LoginAndRegister"
const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  getMessageCount: "/ucenter/getMessageCount",
  logout: "/logout",
  getSysSetting: "/getSysSetting",
}
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
const Layout = observer(() => {
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
  // 登陆注册对话框
  const loginAndRegisterRef = useRef(null)
  const loginAndRegister = (type) => {
    loginAndRegisterRef.current.showDialog(type)
  }
  const { userStore } = useStore()
  const { loginUserInfo, updateLoginUserInfo, showLogin,boardList, saveBoardList } = userStore
  // 获取用户信息
  const getUserInfo = async () => {
    let result = await Request({
      url: api.getUserInfo,
      showLoading: false,
    })
    if (!result) {
      return
    }
    updateLoginUserInfo(result.data)
  }
  useRequest(getUserInfo)
  useEffect(()=>{
    if(showLogin){
      loginAndRegisterRef.current.showDialog(1)
    }
  },[showLogin])
  // 获取板块信息
  const loadBoard = async () => {
    let result = await Request({
      url: api.loadBoard,
    })
    if (!result) {
      return
    }
    saveBoardList(result.data)
  }
  useRequest(loadBoard)
  const renderLogo = () =>
    logoInfo.map((item, index) => (
      <span key={index} style={{ color: item.color }}>
        {item.letter}
      </span>
    ))
  const avatarRef = useRef()
  // 渲染按钮组件和头像信息
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

      {loginUserInfo === null ? (
        <>
          <Button className={styles["op-btn"]} ghost onClick={() => loginAndRegister(1)}>
            登陆
          </Button>
          <Button className={styles["op-btn"]} ghost onClick={() => loginAndRegister(0)}>
            注册
          </Button>
        </>
      ) : (
        <>
          <div className={styles["user-info"]}>
            <Popover
              content={
                <>
                  <p className="message">回复我的</p>
                  <p className="message">赞了我的文章</p>
                  <p className="message">下载了我的附件</p>
                  <p className="message">赞了我的评论</p>
                  <p className="message">回复我的</p>
                  <p className="message">系统消息</p>
                </>
              }
              trigger="hover"
            >
              <Badge count={5} size="small">
                <span className="iconfont icon-message"></span>
              </Badge>
            </Popover>
          </div>
          <div className={styles["message-info"]}>
            <Popover
              content={
                <>
                  <p className="message">我的主页</p>
                  <p className="message">退出</p>
                </>
              }
              trigger="hover"
            >
              <>
                <AvataR ref={avatarRef} size={45} userId={loginUserInfo.userId}></AvataR>
              </>
            </Popover>
          </div>
        </>
      )}
    </>
  )
  // 渲染板块信息
  const renderBoardList = () => (
    <>
      <Link to="/" className={[styles["menu-item"], styles.home].join(" ")}>
        首页
      </Link>
      {boardList.map((board) =>
        board.children ? (
          <Popover
            key={board.boardId}
            placement="bottomLeft"
            content={
              <div className={styles["sub-board-list"]}>
                {board.children.map((subBoard) => (
                  <span key={subBoard.boardId} className={styles["sub-board"]}>
                    {subBoard.boardName}
                  </span>
                ))}
              </div>
            }
            trigger="hover"
          >
            <>
              <span className={styles["menu-item"]}>{board.boardName}</span>
            </>
          </Popover>
        ) : (
          <span key={board.boardId} className={styles["menu-item"]}>
            {board.boardName}
          </span>
        ),
      )}
    </>
  )
  return (
    <>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles["header-content"]} style={{ width: globalInfo.bodyWidth }}>
            <Link to="/" className={styles.logo}>
              {renderLogo()}
            </Link>
            <div className={styles["menu-panel"]}>
              {/* 渲染板块信息 */}
              {renderBoardList()}
            </div>
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
})

export default Layout
