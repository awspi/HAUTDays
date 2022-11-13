import { getWeather } from '../../api/weather'
import { timeFormat } from '../../utils/time'
import { notification, functionList, swiperList } from './static/index'
import Dialog from '@vant/weapp/dialog/dialog'
const dayOfWeek = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]
const dayOfWeekIndex = ['7', '1', '2', '3', '4', '5', '6']
const app = getApp()
import Toast from '@vant/weapp/toast/toast'
//今日课程
const day = new Date().getDay() //周几
const currentWeekLessons =
  app.globalData.lessons[app.globalData.currentWeek - 1]
console.log(app.globalData.lessons)
const todayLessons = currentWeekLessons
  ? currentWeekLessons.filter((item) => item.dayOfWeek === dayOfWeekIndex[day])
  : []

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navibarStyle: app.globalData.navibarStyle,
    // weather degree
    weather: '',
    degree: '',
    today: timeFormat(new Date(), '.'),
    currentWeek: app.globalData.currentWeek,
    dayOfWeek: dayOfWeek[day],
    notice: notification,
    swiperList: swiperList, //轮播图列表
    todayLessons: todayLessons.slice(0, 3),
    overflow: todayLessons.length > 3,
    funcitonList: functionList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      ...(await getWeather())
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //如果没信息 就弹窗
    const loginForm = wx.getStorageSync('loginForm')
    if (!loginForm?.xh) {
      Dialog.alert({
        title: '注意',
        message: '登录后才能使用课程表,请先登录~'
      }).then(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '河工大颜值超高的课表小程序-HAUTDAYS分享给你',
      path: '/pages/home/home'
    }
  },
  onSeeMoreHandler() {
    wx.redirectTo({
      url: '/pages/schedule/schedule'
    })
  },
  onIconHandler(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    } else {
      Toast('开发ing~')
    }
  }
})
