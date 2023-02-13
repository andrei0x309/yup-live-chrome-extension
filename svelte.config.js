import sveltePreprocess from "svelte-preprocess";
import { windi } from 'svelte-windicss-preprocess';


export default {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [windi({}), sveltePreprocess()]
};
