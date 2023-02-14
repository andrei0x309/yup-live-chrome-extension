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
        coinGeckoPrice: 0,
        hasNewNotifications: false,
        refilNotifTimestamp: 0,
    }
}

export const storageNotifsDefault =  {
    lastRewardNotif: {
        createdAt: 0,
        id: '',
    },
    notifs: []
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
    const updateNotifs = { ...storageNotifsDefault, ...notifs }
    const updateNotifsCondition = !notifs.notifs || !notifs.lastRewardNotif
    if(updateNotifsCondition) {
        await chrome.storage.local.set({ notifs: updateNotifs })
        console.info('Notifs storage initialized')
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

export const setNotifStorageLastRewardNotif = async (lastRewardNotif) => {
    const notifsStorage = await getNotifStorage()
    await chrome.storage.local.set({ ...notifsStorage, ...{ notifs: { lastRewardNotif } } })
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

