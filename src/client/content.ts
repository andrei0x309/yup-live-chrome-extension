  
(() =>{
  try { 
      const container = document.documentElement;
      const script = document.createElement('script');
      script.setAttribute('async', "false")
      script.setAttribute('fetchpriority', "high")
      script.src = chrome.runtime.getURL('src/client/inject.js')
      container.prepend(script)
      script.addEventListener('load', () => { container.removeChild(script) } )
  } catch (error) {
    console.error('Yup Live Extension inject failed.', error);
  }
})()

  import { SEND_VOTE, SET_AUTH } from '@/constants/messeges'
  import { setAuth } from '@/utils/storage'

  const allowedEvents = [SEND_VOTE, SET_AUTH]

  window.addEventListener("message", (event) => {
    if (event.source != window)
        return;
        if(allowedEvents.includes(event?.data?.type ?? '')){
          console.log('Yup Live Extension received message:', event.data);
          switch (event.data.type) {
            case SEND_VOTE:
              console.log('SEND_VOTE', event.data.payload)
              break;
            case SET_AUTH:
              console.log('SET_AUTH', event.data.payload)
              setAuth(event.data.payload).catch(console.error)
              break;
            default:
              break;
        }
      }
})

import Overlay from '@/overlay/Overlay.svelte'

import('@/utils/storage').then(({ getStore }) => {
  getStore().then(async (store) => {
    if (store.settings.injectEmbed) {
      setTimeout(() => {
      //@ts-ignore
      new Overlay({ target: document.body });
      }, 200)
    }
  });
});
