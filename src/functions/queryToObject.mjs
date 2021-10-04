import { compose, fromPairs, isNil, map, reject, replace, split } from 'rambda'

export default compose(
  map(decodeURIComponent),
  reject(isNil),
  fromPairs,
  map(split('=')),
  split('&'),
  replace(/^\?/, '')
)