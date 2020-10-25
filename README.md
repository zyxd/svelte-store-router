# Store-based router for Svelte

#### Inspired by the [svelte-pathfinder](https://github.com/PaulMaly/svelte-pathfinder) by [PaulMaly](https://github.com/PaulMaly)

A completely different approach of routing. State-based router suggests that routing is just another global state and History API changes are just an optional side-effects of this state.

## Features

- Zero-config.
- Just another global state.
- It doesn't impose any restrictions on how to apply this state to the application.
- Manipulate different parts of a state (`path` / `query` / `fragment`) separately.
- Automatic parsing of the `query` and `fragment` parameters.
- Components for `path` matching and parameters extracting (using [path-to-regexp](https://github.com/pillarjs/path-to-regexp)).
- Configurable History changing delay.
- Converting `query` and `fragment` string values to JavaScript types.
- Cleaning `query` and `fragment` from empty values like a null / undefined / ''.

## Install

```bash
npm i svelte-store-router --save-dev
```

## Usage

Initialize store.
```svelte
<script>
  import { Route } from 'svelte-store-router'
  const route = Route.toStore()
</script>
```

Now you can access it as usual store.
```svelte
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

You can match path pattern and parametrize it (by [path-to-regexp](https://github.com/pillarjs/path-to-regexp)).
```svelte
<Match path={$route.path} pattern="/users">
  User list
</Match>
<Match path={$route.path} pattern="/users/:id" let:params={{ id }}>
  User {id} profile
</Match>
```

You can show only first matching path.
```svelte
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
    This content will never be displayed, because the previous <Match> handle all possible routes
  </Match>
</Matcher>
```

You can set delay before `history.pushstate` was called. This prevents a large number of items from appearing in History state.
```svelte
<script>
  import { Match, Matcher, Route } from 'svelte-store-router'

  Route.delay = 300 // in milliseconds, zero by default

  const route = Route.toStore()
</script>

<textarea placeholder="fragment.search" bind:value={$route.fragment.search}/>
```

You can convert query and fragment string values to JavaScript types.

```svelte
<script>
  import { Match, Matcher, Route } from 'svelte-store-router'
  
  Route.queryTyped = true     // true by default
  Route.fragmentTyped = true  // true by default
  
  /*
    For example will be converted from -> to:
    "1"         -> 1
    "0.123"     -> 0.123
    "true"      -> true
    "null"      -> null
    "undefined" -> undefined
    "01234"     -> 1234
    "a1234"     -> "a1234"
  */
  
  const route = Route.toStore()
</script>
```

You can clean query and fragment from empty (null / undefined / "") values. Might be useful to avoid `/path?page=undefined&search=`.
```svelte
<script>
  import { Match, Matcher, Route } from 'svelte-store-router'
  
  Route.queryClean = true     // false by default
  Route.fragmentClean = true  // false by default

  const route = Route.toStore()
</script>
```

You can also disable side effect (History) of route changing.
```svelte
<script>
  import { Match, Matcher, Route } from 'svelte-store-router'
  
  Route.sideEffect = true // true by default in browser
                          // always false on server side

  const route = Route.toStore()
</script>
```
