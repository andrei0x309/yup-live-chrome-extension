export const copy = async (text: string) => {
    return await navigator.clipboard.writeText(text)
}

export const chromeUrl = (url: string) => {
    return chrome.runtime.getURL(url)
}


export const extrenalNavigate = (url) => {
    chrome.tabs.create({url})
}

export const setBadge = async (text: string, color = '#222') => {
    chrome?.action?.setBadgeBackgroundColor({color})
    chrome?.action?.setBadgeText({text})
}

export const clearBadge = async () => {
    chrome?.action?.setBadgeBackgroundColor({color: '#00000000'})
    chrome?.action?.setBadgeText({text: ''})
}

export const getCurrentTab = () => {
    return chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    })
}

export const getExtensionVersion = () => {
    return chrome.runtime.getManifest().version
}

export const reloadExtension = () => {
    chrome.runtime.reload()
}

export const sendSWMessage = (message: {type: string, [key: string]: any}) => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            resolve(response)
        })
    })
}