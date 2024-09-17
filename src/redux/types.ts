import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'

import { user } from './reducers/user'
import store from './store'
import device from './reducers/device'
import { notification } from './reducers/notification'
import asyncstorage from './reducers/asyncstorage'

export type ActionType = {
    type: string,
    payload: any
}

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

export interface RootState {
    userState: ReturnType<typeof user>
    deviceState: ReturnType<typeof device>
    notificationState: ReturnType<typeof notification>
    asyncstorageState: ReturnType<typeof asyncstorage>
}

export type AppDispatch = typeof store.dispatch