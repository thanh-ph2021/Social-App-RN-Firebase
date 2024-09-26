import { AppThunk } from '../types'
import { fetchUser, fetchUsers } from './user'
import { fetchPosts } from './post'

export const reload = (): AppThunk => async (dispatch) => {
    await dispatch(fetchUser())
    await dispatch(fetchUsers())
    await dispatch(fetchPosts())
}


export { addPost, fetchPosts } from './post'
export { fetchUser } from './user'


