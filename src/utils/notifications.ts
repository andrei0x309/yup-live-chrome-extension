import {API_BASE} from '@/constants/config'
import type { StorageType } from '@/utils/storage'
import { fetchWAuth } from '@/utils/auth'
import { wait } from '@/utils/time'

export const notificationTypes = ['reward', 'vote', 'follow', 'repost', 'comment', 'mention']

export const getNotifications = async (
    { type, limit, skip, address } = { type: null, limit: '10', skip: '0' } as { address: string, type: null | string[]; limit?: string; skip?: string }
) => {
    let req
    let queryType = ''
    if (type) {
        queryType = `&eventTypes=${type.join(',')}`
    }
    if (!limit) {
        limit = '10'
    }

    if (!skip) {
        skip = '0'
    }

    req = await fetch(`${API_BASE}/web3-notifications/${address}?skip=${skip}&limit=${limit}${queryType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })

    if (!req.ok) {
        return false
    }
    const data = await req.json()
    return data
}


export const clearNotifications = async (store: StorageType) => {
    let req
    let failed = true
    let retry = 0
    do {
        try {
            failed = false
            req = await fetchWAuth(store, `${API_BASE}/web3-notifications/seen/all`, {
                method: 'POST',
            })
        } catch {
            failed = true
            retry++
            if (retry > 3) {
                return
            }
            await wait(1500)
        }
    } while (failed)

    if (!req) {
        return
    }
    if (!req.ok) {
        return
    }
    return await req.json()
}
