const superagent = require('superagent');
const { RSAKey } = require('./utils/rsa')
const { b64tohex, hex2b64 } = require('./utils/encode/base64')
const {getStr} =require('./utils/str')
const {genCardStyle}= require('./utils/style')


let agent = null
// 云函数入口函数
exports.main = async (event, context) => {
    agent=superagent.agent()
    const xh="201911020101"
    const mm="xiaoli2AL"
    const loginRes=await login(xh,mm)
    if(loginRes.status==="error"){
        return loginRes
    }
    const termRange=await getTermRange(xh)
    const lessons=await getLessons(2022,3,termRange)
    const profile=await getInfo(xh)
    return {
        a:agent,
        b:"11",
        termRange,
        lessons,
        profile
    }
}

/**
 *  登录
 * @param {*} xh 学号
 * @param {*} mm 密码
 */
async function login(xh,mm){
    //! token
    const reg = new RegExp('(?<=<input type="hidden" id="csrftoken" name="csrftoken" value=").*?(?="/>)', 'g')
    const res2 = await agent.get(`https://jwglxt.haut.edu.cn/jwglxt/xtgl/login_slogin.html?time=${new Date().getTime()}`)
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      tokenArr= reg.exec(res2.text)
    if(!tokenArr){
        return {
            status:"error",
            message:"教务系统获取csrftoken失败"
        }
    }
    const csrftoken = tokenArr[0]
    console.log(csrftoken);
    //! modulus, exponent 
    const res = await agent.get(`https://jwglxt.haut.edu.cn/jwglxt/xtgl/login_getPublicKey.html?time=${new Date().getTime()}`)
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37')
      .set('Content-Type', 'application/x-www-form-urlencoded')
    const { modulus, exponent } = res.body
    // console.log(modulus, exponent);
    //! encode
    const rsaKey = new RSAKey()
    rsaKey.setPublic(b64tohex(modulus), b64tohex(exponent))
    const pwd = hex2b64(rsaKey.encrypt(mm));
    // console.log(pwd);
    //! login
    const loginRes = await agent.post(`https://jwglxt.haut.edu.cn/jwglxt/xtgl/login_slogin.html?time=${new Date().getTime()}`)
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .type('form')
      .send({ language: 'zh_CN' })
      .send({ csrftoken: csrftoken })
      .send({ yhm: xh })
      .send({ mm: pwd })
      .send({ mm: pwd })
    const loginResText = loginRes.text
    if (loginResText.indexOf('用户名或密码不正确，请重新输入！') != -1) {
      console.log('用户名或密码不正确，请重新输入！');
      return {
          status:"error",
          msg:"学号/密码错误,登录失败"
      }
    } else {
      console.log('登录成功');
      return {
          status:"ok"
      }
    }
}


/**
 * 获取termRange
 */
async function getTermRange(xh){
    //! 获取学期开始和结束日期
    const term = await agent.get('https://jwglxt.haut.edu.cn/jwglxt/xtgl/index_cxAreaFive.html?localeKey=zh_CN&gnmkdm=index&su=' + xh)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37')
        .set('Content-Type', 'application/x-www-form-urlencoded')
    const temp = getStr(term.text, '学期(', ')</th>')
    const termRange = temp.substring(1, temp.length - 1).split('至')
    console.log(termRange);
    return termRange
}
/**
 * 获取课程
 */
async function getLessons(xnm,xqm,termRange) {
    const lessonsRes = await agent.post('https://jwglxt.haut.edu.cn/jwglxt/kbcx/xskbcx_cxXsgrkb.html?gnmkdm=N2151')
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({ xnm: xnm})
    .send({ xqm: xqm })
    const rawList=lessonsRes.body.kbList
    const lessons = []
    rawList.forEach((item,index) => {
        const raw={
            name: item.kcmc,
            teacher_name: item.xm,
            classroom: item.cdmc,
            time: item.jc,
            credit: item.xf,
            dayOfWeek: item.xqj,
            timeRange: [parseInt(item.jcor.split('-')[0]), parseInt(item.jcor.split('-')[1])],
            weekRange: [parseInt(item.zcd.split('-')[0]), parseInt(item.zcd.split('-')[1].slice(0, -1))],
        }
        
        const styledLesson= genCardStyle(raw,index)
        lessons.push(styledLesson)
        // lessons.push(item)
    })
    const totalDays = Math.floor((Date.parse(termRange[1]) - Date.parse(termRange[0])) / 86400000)
    const totalWeeks = Math.floor(totalDays / 7) + 1

    //? 生成二维数组
    const lessons_assorted = []
    for (let i = 0; i < totalWeeks; i++) {
      lessons_assorted[i] = lessons.filter(item => {
          return i >= item.weekRange[0] && i <= item.weekRange[1]
      })
    }
    return lessons_assorted
}
async function getInfo(xh){
    const infoRes = await agent.get('https://jwglxt.haut.edu.cn/jwglxt/xtgl/index_cxYhxxIndex.html?localeKey=zh_CN&su=' + xh)
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    const raw=infoRes.text
    const tem = getStr(raw, `<p>`, `</p>`)
    const temArr=tem.split(' ')
    const name=getStr(raw, `class="media-heading">`, `</h4>`)
    return {
        name,
        college: temArr[0],
        class_:temArr[1]
    }
}

