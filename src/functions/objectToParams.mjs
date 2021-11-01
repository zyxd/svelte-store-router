import { always, compose, concat, equals, ifElse, is, isEmpty, join, map, not, reject, toPairs, when } from 'rambda'
import cleanObject from './cleanObject.mjs'

export default (clean, hideBoolean) => compose(
  ifElse(
    compose(not, isEmpty),
    compose(
      join('&'),
      map(join('=')),
      map(map(encodeURIComponent)),
      when(always(hideBoolean), map(reject(is(Boolean)))),
      toPairs,
      when(always(hideBoolean), reject(equals(false)))
    ),
    always('')
  ),
  when(
    always(clean),
    cleanObject
  )
)