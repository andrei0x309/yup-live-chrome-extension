<script lang="ts">
    import Alert from "@/components/Alert.svelte";
    import LikeIcon from "@/components/LikeIcon.svelte";
    import '@/overlay/overlay.scss'
    import { getStore } from "@/utils/storage";
    import { executeVote, getVotePayload } from "@/utils/votes";
    import { API_BASE } from '@/constants/config';
    import { fetchWAuth } from '@/utils/auth'
    import { hasVote, getPost } from '@/utils/votes';
    import { onMount } from "svelte";

    let alert
    let loading = false
    let hasUserVote = false
    let postid = null

    const getPostIntial = async (onlyPost = false) => {
        const store = await getStore()
        loading = true
        const post = await getPost(document.location.href)
        if(!post) {
            postid = null
            loading = false
        } else {
            postid = post._id.postid
            if(!onlyPost) {
                const has = (await hasVote(post._id.postid, store.user.auth.userId))?.[0] ?? null
                if(has){
                    hasUserVote = true
                } else {
                    hasUserVote = false
                }
            }
        }
        loading = false
    }

    const submitRate = async (type = true) => {
        if(loading) return
        loading = true
        const store = await getStore()

        const vote = await executeVote(getVotePayload({
            store,
            url: document.location.href,
            type
        }))
        
        if (vote?._id){
            alert.show('Liked!', 'success')
            hasUserVote = true
        } else {
            alert.show('Error submitting', 'error')
        }
        loading = false
    }

    const deleteVote = async () => {
        if(loading) {
            return
        }
        try {
            loading = true
            const store = await getStore()
          const reqVote = await fetch(`${API_BASE}/votes/post/${postid}/voter/${store.user.auth.userId}`)
          const voteId = (await reqVote.json())[0]._id.voteid
          const p1 = fetchWAuth(store, `${API_BASE}/votes/${voteId}`, {
            method: 'DELETE'
          })
          const [req] = await Promise.all([p1])
          if (req.ok) {
            await getPostIntial()
            hasUserVote = false
            alert.show('Vote deleted!', 'success')
          } else {
            alert.show('Vote not deleted due to error try to re-login!', 'error')
            }   
            loading = false
        } catch (error) {

            alert.show('The vote could not be deleted!', 'error')
           loading = false
        }
    }

    onMount(async () => {
        loading = true
        await getPostIntial()
        loading = false
    })

</script>

<div class="yup-overlay" >
<svg class="{`yup-logo ${loading ? 'yup-rotate': ''}`}" viewBox="0 0 366 366" fill="none" ><path d="M182.911 366C82.1487 366 0 283.851 0 182.911C0 81.9697 82.1487 0 182.911 0C283.672 0 365.821 82.1487 365.821 182.911C365.821 283.672 283.851 366 182.911 366ZM182.911 17.3604C91.6342 17.3604 17.1814 91.6342 17.1814 183.089C17.1814 274.545 91.4553 348.819 182.911 348.819C274.366 348.819 348.64 274.545 348.64 183.089C348.64 91.6342 274.366 17.3604 182.911 17.3604Z" fill="currentColor"></path><path d="M129.218 156.959C105.952 156.959 86.8018 139.241 84.4751 116.69C84.1172 114.185 86.2649 111.858 88.9495 111.858H97.0033C99.5089 111.858 101.657 113.827 102.014 116.332C104.162 129.576 115.616 139.599 129.397 139.599C143.178 139.599 154.633 129.576 156.78 116.332C157.138 113.827 159.286 111.858 161.792 111.858H169.845C172.53 111.858 174.499 114.185 174.32 116.69C171.635 139.241 152.306 156.959 129.218 156.959Z" fill="currentColor"></path><path d="M277.05 148.19H268.997C266.491 148.19 264.343 146.221 263.985 143.715C261.838 130.471 250.383 120.449 236.602 120.449C222.822 120.449 211.367 130.471 209.22 143.715C208.862 146.221 206.714 148.19 204.208 148.19H196.155C193.47 148.19 191.501 145.863 191.68 143.357C194.186 120.807 213.336 103.089 236.424 103.089C259.511 103.089 278.84 120.807 281.167 143.357C281.883 145.863 279.735 148.19 277.05 148.19Z" fill="currentColor"></path><path d="M185.058 306.939C115.616 308.192 58.8818 250.204 58.8818 180.763V178.615C58.8818 176.289 60.8505 174.32 63.1772 174.32H302.464C304.791 174.32 306.76 176.289 306.76 178.615V182.911C306.939 250.562 252.531 305.865 185.058 306.939ZM79.8217 191.68C78.2109 191.68 76.7791 193.112 76.9581 194.723C82.8642 248.057 128.144 289.579 182.91 289.579C237.676 289.579 282.956 248.057 288.862 194.723C289.041 193.112 287.788 191.68 285.999 191.68H79.8217Z" fill="currentColor"></path></svg>
<button class="{`yup-btn up ${loading? 'disabled' : ''}`}"
on:click={() => {
    if(hasUserVote) {
        deleteVote()
    } else {
        submitRate(false)
    }
}}>
<LikeIcon className="yup-rate-svg" solid={hasUserVote} />
<Alert bind:this={alert} />
</div>

 