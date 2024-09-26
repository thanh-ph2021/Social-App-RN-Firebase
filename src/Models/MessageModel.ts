import { MessageItemModel } from "./MessageItemModel";

export interface MessageModel {
    id?: string,
    userID: string,
    lastMessage: string,
    messageTime: any,
    unread: UnreadMessage,
    messages?: MessageItemModel[],
    pinned?: boolean
}

export interface UnreadMessage {
    [uid: string]: number
}