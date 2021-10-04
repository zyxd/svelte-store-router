import { compose, fromPairs, isEmpty, isNil, map, reject, replace, split } from 'rambda'

export default compose(
  map(decodeURIComponent),
  reject(isNil),
  map(item => item ? item : true),
  fromPairs,
  map(split('=')),
  reject(isEmpty),
  split('&'),
  replace(/^\?|\#/, '')
)