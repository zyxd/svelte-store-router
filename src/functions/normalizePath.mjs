export default function(path) {
  if (path === '') {
    return '/'
  }

  path = path.toLowerCase()

  if (path.charAt(0) !== '/') {
    path = '/' + path
  }

  return path
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
}