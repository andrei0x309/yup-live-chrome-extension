import { SEND_AUTH_NOTIF, ENABLE_RIGHT_CLICK, DISABLE_RIGHT_CLICK } from '@/constants/messeges';
import { initStorage } from '@/utils/storage'
import { getStore, setProfile, setNotifStorageNotifs, setSettings,
     setNotifStorageLastRewardNotif, getNotifStorageLastRewardNotif, getSetting, setSetting } from '@/utils/storage'
import type { Notification } from '@/utils/types';
import { API_BASE } from '@/constants/config';
import { getNotifications } from '@/utils/notifications';
import { setBadge, extrenalNavigate } from '@/utils/chrome-misc'
import { closeTo } from '@/utils/time';
import { getActionUsage } from '@/utils/user';
import { executeVote, getVotePayload } from '@/utils/votes';

// Disable conflict with yup extension
const yupExtensionId = 'nhmeoaahigiljjdkoagafdccikgojjoi'

console.info('Service worker started')

let notificationUrl: string

const buttons = {
     buttons: [{
        title: 'Open in App',
    }]
}

const notificationActionListner = async (id: string) => {
    try {
        const url = new URL(notificationUrl ?? 'https://app.yup.io/notifications')
        extrenalNavigate(url.href)
        chrome.notifications.clear(id)
    } catch {
        // ignore
    }
}

if (!chrome.notifications.onButtonClicked.hasListener(notificationActionListner)){
    chrome.notifications.onButtonClicked.addListener(notificationActionListner)
}

const onRightClickLike = async (store, info, tab) => {
        const vote = await executeVote(getVotePayload({
            store,
            url: tab.url,
            type: true
        }))
        if (store?.settings?.enableRightClickNotif) {
            if (vote?._id) {
                await chrome.notifications.create({
                    type: 'basic',
                    iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                    title: 'Yup Live Extension',
                    message: `Your rating has been submitted`,
                })
            } else {
                await chrome.notifications.create({
                    type: 'basic',
                    iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                    title: 'Yup Live Extension',
                    message: `There was an error submitting your rating`,
                })
            }
        }
}

const enableRightClickVote = async () => {
    try {
        await chrome.contextMenus.removeAll();
        await chrome.contextMenus.create({
            id: "yup-like",
            title: "Like this page",
            contexts: ["page", "page_action"],
        });
    } catch (error) {
        // ignore
    }
}

const disableRightClickVote = async () => {
    try {
        await chrome.contextMenus.remove("yup-like");
    } catch (error) {
        // ignore
    }
    if(chrome.runtime.lastError) {
        console.warn('Error creating context menu', chrome.runtime.lastError.message)
    }
}

const alarmHandler = async () => {
    const store = await getStore()
    const requests = {} as Record<string, Promise<Response | Notification[]>>
    if (store?.user?.auth?.authToken) {
        requests.profile = fetch(`${API_BASE}/web3-profiles/` + store.user.auth.address)
        if (store?.settings.notificationsEnabled) {
            requests.notifications = getNotifications({
                type: null,
                limit: '15',
                skip: '0',
                address: store.user.auth.address
            })
        }
        requests.coinGecko = fetch('https://api.coingecko.com/api/v3/simple/price?ids=yup&vs_currencies=usd')

        try {
            const profile = await requests.profile as Response
            const profileJson = await profile.json()
            setProfile(profileJson).catch(console.error)
        } catch (error) {
            console.error('Error fetching profile', error)
        }

        try {
            const coinGecko = await requests.coinGecko as Response
            const coinGeckoJson = await coinGecko.json()
            const coinGeckoPrice = coinGeckoJson.yup.usd
            const store = await getStore()
            if (store.settings.coinGeckoPrice !== coinGeckoPrice) {
                await chrome.storage.local.set({ store: { ...store, settings: { ...store.settings, coinGeckoPrice } } })
            }
        } catch (error) {
            console.error('Error fetching coinGecko', error)
        }

        if (store?.settings.notificationsEnabled) {
            try {
                const notifications = await requests.notifications as Notification[]
                const notSeen = notifications.reverse().filter(notif => !notif.seen)
                const updateSettings = {} as Record<string, boolean>
                if (notSeen.length > 0) {
                    setBadge(String(notSeen.length))
                    setNotifStorageNotifs(notSeen).catch(console.error)
                    updateSettings.hasNewNotifications = true
                } else {
                    setBadge('')
                    updateSettings.hasNewNotifications = false
                }
                setSettings(updateSettings).catch(console.error)

                if (store.settings?.chromeNotifWhenReward && notSeen.some(notif => notif.eventType === 'reward')) {
                    const rewardNotif = notSeen.find(notif => notif.eventType === 'reward')
                    if (rewardNotif) {
                        const storeReward = (await getNotifStorageLastRewardNotif())

                        if (!storeReward || (storeReward.id !== rewardNotif._id
                            && !closeTo(new Date(storeReward.createdAt), new Date(rewardNotif.createdAt), 2e4)
                        )) {
                            {
                                await setNotifStorageLastRewardNotif({ createdAt: rewardNotif.createdAt, id: rewardNotif._id });
                                await chrome.notifications.create({
                                    type: 'basic',
                                    iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                                    title: 'Yup Live Extension',
                                    message: `You have been alocated a future reward of ${rewardNotif?.meta.quantity ?? "unknown"} YUP`,
                                })
                            }
                        }
                    }
                } else if (store.settings?.enableFollowNotif && notSeen.some(notif => notif.eventType === 'follow')) {
                    const followNotif = notSeen.filter(notif => notif.eventType === 'follow').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                    const lastFollowNotif = await getSetting('lastfollowNotif') as number
                    const isNew = !lastFollowNotif || ( !closeTo(new Date(lastFollowNotif), new Date(followNotif.createdAt), 2e4))
                    if (followNotif && isNew) {
                        notificationUrl = followNotif?.senders?.[0]._id ? `${API_BASE}/account/${followNotif?.senders?.[0]._id}`: undefined
                        await chrome.notifications.create({
                            type: 'basic',
                            iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                            title: 'Yup Live Extension',
                            message: `${followNotif.senders[0].handle} has followed you`,
                            ...(buttons)
                        })
                        await setSetting('lastfollowNotif', new Date(followNotif.createdAt).getTime())
                    }
                } else if (store.settings?.enableCommentNotif && notSeen.some(notif => notif.eventType === 'comment')) {
                    const commentNotif = notSeen.filter(notif => notif.eventType === 'comment').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                    const lastCommentNotif = await getSetting('lastCommentNotif') as number
                    const isNew = !lastCommentNotif || ( !closeTo(new Date(lastCommentNotif), new Date(commentNotif.createdAt), 2e4))
                    if (commentNotif && isNew) {
                        notificationUrl = commentNotif?.meta?.postid ? `${API_BASE}/post/${commentNotif?.meta?.postid}`: undefined
                        await chrome.notifications.create({
                            type: 'basic',
                            iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                            title: 'Yup Live Extension',
                            message: `${commentNotif.senders[0].handle} has commented on your post`,
                            ...(buttons)
                        })
                        await setSetting('lastCommentNotif', new Date(commentNotif.createdAt).getTime())
                    }
                } else if (store.settings?.enableMentionNotif && notSeen.some(notif => notif.eventType === 'mention')) {
                    const mentionNotif = notSeen.filter(notif => notif.eventType === 'mention').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                    const lastMentionNotif = await getSetting('lastMentionNotif') as number
                    const isNew = !lastMentionNotif || ( !closeTo(new Date(lastMentionNotif), new Date(mentionNotif.createdAt), 2e4))
                    if (mentionNotif && isNew) {
                        notificationUrl = mentionNotif?.meta?.postid ? `${API_BASE}/post/${mentionNotif?.meta?.postid}`: undefined
                        await chrome.notifications.create({
                            type: 'basic',
                            iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                            title: 'Yup Live Extension',
                            message: `${mentionNotif.senders[0].handle} has mentioned you`,
                            ...(buttons)
                        })
                        await setSetting('lastMentionNotif', new Date(mentionNotif.createdAt).getTime())
                    }
                }
                if (store.settings?.chromeNotifWhenAbleToVote) {
                    await getActionUsage(store?.user?.auth?.userId)
                }

            } catch (error) {
                // console.error('Error fetching notifications', error)
                // ignore
            }
        }

    }
}

chrome.alarms.create(
    'alarm',
    {
        periodInMinutes: 1,
    },
)

chrome.alarms.onAlarm.addListener(alarmHandler)

chrome.runtime.onInstalled.addListener(async () => {
    initStorage()
    chrome.management.setEnabled(yupExtensionId, false)
    const store = await getStore()
    if (store?.user?.auth?.authToken && store?.settings?.enableRightClick) {
            enableRightClickVote()
    }
});

chrome.runtime.onStartup.addListener(async () => {
    initStorage()
    chrome.management.setEnabled(yupExtensionId, false)
    const store = await getStore()
    if (store?.user?.auth?.authToken && store?.settings?.enableRightClick) {
            enableRightClickVote()
    }
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'yup-like') {
        const store = await getStore()
        if (store?.user?.auth?.authToken) {
            onRightClickLike(store, info, tab)
        }
    }
})
            
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        console.log('Message received', request)
        const lastLoginNotifTime = Number(await getSetting('lastLoginNotif'))
        const moreThanOneDay = (new Date().getTime() - lastLoginNotifTime) > 864e5
        if (request.type === SEND_AUTH_NOTIF && moreThanOneDay) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                title: 'Yup Live Extension',
                message: 'You have been logged in.',
            })
            setSetting('lastLoginNotif', new Date().getTime())
            sendResponse({ success: true })
        } else if (request.type === ENABLE_RIGHT_CLICK) {
            await enableRightClickVote()
            sendResponse({ success: true })
        } else if (request.type === DISABLE_RIGHT_CLICK) {
            await disableRightClickVote()
            sendResponse({ success: true })
        }
    } catch (error) {
        console.error('Error in message listener', error)
        sendResponse({ error })
    }
    return true
})
