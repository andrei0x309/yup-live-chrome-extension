<script lang="ts">
    import { isUrlInvalid } from '@/utils/misc';

    export let source

    let loading = true
    let loaded = false
    let error = false
    
    export const onLoad = () => {
        loading = false
        loaded = true
    }

    export const onError = () => {
        loading = false
        error = true
    }

    $: {
        if(isUrlInvalid(source)) {
            loading = false
            error = true
        } else {
            loading = true
            error = false
        }
       
    }
    
</script>

<div class="inline-flex {`${loading ? 'animate-pulse' :''}`}">
    {#if loading || loaded}
    <slot name="img">
    </slot>
    {:else if error}
    <slot name="error">
    </slot>
    {/if}
    <slot name="after">
    </slot>
</div>