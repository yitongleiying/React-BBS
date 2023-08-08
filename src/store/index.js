import { useContext, createContext } from 'react'
import UserStore from './user.store.js'
class RootStore {
  constructor() {
    this.userStore = new UserStore()
  }
}
const store = new RootStore()
const context = createContext(store)
const useStore=()=> useContext(context)
export default useStore