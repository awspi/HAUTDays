import {throttle} from '../../utils/index'
import {chooseImageToBase64} from './utils/index'
import Toast from '@vant/weapp/toast/toast';
const app=getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show:{
            type:Boolean,
            value:false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isPopupShow:false,
        isBlurPopupShow:false,
        //blur,opacity
        blur:0,
        opacity:1,
        ...wx.getStorageSync('style')
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClose(){
            this.setData({
                isPopupShow:false
            })
        },
        onUpdateHandler(){

        },
        /**
         * 上传图片并转为base64
         */
        async onChangeBgHandler(){
            Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true,
                context:this,
                message: '上传中...',
              });
              try {
                const base64Img= await chooseImageToBase64(3145728)
                console.log(base64Img);
                Toast.clear();
                Toast({
                    type:"success",
                    message:"上传成功",
                    context:this
                });
                this.setData({
                    isPopupShow:false// 上传成功默认关闭下拉框
                })
                //VM16 asdebug.js:10 setData 数据传输长度为 3672 KB，存在有性能问题！
                // 改为直接存storage
                wx.setStorageSync('style_bgUrl', base64Img)
                this.triggerEvent("updateBgUrl",{blur:parseFloat(this.data.blur).toFixed(1)})

              } catch (error) {
                Toast.clear();
                Toast({
                    type:"fail",
                    message:error,
                    context:this
                });
              }
        },
        // 修改透明度
        onBlurHandler(){
            this.setData({
                isBlurPopupShow:true
            })
        },
        onHelpHandler(){
            
        },
        // 修改高斯模糊和透明度
        //todo 不应该用opacity 而是用rgba只设置背景透明
        onBlurDrag(e){
            this.setData({
                blur:e.detail.value
            })
        },
        onOpacityDrag(e){
            this.setData({
                opacity:e.detail.value
            })
        },
        // 关闭onCloseBlurPopup
        onCloseBlurPopup(){
            //保存
            const {blur,opacity}=this.data
            wx.setStorageSync('style', {blur,opacity})
            this.setData({
                isBlurPopupShow:false
            })
        }
    },
    observers:{
        show:function(show){
            if(show){
            this.setData({
                isPopupShow:true
            });
            }
        },
        // 自动更新到storage 并回调 节流
        "blur,opacity":function (blur,opacity) {
            // console.log(blur,opacity);
            //节流
            this.triggerEvent("updateBlurOpacity",{blur:parseFloat(blur).toFixed(1),opacity:parseFloat(opacity).toFixed(1)})
        }
    }
})
