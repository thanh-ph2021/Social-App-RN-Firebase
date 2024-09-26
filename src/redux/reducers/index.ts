import { combineReducers } from "redux"

import { user } from "./user"
import device from "./device"
import { notification } from "./notification"
import asyncstorage from "./asyncstorage"
import chat from "./chat"
import message from "./message"


const rootReducer = combineReducers({
  userState: user,
  deviceState: device,
  notificationState: notification,
  asyncstorageState: asyncstorage,
  chatState: chat,
  messageState: message
})

export default rootReducer