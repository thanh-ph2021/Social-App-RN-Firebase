export interface NotificationRequest {
    notifyTokens?: string[],
    title: string
    body: string,
    data: NotificationDataRequest
}

interface NotificationDataRequest {
    // userID
    id: string,
    type: string,
}