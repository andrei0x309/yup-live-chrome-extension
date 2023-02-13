<script lang="ts">
    import { timeSince } from '@/utils/time';
    import ImgLoader from './ImgLoader.svelte';
    import type { Notification } from '@/utils/types';
    import { mainStore } from '@/utils/store';
    import { chromeUrl } from '@/utils/chrome-misc';
    import { extrenalNavigate } from "@/utils/chrome-misc";

    let loader

    export let notif: Notification
</script>

{#if notif.action === 'vote'}
{@const url = notif.post.url }
{@const length = url.length}
{@const shortUrl = url.slice(0, 10) + '...' + url.slice(length - 10, length) }
{@const finalUrl = length > 24 ? shortUrl : url }
    <div class="flex flex-row notifBody">
        <ImgLoader bind:this={loader} source="{notif.image} ">
            <img class="notificationImage" on:load="{() => loader.onLoad()}" on:error={() => loader.onError()}  style="{ $mainStore.settings.theme === 'light'? 'filter: invert(0.9);' : '' }" slot="img" src="{notif.image}" alt="preview">
            <svg class="notificationImage" style="{ $mainStore.settings.theme === 'light'? 'filter: invert(0.9);' : '' }" slot="error" viewBox="0 0 512 512"><g><polygon points="40,38.999 40,468.998 215,293.998 270,348.998 360,258.998 470,358.998 470,38.999 " style="fill:#EFF3F6;"/>
                <g><circle cx="150" cy="158.999" r="40" style="fill:#FCD884;"/></g><g><polygon points="470,358.998 470,468.998 385,468.998 385,463.998 270,348.998 360,258.998    " style="fill:#70993F;"/></g><g><polygon points="385,463.998 385,468.998 40,468.998 215,293.998 270,348.998" style="fill:#80AF52;"/></g></g><g/></svg>
        </ImgLoader>
        <div class="ml-4 text-left" style="width: 97%">
             <p class="text-xs text-gray-200 my-0 mt-1">
                {#if notif.like}
                <svg class="w-4 like-dsilike" viewBox="0 0 24 24">
                    <path fill="#fff" d="M12,3.172L5.586,9.586c-0.781,0.781-0.781,2.047,0,2.828s2.047,0.781,2.828,0L10,10.828v7.242c0,1.104,0.895,2,2,2  c1.104,0,2-0.896,2-2v-7.242l1.586,1.586C15.977,12.805,16.488,13,17,13s1.023-0.195,1.414-0.586c0.781-0.781,0.781-2.047,0-2.828  L12,3.172z"/>
                </svg>
                {:else}
                <svg class="w-4 down like-dsilike" viewBox="0 0 24 24">
                    <path fill="#fff" d="M12,3.172L5.586,9.586c-0.781,0.781-0.781,2.047,0,2.828s2.047,0.781,2.828,0L10,10.828v7.242c0,1.104,0.895,2,2,2  c1.104,0,2-0.896,2-2v-7.242l1.586,1.586C15.977,12.805,16.488,13,17,13s1.023-0.195,1.414-0.586c0.781-0.781,0.781-2.047,0-2.828  L12,3.172z"/>
                </svg>
                {/if}
                by {notif.voter.length > 12 ? notif.voter.slice(0, 12) + '...' : notif.voter}
                </p>
                <p class="text-xs text-gray-200  my-0 mt-1">
                 <span on:click={() => extrenalNavigate(`https://yup-live.pages.dev/post/${notif.postid}`)}
                    aria-hidden
                    class="text-blue-200 interactive-svg">{finalUrl}</span>
                </p>
                <p class="text-xs text-gray-200 my-0 my-1 text-right mr-2">
                    <svg class="w-3 inline" viewBox="0 0 20 20"  ><path fill="#fff" d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"/></svg>
                    {timeSince(new Date(notif.createdAt))}</p>
            </div>
        </div>
        {:else if notif.action === 'reward'}
        <div class="flex flex-row notifBody">
            <img class="notificationImage" src="{chromeUrl('src/assets/res/reward_optimized.png')}" alt="reward">
            <div class="ml-4 text-left"  style="width: 97%">
                   <p class="text-xs text-gray-200  my-0 mt-1">You were alocated a future reward of {notif?.quantity ?? 'unknown'} amount of YUP.
                    </p>
                    <p class="text-xs text-gray-500  my-0 my-1 text-right mr-2">
                        <svg class="w-3 inline" viewBox="0 0 20 20"  ><path fill="#fff" d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"/></svg>
                        {timeSince(new Date(notif.createdAt))}</p>
            </div>
        </div>
        {:else }
        <div class="flex flex-row items-center notifBody">
            <div class="ml-4 text-left" style="width: 97%">
                <p class="text-xs text-gray-200  my-0 mt-1">{notif?.message ?? 'unknown notification type'}</p>
                <p class="text-xs text-gray-500  my-0 my-1 text-right mr-2">
                        <svg viewBox="0 0 20 20"  ><path fill="#fff" d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"/></svg>
                        {timeSince(new Date(notif.createdAt))}</p>
            </div>
        </div>
        {/if}

    

<style class="scss">
    .notificationImage {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        border-radius: 6px;
        margin-left: 0.5rem;
        margin-top: 0.5rem;
    }

    .notifBody {
        background: #00000061;
        border: 1px solid rgba(0, 0, 0, 0.938);
    }

    .like-dsilike {
        position: relative;
        top: 0.2rem;
    }

</style>