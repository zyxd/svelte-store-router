import { always, compose, ifElse, isEmpty, join, map, not, toPairs } from 'rambda'

export default ifElse(
  compose(not, isEmpty),
  compose(
    join('&'),
    map(join('=')),
    map(map(encodeURIComponent)),
    toPairs
  ),
  always('')
)