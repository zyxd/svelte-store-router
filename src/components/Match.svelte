{#if result && show}
  <slot params={result} />
{/if}

<script>
  import { getContext, hasContext } from 'svelte'
  import match from '../functions/match.mjs'
  import { key as key_matcher } from './Matcher.svelte'

  export let route
  export let pattern = undefined
  export let loose = false
  
  const key = {}
  const { register } = getContext(key_matcher) || {}
  let show = false

  $: result = match(route, pattern, loose)

  $: {
    if (hasContext(key_matcher)) {
      register(key, {
        result,
        show: () => show = true,
        hide: () => show = false
      })
    } else {
      show = true
    }
  }
</script>