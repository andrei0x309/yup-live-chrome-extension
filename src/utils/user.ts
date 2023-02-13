
import {API_BASE} from '@/constants/config'

export const getNormalizedValue = (val: number, min: number, max: number) => {
    return Math.floor(((val - min) / (max - min)) * 100)
  }
  
  export const getMaxVote = (balance: number) => {
    return balance >= 100 ? 250 : balance >= 0.5 ? 190 : 130
  }
  
  export const makePercentage = (val: number) => {
    return `${val}%`
  }
  
  export const MAX_DELETE_VOTE = 600
  export const MAX_FOLLOW_USAGE = 60

export const getActionUsage = async (userId: string) => {
    try {
      const req = await fetch(`${API_BASE}/accounts/actionusage/${userId}`)
      if (req.ok) {
        return { error: false, data: await req.json() }
      }
      return { error: true, msg: "API didn't return expected response." }
    } catch {
      return { error: true, msg: 'API is not available' }
    }
  }
  
  export const createActionUsage = async (userId: string, balance: number) => {
    const data = await getActionUsage(userId)
    if (data.error) return { error: true, msg: 'API returned error' }
    const MAX_VOTE = getMaxVote(balance)
    return {
      nextReset: new Date(data.data.lastReset + 864e5).toLocaleString(),
      actionBars: {
        deleteVote: makePercentage(getNormalizedValue(MAX_DELETE_VOTE - data.data.deleteVoteCount, 0, MAX_DELETE_VOTE)),
        follow: makePercentage(getNormalizedValue(MAX_FOLLOW_USAGE - data.data.followCount, 0, MAX_FOLLOW_USAGE)),
        vote: makePercentage(getNormalizedValue(MAX_VOTE - data.data.createVoteCount, 0, MAX_VOTE))
      }
    }
  }