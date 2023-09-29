<script lang="ts">
    import RateSingle from '@/components/RateSingle.svelte'
    import { getCurrentTab } from '@/utils/chrome-misc'
    import { onMount } from 'svelte'
    import { mainStore } from '@/utils/store'
    import ImgLoader from './ImgLoader.svelte';
    import { isUrlInvalid } from '@/utils/misc';

    let tab = null
    let url = new URL('http://127.0.0.1')
    let isValid = true
    let loading = true
    let loader: ImgLoader

    onMount(async () => {
        tab = (await getCurrentTab())[0]
        isValid = !isUrlInvalid(tab?.url)
        try {
            if(tab?.url) {
                url = new URL(tab?.url)
            } else {
                isValid = false
            }
        } catch {
            isValid = false
        }
        loading = false
    })

$: {
    if(loader && (!tab?.favIconUrl || !isValid) ) {
        loader.onError()
    }
}

</script>

<div class="{`flex flex-col ${loading ? 'animate-pulse' :''}`}">
    {#if url}
    <div class="flex items-center flex-col text-[0.8rem] leading-4 mb-4">
    <div class="mb relative">
    <ImgLoader source={tab?.favIconUrl ?? ''} bind:this={loader}>
    <img style="{ $mainStore.settings.theme === 'light'? 'filter: invert(0.9);' : '' }" slot="img" 
    on:load={() => loader.onLoad()} 
    on:error={() => loader.onError} 
    class="w-5 h-5 mt-2 rounded-full wicon" src="{tab?.favIconUrl ?? ''}" alt="favicon" />
    <svg class="w-5 h-5 mt-2 rounded-full wicon" style="{ $mainStore.settings.theme === 'light'? 'filter: invert(0.9);' : '' }" slot="error" viewBox="0 0 512 512"><g><polygon points="40,38.999 40,468.998 215,293.998 270,348.998 360,258.998 470,358.998 470,38.999 " style="fill:#EFF3F6;"/>
        <g><circle cx="150" cy="158.999" r="40" style="fill:#FCD884;"/></g><g><polygon points="470,358.998 470,468.998 385,468.998 385,463.998 270,348.998 360,258.998    " style="fill:#70993F;"/></g><g><polygon points="385,463.998 385,468.998 40,468.998 215,293.998 270,348.998" style="fill:#80AF52;"/></g></g><g/></svg>
    </ImgLoader>
    {#if isValid}
    <h1 class="inline-flex text-[1.1rem] font-semibold mb-2">Rate Website</h1>
    {:else}
    <h1 class="inline-flex text-[1.1rem] font-semibold mb-2">Invalid URL</h1>
    {/if}  
    </div>
    {#if url.hostname !== '127.0.0.1'}
    <span>Hostname: {url.hostname.length > 18 ? url.hostname.slice(0,16) + '...': url.hostname }</span>
    <span>URL: {url.href.length > 20 ? '...' + url.href.slice(-20) : url.href}</span>
    {:else}
    <span>Hostname: No Active Tab</span>
    <span>URL: No Active Tab</span>
    {/if}
    </div>
    {/if}

    {#key url.href}
        <RateSingle url={url.href.replace(/\/$/gms, '') ?? ''} disabled={!isValid} />
    {/key}
</div>

<style>
    .wicon {
        position: absolute;
        top: 2px;
        left: -24px;
        background-color: #7878788f;
        padding: 0.13rem;
    }
</style>