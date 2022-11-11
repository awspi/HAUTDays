// 云函数入口文件
const cloud = require('wx-server-sdk')
//
const superagent = require('superagent')
const { RSAKey } = require('./utils/rsa')
const { b64tohex, hex2b64 } = require('./utils/encode/base64')
const { getStr, guid } = require('./utils/str')
const { genCardStyle } = require('./utils/style')

const { LessonsDB } = require('./services/lesson_db')

let agent = null

cloud.init({
  env: 'schoolepmpic-9ag8l'
})
const db = cloud.database()
const lessonsDB = new LessonsDB(db)
/**
 * ! 获取课程 done
 * 1.根据xh在数据库中查询 找到则返回结果 todo
 * 2.找不到,就去教务系统获取 todo
 * 3.获取后保存在数据库 并返回 done
 */

// status,msg,data

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //
  const { xh, mm } = event
  //重制agent
  agent = superagent.agent()
  const loginRes = await login(xh, mm)
  if (loginRes.status === 'error') {
    return loginRes
  }
  const termRange = await getTermRange(xh)
  const lessons = await getLessons(2022, 3, termRange, xh)
  const { college, class_, name } = await getInfo(xh)
  //score
  const scores = await getScore(xh)
  return {
    status: 'ok',
    msg: '获取成功',
    data: {
      termRange,
      lessons,
      scores,
      profile: {
        xh,
        name,
        class: class_,
        college
      }
    }
  }
}

/**
 *  登录 获取登录状态
 * @param {*} xh 学号
 * @param {*} mm 密码
 */
async function login(xh, mm) {
  //! token
  const reg = new RegExp(
    '(?<=<input type="hidden" id="csrftoken" name="csrftoken" value=").*?(?="/>)',
    'g'
  )
  const res2 = await agent
    .get(
      `https://jwglxt.haut.edu.cn/jwglxt/xtgl/login_slogin.html?time=${new Date().getTime()}`
    )
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37'
    )
    .set('Content-Type', 'application/x-www-form-urlencoded')
  tokenArr = reg.exec(res2.text)
  if (!tokenArr) {
    return {
      status: 'error',
      message: '教务系统获取csrftoken失败'
    }
  }
  const csrftoken = tokenArr[0]
  console.log(csrftoken)
  //! modulus, exponent
  const res = await agent
    .get(
      `https://jwglxt.haut.edu.cn/jwglxt/xtgl/login_getPublicKey.html?time=${new Date().getTime()}`
    )
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37'
    )
    .set('Content-Type', 'application/x-www-form-urlencoded')
  const { modulus, exponent } = res.body
  //! encode
  const rsaKey = new RSAKey()
  rsaKey.setPublic(b64tohex(modulus), b64tohex(exponent))
  const pwd = hex2b64(rsaKey.encrypt(mm))
  //! login
  const loginRes = await agent
    .post(
      `https://jwglxt.haut.edu.cn/jwglxt/xtgl/login_slogin.html?time=${new Date().getTime()}`
    )
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37'
    )
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({ language: 'zh_CN' })
    .send({ csrftoken: csrftoken })
    .send({ yhm: xh })
    .send({ mm: pwd })
    .send({ mm: pwd })
  const loginResText = loginRes.text
  if (loginResText.indexOf('用户名或密码不正确，请重新输入！') != -1) {
    console.log('用户名或密码不正确，请重新输入！')
    return {
      status: 'error',
      msg: '学号/密码错误,登录失败'
    }
  } else {
    console.log('登录成功')
    return {
      status: 'ok'
    }
  }
}

/**
 * 获取学期范围 termRange
 */
async function getTermRange(xh) {
  //! 获取学期开始和结束日期
  const term = await agent
    .get(
      'https://jwglxt.haut.edu.cn/jwglxt/xtgl/index_cxAreaFive.html?localeKey=zh_CN&gnmkdm=index&su=' +
        xh
    )
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37'
    )
    .set('Content-Type', 'application/x-www-form-urlencoded')
  const temp = getStr(term.text, '学期(', ')</th>')
  const termRange = temp.substring(1, temp.length - 1).split('至')
  console.log(termRange)
  return termRange
}
/**
 * 获取课程
 */
async function getLessons(xnm, xqm, termRange, xh) {
  const lessonsRes = await agent
    .post(
      'https://jwglxt.haut.edu.cn/jwglxt/kbcx/xskbcx_cxXsgrkb.html?gnmkdm=N2151'
    )
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37'
    )
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({ xnm: xnm })
    .send({ xqm: xqm })
  const rawList = lessonsRes.body.kbList
  // console.log(rawList);//
  const lessons = []
  const lessonNameArr = []
  //生成totalWeeks [] -->activeWeeks
  const totalDays = Math.floor(
    (Date.parse(termRange[1]) - Date.parse(termRange[0])) / 86400000
  )
  const totalWeeks = Math.floor(totalDays / 7) + 1
  rawList.forEach((item, index) => {
    let timeRange
    const activeWeeks = []
    let weekTemp
    //课程节数
    if (item.jcor.includes('-')) {
      //1-2
      const timeTemp = item.jcor.split('-')
      timeRange = [parseInt(timeTemp[0]), parseInt(timeTemp[1])]
    } else {
      //todo 只有一节课 1-1 ?
    }
    //含有此课程的周
    //zcd: "5-7周,9-13周"
    //zcd: "5-13周"
    //zcd: "13周"
    const zcds = item.zcd.split(',')
    zcds.forEach((zcd) => {
      if (zcd.includes('-')) {
        //"5-13周"
        weekTemp = zcd.split('-')
        const weekRange = [
          parseInt(weekTemp[0]),
          parseInt(weekTemp[1].slice(0, -1))
        ]
        for (let i = weekRange[0]; i <= weekRange[1]; i++) {
          activeWeeks.push(i)
        }
      } else {
        // 只有一周  9周
        weekTemp = zcd
        const week = parseInt(weekTemp.slice(0, -1))
        activeWeeks.push(week)
      }
    })

    const raw = {
      id: guid(),
      name: item.kcmc,
      teacher_name: item.xm,
      classroom: item.cdmc,
      time: item.jc,
      credit: item.xf,
      dayOfWeek: item.xqj,
      timeRange,
      activeWeeks,
      custom: false
    }
    //设置唯一的index
    let lessonsUniqueIndex = lessonNameArr.findIndex(
      (name) => name === item.kcmc
    )
    if (lessonsUniqueIndex === -1) {
      lessonsUniqueIndex = lessonNameArr.length
      lessonNameArr.push(item.kcmc)
    }

    Object.assign(raw, {
      startPosition: raw.dayOfWeek + '-' + raw.timeRange[0]
    })
    const styledLesson = genCardStyle(raw, lessonsUniqueIndex)
    lessons.push(styledLesson)
  })

  /**
   * 数据库
   */
  // console.log(lessons);

  //todo
  lessonsDB.saveLessons(lessons, xh)

  //? 生成二维数组
  const lessons_assorted = []
  for (let i = 0; i < totalWeeks; i++) {
    const weekLessons = lessons.filter((item) =>
      item.activeWeeks.includes(i + 1)
    )
    //  weekLessons.length&&coincide(weekLessons)
    lessons_assorted[i] = weekLessons
  }
  return lessons_assorted
}
/**
 * 获取用户信息
 * @param {*} xh 学号
 */
async function getInfo(xh) {
  const infoRes = await agent
    .get(
      'https://jwglxt.haut.edu.cn/jwglxt/xtgl/index_cxYhxxIndex.html?localeKey=zh_CN&su=' +
        xh
    )
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37'
    )
    .set('Content-Type', 'application/x-www-form-urlencoded')
  const raw = infoRes.text
  const tem = getStr(raw, `<p>`, `</p>`)
  const temArr = tem.split(' ')
  const name = getStr(raw, `class="media-heading">`, `</h4>`)
  return {
    name,
    college: temArr[0],
    class_: temArr[1]
  }
}

async function getScore(xh) {
  const scoreRes = await agent
    .post(
      'https://jwglxt.haut.edu.cn/jwglxt/cjcx/cjcx_cxXsgrcj.html?doType=query&gnmkdm=N305005&su=' +
        xh
    )
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37'
    )
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({ xnm: '' })
    .send({ xqm: '' })
    .send({ 'queryModel.showCount': '300' })
  const { items } = JSON.parse(scoreRes.text)
  //kcxzmc 必修课 选修课
  //cj  90 中
  //bfzcj 成绩 纯数字
  //kcmc课程名称
  //xf 学分
  //jd 绩点
  //xnm 学年名2019
  //xqmmc 学期名 1或2    //xqm 学期名? xqm=term*term*3

  //? 处理补考的情况 所有数据带补考字样的信息(<60)不计入到绩点之中
  const Scorelist = []
  items.forEach(({ bfzcj, cj, kcxzmc, kcmc, jd, xf, xnm, xqmmc }) => {
    if (parseInt(bfzcj) >= 60) {
      Scorelist.push({
        scoreNum: parseInt(bfzcj),
        score: cj,
        type: kcxzmc,
        name: kcmc,
        GPA: parseFloat(jd),
        credit: parseFloat(xf),
        year: parseInt(xnm),
        term: parseInt(xqmmc)
      })
    }
  })
  //? todo 含公选课：除去重修课项

  return Scorelist
}

/**
 * todo coincide
 */
function coincide(lessons) {
  const set = new Set()
  lessons.forEach((item) => {
    const { dayOfWeek, timeRange } = item
    set.has()
    set.add([parseInt(dayOfWeek), timeRange[0], timeRange[1]])
  })

  console.log(set)
  // console.log(lessons);
}
