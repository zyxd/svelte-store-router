let timer

export default function(ms, callback) {
  if (timer) {
    clearTimeout(timer)
  }

  if (ms > 200) {
    timer = setTimeout(callback, ms)
  } else {
    callback()
  }
}