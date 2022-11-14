import { throttle } from '../../utils/index'
import { chooseImageToBase64 } from './utils/index'
import Toast from '@vant/weapp/toast/toast'
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    isPopupShow: false,
    isBlurPopupShow: false,
    //blur,opacity
    isUseBgColor: app.globalData.isUseBgColor, //是否使用纯色背景
    blur: 0,
    opacity: 1,
    bgColor: '',
    ...wx.getStorageSync('style'),
    //
    isCustomShow: true, //颜色
    isCustomBgShow: true,
    isBgPopupShow: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({
        isPopupShow: false
      })
    },
    onUpdateHandler() {
      this.setData({
        isPopupShow: false
      })
      wx.navigateTo({
        url: '/pages/login/login'
      })
      // this.onLoad()
      // wx.navigateTo({
      //     url: "",
      //     })
    },
    onChangeBgHandler() {
      this.setData({
        isCustomBgShow: true,
        isPopupShow: false
      })
    },
    onCloseBg() {
      this.setData({
        isCustomBgShow: false
      })
    },
    /**
     * 上传图片并转为base64
     */
    async onChangeBgImgHandler() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        context: this,
        message: '上传中...'
      })
      try {
        const base64Img = await chooseImageToBase64(3145728)
        console.log(base64Img)
        Toast.clear()
        Toast({
          type: 'success',
          message: '上传成功',
          context: this
        })
        this.setData({
          isPopupShow: false // 上传成功默认关闭下拉框
        })
        //VM16 asdebug.js:10 setData 数据传输长度为 3672 KB，存在有性能问题！
        // 改为直接存storage
        wx.setStorageSync('style_bgUrl', base64Img)
        this.triggerEvent('updateBgUrl')
      } catch (error) {
        Toast.clear()
        Toast({
          type: 'fail',
          message: error,
          context: this
        })
      }
    },
    onSwitchChange({ detail }) {
      this.setData({
        isUseBgColor: detail
      })
      wx.setStorageSync('preference', {
        isUseBgColor: this.data.isUseBgColor
      })
      this.triggerEvent('changeIsUseBgColor', {
        isUseBgColor: detail
      })
    },
    /**
     * 删除背景图片
     */
    onDelBgImgHandler() {
      wx.setStorageSync('style_bgUrl', '')
      this.triggerEvent('updateBgUrl')
      Toast({
        type: 'success',
        message: '删除成功',
        context: this
      })
    },
    saveBg() {},
    onChangeBgColor() {
      this.setData({
        isBgPopupShow: true
      })
    },
    // 修改透明度
    onBlurHandler() {
      this.setData({
        isPopupShow: false,
        isBlurPopupShow: true
      })
    },
    /**
     * 修改字体颜色
     */
    onColorHandler() {
      this.setData({
        isPopupShow: false,
        isCustomShow: true
      })
    },
    // 实时预览 themeCss颜色
    onthemeCssChange: throttle(function (e) {
      console.log(e.detail)
      //防抖
      this.setData({
        themeCss: e.detail.themeCss
      })
      this.triggerEvent('updateThemeCss', {
        themeCss: e.detail.themeCss
      })
    }, 100),
    // 保存字体颜色 背景颜色
    onCssUpdated(e) {
      this.setData({
        themeCss: e.detail.themeCss
      })
      this.triggerEvent('updateThemeCss', {
        themeCss: e.detail.themeCss
      })
      Toast({
        message: '修改成功',
        context: this
      })
    },
    updateBgColor(e) {
      this.setData({
        bgColor: e.detail.color
      })
      this.triggerEvent('updateBgColor', {
        bgColor: e.detail.color
      })
    },
    // 修改高斯模糊
    onBlurDrag: throttle(function (e) {
      //防抖
      this.setData({
        blur: e.detail.value
      })
    }, 100),
    //用rgba设置仅背景透明
    onOpacityDrag: throttle(function (e) {
      //防抖
      this.setData({
        opacity: e.detail.value
      })
    }, 100),
    // 关闭onCloseBlurPopup
    onCloseBlurPopup() {
      //保存
      const { blur, opacity } = this.data
      wx.setStorageSync('style', { blur, opacity })
      this.setData({
        isBlurPopupShow: false
      })
    },
    cancel() {
      const style = wx.getStorageSync('style')
      this.setData({
        ...style
      })
      this.setData({
        isBlurPopupShow: false
      })
    }
  },
  observers: {
    show: function (show) {
      if (show) {
        this.setData({
          isPopupShow: true
        })
      }
    },
    // 自动更新到storage 并回调 节流
    'blur,opacity': function (blur, opacity) {
      // console.log(blur,opacity);
      //节流
      this.triggerEvent('updateBlurOpacity', {
        blur: parseFloat(blur).toFixed(1),
        opacity: parseFloat(opacity).toFixed(1)
      })
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        isCustomShow: false, //getBoundingClientRecta
        isCustomBgShow: false,
        isBgPopupShow: false //getBoundingClientRecta
      })
    }
  }
})
