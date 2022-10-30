// app.js
import {genCardStyle,assortLessons} from './utils/schedule'
import {getCurrentWeek} from './utils/time'

App({
  globalData: {
    termRange:wx.getStorageSync('key'),
    currentWeek:1
  },
    onLaunch() {
    //初始化云开发
    wx.cloud.init({
    env:"schoolepmpic-9ag8l",
    traceUser:true
    })
    //获取学期开始和结束日期
    const termRange=wx.getStorageSync('termRange')||['2022-08-2','2022-08-2']
    this.globalData.termRange=termRange
    //获取当前周
    this.globalData.currentWeek=getCurrentWeek(termRange[0],termRange[1])
    //获取课程
    this.globalData.lessons =wx.getStorageSync('lessons')
    //用户信息
    this.globalData.profile=wx.getStorageSync('profile')||{}
    //
    wx.cloud.callFunction({
        name: 'test',
        data:{
            a:1
        }
    }).then(err=>{
        console.log(err);
    })

    // 登录

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
})
