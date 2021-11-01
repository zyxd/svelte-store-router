import { always, compose, concat, equals, isEmpty, join, map, not, when } from 'rambda'
import { parse } from 'regexparam'
import { writable } from 'svelte/store'
import delayed from './delayed.mjs'
import fragmentToObject from './fragmentToObject.mjs'
import normalizePath from './normalizePath.mjs'
import objectToParams from './objectToParams.mjs'
import queryToObject from './queryToObject.mjs'
import stringToType from './stringToType.mjs'

const hasWindow = typeof window !== 'undefined'
const hasHistory = typeof history !== 'undefined'
const hasLocation = typeof location !== 'undefined'
const subWindow = hasWindow && window !== window.parent
const href = hasLocation ? window.location.href : 'http://localhost'

export default function({
  base = '',
  sideEffect = true,
  handleNavigation = true,
  delay = 0,
  autoClearParams = false,
  queryParse = true,
  queryTyped = true,
  queryClean = false,
  queryShortBoolean = false,
  fragmentParse = true,
  fragmentTyped = true,
  fragmentClean = false,
  fragmentShortBoolean = false
} = {}) {
  function toString() {
    return decodeURIComponent(join('', [
      this.path,
      when(
        always(queryParse),
        compose(
          when(
            compose(not, isEmpty),
            concat('?')
          ),
          objectToParams(queryClean, queryShortBoolean)
        )
      )(this.query),
      when(
        always(fragmentParse),
        compose(
          when(
            compose(not, isEmpty),
            concat('#')
          ),
          objectToParams(fragmentClean, fragmentShortBoolean)
        )
      )(this.fragment)
    ]))
  }

  function fromString(url) {
    let path = ''
    let query = ''
    let fragment = ''

    try {
      const { pathname, search, hash } = new URL(url, href)
      path = pathname
      query = search
      fragment = hash
    } catch {}

    if (parse(base, true).pattern.test(path)) {
      path = normalizePath(path.slice(base.length))
    } else {
      path = ''
    }

    query = compose(
      when(always(queryParse), compose(
        when(always(queryTyped), map(stringToType)),
        queryToObject
      ))
    )(query)

    fragment = compose(
      when(always(fragmentParse), compose(
        when(always(fragmentTyped), map(stringToType)),
        fragmentToObject
      ))
    )(fragment)

    return {
      path,
      query,
      fragment,
      toString
    }
  }

  base = normalizePath(base)
  const { subscribe, set, update } = writable(fromString(href))

  if (sideEffect && hasWindow && hasHistory && !subWindow) {
    window.addEventListener('popstate', () => {
      set(fromString(window.location))
    })

    if (handleNavigation) {
      window.addEventListener('click', event => {
        if (
          !event.target ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.shiftKey ||
          event.button ||
          event.which !== 1 ||
          event.defaultPrevented
        ) {
          return
        }

        const anchor = event.target.closest('a')

        if (
          !anchor ||
          !anchor.href ||
          (typeof handleNavigation === 'string' && !anchor.closest(handleNavigation)) ||
          anchor.target ||
          anchor.hasAttribute('download') ||
          anchor.getAttribute('rel') === 'external'
        ) {
          return
        }

        const url = anchor.href
        const isSpecialLink = /((mailto:\w+)|(tel:\w+)).+/.test(url)
        const isSameOrigin = url.indexOf(window.location.origin) === 0
        const isSameBase = parse(base, true).pattern.test(new URL(url, window.location.origin).pathname)

        if (!url || !isSameOrigin || !isSameBase || isSpecialLink) {
          return
        }

        event.preventDefault()
        set(fromString(url))
      })
    }
  
    subscribe(($route) => {
      if (typeof $route === 'string') {
        return set(fromString(normalizePath(`${base}${normalizePath($route)}`)))
      }

      const $route_сurrent = fromString(window.location.href)
      const isSamePath = $route.path === $route_сurrent.path
      const isSameQuery = equals($route.query, $route_сurrent.query)
      const isSameFragment = equals($route.fragment, $route_сurrent.fragment)
      const isSameRoute = $route.toString() === $route_сurrent.toString()

      if (autoClearParams && !isSamePath && !isEmpty($route.query) && isSameQuery) {
        return set({ ...$route, query: {} })
      }

      if (autoClearParams && !isSamePath && !isEmpty($route.fragment) && isSameFragment) {
        return set({ ...$route, fragment: {} })
      }

      if (!isSameRoute) {
        delayed(delay, () => history.pushState({}, null, normalizePath(`${base}${$route}`)))
      }
    })
  }

  return {
    subscribe,
    set,
    update,
    goto: route => set(fromString(normalizePath(`${base}${normalizePath(route)}`)))
  }
}