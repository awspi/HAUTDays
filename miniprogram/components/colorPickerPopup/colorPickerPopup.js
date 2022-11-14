const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    theme: {
      type: Boolean,
      value: false
    },
    font: {
      type: Boolean,
      value: false
    },
    bg: {
      type: Boolean,
      value: false
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    themeCss: app.globalData.themeCss,
    theme_rgb: wx.getStorageSync('color').theme,
    font_rgb: wx.getStorageSync('color').font,
    bg_rgb: wx.getStorageSync('color').bg
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pickColorTheme(e) {
      console.log(e.detail.color)
      this.setData({
        theme_rgb: e.detail.color
      })
      this.triggerEvent('change', {
        themeCss:
          `--theme-color:${e.detail.color};` +
          `--bg-color:${this.data.bg_rgb};` +
          `--text-color:${this.data.font_rgb};`
      })
    },
    pickColorFont(e) {
      console.log(e.detail.color)
      this.setData({
        font_rgb: e.detail.color
      })
      this.triggerEvent('change', {
        themeCss:
          `--theme-color:${this.data.theme_rgb};` +
          `--bg-color:${this.data.bg_rgb};` +
          `--text-color:${e.detail.color};`
      })
    },
    pickColorBg(e) {
      this.setData({
        bg_rgb: e.detail.color
      })
      console.log(`--bg-color:${e.detail.color};`)
      this.triggerEvent('change', {
        themeCss:
          `--theme-color:${this.data.theme_rgb};` +
          `--text-color:${this.data.font_rgb};` +
          `--bg-color:${e.detail.color};`
      })
    },
    save() {
      const { theme_rgb, font_rgb, bg_rgb } = this.data
      wx.setStorageSync('color', {
        theme: theme_rgb,
        font: font_rgb,
        bg: bg_rgb
      })
      this.setData({
        show: false
      })
      this.triggerEvent('save', {
        themeCss:
          `--theme-color:${theme_rgb};` +
          `--text-color:${font_rgb};` +
          `--bg-color:${bg_rgb}`
      })
    },
    cancel() {
      const color = wx.getStorageSync('color')
      this.triggerEvent('change', {
        themeCss:
          `--theme-color:${color.theme};` +
          `--text-color:${color.font};` +
          `--bg-color:${color.bg}`
      })
      this.setData({
        show: false
      })
    }
  },
  lifetimes: {
    attached() {}
  }
})

function rpx2px(rpx) {
  return rpx * this.data.scale
}
