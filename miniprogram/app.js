// app.js
import {genCardStyle,assortLessons} from './utils/schedule'
import {getCurrentWeek} from './utils/time'

App({
  globalData: {
    termRange:wx.getStorageSync('termRange'),
    currentWeek:1
  },
    onLaunch() {
    //初始化云开发
    console.log(new Date());
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
    //获取成绩
    this.globalData.scores =wx.getStorageSync('scores')
    //用户信息
    this.globalData.profile=wx.getStorageSync('profile')||{}
    //课程表背景 高斯模糊 透明度
    !wx.getStorageSync('style')&&wx.setStorageSync('style', {blur:0,opacity:1})
    !wx.getStorageSync('style_bgUrl')&&wx.setStorageSync('style_bgUrl', "")
    // 登录
    //bg
    

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
})
