// pages/login/login.js
import Toast from '@vant/weapp/toast/toast'
import { getAvatarUrl } from '../../utils/user'
import { getCurrentWeek } from '../../utils/time'
import { getData } from '../../api/stu'
import { getUserInfo } from '../../api/user'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    themeCss: app.globalData.themeCss,
    loading: false,
    xh: '',
    password: '',
    isPwdHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const loginForm = wx.getStorageSync('loginForm')
    this.setData({
      xh: loginForm.xh,
      password: loginForm.password
    })
  },
  /**
   * 登录
   * @param {} e
   */
  async onLoginCLick(e) {
    if (this.data.loading) return
    this.setData({
      loading: true
    })
    //获取课程
    try {
      const { status, msg, data } = await getData(
        this.data.xh,
        this.data.password
      )
      console.log(status)
      //如果登录成功 把登录信息保存到本地
      if (status === 'ok') {
        this.loginDoneHandler(data)
        Toast({
          type: 'success',
          message: msg,
          onClose: () => {
            wx.navigateBack()
          }
        })
      } else {
        //登录失败
        Toast.fail(msg)
      }
      this.setData({
        loading: false
      })
    } catch (err) {
      console.log(err)
      Toast.fail('error')
      this.setData({
        loading: false
      })
    }
  },
  async loginDoneHandler(data) {
    wx.setStorageSync('loginForm', {
      xh: this.data.xh,
      password: this.data.password
    })
    //lessons
    app.globalData.lessons = data.lessons
    wx.setStorageSync('lessons', app.globalData.lessons)
    //profile
    app.globalData.profile = Object.assign(
      app.globalData.profile || {},
      data.profile
    )
    wx.setStorageSync('profile', app.globalData.profile)
    //scores
    app.globalData.scores = data.scores
    wx.setStorageSync('scores', app.globalData.scores)
    //termRange
    app.globalData.termRange = data.termRange
    wx.setStorageSync('termRange', app.globalData.termRange)
    //currentWeek
    app.globalData.currentWeek = getCurrentWeek(
      data.termRange[0],
      data.termRange[1]
    )
    //bg_url
    const { bg_url } = await getUserInfo()
    console.log(bg_url)
    wx.setStorageSync('style', {
      blur: 0.5,
      opacity: 0.8,
      bg_url: bg_url
        ? bg_url
        : 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a55c234-d419-42b9-98d8-4733827bec98/afd78fd9-df9e-4d6e-b2a0-2b1724dd5085.jpeg'
    })
    //
    !wx.getStorageSync('color') &&
      wx.setStorageSync('color', {
        theme: 'rgb(21, 94, 178)',
        font: 'rgb(255,151,5)',
        bg: 'rgb(21, 94, 178)'
      })
    !wx.getStorageSync('preference') &&
      wx.setStorageSync('preference', {
        isUseBgColor: true
      })
    this.globalData.isUseBgColor =
      wx.getStorageSync('preference').isUseBgColor || true
  },
  /**
   * ?被点击
   */
  onIconClick() {
    console.log('?被点击')
  },
  /**
   * 获取头像回调
   */
  onChooseavatar: getAvatarUrl,

  /**
   * 使用须知 被点击
   */
  onInstructionClick() {
    console.log('使用须知 被点击')
  },
  /**
   * isPwdHidden
   */
  tigglePwdHidden() {
    this.setData({
      isPwdHidden: !this.data.isPwdHidden,
      password: this.data.password
    })
  }
})
