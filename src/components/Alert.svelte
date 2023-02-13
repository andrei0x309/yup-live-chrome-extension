<script lang="ts">
    import { fly } from 'svelte/transition'
    import type { FlyParams } from 'svelte/transition'

    let hidden = true
    let timer: undefined | number | string = undefined
    let alertTimeout = 5000
    let alretType = 'success'
    let alertMsg = ''

    export const show = (message: string, type: string = 'success', timeout: number = 5000) => {
        hidden = false
        alertMsg = message
        alretType = type
        alertTimeout = timeout
        timer = setTimeout(() => {
            hidden = true
        }, alertTimeout) as unknown as number
    }

    export const close = () => {
         hidden = true
        clearTimeout(timer)
    }

   const tryFly = (node: Element, params?: FlyParams) => {
        try{
            return fly(node, params)
        }catch {
          // ignore
        }
    }

</script>
  {#if !hidden}
    <div transition:tryFly="{{ y: 200, duration: 500 }}" class="shadow-md flex flex-row rounded-lg alertCmp">
      <div
        class="{`${
          alretType === 'warning' ? 'yellow' : alretType === 'error' ? 'red' : 'green'
        } inline-block rounded-lg p-1 mr-1`}"
      ></div>
      <p class="p-1 flex items-center">{ alertMsg }</p>
      <span class="h-5 w-5 text-gray-500 inline-block p-1" on:click={() => close()} aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 absolute"
          style="right: 0.4rem; top: 0.4rem"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </div>
  {/if}

<style lang="scss">
    .alertCmp {
      background-color: #0e0e0efc;
    box-shadow: 0 1px 3px #0000001a, 0 1px 2px #0000000f;
    position: fixed;
    z-index: 100;
    width: 230px;
    max-width: 100%;
    border-radius: 0.25rem;
    border: 1px solid rgba(0,0,0,.1);
    color: #fff;
    font-size: .675rem;
    font-weight: 400;
    letter-spacing: .025em;
    text-align: left;
    padding: 0.2rem 0.6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    bottom: 0.8rem;
    }
    .green {
        background-color: #48bb78;
    }
    .yellow {
        background-color: #f6e05e;
    }
    .red {
        background-color: #e53e3e;
    }
</style>