import { createSelector } from "reselect";
import { MessageItemModel, MessageModel, PostModel, UserModel } from "../models";
import { RootState } from "./types";
import { StoryModel } from "../models/StoryModel";

export const selectPostById = createSelector(
    [
        (state: RootState) => state.userState.posts,
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

export const selectMessagesByChatId = createSelector(
    [
        state => state.messageState,
        (state, chatId) => chatId
    ],
    (messages, chatId) => messages[chatId] || []
)

export const calculateUnreadCount = createSelector(
    [
        state => state.chatState.conversations,
        (state, userId) => userId
    ],
    (conversations, userId) => {
        return conversations.reduce((total: number, conversation: MessageModel) => {
            const unreadCount = conversation.unread[userId] || 0
            return total + unreadCount
        }, 0)
    }
)

export const selectChatByChatId = createSelector(
    [
        state => state.chatState.conversations,
        (state, chatId) => chatId
    ],
    (conversations, chatId) => conversations.filter((con: MessageModel) => con.id === chatId)[0]
)

export const selectConversationPinned = createSelector(
    [
        state => state.chatState.conversations,
    ],
    (conversations) => conversations.filter((con: MessageModel) => con.pinned === true) || []
)

export const selectStoryByUID = createSelector(
    [
        state => state.storyState.stories,
        (state, uid) => uid
    ],
    (stories, uid) => stories.filter((story: StoryModel) => story.userId === uid)
)