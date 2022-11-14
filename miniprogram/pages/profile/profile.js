// pages/profile/profile.js
import { menus, privacy, about } from './static/index'
import Toast from '@vant/weapp/toast/toast'

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    themeCss: app.globalData.themeCss,
    navibarStyle: app.globalData.navibarStyle,
    popupContent: '',
    isPopupShow: false,
    profile: app.globalData.profile,
    menus: menus,
    //
    isCustomShow: true
  },
  //   async onRefreshHandler() {
  //     await getUserProfile()
  //     this.setData({
  //       profile: app.globalData.profile
  //     })
  //   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData.profile)
    this.setData({
      profile: app.globalData.profile,
      isCustomShow: false //getBoundingClientRect
    })
  },
  onReady() {},
  onShow() {
    this.setData({
      profile: app.globalData.profile
    })
    console.log(this.data.profile.avatarUrl)
  },
  //popup
  onClose() {
    this.setData({ isPopupShow: false })
  },
  showPopup(e) {
    switch (e.currentTarget.dataset.title) {
      case '用户服务条款':
        this.setData({
          popupContent: privacy,
          isPopupShow: true
        })
        break

      case '关于':
        this.setData({
          popupContent: about,
          isPopupShow: true
        })
        break
      case '个性设置':
        this.setData({
          isCustomShow: true
        })
        break
      case '清除缓存':
        wx.clearStorageSync()
        Toast({
          type: 'success',
          message: '清除成功,请重新登录',
          onClose: () => {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        })
        break
    }
  },
  onCssUpdated(e) {
    this.setData({
      themeCss: e.detail.themeCss
    })
    Toast('部分颜色重新进入小程序后生效')
  }
})
