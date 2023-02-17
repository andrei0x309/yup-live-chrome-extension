import { SEND_AUTH_NOTIF } from '@/constants/messeges';
import { initStorage } from '@/utils/storage'
import { getStore, setProfile, setNotifStorageNotifs, setSettings, getNotifStorage, setNotifStorageLastRewardNotif } from '@/utils/storage'
import type { Notification } from '@/utils/types';
import { API_BASE } from '@/constants/config';
import { getNotifications } from '@/utils/notifications';
import { setBadge } from '@/utils/chrome-misc'
import { closeTo, getTimeRemaining } from '@/utils/time';
import { getActionUsage } from '@/utils/user';
// Disable conflict with yup extension
const yupExtensionId = 'nhmeoaahigiljjdkoagafdccikgojjoi'

console.info('Service worker started')

const alarmHandler = async () => {
    const store = await getStore()
    const requests = {} as Record<string, Promise<Response | Notification[]>>
    if (store?.user?.auth?.authToken) {
        requests.profile = fetch(`${API_BASE}/web3-profiles/` + store.user.auth.address)
        if (store?.settings.notificationsEnabled) {
            requests.notifications = getNotifications({
                type: 'all',
                limit: '15',
                skip: '0',
                userId: store.user.auth.userId
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

                if (store.settings?.chromeNotifWhenReward && notSeen.some(notif => notif.action === 'reward')) {
                    const rewardNotif = notSeen.find(notif => notif.action === 'reward')
                    if (rewardNotif) {
                        const storeReward = (await getNotifStorage()).lastRewardNotif
                        if (!storeReward || (storeReward.id !== rewardNotif._id &&
                            !closeTo(new Date(storeReward.createdAt), new Date(rewardNotif.createdAt), 2e4))) {
                            {
                                setNotifStorageLastRewardNotif({ createdAt: rewardNotif.createdAt, id: rewardNotif._id }).then(() => {
                                    chrome.notifications.create({
                                        type: 'basic',
                                        iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                                        title: 'Yup Live Extension',
                                        message: `You have been alocated a future reward of ${rewardNotif.quantity} YUP`,
                                    })
                                }).catch(console.error)
                            }
                        }
                    }
                }

                if (store.settings?.chromeNotifWhenAbleToVote) {
                    await getActionUsage(store?.user?.auth?.userId)
                }
                
            } catch (error) {
                console.error('Error fetching notifications', error)
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

chrome.runtime.onInstalled.addListener(() => {
    initStorage()
    chrome.management.setEnabled(yupExtensionId, false)
});

chrome.runtime.onStartup.addListener(() => {
    initStorage()
    chrome.management.setEnabled(yupExtensionId, false)
})


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        if (request.type === SEND_AUTH_NOTIF) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: chrome.runtime.getURL('src/assets/icons/yup_ext_128.png'),
                title: 'Yup Live Extension',
                message: 'You have been logged in.',
            })
        }
    } catch (error) {
        console.error('Error in message listener', error)
        sendResponse({ error })
    }

    return true
})
