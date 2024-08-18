import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'

import { user } from './reducers/user'
import store from './store'

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
}

export type AppDispatch = typeof store.dispatch