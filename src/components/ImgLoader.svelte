<script lang="ts">
    import { isUrlInvalid } from '@/utils/misc';

    export let source

     let loading = true
     let loaded = false
    
    export const onLoad = () => {
        loading = false
        loaded = true
    }

    export const onError = () => {
        loading = false
        source = undefined
    }

    $: {
        if(isUrlInvalid(source)) {
            source = undefined
        } else {
        }
    }
    
</script>

<div class="inline-flex {`${loading ? 'animate-pulse' :''}`}">
    {#if loading || loaded}
    <slot name="img">
    </slot>
    {:else if source === undefined}
    <slot name="error">
    </slot>
    {/if}
    <slot name="after">
    </slot>
</div>