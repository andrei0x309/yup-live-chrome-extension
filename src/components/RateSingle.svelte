<script lang="ts">
    import { mainStore } from '@/utils/store';
    import { hasVote, getPost } from '@/utils/votes';
    import { onMount } from 'svelte'
    import { formatNumber } from '@/utils/misc'
    import { fetchWAuth } from '@/utils/auth'
    import { alertStore } from '@/utils/store';
    import { API_BASE } from '@/constants/config';
    import { executeVote } from '@/utils/votes';
    import LikeIcon from '@/components/LikeIcon.svelte';


    export let url = ''
    export let disabled = false
    let loading = true
    const defaultUserVote = {
        rating: 1,
        like: true,
        _id: null
    }
    let userVote = defaultUserVote
    let saveUserVote = defaultUserVote
    // let positiveWeight = 0
    // let negativeWeight = 0
    // let savePositiveWeight = 0
    // let saveNegativeWeight = 0
    // let timer = 0
    let doingLike = false
    let numLikes = 0
    let post = null


    const getPostIntial = async (onlyPost = false) => {
        post = await getPost(url)
        if(!post) {
            loading = false
        } else {
            numLikes = post.rating?.overall?.ratingCount ?? 0
            if(!onlyPost) {
                const has = (await hasVote(post._id.postid, $mainStore.user.auth.userId))?.[0] ?? null
            
                if(has){
                    userVote = has
                    saveUserVote = has
                } 
            } else {
                userVote = defaultUserVote
                saveUserVote = defaultUserVote
            }
        }
    }


    onMount(async () => {
        if(disabled) {
            loading = false
            return
        }
        if(!url) {
            loading = false
            disabled = true
            return
        }
        await getPostIntial()
        loading = false
    })


    const doLike = async () => {
        if(disabled) {
            $alertStore?.show('You shall not pass', 'error')
            return
        }
        if(!doingLike) {
                let reqVote
                doingLike = true
                try {
                    reqVote = await executeVote({
                        post,
                        userVote:defaultUserVote,
                        $mainStore,
                        $alertStore,
                        url
                    })
                    if(!reqVote) {
                        throw new Error('Vote not executed')
                    }
                    userVote = reqVote
                    saveUserVote = userVote
                    numLikes += 1
                } catch(e) {
                    console.log(e)
                    userVote = saveUserVote
                }
                doingLike = false
            }
    }

    // const doVote = (type = true) => {
    //     if(disabled) {
    //         $alertStore?.show('You shall not pass', 'error')
    //         return
    //     }
    //     if(timer && !doingVote) {
    //         clearTimeout(timer)
    //     }
    //     let noVoteAlert = false
    //     if(!doingVote) {
    //         const lastRating = userVote?.rating ?? 1
    //         let sameType = true
    //         if(type !== userVote?.like && userVote._id !== null) {
    //             userVote.rating = 0
    //             sameType = false
    //         }
    //         if(type && userVote?.rating < 3 || !type && userVote?.rating < 2) {
    //             userVote.rating += 1
    //         }
    //         if(userVote?.rating === lastRating && userVote && sameType) {
    //             $alertStore?.show('You already gave maximum rating.', 'warning')
    //             noVoteAlert = true
    //         } else {
    //         if(userVote.like !== type && userVote._id !== null) {
    //                     if(type) {
    //                         negativeWeight -= $mainStore.user.profile.yup.weight * (userVote.rating + lastRating - 1)
    //                         userVote.rating = 1
    //                         positiveWeight += $mainStore.user.profile.yup.weight * userVote.rating
    //                     } else {
    //                         positiveWeight -= $mainStore.user.profile.yup.weight * (userVote.rating + lastRating - 1)
    //                         userVote.rating = 1
    //                         negativeWeight += $mainStore.user.profile.yup.weight * userVote.rating
    //                     }
    //                 } else {
    //                     if(type) {
    //                         positiveWeight += $mainStore.user.profile.yup.weight * (userVote.rating - lastRating)
    //                     } else {
    //                         negativeWeight += $mainStore.user.profile.yup.weight * (userVote.rating - lastRating)
    //                     }
    //                 }
    //                 userVote.like = type
    //         }
    //         timer = setTimeout(async () => {
    //             doingVote = true
    //             let reqVote
    //             try {
    //                 reqVote = await executeVote({
    //                     post,
    //                     userVote,
    //                     $mainStore,
    //                     $alertStore,
    //                     url,
    //                     noVoteAlert
    //                 })
    //                 if(!reqVote) {
    //                     throw new Error('Vote not executed')
    //                 }
    //                 savePositiveWeight = positiveWeight
    //                 saveNegativeWeight = negativeWeight
    //                 saveUserVote = userVote
    //             } catch(e) {
    //                 console.log(e)
    //                 positiveWeight = savePositiveWeight
    //                 negativeWeight = saveNegativeWeight
    //                 userVote = saveUserVote
    //             }
    //             if(reqVote) {
    //                 userVote = reqVote
    //             }
    //             doingVote = false
    //         }, 500) as unknown as number
    //     }
    // }


    const deleteVote = async () => {
        if(doingLike) {
            return
        }
        try {
          doingLike = true
          const reqVote = await fetch(`${API_BASE}/votes/post/${post._id.postid}/voter/${$mainStore.user.auth.userId}`)
          const voteId = (await reqVote.json())[0]._id.voteid
          const p1 = fetchWAuth($mainStore, `${API_BASE}/votes/${voteId}`, {
            method: 'DELETE'
          })
          const [req] = await Promise.all([p1])
          if (req.ok) {
            await getPostIntial(true)
            $alertStore.show('Vote deleted!')
          } else {
            $alertStore.show('Vote not deleted due to error try to re-login!', 'error')
            userVote = saveUserVote
            }   
            doingLike = false
        } catch (error) {
            userVote = saveUserVote
           console.log(error)
           $alertStore.show('The vote could not be deleted!')
           doingLike = false
        }
    }

</script>

<!-- {#if userVote._id !== null}
<svg on:click={() => deleteVote()} aria-hidden="true" class="{`w-4 opacity-30 delete interactive-svg ${delLoading ? 'animate-ping' : ''}`}" viewBox="0 0 512 512"><title/><polygon points="337.46 240 312 214.54 256 270.54 200 214.54 174.54 240 230.54 296 174.54 352 200 377.46 256 321.46 312 377.46 337.46 352 281.46 296 337.46 240" style="fill:none"/><polygon points="337.46 240 312 214.54 256 270.54 200 214.54 174.54 240 230.54 296 174.54 352 200 377.46 256 321.46 312 377.46 337.46 352 281.46 296 337.46 240" style="fill:none"/><path d="M64,160,93.74,442.51A24,24,0,0,0,117.61,464H394.39a24,24,0,0,0,23.87-21.49L448,160ZM312,377.46l-56-56-56,56L174.54,352l56-56-56-56L200,214.54l56,56,56-56L337.46,240l-56,56,56,56Z"/><rect height="80" rx="12" ry="12" width="448" x="32" y="48"/></svg>
{/if} -->
<div class="{`flex justify-center main-section bt ${doingLike ? 'animate-pulse disabled' : ''}`}" class:disabled>
<div on:click={() => {
    if(userVote?._id) {
        deleteVote()
    } else {
        doLike()
    }
}} aria-hidden="true" class="{`flex w-1/2 p-4 box h-6 bf mr-4 justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}">
    {#if userVote?._id}
    <LikeIcon solid={true} className="w-8 h-8" />
    {:else}
    <LikeIcon solid={false} className="w-8 h-8" />
    {/if}
    {#key numLikes}
    <span class="ml-4" style="margin-top: 0.2rem">{formatNumber(numLikes)}</span>
    {/key}
</div>
<!-- <div on:click={() => doVote(false)} aria-hidden="true" class="{`flex w-1/2 p-4 box h-6 bf ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}">
    {#if userVote.rating && !userVote.like}
    <svg class="w-8 down" viewBox="0 0 24 24">
        <path fill="#fff" d="M12,3.172L5.586,9.586c-0.781,0.781-0.781,2.047,0,2.828s2.047,0.781,2.828,0L10,10.828v7.242c0,1.104,0.895,2,2,2  c1.104,0,2-0.896,2-2v-7.242l1.586,1.586C15.977,12.805,16.488,13,17,13s1.023-0.195,1.414-0.586c0.781-0.781,0.781-2.047,0-2.828  L12,3.172z"/>
    </svg>
    {:else}
    <svg class="w-8 down" viewBox="0 0 24 24"><g><path fill="#fff" d="M12,21c-1.654,0-3-1.346-3-3v-4.764c-1.143,1.024-3.025,0.979-4.121-0.115c-1.17-1.169-1.17-3.073,0-4.242L12,1.758   l7.121,7.121c1.17,1.169,1.17,3.073,0,4.242c-1.094,1.095-2.979,1.14-4.121,0.115V18C15,19.654,13.654,21,12,21z M11,8.414V18   c0,0.551,0.448,1,1,1s1-0.449,1-1V8.414l3.293,3.293c0.379,0.378,1.035,0.378,1.414,0c0.391-0.391,0.391-1.023,0-1.414L12,4.586   l-5.707,5.707c-0.391,0.391-0.391,1.023,0,1.414c0.379,0.378,1.035,0.378,1.414,0L11,8.414z"/></g>
    </svg>
    {/if}
    {#key negativeWeight}
    <span class="ml-4">{formatNumber(negativeWeight)}</span>
    {/key}
</div> -->
</div>

<style lang="scss">
    .cursor-block {
        cursor: not-allowed;
    }

    .cursor-pointer {
        cursor: pointer;
    }
 
    .box {
        box-shadow: inset 3px -3px 6rem 11px #0000005e;
    }
    .bf {
        border: 1px solid #d3d9dfc2;
        border-radius: 6px;
        transition: all 0.2s ease-in-out;
    }
    .bf:hover {
        color: #fffee5;
        background-color: #0000004f;
        border: 1px solid #d3d9df73;
        
    }
    .down {
        transform: rotate(180deg);
    }

    .delete {
        position: absolute;
        top: 225px;
        right: 7px;
        fill: #f0f8ff;
    }
</style>
