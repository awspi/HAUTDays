// app.js
import { getCurrentWeek } from './utils/time'

App({
  globalData: {
    termRange: wx.getStorageSync('termRange'),
    currentWeek: 1
  },
  onLaunch() {
    //初始化云开发
    console.log(new Date())
    wx.cloud.init({
      env: 'schoolepmpic-9ag8l',
      traceUser: true
    })
    //获取学期开始和结束日期
    const termRange = wx.getStorageSync('termRange') || [
      '2022-08-2',
      '2022-08-2'
    ]
    this.globalData.termRange = termRange
    //获取当前周
    this.globalData.currentWeek = getCurrentWeek(termRange[0], termRange[1])
    //获取课程
    this.globalData.lessons = wx.getStorageSync('lessons')
    //获取成绩
    this.globalData.scores = wx.getStorageSync('scores')
    //用户信息
    this.globalData.profile = wx.getStorageSync('profile') || {}
    //课程表背景 高斯模糊 透明度 字体颜色 主题色
    !wx.getStorageSync('style') &&
      wx.setStorageSync('style', { blur: 0.5, opacity: 0.8 })
    !wx.getStorageSync('style_bgUrl') && wx.setStorageSync('style_bgUrl', '')
    !wx.getStorageSync('color') &&
      wx.setStorageSync('color', {
        theme: 'rgb(251, 103, 142)',
        font: 'rgb(168, 24, 223)',
        bg: 'rgb(232,237,255)'
      })
    !wx.getStorageSync('preference') &&
      wx.setStorageSync('preference', {
        isUseBgColor: true
      })
    this.globalData.isUseBgColor = wx.getStorageSync('preference').isUseBgColor

    this.globalData.themeCss =
      `--theme-color:${wx.getStorageSync('color').theme};` +
      `--bg-color:${wx.getStorageSync('color').bg};` +
      `--text-color:${wx.getStorageSync('color').font};`
    // navi
    // console.log(menuInfo)
    const { statusBarHeight } = wx.getSystemInfoSync()
    // console.log(systemInfo)
    const { height, top } = wx.getMenuButtonBoundingClientRect()
    const navibarStyle = `line-height:${height}px;height:${height}px;padding-top:${top}px;padding-bottom:32rpx`
    this.globalData.navibarStyle = navibarStyle

    //bg

    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }
})
