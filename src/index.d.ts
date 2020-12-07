import { SvelteComponentTyped } from 'svelte'
import { Writable } from 'svelte/store'

interface Route {
  path: string,
  query: any,
  fragment: any,
  toString: () => string
}

interface RouteStoreOptions {
  href?: string,
  sideEffect?: boolean,
  handleNavigation?: boolean,
  delay?: number,
  queryParse?: boolean,
  queryTyped?: boolean,
  queryClean?: boolean,
  fragmentParse?: boolean,
  fragmentTyped?: boolean,
  fragmentClean?: boolean
}

export function createRouteStore(options?: RouteStoreOptions): Writable<Route>
export class Match extends SvelteComponentTyped<{path: string, pattern?: string}> {}
export class Matcher extends SvelteComponentTyped<{}> {}