import { createSelector } from "reselect";
import { PostModel, UserModel } from "../models";

export const selectPostById = createSelector(
    [
        state => state.userState.posts,
        (state, postId) => postId
    ],
    (posts, postId) => posts.filter((post: PostModel) => post.id === postId)[0]
)

export const selectPostByUserId = createSelector(
    [
        state => state.userState.posts,
        (state, userId) => userId
    ],
    (posts, userId) => posts.filter((post: PostModel) => post.userID === userId)
)

export const selectUserByUID = createSelector(
    [
        state => state.userState.users,
        (state, uid) => uid
    ],
    (users, uid) => users.filter((user: UserModel) => user.uid === uid)[0]
)

export const selectPostUserLiked = createSelector(
    [
        state => state.userState.posts,
        (state, uid) => uid
    ],
    (posts, uid) => posts.filter((post: PostModel) => {
        const likes = post.likes ? post.likes.map(like => like.userID) : []
        return likes.includes(uid)
    })
)

export const selectPostTagged = createSelector(
    [
        state => state.userState.posts,
        (state, postTags) => postTags
    ],
    (posts, postTags) => posts.filter((post: PostModel) => {
        return postTags.includes(post.id)
    })
)

export const selectPostbySearch = createSelector(
    [
        state => state.userState.posts,
        (state, searchText) => searchText
    ],
    (posts, searchText) => {
        if (searchText) {
            return posts.filter((post: PostModel) => {
                const medias = post.media ? post.media.map(item => item.uri) : []
                return post.post.includes(searchText) || medias.includes(searchText)
            })
        }
        return []
    }
)

export const selectUserbySearch = createSelector(
    [
        state => state.userState.users,
        (state, searchText) => searchText
    ],
    (users, searchText) => {
        if (searchText) {
            return users.filter((user: UserModel) => {
                if (user.fname && user.lname) {
                    return user.fname.includes(searchText) || user.lname.includes(searchText)
                }
                return false
            })
        }
        return []
    }
)