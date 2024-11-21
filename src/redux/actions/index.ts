import { AppThunk } from '../types'
import { fetchUser, fetchUsers } from './user'
import { fetchPosts } from './post'
import { fetchStories } from './story'
import { SHOW_BOTTOM_SHEET_CHANGE } from '../constants'

export const reload = (): AppThunk => async (dispatch) => {
    await dispatch(fetchUser())
    await dispatch(fetchUsers())
    await dispatch(fetchPosts())
    await dispatch(fetchStories())
}

export { addPost, fetchPosts } from './post'
export { fetchUser } from './user'


