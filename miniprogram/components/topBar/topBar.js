const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    naviBack: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navibarStyle: app.globalData.navibarStyle
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onNaviBack() {
      wx.navigateBack()
    }
  }
})
