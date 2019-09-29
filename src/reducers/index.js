import { combineReducers } from 'redux'
import login from './login'
import oilCard from './oilCard'
import driver from './driver'
import account from './account'
import open from './open'
import oilDetail from './oilDetail'

export default combineReducers({
  login,
  oilCard,
  driver,
  account,
  open,
  oilDetail
})
