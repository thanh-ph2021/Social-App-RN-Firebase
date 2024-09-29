import { DocumentItem } from "./DocumentItem"

export interface MessageItemModel {
    _id: string,
    text: string,
    createdAt: any,
    user: {
        _id: string,
        avatar: string
    }
    image?: string
    video?: string
    audio?: string
    sent?: boolean
    received?: boolean
    pending?: boolean,
    document?: DocumentItem 
}