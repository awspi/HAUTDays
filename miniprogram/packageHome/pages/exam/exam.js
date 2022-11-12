import Toast from '@vant/weapp/toast/toast'
import { getExamArrange } from './utils/index'
import { getExam } from '../../../api/stu'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    examsArrange: {},
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const exams = wx.getStorageSync('exams') || []

    if (exams.length === 0) {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '获取中...'
      })

      this.getExams()
    } else {
      this.setData({
        examsArrange: getExamArrange(exams)
      })
    }
  },
  onUpdateclick() {
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '获取中...'
    })
    this.getExams()
  },
  async getExams() {
    const profile = wx.getStorageSync('loginForm')
    try {
      const { status, msg, data } = await getExam(profile.xh, profile.password)
      //如果登录成功 把登录信息保存到本地
      if (status === 'ok') {
        wx.setStorageSync('exams', data.exams)
        this.setData({
          examsArrange: getExamArrange(data.exams)
        })
        Toast.clear()
        Toast.success('获取成功')
      }
    } catch (err) {
      console.log(err)
      Toast.fail('error')
      this.setData({
        loading: false
      })
    }
  },
  onNaviBack() {
    wx.navigateBack()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
