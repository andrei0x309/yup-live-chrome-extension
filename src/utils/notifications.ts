import {API_BASE} from '@/constants/config'
import type { StorageType } from '@/utils/storage'
import { fetchWAuth } from '@/utils/auth'
import { wait } from '@/utils/time'

export const notificationTypes = ['vote', 'reward', 'all-followers', 'follow', 'unfollow']

export const getNotifications = async (
    { type, limit, skip, userId } = { type: null, limit: '10', skip: '0' } as { userId: string, type: null | string[]; limit?: string; skip?: string }
) => {
    let req
    let queryType = ''
    if (type) {
        queryType = `&inType=${type.join(',')}`
    }
    if (!limit) {
        limit = '10'
    }

    if (!skip) {
        skip = '0'
    }

    req = await fetch(`${API_BASE}/notifications/${userId}?skip=${skip}&limit=${limit}${queryType}`, {
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
            req = await fetchWAuth(store, `${API_BASE}/notifications/${store.user.auth.userId}`)
        } catch {
            failed = true
            await console.log(
                `[ Account: ${store.user.auth.userId} ] Failed fetch on 'notifications' (probably 💩 network) Recursive retry in 2.5s`
            )
            retry++
            if (retry > 3) {
                await console.log(`[ Account: ${store.user.auth.userId} ] Failed fetch on 'notifications' (probably 💩 network)`)
                return
            }
            await wait(2500)
        }
    } while (failed)
    
    retry = 0

    if (req.ok) {
        const notif = await req.json()

        for (const n of notif) {
            if (!n.seen) {
                const data = {
                    id: n['_id']
                }
                failed = true
                do {
                    try {
                        failed = false
                        await fetchWAuth(store, `${API_BASE}/notifications/seen`, {
                            method: 'POST',
                            body: JSON.stringify(data)
                        })
                    } catch {
                        failed = true
                        await console.log(
                            `[ Account: ${store.user.auth.userId} ] Failed to mark notification ${data.id} as seen (probably 💩 network) retry in 2.5 seconds.`
                        )
                        retry++
                        if (retry > 3) {
                            await console.log(`[ Account: ${store.user.auth.userId} ] Failed fetch on 'notifications seen set' (probably 💩 network)`)
                            return
                        }
                        await wait(2500)
                    }
                } while (failed)
            }
        }
    }
}