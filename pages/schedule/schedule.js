// pages/schedule/schedule.js

import {timeFormat,getFirstDayOfWeek} from '../../utils/time'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],//周
        courseTime: ['8:05','9:00','10:05','11:00','中午','14:40','15:35','16:30','17:25','19:00','19:55'],
        showWeekDates:[],//展示的7个日期
        today:timeFormat(new Date()),//当天日期
        showMonth:new Date().getMonth()+1,//当前月份
        isSwitchingWeek:false//是否展开切换学周
    },
    
    /**
     * 切换周
     */
    onSwitchWeekHandler(){
        this.setData({
            isSwitchingWeek:!this.data.isSwitchingWeek
        })
    },
    /**
     * 生成显示的7天
     */
    genWeekDates(date=new Date()){
        const arr=[]
        for(let i=0;i<7;i++){
            arr[i]=getFirstDayOfWeek(date,i)
        }
        console.log(arr);
        this.setData({
            showWeekDates:arr
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.genWeekDates()
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
