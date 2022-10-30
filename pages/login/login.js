// pages/login/login.js
import {getUserProfile} from '../../utils/user'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading:false,
        xh:"",
        password:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    /**
     * 登录
     * @param {} e 
     */
    async onLoginHandler(e){
        if(this.data.loading) return
        //获取wx信息
        await getUserProfile()
        //
        console.log(this.data.xh);
        console.log(this.data.password);
        
        this.setData({
            loading:true
        })
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
    }
})