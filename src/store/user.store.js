import { makeAutoObservable } from 'mobx'
class UserStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  loginUserInfo = null
  updateLoginUserInfo(value) {
    this.loginUserInfo = value
  }
}

export default UserStore