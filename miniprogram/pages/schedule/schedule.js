// pages/schedule/schedule.js
import { timeFormat, genWeekDates } from '../../utils/time'
import { courseTime } from './static/index'
import Dialog from '@vant/weapp/dialog/dialog'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], //周
    courseTime: courseTime,
    showWeekDates: genWeekDates(), //展示的7个日期
    today: timeFormat(new Date()), //当天日期
    showWeek: app.globalData.currentWeek, //展示的周数
    currentWeek: app.globalData.currentWeek, //现在的周数
    showMonth: null, //当前月份
    isSwitchingWeek: true, //是否展开切换周
    //
    isPopupShow: false,
    //
    showDetail: 0, //弹出层 课程的info
    isDetailCardVisible: false, //控制课程详情弹窗
    //
    totalLessons: app.globalData.lessons,
    //
    isAddLessonDialogVisible: false,
    selectedLesson: {},

    //背景
    bgStyle_ImgUrl: '',
    bgStyle_blur: '',
    cardStyle: ''
  },

  /**
   * 切换周
   */
  onPopupClick() {
    this.setData({
      isPopupShow: true
    })
  },
  onSwitchWeekHandler() {
    this.setData({
      isSwitchingWeek: !this.data.isSwitchingWeek
    })
  },
  /**
   * 通过scroll-view改变
   */
  onChangeWeek(e) {
    const index = e.detail.current
    const date = new Date()
    const diff = index + 1 - this.data.currentWeek
    date.setDate(date.getDate() + diff * 7)
    this.setData({
      showWeek: index + 1,
      showWeekDates: genWeekDates(date),
      showMonth: date.getMonth() + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //一个bug
    this.setData({
      // showsLessons: [app.globalData.currentWeek-1],
      isSwitchingWeek: false, //隐藏切换周
      showWeek: app.globalData.currentWeek,
      showMonth: new Date().getMonth() + 1
    })

    this.setStyle()
  },
  /**
   * 设置背景和格子css
   */
  setStyle() {
    console.log('设置背景&css')
    const { blur, opacity } = wx.getStorageSync('style')
    const url = wx.getStorageSync('style_bgUrl')
    this.setData({ bgStyle_blur: `--bg-img-blur:${blur}px;` })
    this.setData({
      bgStyle_ImgUrl: `
        --bg-img-url:url("${url}");`
    })
    this.setData({ cardStyle: `--card-opacity:${opacity};` })
  },
  updateBlurOpacity(e) {
    const { blur, opacity } = e.detail
    console.log({ blur, opacity })
    this.setData({ cardStyle: `--card-opacity:${opacity};` })
    this.setData({ bgStyle_blur: `--bg-img-blur:${blur}px;` })
  },
  updateBgUrl(e) {
    const { blur } = e.detail
    const url = wx.getStorageSync('style_bgUrl')
    this.setData({
      bgStyle_ImgUrl: `--bg-img-blur:${blur}px;
        --bg-img-url:url("${url}");`
    })
  },
  onShow() {
    this.setData({
      showWeek: app.globalData.currentWeek, //展示的周数
      currentWeek: app.globalData.currentWeek, //现在的周数
      totalLessons: app.globalData.lessons
    })
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
   * 显示课程详情
   */
  showDetailCard(e) {
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      isDetailCardVisible: true,
      showDetail: e.currentTarget.dataset.detail
    })
  },
  /**
   * 滑动切换页
   */
  onChangePage(e) {
    const index = e.detail.current
    const source = e.detail.source
    console.log('switch week to ', index + 1)
    if (source !== 'touch') {
      return
    }
    //更新显示的日期
    const date = new Date()
    const diff = index + 1 - this.data.currentWeek
    console.log(index + 1, this.data.currentWeek, diff)
    date.setDate(date.getDate() + diff * 7)
    this.setData({
      showWeekDates: genWeekDates(date),
      //更新页面
      showWeek: index + 1,
      showMonth: date.getMonth() + 1
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  /**
   * 背景被长按,新增课程
   */
  onBgLongpress() {
    wx.vibrateShort({
      type: 'light'
    })
    console.log('背景被长按,新增课程')
    this.setData({
      isAddLessonDialogVisible: true,
      selectedLesson: {}
    })
  },
  //新增课程完成的回调
  onAddLessonDone() {
    this.setData({
      isAddLessonDialogVisible: false,
      totalLessons: app.globalData.lessons,
      selectedLesson: {}
    })
  }, //
  /**
   * 课程被长按,修改课程
   */
  onCardLongpress(e) {
    wx.vibrateShort({
      type: 'light'
    })
    console.log('课程被长按,修改课程')
    this.setData({
      isAddLessonDialogVisible: true,
      selectedLesson: e.currentTarget.dataset.detail
    })
  }
})
