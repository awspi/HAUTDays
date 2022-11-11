// 云函数入口文件
const cloud = require('wx-server-sdk')
//
const superagent = require('superagent')
const { RSAKey } = require('./utils/rsa')
const { b64tohex, hex2b64 } = require('./utils/encode/base64')
const { getStr, guid } = require('./utils/str')
const { genCardStyle } = require('./utils/style')

let agent = null

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
  //score
  const scores = await getScore(xh)
  return {
    status: 'ok',
    msg: '获取成功',
    data: {
      scores
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
  const tokenArr = reg.exec(res2.text)
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
