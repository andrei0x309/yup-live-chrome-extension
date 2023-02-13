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
  

  export interface Notification {
    _id: string
    action: string
    image: string
    invoker: {
      username: string
      eosname: string
    }
    like: boolean
    post: {
      postid: string
      url: string
      title: string
      tag: string
    }
    seen: boolean
    postid: string
    rating: number
    recipient: string
    voter: string
    createdAt: string
    quantity?: string
    message?: string
  }