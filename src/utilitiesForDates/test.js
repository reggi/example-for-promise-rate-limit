import Promise from 'bluebird'
import test from 'ava'
import {getIntervalsBetweenDates} from './index'
import {filter} from 'lodash'
import {arraySum} from '../utilitiesForArrays'

test('getIntervalsBetweenDates 200 intv', async (t) => {
  let timeLog = []
  let bufferInterval = 200
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  const intervals = getIntervalsBetweenDates(timeLog)
  const invalidIntervals = filter(intervals, (interval) => interval < bufferInterval)
  const totalTime = arraySum(intervals)
  t.is(intervals.length, 5)
  t.deepEqual(invalidIntervals, [])
  t.deepEqual(totalTime >= (bufferInterval * 5), true)
})

test('getIntervalsBetweenDates 100 intv', async (t) => {
  let timeLog = []
  let bufferInterval = 100
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  timeLog.push(new Date())
  await Promise.delay(bufferInterval)
  const intervals = getIntervalsBetweenDates(timeLog)
  const invalidIntervals = filter(intervals, (interval) => interval < bufferInterval)
  const totalTime = arraySum(intervals)
  t.is(intervals.length, 5)
  t.deepEqual(invalidIntervals, [])
  t.deepEqual(totalTime >= (bufferInterval * 5), true)
})
