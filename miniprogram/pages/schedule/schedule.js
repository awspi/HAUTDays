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
    navibarStyle: app.globalData.navibarStyle,
    //
    themeCss: app.globalData.themeCss,
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
    isUseBgColor: wx.getStorageSync('preference').isUseBgColor,
    bgStyle_ImgUrl: '',
    bgStyle_blur: '',
    bgStyle_color: '',

    cardStyle: ''
  },

  /**
   * 切换周
   */
  onPopupClick() {
    this.setData({
      isPopupShow: !this.data.isPopupShow
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
  onShow() {
    this.setStyle()
  },
  /**
   * 设置背景和格子css
   */
  setStyle() {
    console.log('设置背景&css')
    const { blur, opacity, bg_url } = wx.getStorageSync('style')
    console.log({ blur, opacity, bg_url })
    this.setData({
      cardStyle: `--card-opacity:${opacity};`,
      bgStyle_blur: `--bg-img-blur:${blur}px;`,
      bgStyle_ImgUrl: `--bg-img-url:url("${bg_url}");`
    })
  },
  updateSchedule(e) {
    const { blur, opacity, bg_url } = e.detail
    console.log({ blur, opacity, bg_url })
    this.setData({
      cardStyle: `--card-opacity:${opacity};`,
      bgStyle_blur: `--bg-img-blur:${blur}px;`,
      bgStyle_ImgUrl: `--bg-img-url:url("${bg_url}");`
    })
  },

  updateBgColor(e) {
    const { bgColor } = e.detail

    this.setData({
      bgStyle_color: `--bg-color:${bgColor};`
    })
    console.log(this.data.bgStyle_color)
  },
  //更新主题色 文字颜色 课程表背景色
  updateThemeCss(e) {
    this.setData({
      themeCss: e.detail.themeCss
    })
  },
  changeIsUseBgColor(e) {
    this.setData({
      isUseBgColor: e.detail.isUseBgColor
    })
  },
  /**
   * 每次打开
   */
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
  },
  preventdefault: function () {}
})
