<script lang="ts">
import { onMount } from 'svelte';
import { createActionUsage } from '@/utils/user';
import { mainStore } from '@/utils/store';
import { getTimeRemaining } from '@/utils/time';
import PageLoader from '@/components/PageLoader.svelte';

let isReset = false;
let hoursSpan = '0'
let minutesSpan = '0'
let secondsSpan = '0'


let data: Awaited<ReturnType<typeof createActionUsage>> = null


function initializeClock(endtime) {
  function updateClock() {
    var t = getTimeRemaining(endtime);

    hoursSpan = ('0' + t.hours).slice(-2);
    minutesSpan = ('0' + t.minutes).slice(-2);
    secondsSpan = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      isReset = true;
    }
  }

  updateClock(); 
  var timeinterval = setInterval(updateClock, 1000);
}

onMount(async () => {
        data = await createActionUsage($mainStore.user.auth.userId, $mainStore.user.profile.yup.balance);
        const resetDate = new Date(data.nextReset)
        isReset = getTimeRemaining(resetDate).total <= 0;
        if(!isReset) initializeClock(resetDate);
});

</script>

{#if data}
<div class="flex flex-col">
<p class="semi-bold text-[1.05rem]">Likes Remaining:</p>
<p class="semi-bold text-[0.95rem] my-1">{data.actionBars.vote}</p>
<p class="semi-bold text-[1.05rem]">Follows Remaining:</p>
<p class="semi-bold text-[0.95rem] my-1">{data.actionBars.follow}</p>
</div>
{#if !isReset}
<p class="semi-bold text-[1.15rem]">Refill Coutdown</p>
<div id="clockdiv">
  <div>
    <span class="hours">{hoursSpan}</span>
    <div class="smalltext">Hours</div>
  </div>
  <div><span class="minutes">{minutesSpan}</span>
    <div class="smalltext">Minutes</div>
  </div>
  <div><span class="seconds">{secondsSpan}</span>
    <div class="smalltext">Seconds</div>
  </div>
</div>
{:else}
<p>✨</p>
<p class="semi-bold text-[1.05rem]">There have been more than 24h since your last reset. 
<span class="mt-2 block">You can now reset your actions by doing a rating.</span></p>
{/if}

{:else}
<PageLoader />
{/if}

<style lang="scss">

#clockdiv {
    color: aliceblue;
    display: inline-block;
    font-weight: 100;
    text-align: center;
    font-size: 1rem;
}

#clockdiv > div {
    padding: 10px;
    border-radius: 3px;
    background: #00000057;
    display: inline-block;
}

#clockdiv div > span {
    padding: 15px;
    border-radius: 3px;
    background: #3b45917a;
    display: inline-block;
}

.smalltext {
	padding-top: 5px;
	font-size: 0.77rem
}
</style>

