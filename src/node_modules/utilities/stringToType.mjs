import { always, both, compose, cond, equals, identity, is, not, toLower, trim, when } from 'rambda'

export default when(
  is(String),
  cond([
    [compose(equals('true'), toLower), always(true)],
    [compose(equals('false'), toLower), always(false)],
    [compose(equals('undefined'), toLower), always(undefined)],
    [compose(equals('null'), toLower), always(null)],
    [
      both(
        compose(not, equals(''), trim),
        compose(not, Number.isNaN, Number)
      ),
      Number
    ],
    [always(true), identity]
  ])
)