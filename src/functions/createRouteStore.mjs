import { always, compose, join, map, when } from 'rambda'
import { writable } from 'svelte/store'
import stringToType from './stringToType.mjs'
import queryToObject from './queryToObject.mjs'
import cleanObject from './cleanObject.mjs'
import objectToQuery from './objectToQuery.mjs'
import objectToFragment from './objectToFragment.mjs'
import delayed from './delayed.mjs'

const hasWindow = typeof window !== 'undefined'
const hasHistory = typeof history !== 'undefined'
const hasLocation = typeof location !== 'undefined'
const subWindow = hasWindow && window !== window.parent

export default function({
  href = hasLocation ? window.location : '',
  sideEffect = true,
  handleNavigation = true,
  delay = 0,
  queryParse = true,
  queryTyped = true,
  queryClean = false,
  fragmentParse = true,
  fragmentTyped = true,
  fragmentClean = false
} = {}) {
  function toString() {
    return decodeURIComponent(join('', [
      this.path,
      when(
        always(queryParse),
        compose(
          objectToQuery,
          when(
            always(queryClean),
            cleanObject
          )
        ),
        this.query
      ),
      when(
        always(fragmentParse),
        compose(
          objectToFragment,
          when(
            always(fragmentClean),
            cleanObject
          )
        ),
        this.fragment
      )
    ]))
  }

  function fromString(url) {
    let path = ''
    let query = ''
    let fragment = ''

    try {
      const { pathname, search, hash } = new URL(url, 'https://example.com')
      path = pathname
      query = search
      fragment = hash
    } catch {}

    query = compose(
      when(always(queryParse), compose(
        when(always(queryTyped), map(stringToType)),
        queryToObject
      ))
    )(query)

    fragment = compose(
      when(always(fragmentParse), compose(
        when(always(fragmentTyped), map(stringToType)),
        queryToObject
      ))
    )(fragment)

    return {
      path,
      query,
      fragment,
      toString
    }
  }

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
        const specialLinks = /((mailto:\w+)|(tel:\w+)).+/

        if (!url || url.indexOf(window.location.origin) !== 0 || specialLinks.test(url)) {
          return
        }

        event.preventDefault()
        set(fromString(url))
      })
    }
  
    subscribe($route => {
      if ($route.toString() !== fromString(window.location).toString()) {
        delayed(delay, () => {
          history.pushState({}, null, $route.toString())
        })
      }
    })
  }

  return {
    subscribe,
    set,
    update,
    goto: url => set(fromString(url))
  }
}