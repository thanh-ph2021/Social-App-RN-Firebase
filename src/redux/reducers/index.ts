import { combineReducers } from "redux"

import { user } from "./user"
import device from "./device"
import { notification } from "./notification"
import asyncstorage from "./asyncstorage"


const rootReducer = combineReducers({
  userState: user,
  deviceState: device,
  notificationState: notification,
  asyncstorageState: asyncstorage,
})

export default rootReducer