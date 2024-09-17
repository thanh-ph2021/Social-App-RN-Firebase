export interface NotificationModel {
    id?: string,
    receiverId: string,
    senderId: string,
    // 'comment' | 'follow' | TypeEmotion
    type: string,
    postId: string,
    message: string,
    isRead: boolean,
    createdAt: any
}