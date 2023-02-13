import type { Vote } from './types'
import { fetchWAuth } from './auth'

const API_BASE = 'https://api.yup.io'

export const getPost = async (url: string): Promise<any | null> => {
    try {
        const res = await fetch('https://api.yup.io/posts/post/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url
            })
        })
        if(res.ok) {
           return (await res.json())?.[0] ?? null
        }
        } catch {
           return null
        }
    }

export const hasVote = (postId: string, account: string): Promise<Vote[]> => {
    return new Promise((resolve) => {
      fetch(`${API_BASE}/votes/post/${postId}/voter/${account}`).then((res) => {
        if (res.ok) {
          res.json().then((json) => {
            resolve(json)
          })
        } else {
          resolve([] as Vote[])
        }
      })
    })
  }

export const executeVote = async ({
    userVote,
    post,
    url,
    $mainStore,
    $alertStore,
    noVoteAlert = false
  }) => {
    const body = {} as Record<string, unknown>
    let voteid = ''
    if (userVote?._id) {
      voteid = userVote._id.voteid
    } else if(post) {
      body.postid = post._id.postid
    } else {
      body.url = url
    }
    body.rating = userVote.rating
    body.voter = $mainStore.user.auth.userId
    console.log(body.voter)
    if (userVote.like) {
      body.like = true
    } else {
      body.like = false
    }
    const req = await fetchWAuth($mainStore, `${API_BASE}/votes${voteid ? '/' + voteid : ''}`, {
      method: 'POST',
      body: JSON.stringify(body)
    })
    if (req.ok) {
      noVoteAlert || $alertStore?.show('Rating submited!')
      return await req.json()
    } else {
      const err = await req.text()
      if (err.includes('limit')) {
          $alertStore?.show('Rating limit consumed!!!', 'warning')
      } else if(err.includes('requests')) {
          $alertStore?.show('You have made too many request try aagin after 24h', 'warning')
      } else if(err.toLocaleLowerCase().includes('unauthorized')) {
          $alertStore?.show('Seem your auth token is not valid anymore re-login!!', 'error')
      } else {
          $alertStore?.show('Vote not submited due to error try to re-login!', 'error')
      }
      return null
    }
  }