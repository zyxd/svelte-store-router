import { parse } from 'regexparam'
import normalizePath from './normalizePath.mjs'

function exec(path, { pattern, keys }) {
  let i = 0
  let output = {}
  let matches = pattern.exec(path)
  
  while (i < keys.length) {
    output[keys[i]] = decodeURIComponent(matches[++i]) || null
  }

  return output
}

export default function({ path, base }, pattern = '*', loose = false) {
  const result = parse(pattern, loose)

  path = normalizePath(path)
  base = normalizePath(base)

  if (path.indexOf(base) === 0) {
    path = normalizePath(path.slice(base.length))
  } else {
    return null
  }

  if (result.pattern.test(path)) {
    return exec(path, result)
  } else {
    return null 
  }
}