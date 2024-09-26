import { MessageItemModel } from "../../models";
import { FETCH_MESSAGES_REALTIME, SEND_MESSAGE } from "../constants/message";
import { ActionType } from "../types";

export interface MessageState {
    [chatId: string]: MessageItemModel[]
}

const initalState: MessageState = {}

const message = (state: MessageState = initalState, action: ActionType) => {
    switch (action.type) {
        case FETCH_MESSAGES_REALTIME:
            return {...state, [action.payload.chatID]: action.payload.messages}
        case SEND_MESSAGE:
            return {
                ...state, 
                [action.payload.chatID]: [action.payload.message, ...(state[action.payload.chatID] || [])]
            }
        default:
            return state
    }
}

export default message