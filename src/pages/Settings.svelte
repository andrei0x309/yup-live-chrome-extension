
<script lang="ts">
import '@/popup/scss/settings.scss';
import { wipeStorage, setSettings } from "@/utils/storage";
import { mainStore } from '@/utils/store'
import { navigate } from "@/utils/router";
import { storageDefault } from '@/utils/storage'
import { onMount } from "svelte";
import PageLoader from "@/components/PageLoader.svelte";
import { clearBadge, reloadExtension } from '@/utils/chrome-misc';

let settings: typeof $mainStore['settings']  = null;
let settingLoading = false;

const logout = () => {
  wipeStorage().then(async () => {
    await Promise.all([mainStore.set(storageDefault),
    clearBadge(),
    navigate("/login")]);
    reloadExtension()
  });
};

const setSettingsLocal = async (setting: string, value = '') => {
    settingLoading = true;
    if(value) $mainStore.settings[setting] = value;
    else {
        $mainStore.settings[setting] = !$mainStore.settings[setting];
    }
    settings = $mainStore.settings;
    await setSettings($mainStore.settings);
    settingLoading = false;
};

onMount(async () => {
    settings = $mainStore.settings
    console.log(settings)
});

</script>


{#if settings}
<button on:click={() => logout() } class="logout" >
    <svg  class="w-5" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id=""/><g id=""><g>
            <path fill="#fff" d="M20.9,11.6c-0.1-0.1-0.1-0.2-0.2-0.3l-3-3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1.3,1.3H13c-0.6,0-1,0.4-1,1s0.4,1,1,1h4.6    l-1.3,1.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3-3c0.1-0.1,0.2-0.2,0.2-0.3C21,12.1,21,11.9,20.9,11.6z    "/>
            <path fill="#fff" d="M15.5,18.1C14.4,18.7,13.2,19,12,19c-3.9,0-7-3.1-7-7s3.1-7,7-7c1.2,0,2.4,0.3,3.5,0.9c0.5,0.3,1.1,0.1,1.4-0.4    c0.3-0.5,0.1-1.1-0.4-1.4C15.1,3.4,13.6,3,12,3c-5,0-9,4-9,9s4,9,9,9c1.6,0,3.1-0.4,4.5-1.2c0.5-0.3,0.6-0.9,0.4-1.4    C16.6,18,16,17.8,15.5,18.1z"/>
        </g></g>
    </svg> Logout
</button>

<section class="switches-settings flex flex-col w-full justify-center" data-theme="blue">
    <h2 class="text-1xl font-bold">Settings</h2>
    <div class="flex flex-col">
    <div class="switch switch--4 text-[0.8rem] flex flex-col mb-4">
    <span class="inline-block">Enable Notifications</span>
      <label aria-hidden class="switch__label mt-2">
        <input type="checkbox" class="switch__input"
        on:click={() => setSettingsLocal('notificationsEnabled')}
        checked={settings.notificationsEnabled}
        >
        <span class="switch__design"></span>
      </label>
    </div>

    <div class="switch switch--4 text-[0.8rem] flex flex-col mb-4">
        <span class="inline-block switch-txt">Light Theme</span>
          <label class="switch__label mt-2">
            <input type="checkbox" class="switch__input"
            on:click={() => setSettingsLocal('theme', settings.theme === 'light' ? 'dark' : 'light' )}
            checked={settings.theme === 'light'}
            >
            <span class="switch__design"></span>
          </label>
        </div>

        <div class="switch switch--4 text-[0.8rem] flex flex-col mb-4">
            <span class="inline-block switch-txt">Inject overlay for all websites</span>
              <label class="switch__label mt-2">
                <input type="checkbox" class="switch__input"
                on:click={() => setSettingsLocal('injectEmbed')}
                checked={settings.injectEmbed}
                >
                <span class="switch__design"></span>
              </label>
        </div>

        <div class="switch switch--4 text-[0.8rem] flex flex-col mb-4">
            <span class="inline-block">Browser notification at reward</span>
              <label aria-hidden class="switch__label mt-2">
                <input type="checkbox" class="switch__input"
                on:click={() => setSettingsLocal('chromeNotifWhenReward')} 
                checked={settings.chromeNotifWhenReward}
                >
                <span class="switch__design"></span>
              </label>
         </div>

         <div class="switch switch--4 text-[0.8rem] flex flex-col mb-4">
            <span class="inline-block">Auto-refill Actions if online</span>
              <label class="switch__label mt-2">
                <input on:click={() => setSettingsLocal('chromeNotifWhenAbleToVote')} type="checkbox" class="switch__input"
                checked={settings.chromeNotifWhenAbleToVote}
                >
                <span class="switch__design"></span>
              </label>
         </div>

    </div>
  </section>
{:else}
<PageLoader />
{/if}

<style lang="scss">

.switch-txt{
    top: -0.4rem;
}

.logout {
    background: none;
    border: 1px solid #160e0e;
    box-shadow: inset 1px 1px 16px 3px #004985d1;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: #f0f8ff;
    text-transform: uppercase;
    padding: 0.4rem 1rem;
    margin: auto;
    margin-top: 1rem;
    border-radius: 0.3rem;
}
.logout:hover {
   transform: scale(1.1);
}

.logout:active {
    transform: scale(0.9);
}

</style>