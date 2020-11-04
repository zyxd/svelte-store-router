<slot/>

<script context="module">
	export const key = {}
</script>

<script>
  import { setContext } from 'svelte'
  import { compose, find, forEach, isNil, not, when } from 'rambda'

  const items = new Map()
  
  setContext(key, {
    register: (key, value) => {
      items.set(key, value)

      compose(
        when(
          compose(not, isNil),
          item => item.show()
        ),
        find(item => item.result),
        forEach(item => item.hide())
      )(Array.from(items.values()))
    }
  })
</script>