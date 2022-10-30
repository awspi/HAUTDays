// pages/profile/profile.js
import{getUserProfile} from '../../utils/user'
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        profile:app.globalData.profile,
        menus:[
            {
            icon:"manager",
            title:"账户与数据",
            label:"导入/更新课程表",
            url:"/pages/login/login"
        },
        {
            icon:"like",
            title:"个性设置",
            url:"",
        },
        {
            icon:"comment-circle",
            title:"意见反馈",
            url:"",
        },
        {
            icon:"chat",
            title:"联系客服",
            url:"",
        },
        {
            icon:"umbrella-circle",
            title:"用户服务条款",
            url:"",
        },
        {
            icon:"more",
            title:"关于",
            value:"pithy",
            url:"",
        },
    ]
    },
    async onRefreshHandler(){
        await getUserProfile()
        this.setData({
            profile:app.globalData.profile
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(app.globalData.profile);
        this.setData({
            profile:app.globalData.profile
        })
    },
    onShow(){
        this.setData({
            profile:app.globalData.profile
        })
    }
})