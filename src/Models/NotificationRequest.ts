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
    id01?: string,
    id02?: string,
    imageUrl?: string,
}