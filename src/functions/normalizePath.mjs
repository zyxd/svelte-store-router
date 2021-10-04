export default function(path) {
  path = path.toLowerCase()
  path = path.replace(/\/+/g, '/')
  path = path.replace(/\/$/, '')

  if (path.charAt(0) !== '/') {
    path = '/' + path
  }

  return path
}