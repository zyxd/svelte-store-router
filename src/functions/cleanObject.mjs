import { either, equals, isNil, reject } from 'rambda'

export default reject(
  either(
    isNil,
    equals('')
  )
)