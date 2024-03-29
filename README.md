# Store-based router for Svelte | [Demo](https://svelte-store-router-demo.vercel.app)

#### Inspired by the [svelte-pathfinder](https://github.com/PaulMaly/svelte-pathfinder) by [PaulMaly](https://github.com/PaulMaly)

A completely different approach of routing. State-based router suggests that routing is just another global state and History API changes are just an optional side-effects of this state.

#### [How it works](https://www.youtube.com/watch?v=kf5zccSyEso) (russian language)

## Features

- Just another global state;
- It doesn't impose any restrictions on how to apply this state to the application;
- Manipulate different parts of a state (`path` / `query` / `fragment`) separately;
- Automatic parsing of the `query` and `fragment` parameters;
- Components for `path` matching and parameters extracting (using [regexparam](https://github.com/lukeed/regexparam));
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

You can navigate to the full path you want by assigning a string value to the store or by calling the store's `goto` function (without $). Don't forget that the route must be relative to the base path. So calling `goto('https://google.com')` with `base: '/test'` redirects you to `/test/https://google.com`.
```svelte
<button on:click={() => $route = '/users?orderBy=karma&limit=10'}>show top 10 users</button>
<button on:click={() => route.goto('/users?orderBy=karma&limit=10')}>show top 10 users</button>
```

You can match path pattern and parametrize it ([regexparam](https://github.com/lukeed/regexparam)).
```svelte
<script>
  import { Match } from 'svelte-store-router'
  import { route } from './stores.js'
</script>

<Match route={$route} pattern="/users">
  User list
</Match>
<Match route={$route} pattern="/users/:id" let:params={{ id }}>
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
  <Match route={$route} pattern="/users">
    User list
  </Match>
  <Match route={$route} pattern="/users/:id" let:params={{ id }}>
    User {id} profile
  </Match>
  <Match route={$route}>
    Page not found
  </Match>
  <Match route={$route}>
    This content will never be displayed, because
    the previous <Match> handle all possible routes
  </Match>
</Matcher>
```

You can use nested match components using the `loose` parameter.
```svelte
<script>
  import { Match, Matcher } from 'svelte-store-router'
  import { route } from './stores.js'
</script>

<Matcher>
  <Match route={$route} pattern="/users" loose>
    Begin of users template
    <Matcher>
      <Match route={$route} pattern="/users">
        Users list
      </Match>
      <Match route={$route} pattern="/users/:id" let:params={{ id }}>
        User {id} profile
      </Match>
    </Matcher>
    End of users template
  </Match>
  <Match route={$route}>
    Page not found
  </Match>
</Matcher>
```

Or you can do it all above manually using `match` function instead of components.
```svelte
<script>
  import { match } from 'svelte-store-router'
  import { route } from './stores'

  let params
</script>

<!--
  It is recommended to first check if the route matches the base path of application by 
  calling `match($route)`. Not necessary if the application will always be in the root path.
-->
{#if match($route)}
  {#if match($route, '/users', true)}
    Begin of users template
    
    {#if params = match($route, '/users/:id')}
      User {params.id}
    {:else if params = match($route, '/users/:id/friends')}
      User {params.id} friends
    {/if}

    End of users template
  {:else}
    Page not found
  {/if}
{/if}
```

## Options

#### base [String]
Base path of application. Routes and links which not match under this path will not be handled. `''` by default.

#### delay [Number]
Sets delay in milliseconds before `history.pushstate` was called. This prevents a large number of items from appearing in History state. For example, it could be useful when the parameter of `query` or `fragment` is binded with the `search` input field. `0` by default.

#### queryParse, fragmentParse [Boolean]
Enables `query` and `fragment` string to objects conversion. `true` by default.

#### queryTyped, fragmentTyped [Boolean]
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

#### queryClean, fragmentClean [Boolean]
Clean query and fragment from empty (`null` / `undefined` / `""`) values. Might be useful to avoid `/path?page=undefined&search=`. `false` by default.

#### queryShortBoolean, fragmentShortBoolean [Boolean]
Automatically shortens the parameter string for boolean values, e.g. `a=true&b=false&c=true` into `a&c`. So for parameters with `true` only the parameter name will be shown, and with `false` they will be hidden completely. `false` by default.

#### sideEffect [Boolean]
Controls side effect of route changing which push items to History. `true` by default in browser, always `false` on server side.

#### handleNavigation [Boolean / String]
Toggles a navigation handler that automatically intercepts `<a>` clicks, updating the route state without reloading the page. Adding a `rel="external"` attribute to a `<a>` will trigger a usual browser navigation when the link is clicked. In addition to boolean, can contain a string with CSS selectors (e.g. `".foo, #bar, form"`) for elements only within which `<a>` clicks should be handled. `true` by default.

#### autoClearParams [Boolean]
This option toggles automatically clear the `query` and `fragment` when the `path` is changed. `false` by default.