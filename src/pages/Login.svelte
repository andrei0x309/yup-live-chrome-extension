<script lang="ts">
    import { extrenalNavigate } from "@/utils/chrome-misc";
    import { APP_BASE } from '@/constants/config'

</script>

<a href="#app" on:click={() => extrenalNavigate(`${APP_BASE}/login`)}>
    <svg enable-background="new 0 0 32 32" viewBox="0 0 32 32" class="w-20 mb-10 mt-8 svg-fill">
      <g id="lock"><path d="M25,13V9c0-4.971-4.029-9-9-9c-4.971,0-9,4.029-9,9v4c-1.657,0-3,1.343-3,3v3v1v2v1c0,4.971,4.029,9,9,9h6 c4.971,0,9-4.029,9-9v-1v-2v-1v-3C28,14.342,26.656,13,25,13z M9,9c0-3.866,3.134-7,7-7c3.866,0,7,3.134,7,7v4h-2V9.002   c0-2.762-2.238-5-5-5c-2.762,0-5,2.238-5,5V13H9V9z M20,9v0.003V13h-8V9.002V9c0-2.209,1.791-4,4-4C18.209,5,20,6.791,20,9z M26,19   v1v2v1c0,3.859-3.141,7-7,7h-6c-3.859,0-7-3.141-7-7v-1v-2v-1v-3c0-0.552,0.448-1,1-1c0.667,0,1.333,0,2,0h14c0.666,0,1.332,0,2,0   c0.551,0,1,0.448,1,1V19z"/>
        <path d="M16,19c-1.104,0-2,0.895-2,2c0,0.607,0.333,1.76,0.667,2.672c0.272,0.742,0.614,1.326,1.333,1.326 c0.782,0,1.061-0.578,1.334-1.316C17.672,22.768,18,21.609,18,21C18,19.895,17.104,19,16,19z"/></g>
    </svg>
  </a>
  <div class="text-[1.6rem] mb-4 uppercase">
  <a href="#app" on:click="{() => extrenalNavigate(`${APP_BASE}/login`)}">
    Login
  </a>
  /
  <a href="#app" on:click="{() => extrenalNavigate(`${APP_BASE}/sign-up`)}" >
    Signup
  </a>
 </div>
  <a href="#app" on:click="{() => extrenalNavigate(`${APP_BASE}/login`)}">
    <svg enable-background="new 0 0 48 48" viewBox="0 0 48 48" class="w-14 svg-fill my-4"><path d="M0.115,30.348c0-7.771,6.303-14.073,14.074-14.073h0.002h14.071V8.051l19.622,15.261l-19.622,15.26v-8.225  H10.458c-3.887,0-7.037,3.152-7.037,7.037c0,0.906,0.186,1.768,0.5,2.564C1.566,37.434,0.115,34.064,0.115,30.348z"/></svg>
</a>
