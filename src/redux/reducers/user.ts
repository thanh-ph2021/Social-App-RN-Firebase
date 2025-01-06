import { ActionType } from "../types"
import { ADD_COMMENT_POST, ADD_POST, DELETE_COMMENT_POST, FETCH_POSTS_REQUEST, LIKE_POST_STATE_CHANGE, LOAD_COMMENTS_POST, LOAD_NEXT_POSTS, LOAD_USERS, SELECT_POST, UPDATE_COMMENT_POST, UPDATE_CURRENT_USER_DATA, UPDATE_POST, UPDATE_USER_DATA, USER_CHATS_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from "../constants"
import { MessageModel, PostModel, UserModel } from "../../models"

export interface UserState {
    currentUser: UserModel | null,
    posts: PostModel[],
    chats: MessageModel[],
    following: any[]
    users: UserModel[],
    selectedPost: PostModel | null,
    loading: boolean
}

const initialState: UserState = {
    currentUser: null,
    posts: [],
    chats: [],
    following: [],
    users: [],
    selectedPost: null,
    loading: true,
}

export const user = (state: UserState = initialState, action: ActionType) => {
    const oldPosts = [...state.posts]
    const oldUsers = [...state.users]

    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.payload
            }
        case FETCH_POSTS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                loading: false,
                posts: action.payload
            }
        case UPDATE_POST:
            return {
                ...state,
                posts: oldPosts.map(post => {
                    if (post.id === action.payload.id) {
                        return action.payload
                    }

                    return post
                })
            }
        case LIKE_POST_STATE_CHANGE:
            let newPosts = oldPosts.map(post => {
                if (post.id === action.payload.id) {
                    return {
                        ...post,
                        likes: action.payload.likes
                    }
                }
                return post
            })

            return {
                ...state,
                posts: newPosts
            }

        case LOAD_COMMENTS_POST:
            newPosts = oldPosts.map(post => {
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        comments: [...action.payload.comments]
                    }
                }
                return post
            })
            return {
                ...state,
                posts: newPosts
            }

        case ADD_COMMENT_POST:
            newPosts = oldPosts.map(post => {
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        commentCount: post.commentCount + 1,
                        comments: [...post.comments, action.payload.commentData]
                    }
                }
                return post
            })
            return {
                ...state,
                posts: newPosts
            }

        case UPDATE_COMMENT_POST:
            newPosts = oldPosts.map(post => {
                if (post.id === action.payload.postId) {
                    const oldComments = [...post.comments]
                    let newComments = oldComments.map(comment => {
                        if (comment.id === action.payload.commentData.id) {
                            return { ...action.payload.commentData }
                        }

                        return comment
                    })
                    return {
                        ...post,
                        comments: [...newComments]
                    }
                }
                return post
            })
            return {
                ...state,
                posts: newPosts
            }

        case DELETE_COMMENT_POST:
            newPosts = oldPosts.map(post => {
                if (post.id === action.payload.postId) {
                    const oldComments = [...post.comments]
                    let newComments = oldComments.filter(comment => comment.id !== action.payload.commentId)
                    return {
                        ...post,
                        comments: [...newComments],
                        commentCount: post.commentCount - 1
                    }
                }
                return post
            })
            return {
                ...state,
                posts: newPosts
            }

        case USER_CHATS_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.payload
            }

        case UPDATE_CURRENT_USER_DATA:
            return {
                ...state,
                currentUser: action.payload
            }

        case LOAD_USERS:
            return {
                ...state,
                users: action.payload
            }
        case UPDATE_USER_DATA:
            let newUsers = oldUsers.map(user => {
                if (user.uid === action.payload.uid) {
                    return action.payload
                }
                return user
            })
            return {
                ...state,
                users: newUsers
            }

        case ADD_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            }

        case SELECT_POST:
            return {
                ...state,
                selectedPost: action.payload
            }

        case LOAD_NEXT_POSTS:
            return {
                ...state,
                posts: [...state.posts, ...action.payload]
            }

        default:
            return { ...state }
    }
}