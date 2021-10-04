import { parse } from 'regexparam'

function exec(path, { pattern, keys }) {
  let i = 0
  let output = {}
  let matches = pattern.exec(path)
  
  while (i < keys.length) {
    output[keys[i]] = decodeURIComponent(matches[++i]) || null
  }

  return output
}

export default function({ path }, pattern = '*', loose = false) {
  if (path === '') {
    return null
  }

  const result = parse(pattern, loose)

  if (result.pattern.test(path)) {
    return exec(path, result)
  } else {
    return null 
  }
}