import test from 'ava'
import Promise from 'bluebird'
import {promiseRateLimit, promiseDelayAtLeast} from './index'
import {getIntervalsBetweenDates} from '../utilitiesForDates'
import {arraySum} from '../utilitiesForArrays'
import {filter} from 'lodash'

test('using async await', async (t) => {
  let timeLog = []
  let runCount = 0
  let bufferInterval = 100
  let promisesLength = 4
  const example = v => {
    timeLog.push(new Date())
    runCount++
    return promiseDelayAtLeast(50, v)
  }
  const exampleLimited = promiseRateLimit(example, bufferInterval, 1)
  const alpha = await exampleLimited('alpha')
  const beta = await exampleLimited('beta')
  const gamma = await exampleLimited('gamma')
  const epsilon = await exampleLimited('epsilon')
  const phi = await exampleLimited('phi')
  const intervals = getIntervalsBetweenDates(timeLog)
  const invalidIntervals = filter(intervals, (interval) => interval < bufferInterval)
  const totalTime = arraySum(intervals)
  t.is(runCount, promisesLength + 1)
  t.is(intervals.length, promisesLength)
  t.deepEqual(invalidIntervals, [])
  t.deepEqual(totalTime >= bufferInterval * promisesLength, true)
  t.is(alpha, 'alpha')
  t.is(beta, 'beta')
  t.is(gamma, 'gamma')
  t.is(epsilon, 'epsilon')
  t.is(phi, 'phi')
})

test('using Promise.props with 2 promises', async (t) => {
  let timeLog = []
  let runCount = 0
  let bufferInterval = 100
  let promisesLength = 1
  const example = v => {
    timeLog.push(new Date())
    runCount++
    return promiseDelayAtLeast(50, v)
  }
  const exampleLimited = promiseRateLimit(example, bufferInterval, 1)
  const results = await Promise.props({
    'alpha': exampleLimited('alpha'),
    'beta': exampleLimited('beta')
  })
  const intervals = getIntervalsBetweenDates(timeLog)
  const invalidIntervals = filter(intervals, (interval) => interval < bufferInterval)
  const totalTime = arraySum(intervals)
  t.is(runCount, promisesLength + 1)
  t.is(intervals.length, promisesLength)
  t.deepEqual(invalidIntervals, [])
  t.deepEqual(totalTime >= bufferInterval * promisesLength, true)
  t.is(results.alpha, 'alpha')
  t.is(results.beta, 'beta')
})

test('using Promise.props with 4 promises', async (t) => {
  let timeLog = []
  let runCount = 0
  let bufferInterval = 100
  let promisesLength = 3
  const example = v => {
    timeLog.push(new Date())
    runCount++
    return promiseDelayAtLeast(200, v)
  }
  const exampleLimited = promiseRateLimit(example, bufferInterval, 1)
  const results = await Promise.props({
    'alpha': exampleLimited('alpha'),
    'beta': exampleLimited('beta'),
    'gamma': exampleLimited('gamma'),
    'delta': exampleLimited('delta')
  })
  const intervals = getIntervalsBetweenDates(timeLog)
  const invalidIntervals = filter(intervals, (interval) => interval < bufferInterval)
  const totalTime = arraySum(intervals)
  t.is(runCount, promisesLength + 1)
  t.is(intervals.length, promisesLength)
  t.deepEqual(invalidIntervals, [])
  t.deepEqual(totalTime >= bufferInterval * promisesLength, true)
  t.is(results.alpha, 'alpha')
  t.is(results.beta, 'beta')
  t.is(results.gamma, 'gamma')
  t.is(results.delta, 'delta')
})

test('using Promise.props with 12 promises', async (t) => {
  let timeLog = []
  let runCount = 0
  let bufferInterval = 200
  let promisesLength = 11
  const example = v => {
    timeLog.push(new Date())
    runCount++
    return promiseDelayAtLeast(200).then(() => v)
  }
  const exampleLimited = promiseRateLimit(example, bufferInterval, 1)
  const results = await Promise.props({
    'a': exampleLimited('a'),
    'b': exampleLimited('b'),
    'c': exampleLimited('c'),
    'd': exampleLimited('d'),
    'e': exampleLimited('e'),
    'f': exampleLimited('f'),
    'g': exampleLimited('g'),
    'h': exampleLimited('h'),
    'i': exampleLimited('i'),
    'j': exampleLimited('j'),
    'k': exampleLimited('k'),
    'l': exampleLimited('l')
  })
  const intervals = getIntervalsBetweenDates(timeLog)
  const invalidIntervals = filter(intervals, (interval) => interval < bufferInterval)
  const totalTime = arraySum(intervals)
  t.is(runCount, promisesLength + 1)
  t.is(intervals.length, promisesLength)
  t.deepEqual(invalidIntervals, [])
  t.deepEqual(totalTime >= bufferInterval * promisesLength, true)
  t.is(results.a, 'a')
  t.is(results.b, 'b')
  t.is(results.c, 'c')
  t.is(results.d, 'd')
})
