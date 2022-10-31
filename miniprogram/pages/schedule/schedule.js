// pages/schedule/schedule.js

import {timeFormat,genWeekDates} from '../../utils/time'
import Dialog from '@vant/weapp/dialog/dialog';
const app=getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],//周
        courseTime: [['08:30','09:15'],['09:20','10:05'],['10:25','11:10'],['11:15','12:00'],'中午',['14:30','15:15'],['15:20','16:05'],['16:25','17:10'],['17:25','18:00'],['19:30','20:15'],['20:25','21:10']],
        showWeekDates:genWeekDates(),//展示的7个日期
        today:timeFormat(new Date()),//当天日期
        showWeek:app.globalData.currentWeek,//展示的周数
        currentWeek:app.globalData.currentWeek,//现在的周数
        showMonth:null,//当前月份
        isSwitchingWeek:true,//是否展开切换周
        //
        showDetail:0,//弹出层 课程的info
        isDetailCardVisible:false,//控制课程详情弹窗
        //
        totalLessons:app.globalData.lessons,
        //
        isAddLessonDialogVisible:false,
        selectedLesson:{}
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
     * 通过scroll-view改变
     */
    onChangeWeek(e){
        const index=e.detail.current
        const date=new Date()
        const diff=index+1-this.data.currentWeek
        date.setDate(date.getDate()+(diff)*7)
        this.setData({
            showWeek:index+1,
            showWeekDates:genWeekDates(date),
            showMonth:date.getMonth()+1
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //一个bug
        this.setData({
            // showsLessons: [app.globalData.currentWeek-1],
            isSwitchingWeek:false,//隐藏切换周
            showWeek:app.globalData.currentWeek,
            showMonth:new Date().getMonth()+1
        })
    },
    onShow(){
        this.setData({
            showWeek:app.globalData.currentWeek,//展示的周数
            currentWeek:app.globalData.currentWeek,//现在的周数
            totalLessons:app.globalData.lessons
        })
        //如果没信息 就弹窗
        //? totalLessons
        if(this.data.totalLessons===""){
            Dialog.alert({
                title: '注意',
                message: '登录后才能使用课程表,请先登录~',
              }).then(() => {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
              });
        }
    },
    /**
     * 显示课程详情
     */
    showDetailCard(e){
        wx.vibrateShort({
          type: 'light',
        })
        this.setData({
            isDetailCardVisible:true,
            showDetail:e.currentTarget.dataset.detail
        })
    },
    /**
     * 滑动切换页
     */
    onChangePage(e){
        const index=e.detail.current
        const source=e.detail.source
        console.log('switch week to ',index+1);
        if(source!=="touch"){
            return
        }
        //更新显示的日期
        const date=new Date()
        const diff=index+1-this.data.currentWeek
        console.log(index+1,this.data.currentWeek,diff);
        date.setDate(date.getDate()+(diff)*7)
        this.setData({
            showWeekDates:genWeekDates(date),
            //更新页面
            showWeek:index+1,
            showMonth:date.getMonth()+1
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
    },
    /**
     * 背景被长按,新增课程
     */
    onBgLongpress(){
        console.log('背景被长按,新增课程');
        this.setData({
            isAddLessonDialogVisible:true,
            selectedLesson:{}
        })
    },
    //新增课程完成的回调
    onAddLessonDone(){
        this.setData({
            isAddLessonDialogVisible:false,
            totalLessons:app.globalData.lessons,
            selectedLesson:{}
        })
    },//
    /**
     * 课程被长按,修改课程
     */
    onCardLongpress(e){
        console.log("课程被长按,修改课程");
        this.setData({
            isAddLessonDialogVisible:true,
            selectedLesson:e.currentTarget.dataset.detail
        })

    }
})
