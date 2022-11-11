function getPieData(scores) {
  //平均绩点=学分*绩点/学分之和
  let averageGPA = 0
  let totalGPA = 0
  let totalCredit = 0
  //pie
  const pieData = [
    { value: 0, name: '差' },
    { value: 0, name: '及格' },
    { value: 0, name: '中' },
    { value: 0, name: '良' },
    { value: 0, name: '优' }
  ]
  scores.forEach((score) => {
    totalGPA += score.GPA * score.credit
    totalCredit += score.credit
    //pieData
    let gpa = score.GPA
    if (gpa >= 4) {
      pieData[4].value++
    }
    if (gpa < 4 && gpa >= 3) {
      pieData[3].value++
    }
    if (gpa < 3 && gpa >= 2) {
      pieData[2].value++
    }
    if (gpa < 2 && gpa >= 1) {
      pieData[1].value++
    }
    if (gpa < 1) {
      pieData[0].value++
    }
  })
  averageGPA = parseFloat(totalGPA / totalCredit).toFixed(2)

  return {
    averageGPA,
    pieData
  }
}
function getLineData(scores) {
  //yearRange
  const obj = {}
  scores.forEach((score) => {
    const key = ('' + score.year).slice(2) + '-' + score.term
    //如果是首次 就初始化
    if (!Object.keys(obj).includes(key)) {
      obj[key] = {}
    }
    if (!Object.keys(obj[key]).includes('totalGPA')) {
      obj[key].totalGPA = 0
      obj[key].totalCredit = 0
    }
    obj[key].totalGPA += score.GPA * score.credit
    obj[key].totalCredit += score.credit
  })
  for (const prop in obj) {
    const { totalGPA, totalCredit } = obj[prop]
    obj[prop].averageGPA = parseFloat(totalGPA / totalCredit).toFixed(2)
  }
  return {
    xAxisData: Object.keys(obj),
    data: Object.values(obj).map((item) => parseFloat(item.averageGPA))
  }
}
function getYearOption(scores) {
  if (!scores.length) return []
  const set = new Set()
  //时间靠后显示在前
  scores.reverse().forEach((item) => {
    set.add(item.year)
  })
  const arr = []
  set.forEach((item) => {
    arr.unshift({
      text: '' + item,
      value: item
    })
  })
  return arr
}
/**
 * 根据条件筛选成绩
 * @param {*} scores
 * @param {*} year
 * @param {*} term
 * @param {*} includePublic
 */
function filterScore(scores, year, term, includePublic) {
  return scores.filter((item) => {
    if (year === 'all') {
      if (term === 'all') {
        if (!includePublic) {
          return item.type === '必修课'
        } else {
          return true
        }
      } else {
        if (!includePublic) {
          return item.type === '必修课' && item.term === term
        } else {
          return item.term === term
        }
      }
    } else {
      if (term === 'all') {
        if (!includePublic) {
          return item.type === '必修课' && item.year === year
        } else {
          return item.year === year
        }
      } else {
        if (!includePublic) {
          return (
            item.type === '必修课' && item.year === year && item.term === term
          )
        } else {
          return item.year === year && item.term === term
        }
      }
    }
  })
}
/**
 * 获取以学年为key的对象
 * @param {*} scores
 */
function getSchoolReport(scores) {
  if (!scores.length) {
    return {}
  }
  const obj = {}
  //为了让最近的学期显示在前面
  scores.reverse().forEach((score) => {
    const key = ('' + score.year).slice(2) + '-' + score.term
    //如果是首次 就初始化
    if (!Object.keys(obj).includes(key)) {
      obj[key] = []
    }
    obj[key].unshift(score) //unshift 倒序 让后出的成绩显示在前面
  })
  return obj
}
module.exports = {
  getPieData,
  getLineData,
  getYearOption,
  filterScore,
  getSchoolReport
}
