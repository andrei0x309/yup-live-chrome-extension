<script lang="ts">
  import { timeSince } from "@/utils/time";
  import ImgLoader from "./ImgLoader.svelte";
  import type { Notification } from "@/utils/types";
  import { mainStore } from "@/utils/store";
  import { chromeUrl } from "@/utils/chrome-misc";
  import { extrenalNavigate } from "@/utils/chrome-misc";
  import LikeIcon from '@/components/LikeIcon.svelte';
  import { YUP_APP_BASE } from "@/constants/config";


  export let notif: Notification;
  const numImages = notif?.senders?.length ?? 0;
  let loaders: ImgLoader[] = Array(numImages).fill(null);

</script>

{#if notif.eventType === "vote"}
  {@const url = notif?.meta?.url ?? ''}
  {@const length = url.length}
  {@const shortUrl = url.slice(0, 10) + "..." + url.slice(length - 10, length)}
  {@const finalUrl = length > 24 ? shortUrl : url}
  <div class="flex flex-row notifBody">
    <LikeIcon solid={true} className={'w-9 mx-auto p-4'} />
    <div class="ml-4 text-left" style="width: 97%">
      <p class="text-xs text-gray-200 my-0 mt-1">
        by
        {#if notif?.senders?.length > 1}
            {notif?.senders[0].handle}
            {#if notif.senders?.length - 1 > 0}
            <span class="opacity-60"> and {notif.senders.length - 1} more</span>
            {/if}
        {:else}
          {notif.senders[0].handle?.length > 12 ? notif.senders[0]?.handle?.slice(0, 12) + "..." : notif.senders[0]?.handle ?? ''}
        {/if}
      </p>
      <p class="text-xs text-gray-200 my-0 mt-1">
        <span
          on:click={() => extrenalNavigate(`${YUP_APP_BASE}/post/${notif.meta.postid}`)}
          aria-hidden
          class="text-blue-200 interactive-svg">{finalUrl}</span
        >
      </p>
      <p class="text-xs text-gray-200 my-1 text-right mr-2">
        <svg class="w-3 inline" viewBox="0 0 20 20"
          ><path
            fill="#fff"
            d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"
          /></svg
        >
        {timeSince(new Date(notif.createdAt))}
      </p>
    </div>
  </div>
{:else if notif.eventType === "reward"}
  <div class="flex flex-row notifBody">
    <img class="notificationImage" src={chromeUrl("src/assets/res/reward_optimized.png")} alt="reward" />
    <div class="ml-4 text-left" style="width: 97%">
      <p class="text-xs text-gray-200 my-0 mt-1">
        You were alocated a future reward of {notif?.meta.quantity ?? "unknown"} amount of YUP.
      </p>
      <p class="text-xs text-gray-500 my-1 text-right mr-2">
        <svg class="w-3 inline" viewBox="0 0 20 20"
          ><path
            fill="#fff"
            d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"
          /></svg
        >
        {timeSince(new Date(notif.createdAt))}
      </p>
    </div>
  </div>
{:else if ["follow"].includes(notif.eventType)}
  <div class="flex flex-col notifBody">
    {#each notif.senders as sender, i}
    <div class="flex flex-row items-center">
    <ImgLoader bind:this={loaders[i]} source="{sender?.avatar}" >
      <img
        class="notificationImage"
        on:load={() => loaders[i]?.onLoad()}
        on:error={() => loaders[i]?.onError()}
        style={$mainStore.settings.theme === "light" ? "filter: invert(0.9);" : ""}
        slot="img"
        src={sender.avatar}
        alt="preview"
      />
      <svg
        class="notificationImage"
        style={$mainStore.settings.theme === "light" ? "filter: invert(0.9);" : ""}
        slot="error"
        viewBox="0 0 512 512"
        ><g
          ><polygon
            points="40,38.999 40,468.998 215,293.998 270,348.998 360,258.998 470,358.998 470,38.999 "
            style="fill:#EFF3F6;"
          />
          <g><circle cx="150" cy="158.999" r="40" style="fill:#FCD884;" /></g><g
            ><polygon
              points="470,358.998 470,468.998 385,468.998 385,463.998 270,348.998 360,258.998    "
              style="fill:#70993F;"
            /></g
          ><g><polygon points="385,463.998 385,468.998 40,468.998 215,293.998 270,348.998" style="fill:#80AF52;" /></g
          ></g
        ><g /></svg
      >
    </ImgLoader>
    <div class="ml-4 text-left" style="width: 97%">
      <p
        aria-hidden
        class="text-xs text-gray-200 my-0 mt-1"
        on:click={() => extrenalNavigate(`${YUP_APP_BASE}/account/${sender?._id}`)}
      >
        <b>{sender?.handle || `${sender?._id?.slice(0, 6)}...`}</b>
        followed you.
      </p>
    </div>
    </div>
    {/each}
    <p class="text-xs text-gray-200 my-1 text-right mr-2">
      <svg class="w-3 inline" viewBox="0 0 20 20"
        ><path
          fill="#fff"
          d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"
        /></svg
      >
      {timeSince(new Date(notif.createdAt))}
    </p>
  </div>
{:else}
  <div class="flex flex-row items-center notifBody">
    <div class="ml-4 text-left" style="width: 97%">
      <p class="text-xs text-gray-200 my-0 mt-1">{notif?.meta?.message ?? notif?.message  ?? "unknown notification type"}</p>
      <p class="text-xs text-gray-500 my-1 text-right mr-2">
        <svg class="w-3 inline" viewBox="0 0 20 20"
          ><path
            fill="#fff"
            d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z"
          /></svg
        >
        {timeSince(new Date(notif.createdAt))}
      </p>
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
    border: 1px solid rgba(0, 0, 0, 0.233);
    background-image: linear-gradient(rgba(0, 0, 0, 0.123), rgba(0, 0, 0, 0.123));
  }

  .notifBody {
    background: #00000061;
    border: 1px solid rgba(0, 0, 0, 0.938);
  }

</style>
