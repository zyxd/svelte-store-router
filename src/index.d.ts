interface MatchProps {
  path: string
  pattern?: string
}

declare module 'svelte-store-router' {
  export function createRouteStore(options: any): string

  export class Match {
    $$prop_def: MatchProps
  }
  
  export class Matcher {
    $$prop_def: any
  }
}