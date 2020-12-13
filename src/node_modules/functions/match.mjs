import regexparam from 'regexparam'

function exec(path, result) {
  let i=0, out={};
  let matches = result.pattern.exec(path);
  while (i < result.keys.length) {
    out[ result.keys[i] ] = decodeURIComponent(matches[++i]) || null;
  }
  return out;
}

export default function(pattern, path, loose = false) {
  const result = regexparam(pattern, loose)

  if (result.pattern.test(path)) {
    return exec(path, result)
  } else {
    return null
  }
}