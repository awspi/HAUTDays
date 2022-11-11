function timeFormat(date, divider = '/') {
  if (!date || typeof date === 'string') {
    this.error('参数异常，请检查...')
  }
  const m = date.getMonth() + 1 //月
  const d = date.getDate() //日

  return m + divider + d
}
function getFirstDayOfWeek(date, offset = 0) {
  //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
  var weekday = date.getDay() || 7
  date.setDate(date.getDate() - weekday + 1 + offset) //往前算（weekday-1）天，年份、月份会自动变化
  return timeFormat(date)
}
function getCurrentWeek(termStartDateStr, termEndDateStr) {
  const totalDays = Math.floor(
    (Date.parse(termEndDateStr) - Date.parse(termStartDateStr)) / 86400000
  )
  //fix:修复8小时时差
  const today = new Date()
  today.setHours(today.getHours() + 8)
  const pastDays = (today - Date.parse(termStartDateStr)) / 86400000
  return Math.floor((totalDays / 7) * (pastDays / totalDays)) + 1
}
function getTotalWeeks(termStartDateStr, termEndDateStr) {
  const totalDays = Math.floor(
    (Date.parse(termEndDateStr) - Date.parse(termStartDateStr)) / 86400000
  )
  const totalWeeks = Math.floor(totalDays / 7) + 1
  return totalWeeks
}
/**
 * 生成显示的7天
 */
function genWeekDates(date = new Date()) {
  console.log(date)
  const arr = []
  for (let i = 0; i < 7; i++) {
    arr[i] = getFirstDayOfWeek(date, i)
  }
  return arr
}

/**
 * 获取可选结束节数组
 *
 */
function genLimitedTime(startTime, length = 10) {
  const arr = []
  for (let i = startTime; i <= length; i++) {
    arr.push(`第${i}节`)
  }
  return arr
}
module.exports = {
  genWeekDates,
  timeFormat,
  getFirstDayOfWeek,
  getCurrentWeek,
  getTotalWeeks,
  genLimitedTime
}
