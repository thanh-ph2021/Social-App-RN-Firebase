import { legacy_createStore as createStore, applyMiddleware, Store } from 'redux'
import { thunk } from 'redux-thunk'

import rootReducer from './reducers'
import { RootState } from './types'

const store: Store<RootState> = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

export default store