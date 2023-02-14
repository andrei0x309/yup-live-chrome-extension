<script lang="ts">
  import { extrenalNavigate } from "@/utils/chrome-misc";
  import ImgLoader from "@/components/ImgLoader.svelte";
  import { onMount } from "svelte";
  import { APP_BASE } from "@/constants/config";
  import RateWebsite from "@/components/RateWebsite.svelte";
  import { mainStore } from "@/utils/store";
  import { formatNumber, truncteEVMAddr } from "@/utils/misc";
  import { alertStore } from "@/utils/store";
  import { copy } from "@/utils/chrome-misc";

  let avatar: string = "";
  let loader: ImgLoader;
  let handle = $mainStore?.user?.profile?.handle;

  const copyAddress = () => {
    copy($mainStore?.user?.auth?.address);
    $alertStore?.show("Copied to clipboard", "success");
  };

  onMount(async () => {
    console.log($mainStore);
    if ($mainStore?.user?.profile?.yup?.avatar && !$mainStore?.user?.profile?.yup?.avatar.endsWith(".mp4")) {
      avatar = $mainStore?.user?.profile?.yup?.avatar;
    } else if ($mainStore?.user?.profile?.lens?.avatar && !$mainStore?.user?.profile?.lens?.avatar.endsWith(".mp4")) {
      avatar = $mainStore?.user?.profile?.lens?.avatar;
    } else if (
      $mainStore?.user?.profile?.farcaster?.avatar &&
      !$mainStore?.user?.profile?.farcaster?.avatar.endsWith(".mp4")
    ) {
      avatar = $mainStore?.user?.profile?.farcaster?.avatar;
    }
  });
</script>


<div class="h-24 leading-6 main-section">
  <div class="flex">
    <div on:click={() => extrenalNavigate(`${APP_BASE}/score/${$mainStore.user.auth.address}`)} aria-hidden class="flex flex-col w-16 mt-1 px-2 py-3 mr-4 link">
      <span class="text-[0.6rem] mb-2">Score</span><span class="text-[0.95rem] mb-2"
        >{$mainStore?.user?.profile?.yupScore?.toFixed(0)}</span
      ><span class="text-[0.7rem]">100<br />MAX</span>
    </div>
    <div on:click={() => extrenalNavigate(`${APP_BASE}/profile/${$mainStore.user.auth.userId}`)} aria-hidden class="flex flex-col justify-center mb-2 w-16">
      <ImgLoader source={avatar} bind:this={loader}>
        <img
          style="{ $mainStore.settings.theme === 'light'? 'filter: invert(1);' : '' }"
          slot="img"
          src={avatar}
          alt="avatar"
          class="h-14 w-14 avatar"
          on:load={() => loader.onLoad()}
          on:error={() => loader.onError()}
        />
        <svg slot="error" class="h-14 w-14 avatar" viewBox="-27 24 100 100" style="{ $mainStore.settings.theme === 'light'? 'filter: invert(0.9);' : '' }"
          ><g
            ><g
              ><rect fill="#F5EEE5" x="-27" y="24" /><g
                ><defs
                  ><path
                    d="M36,95.9c0,4,4.7,5.2,7.1,5.8c7.6,2,22.8,5.9,22.8,5.9c3.2,1.1,5.7,3.5,7.1,6.6v9.8H-27v-9.8       c1.3-3.1,3.9-5.5,7.1-6.6c0,0,15.2-3.9,22.8-5.9c2.4-0.6,7.1-1.8,7.1-5.8c0-4,0-10.9,0-10.9h26C36,85,36,91.9,36,95.9z"
                    id="shoulders"
                  /></defs
                ><use fill="#E6C19C" overflow="visible" xlink:href="#shoulders" /><clipPath id="shoulders_1_"
                  ><use overflow="visible" xlink:href="#shoulders" /></clipPath
                ><path
                  clip-path="url(#shoulders_1_)"
                  d="M23.2,35c0.1,0,0.1,0,0.2,0c0,0,0,0,0,0      c3.3,0,8.2,0.2,11.4,2c3.3,1.9,7.3,5.6,8.5,12.1c2.4,13.7-2.1,35.4-6.3,42.4c-4,6.7-9.8,9.2-13.5,9.4c0,0-0.1,0-0.1,0      c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c0,0-0.1,0-0.1,0c-3.7-0.2-9.5-2.7-13.5-9.4c-4.2-7-8.7-28.7-6.3-42.4      c1.2-6.5,5.2-10.2,8.5-12.1c3.2-1.8,8.1-2,11.4-2c0,0,0,0,0,0C23.1,35,23.1,35,23.2,35L23.2,35z"
                  fill="#D4B08C"
                  id="head-shadow"
                /></g
              ></g
            ><path
              d="M22.6,40c19.1,0,20.7,13.8,20.8,15.1c1.1,11.9-3,28.1-6.8,33.7c-4,5.9-9.8,8.1-13.5,8.3    c-0.2,0-0.2,0-0.3,0c-0.1,0-0.1,0-0.2,0C18.8,96.8,13,94.6,9,88.7c-3.8-5.6-7.9-21.8-6.8-33.8C2.3,53.7,3.5,40,22.6,40z"
              fill="#F2CEA5"
              id="head"
            /></g
          ></svg
        >
      </ImgLoader>
      {#if handle}
        <span class="text-[0.6rem] mt-4 -ml-1">{handle.length >= 12 ? handle.slice(0, 10) + "..." : handle}</span>
      {/if}
    </div>
    <div on:click={() => extrenalNavigate(`${APP_BASE}/raw-influence/${$mainStore.user.auth.userId}`)} aria-hidden class="flex flex-col w-16 mt-1 ml-4 px-2 py-3 link">
      <span class="text-[0.6rem] mb-2">Influence</span><span class="text-[0.95rem] mb-2"
        >{$mainStore?.user?.profile?.yup?.weight}</span
      ><span class="text-[0.7rem]">10<br />MAX</span>
    </div>
  </div>

</div>
<div class="address text-[0.8rem]">
  <span
    class="mb-2"
    >Address: {truncteEVMAddr($mainStore?.user?.auth?.address)}
    <svg on:click={() => copyAddress()} aria-hidden="true" class="w-4 interactive-svg" viewBox="0 0 24 24"
      ><path
        fill="#eee"
        d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2z"
      /><path fill="#eee" d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" /></svg
    ></span
  >
  <span>Balance: {formatNumber($mainStore?.user?.profile.yup.balance, 2)}
    {#if $mainStore?.user?.profile.yup.balance > 0 && $mainStore?.settings?.coinGeckoPrice > 0}
      <span class="text-[0.6rem] opacity-70 ml-1">${formatNumber($mainStore?.user?.profile.yup.balance * $mainStore?.settings.coinGeckoPrice, 2)}</span>
    {/if}
  </span>
</div>

<RateWebsite />

<style lang="scss">
  .address {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0.5rem;
    border: 1px solid #2c2c2c;
    box-shadow: inset -1px 0px 18px 0px #0000004f;
    background: #1a1a1a;
    height: 3.4rem;
    width: 130%;
    overflow: hidden;
    margin-left: -2rem;
    margin-bottom: 0.2rem;
  }

  .avatar {
    border: 2px solid #d3d9df1a;
    box-shadow: 0px 0px 0px 4px #0000004f;
    transition: all .4s ease-in-out;
    border-radius: 8px;
    cursor: pointer;
  }
  .link {
    cursor: pointer;
    transition: all 0.4s ease-in-out;
    border-radius: 6px;
    background-color: #00000027;
  }

  .avatar:hover,
  .link:hover {
    color: #fffee5;
    background-color: #0000004f;
  }

  .link:hover {
    border: 1px solid #d3d9df73;
  }

  .avatar:hover {
    border: 2px solid #d3d9df73;
  }
</style>
