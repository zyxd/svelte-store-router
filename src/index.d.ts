import { SvelteComponentTyped } from 'svelte'
import { Writable } from 'svelte/store'

interface Route {
  path: string,
  query: { [key: string]: any },
  fragment: { [key: string]: any },
  toString: () => string
}

interface RouteStore<T> extends Writable<T> {
  goto: (url: string) => void
}

interface RouteStoreOptions {
  base?: string,
  sideEffect?: boolean,
  handleNavigation?: boolean | string,
  delay?: number,
  autoClearParams?: boolean,
  queryParse?: boolean,
  queryTyped?: boolean,
  queryClean?: boolean,
  queryShortBoolean?: boolean,
  fragmentParse?: boolean,
  fragmentTyped?: boolean,
  fragmentClean?: boolean,
  fragmentShortBoolean?: boolean
}

export function createRouteStore(options?: RouteStoreOptions): RouteStore<Route>
export function match(route: Route, pattern?: string, loose?: boolean): { [key: string]: any } | null
export class Match extends SvelteComponentTyped<{route: Route, pattern?: string, loose?: boolean}> {}
export class Matcher extends SvelteComponentTyped<{}> {}