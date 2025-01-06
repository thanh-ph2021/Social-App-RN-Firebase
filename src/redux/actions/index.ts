import { AppThunk } from '../types'
import { fetchUser, fetchUsers } from './user'
import { fetchPosts, fetchPostsRequest } from './post'
import { fetchStories } from './story'

export const reload = (): AppThunk => async (dispatch) => {
    await dispatch(fetchPostsRequest())
    await dispatch(fetchUser())
    await dispatch(fetchUsers())
    await dispatch(fetchStories())
    await dispatch(fetchPosts())
}

export { addPost, fetchPosts } from './post'
export { fetchUser } from './user'


