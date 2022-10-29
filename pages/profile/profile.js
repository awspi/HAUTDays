// pages/profile/profile.js
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
            url:"",
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})