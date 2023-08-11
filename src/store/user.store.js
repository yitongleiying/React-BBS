import { makeAutoObservable } from 'mobx'
class UserStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  // 登陆信息
  loginUserInfo = null
  // 是否展示登陆
  showLogin = false
  // 板块信息,
  boardList = []
  // 当前一级板块
  activePBoardId = 0
  // 二级版块
  activeBoardId = 0
  updateLoginUserInfo(value) {
    this.loginUserInfo = value
  }
  saveBoardList(value) {
    this.boardList = value
  }
  //  展示登陆状态
  isShowLogin(value) {
    this.showLogin = value
  }
}

export default UserStore