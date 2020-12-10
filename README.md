# Store-based router for Svelte | [Demo](https://svelte-store-router-demo.vercel.app)

#### Inspired by the [svelte-pathfinder](https://github.com/PaulMaly/svelte-pathfinder) by [PaulMaly](https://github.com/PaulMaly)

A completely different approach of routing. State-based router suggests that routing is just another global state and History API changes are just an optional side-effects of this state.

#### [How it works](https://www.youtube.com/watch?v=kf5zccSyEso) (russian language)

## Features

- Just another global state;
- It doesn't impose any restrictions on how to apply this state to the application;
- Manipulate different parts of a state (`path` / `query` / `fragment`) separately;
- Automatic parsing of the `query` and `fragment` parameters;
- Components for `path` matching and parameters extracting (using [path-to-regexp](https://github.com/pillarjs/path-to-regexp));
- Configurable delay of `History` changing;
- Converting `query` and `fragment` string values to JavaScript types;
- Cleaning `query` and `fragment` from empty values like a `null` / `undefined` / `''`;
- Automatically handling `<a>` navigation what allow updating the route state without reloading the page;
- Works fine with SSR.

## Install

```bash
npm i svelte-store-router --save-dev
```

## Usage

Create a route store in your `stores.js`:
```javascript
import { createRouteStore } from 'svelte-store-router'

export const route = createRouteStore({
  delay: 300,
  queryClean: true,
  fragmentClean: true
})
```

Now you can access it as usual store.
```svelte
<script>
  import { route } from './stores.js'
</script>

Full route:   {$route}
Path:         {$route.path}
Query:        {$route.query}
Fragment:     {$route.fragment}
```

You can change it.
```svelte
<button on:click={() => $route.path = '/'}>home page</button>
<button on:click={() => $route.path = '/users'}>user list</button>

<button on:click={() => $route.query.sort = 'name'}>sort by name</button>
<button on:click={() => $route.query.team = 'svelte'}>filter by team</button>

<button on:click={() => $route.fragment.modal = true}>open modal window</button>
<button on:click={() => $route.fragment.scroll = 5}>skip first 50 users</button>
```

You can bind store values.
```svelte
<textarea placeholder="fragment.search" bind:value={$route.fragment.search}/>
```

You can go directly to the desired url by calling a store function `goto` (without $).
```svelte
<button on:click={() => route.goto('/users?orderBy=karma&limit=10')}>show top 10 users</button>
```

You can match path pattern and parametrize it (by [path-to-regexp](https://github.com/pillarjs/path-to-regexp)).
```svelte
<script>
  import { Match } from 'svelte-store-router'
  import { route } from './stores.js'
</script>

<Match path={$route.path} pattern="/users">
  User list
</Match>
<Match path={$route.path} pattern="/users/:id" let:params={{ id }}>
  User {id} profile
</Match>
```

You can show only first matching path.
```svelte
<script>
  import { Match, Matcher } from 'svelte-store-router'
  import { route } from './stores.js'
</script>

<Matcher>
  <Match path={$route.path} pattern="/users">
    User list
  </Match>
  <Match path={$route.path} pattern="/users/:id" let:params={{ id }}>
    User {id} profile
  </Match>
  <Match path={$route.path}>
    Page not found
  </Match>
  <Match path={$route.path}>
    This content will never be displayed, because
    the previous <Match> handle all possible routes
  </Match>
</Matcher>
```

Or you can match path manually using `match` function.
```svelte
<script>
  import { match } from 'svelte-store-router'
  import { route } from './stores'

  let params
</script>

{#if params = match('/users/:id', $route.path)}
  User {params.id}
{:else}
  Page not found
{/if}
```

## Options

#### href
Starting route as string. By default, empty on the server side and equal to `window.location` in the browser. Useful for SSR.

#### delay
Sets delay in milliseconds before `history.pushstate` was called. This prevents a large number of items from appearing in History state. For example, it could be useful when the parameter of `query` or `fragment` is binded with the `search` input field. `0` by default.

#### queryParse / fragmentParse
Enables `query` and `fragment` string to objects conversion. `true` by default.

#### queryTyped / fragmentTyped
Converts query and fragment string values to JavaScript types. `true` by default. For example strings will be converted from -> to:
```
"1"         -> 1
"0.123"     -> 0.123
"true"      -> true
"null"      -> null
"undefined" -> undefined
"01234"     -> 1234
"a1234"     -> "a1234"
```

#### queryClean / fragmentClean
Clean query and fragment from empty (`null` / `undefined` / `""`) values. Might be useful to avoid `/path?page=undefined&search=`. `false` by default.

#### sideEffect
Controls side effect of route changing which push items to History. `true` by default in browser, always `false` on server side.

#### handleNavigation
Toggles a navigation handler that automatically intercepts `<a>` clicks, updating the route state without reloading the page. `true` by default.
