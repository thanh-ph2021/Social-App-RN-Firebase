import { MessageModel } from "../../models"
import { ADD_CHAT, FETCH_CHATS, MARK_CHAT_AS_READ, PIN_CONVERSATION, SEARCH_CHAT, UPDATE_CHAT } from "../constants/chat"
import { ActionType } from "../types"

export interface ChatState {
    conversations: MessageModel[],
    searchConversations: MessageModel[],
}

const initialState: ChatState = {
    conversations: [],
    searchConversations: [],
}

const chat = (state: ChatState = initialState, action: ActionType) => {
    switch (action.type) {
        case FETCH_CHATS:
            return {
                ...state,
                conversations: action.payload.conversations,
            }
        case ADD_CHAT:
            return {
                ...state,
                conversations: [...state.conversations, action.payload]
            }
        case UPDATE_CHAT:
            return {
                ...state,
                conversations: state.conversations.map(con => {
                    if (con.id === action.payload.id) {
                        return {
                            ...con,
                            ...action.payload.conversation
                        }
                    }
                    return con
                }),
            }
        case SEARCH_CHAT:
            return {
                ...state,
                searchConversations: action.payload
            }

        case MARK_CHAT_AS_READ:
            return {
                ...state,
                conversations: state.conversations.map((con: MessageModel) =>
                    con.id === action.payload.chatID
                        ? { ...con, unread: { ...con.unread, [action.payload.userId]: 0 } }
                        : con
                )
            }
        case PIN_CONVERSATION:
            return {
                ...state,
                conversations: state.conversations.map((con: MessageModel) =>
                    con.id === action.payload.chatID
                        ? { ...con, pinned: action.payload.pinned }
                        : con
                )
            }
        default:
            return state
    }
}

export default chat