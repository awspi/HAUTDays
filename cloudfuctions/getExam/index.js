// 云函数入口文件
const cloud = require('wx-server-sdk')
//
const superagent = require('superagent');
const { RSAKey } = require('./utils/rsa')
const { b64tohex, hex2b64 } = require('./utils/encode/base64')


let agent = null

cloud.init({
  env: 'schoolepmpic-9ag8l'
})
const db=cloud.database()
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
    const {xh,mm}=event
    //重制agent
    agent=superagent.agent()
    const loginRes=await login(xh,mm)
    if(loginRes.status==="error"){
        return loginRes
    }

    //score
    const exams= await getExam(xh)
    return {
        status:"ok",
        msg:"获取成功",
        data:{
            exams
        }
    }
}


/**
 *  登录 获取登录状态
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
    //! encode
    const rsaKey = new RSAKey()
    rsaKey.setPublic(b64tohex(modulus), b64tohex(exponent))
    const pwd = hex2b64(rsaKey.encrypt(mm));
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
 * 获取考试安排 
 */
async function getExam(xh) {
    const scoreRes = await agent.post('https://jwglxt.haut.edu.cn/jwglxt/kwgl/kscx_cxXsksxxIndex.html?doType=query&gnmkdm=N358105&su='+xh)
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({"xnm":""})
    .send({"xqm":""})
    .send({"queryModel.showCount": "300"})
    const {items}=JSON.parse(scoreRes.text)

    //xnm 学年名2019
    //xqmmc 学期名 1或2    //xqm 学期名? xqm=term*term*3
    const examList= items.map(({kcmc,kssj,cdmc,zwh,xnm,xqmmc})=>({
        name:kcmc,
        date:kssj,
        classroom:cdmc,
        seat:zwh,
        year:xnm,
        term:xqmmc
    }))
    
    return examList
}
