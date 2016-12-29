import Promise from 'bluebird'

export function promiseDelayAtLeast (delay, value) {
  const begin = Date.now()
  return Promise.delay(delay, value).then(function checkTime(v) {
    const duration = Date.now() - begin
    console.log({x: duration < delay, left: delay - duration})
    return duration < delay
      ? Promise.delay(delay - duration, v).then(checkTime)
      : v
  })
}

export function promiseRateLimit (fn, delay, count) {
  let working = 0
  let queue = []
  function work () {
    if ((queue.length === 0) || (working === count)) return
    working++
    promiseDelayAtLeast(delay).tap(() => working--).then(work)
    let {self, args, resolve} = queue.shift()
    resolve(fn.apply(self, args))
  }
  return function debounced (...args) {
    return new Promise(resolve => {
      queue.push({self: this, args, resolve})
      if (working < count) work()
    })
  }
}
