import { compose, concat, isEmpty, not, when } from 'rambda'
import objectToParams from './objectToParams.mjs'

export default compose(
  when(
    compose(not, isEmpty),
    concat('?')
  ),
  objectToParams
)