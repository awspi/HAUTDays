// pages/login/login.js
import Toast from '@vant/weapp/toast/toast';
import {getUserProfile} from '../../utils/user'
import {getCurrentWeek} from '../../utils/time'
const app =getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading:false,
        xh:"",
        password:"",
        isPwdHidden:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const loginForm=wx.getStorageSync('loginForm')
        this.setData({
            xh:loginForm.xh,
            password:loginForm.password
        })
    },
    /**
     * 登录
     * @param {} e 
     */
    async onLoginCLick(e){
        if(this.data.loading) return
        this.setData({
            loading:true
        })
        //获取wx信息
        getUserProfile()
        //获取课程
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getData',
            // 传给云函数的参数
            data: {
            xh: this.data.xh,
            mm: this.data.password,
            }
        }).then(res=>{
            const {status,msg,data}=res.result
                //如果登录成功 把登录信息保存到本地
                if(status==='ok'){
                    this.loginDoneHandler(data)
                    Toast({
                        type:"success",
                        message:msg,
                        onClose:()=>{
                            wx.navigateBack()
                        }
                    });
                }else{
                    //登录失败
                    Toast.fail(msg);
                }
                this.setData({
                    loading:false
                })
        }).catch(err=>{
            console.log(err);
            Toast.fail("error");
            this.setData({
                loading:false
            })
        })


    },
    async loginDoneHandler(data){
        wx.setStorageSync('loginForm', {
            xh:this.data.xh,
            password:this.data.password
        })
        //lessons
        app.globalData.lessons=data.lessons
        wx.setStorageSync('lessons',app.globalData.lessons)
        //profile
        app.globalData.profile=Object.assign(app.globalData.profile||{},data.profile)
        console.log(app.globalData.profile);
        wx.setStorageSync('profile',app.globalData.profile)
        //termRange
        app.globalData.termRange=data.termRange
        wx.setStorageSync('termRange', app.globalData.termRange)
        //currentWeek
        app.globalData.currentWeek=getCurrentWeek(data.termRange[0],data.termRange[1])
    },
    /**
     * ?被点击
     */
    onIconClick(){
        console.log("?被点击");
    },
    /**
     * 使用须知 被点击
     */
    onInstructionClick(){
        console.log("使用须知 被点击");
    },
    /**
     * isPwdHidden
     */
    tigglePwdHidden(){
        this.setData({
            isPwdHidden:!this.data.isPwdHidden,
            password:this.data.password,
        })
    }
})