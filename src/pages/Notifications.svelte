<script lang="ts">
import { onMount } from 'svelte';
import { getNotifStorage, setSettings } from '@/utils/storage'
import { mainStore } from '@/utils/store'
import PageLoader from '@/components/PageLoader.svelte';
import { getNotifications } from '@/utils/notifications';
import Notification from '@/components/Notification.svelte';
import { clearNotifications } from '@/utils/notifications';
import { clearBadge } from '@/utils/chrome-misc'

let loading = true;
let noNotifications = false;
let notifs = [];
let pastNotifsPromise
let type = null

onMount(async () => {
    notifs = await getNotifications({
        address: $mainStore.user.auth.address.toLowerCase(),
        type,
        skip: '0',
        limit: '15'
    })
    pastNotifsPromise = getNotifStorage()
    
    loading = false;
    clearNotifications($mainStore).then(
        () => {
            clearBadge()
            $mainStore.settings.hasNewNotifications = false
            setSettings($mainStore.settings)
        }
    )

});

const changeNotifsType = async (t : string[] | null) => {
     if(String(type) === String(t)) return;
    type = t
    loading = true;
    notifs = await getNotifications({
        address: $mainStore.user.auth.address.toLowerCase(),
        type: t,
        skip: '0',
        limit: '15'
    })
    loading = false;
}

</script>

{#if loading}
    <PageLoader />
{:else if (notifs ?? []).length === 0}

    {#await pastNotifsPromise}
        &nbsp;
    {:then pastNotifs}
        {#if (pastNotifs.notifs ?? []).length > 0}
        {#each pastNotifs.notifs as notif}
        <Notification {notif} />
         {/each}
        {:else}
        {(noNotifications = true) && ''}
        {/if}
    {/await}
{:else}
    <div class="text-[0.75rem] py-1">
        <span on:click={() => changeNotifsType(null)} aria-hidden class="inline-block mr-2 interactive-svg text-blue-200 interactive-svg" >All</span>
        <span on:click={() => changeNotifsType(['reward'])} aria-hidden class="text-blue-200 interactive-svg interactive-svg interactive-svg">Rewards</span>
    </div>
    <div class="flex flex-col">
        {#each notifs as notif}
            <Notification {notif} />
        {/each}
    </div>
{/if}

{#key noNotifications}
{#if noNotifications }
<div class="flex flex-col items-center justify-center h-full">
    <p class="text-2xl font-semibold">No Notifications</p>
    <p class="text-lg">You have no notifications</p>
</div>
{/if}
{/key}
