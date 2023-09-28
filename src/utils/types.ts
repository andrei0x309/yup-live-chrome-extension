export interface Vote {
    influence: number
    like: boolean
    postid: string
    rating: number
    lastUpdated: string
    timestamp: string
    voter: string
    _id: {
      voteid: string
    }
  }
  

  export interface Notification  {
    _id: string
    eventType: string
    count: number
    senderYupScore: number
    platform: string
    meta: {
        like?: boolean
        quantity?: number
        postid?: string
        url?: string
        message?: string
    }
    image: string
    createdAt: string
    senders: {
        _id: string
        handle: string
        avatar: string
    }[]
    message?: string
    seen: boolean
}
