

const routes = {
    '/':  {
        component: () => import('@/pages/Main.svelte'),
        title: 'Main'
    },
    '/login': {
        component: () => import('@/pages/Login.svelte'),
        title: 'Login'
    },
    '/usage' : {
        component: () => import('@/pages/Usage.svelte'),
        title: 'Usage'
    },
    '/settings' : {
        component: () => import('@/pages/Settings.svelte'),
        title: 'Settings'
    },
    '/notifications' : {
        component: () => import('@/pages/Notifications.svelte'),
        title: 'Notifications'
    },
    '/info': {
        component: () => import('@/pages/Info.svelte'),
        title: 'Info'
    }
}

let lastMountedRoute = null

export const getCurentRouteComponent = () => {
    const path = window.location.pathname
    return routes[path]
}

export const getCurrentRoutePath = () => {
    return window.location.pathname
}

export const navigate = (path: string, props: {} = {}) => {
    new Promise<void>((resolve) => {
    window.history.pushState({}, '', path)
    const { component, title } = getCurentRouteComponent()
    component().then(({ default: Component }) => {
        console.log({ target: document.getElementById('router'), props })
        if (lastMountedRoute) lastMountedRoute.$destroy()
        lastMountedRoute = new Component({ target: document.getElementById('router'), props })
        document.title = title
        resolve()
     })
    })
}
