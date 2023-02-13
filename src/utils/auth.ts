

export const fetchWAuth = async (store, endpoint: string, options?: any) => {
    if (!options) options = {}
    if (!options.headers) options.headers = {}
    if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'
    if (!options.headers['Authorization']) options.headers['Authorization'] = 'Bearer ' + store.user.auth.authToken
    return fetch(endpoint, options)
}
