import { SEND_AUTH_NOTIF } from '@/constants/messeges'
 
export const storageDefault = {
    user: { 
        auth: {
            ethSignature: '',
            userId: '',
            address: '',
            authToken: '',
            username: '',
        },
        profile: {
            _id: '',
            handle: '',
            yupScore: 0,
            avatar: '',
            yup: {
                _id: '',
                handle: '',
                bio: '',
                avatar: '',
                weight: 0,
                balance: 0,
            },
            lens: {
                avatar: '',
                profileId: '',
                handle: '',
            },
            farcaster: {
                fid: '',
                handle: '',
                avatar: '',
            },
            ens: {
                handle: '',
            },
        }

    },
    settings: {
        theme: 'dark',
        notificationsEnabled: false,
        injectEmbed: false,
        chromeNotifWhenReward: false,
        chromeNotifWhenAbleToVote: false,
        lastCoinGeckoPriceCheckTimestamp: 0,
        coinGeckoPrice: 0,
        hasNewNotifications: false,
        refilNotifTimestamp: 0,
        enableRightClick: false,
        enableRightClickNotif: false,
        lastLoginNotif: 0,
        enableCommentNotif: false,
        enableMentionNotif: false,
        enableFollowNotif: false,
        lastfollowNotif: 0,
        lastCommentNotif: 0,
        lastMentionNotif: 0
    }
}

export const storageNotifsDefault =  {
    notifs: []
}

export const lastRewardNotifDefault = {
        createdAt: 0,
        id: '',
    }

export type StorageType = typeof storageDefault

export const wipeStorage = async () => {
    await chrome.storage.local.clear()
}

export const initStorage = async () => {
    const store = await chrome.storage.local.get('store')
    const updateStore = { store: { ...storageDefault, ...store.store } }
    const updateCondition = !store.store || !store.store.user || !store.store.user.auth || 
    store.store.user.auth.authToken || !store.store.settings || !store.store.settings.coinGeckoPrice
    || !store.store.user.profile || !store.store.user.profile._id
    if(updateCondition) {
        await chrome.storage.local.set(updateStore)
        console.info('Storage initialized')
    }
    const notifs = await chrome.storage.local.get('notifs')
    const lastRewardNotif = await chrome.storage.local.get('lastRewardNotif')
    if(!notifs.notifs) {
        await chrome.storage.local.set({ notifs: storageNotifsDefault  })
        console.info('Notifs storage initialized')
    }
    if(!lastRewardNotif.lastRewardNotif) {
        await chrome.storage.local.set({ lastRewardNotif: lastRewardNotifDefault })
        console.info('Last reward notif storage initialized')
    }
}

export const getNotifStorage = async () => {
    const notifs = await chrome.storage.local.get('notifs')
    return notifs ? notifs as typeof storageNotifsDefault : storageNotifsDefault as typeof storageNotifsDefault
}

export const setNotifStorageNotifs = async (notifs: any[]) => {
    const notifsStorage = await getNotifStorage()
    await chrome.storage.local.set({ ...notifsStorage, notifs: notifs })
}

export const getNotifStorageLastRewardNotif = async () => {
    const notifsStorage = await chrome.storage.local.get('lastRewardNotif')
    return notifsStorage ? notifsStorage.lastRewardNotif : lastRewardNotifDefault
}

export const setNotifStorageLastRewardNotif = async (lastRewardNotif) => {
    const lastReward = await getNotifStorageLastRewardNotif()
    chrome.storage.local.set({ lastRewardNotif: { ...lastReward, ...lastRewardNotif } })
}

export const setAuth = async (auth) => {
     const storeAuth = await chrome.storage.local.get('store')
        let profile
        try {
        const res = await fetch('https://api.yup.io/web3-profiles/' + auth.address)
        profile = await res.json()
        } catch (error) {
            console.error('Error fetching profile', error)
        }
        const updateObj = { store: { ...storeAuth.store, user: { auth: { ...auth }, }   } }
        if(profile){
            updateObj.store.user.profile = profile
        }
        await chrome.storage.local.set(updateObj)
        chrome.runtime.sendMessage({ type: SEND_AUTH_NOTIF })
}

export const setProfile = async (profile) => {
    const store = await chrome.storage.local.get('store')
    await chrome.storage.local.set({ store: { ...store.store, user: { ...store.store.user, profile } } })
}

export const setSettings = async (settings) => {
    const store = await chrome.storage.local.get('store')
    await chrome.storage.local.set({ store: { ...store.store, settings: { ...store.store.settings, ...settings } } })
}

export const getStore = async () => {
    const store = await chrome.storage.local.get('store')
    return store ? store.store as StorageType : storageDefault as StorageType
}

export const getSettings = async () => {
    const store = await chrome.storage.local.get('store')
    return store ? store.store.settings as StorageType['settings'] : storageDefault.settings as StorageType['settings']
}

export const getSetting = async (setting: keyof StorageType['settings']) => {
    const settings = await getSettings()
    return settings[setting]
}

export const setSetting = async <K extends keyof StorageType['settings']>(setting: K, value: StorageType['settings'][K]) => {
    const settings = await getSettings()
    settings[setting] = value
    await setSettings(settings)
}

