
export interface MessageItemModel {
    _id: string,
    text: string,
    createdAt: any,
    user: {
        _id: string,
        avatar: string
    }
}