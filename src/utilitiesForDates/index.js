export function getIntervalsBetweenDates (dates) {
  let intervals = []
  dates.forEach((date, index) => {
    let nextDate = dates[index + 1]
    if (nextDate) intervals.push(nextDate - date)
  })
  return intervals
}
