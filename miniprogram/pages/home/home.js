import {getWeather} from '../../api/weather'
import {timeFormat} from '../../utils/time'
import {notification} from './static/index'
const dayOfWeek= ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
const dayOfWeekIndex=["7","1","2","3","4","5","6"]
const app=getApp()
import Toast from '@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        weather:"",
        degree:"",

        today:timeFormat(new Date(),"."),
        currentWeek:app.globalData.currentWeek,
        dayOfWeek:"",
        notice:notification,
        swiperList:[],//轮播图列表
        todayLessons:[],
        overflow:false,
        funcitonList:[
            {
                icon:"navi",
                title:"校园导航",
                url:"/pages/guidance/guidance",
            },
            {
                icon:"score",
                title:"成绩分析",
                url:'/pages/score/score',
            },
            {
                icon:"arrange",
                title:"考试安排",
                url:"/pages/exam/exam",
            },
            {
                icon:"find",
                title:"遗失寻物",
                url:"",
            },
            {
                icon:"activity",
                title:"一些活动",
                url:"/pages/activity/activity",
            },
        ]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const swiperList=["https://img9.vilipix.com/picture/pages/regular/2022/08/31/12/102478682_p0_master1200.jpg?x-oss-process=image/resize,w_450/format,jpg","https://img9.vilipix.com/picture/pages/regular/2022/07/06/12/100307867_p0_master1200.jpg?x-oss-process=image/resize,w_450/format,jpg","https://img9.vilipix.com/picture/pages/regular/2022/06/27/14/99319833_p0_master1200.jpg?x-oss-process=image/resize,w_450/format,jpg","https://img9.vilipix.com/picture/pages/regular/2021/04/24/19/07/89508792_p0_master1200.jpg?x-oss-process=image/resize,w_450/format,jpg","https://img9.vilipix.com/picture/pages/regular/2022/05/01/19/41/98014664_p0_master1200.jpg?x-oss-process=image/resize,w_450/format,jpg"]

        const day=new Date().getDay()//周几
        const currentWeekLessons=app.globalData.lessons[this.data.currentWeek-1]
        const todayLessons=currentWeekLessons.filter(item=>item.dayOfWeek===dayOfWeekIndex[day])
        this.setData({
            ...await getWeather(),
            swiperList,
            dayOfWeek:dayOfWeek[day],
            overflow:todayLessons.length>3,
            todayLessons:todayLessons.slice(0,3)
        })
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
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    onSeeMoreHandler(){
        wx.redirectTo({
            url: '/pages/schedule/schedule',
          })
    },
    onIconHandler(e){
        const url=e.currentTarget.dataset.url
        if(url){
            wx.navigateTo({
              url
            })
        }else{    
            Toast('开发ing~');
        }
    }
})