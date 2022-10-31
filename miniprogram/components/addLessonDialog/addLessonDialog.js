import {genCardStyle} from '../../utils/schedule'
const dayOfWeekNames= ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
const app=getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show:{
            type:Boolean,
            value:true
        },
        lesson:{
            type:Object
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        confirmText:"新增",
        title:"新增自定义课程",
        //
        name:"",
        classroom:"",
        teacher_name:"",
        credit:"",
        dayOfWeek:"",
        timeRange:[],
        weekRange:[],
        weekCount:app.globalData.lessons.length,
        selectedWeeks:[],
        //
        isPickerShow:false,
        //
        showTime:"请选择上课时间"

    },

    /**
     * 组件的方法列表
     */
    methods: {
        submit(){
            const rawInfo={
                name:this.data.name,
                classroom:this.data.classroom,
                teacher_name:this.data.teacher_name,
                credit:this.data.credit,
                dayOfWeek:this.data.dayOfWeek,
                timeRange:this.data.timeRange,
                weekArr:this.data.selectedWeeks,
                time:`${this.data.timeRange[0]}-${this.data.timeRange[1]}节`,
                style:"",
                custom:true
            }
            const index=app.globalData.lessons.length
            this.saveCustomLesson(rawInfo,index)
            this.triggerEvent("done")
        },
        //选择上课周次
        onSelectWeek(e){
            this.setData({
                selectedWeeks: e.detail,
              });
        },
        // 选择时间
        onSlecetTime(){
            this.setData({
                isPickerShow:true
            })
        },
        onTimeRangeSelected(e){
            console.log(e.detail);
            this.setData({ ...e.detail})
        },
        //上课周次
        addAllWeeks(){
            console.log(123);
            const arr=[]
            for(let i=0;i<this.data.weekCount;i++){
                arr.push(""+(i+1))
            }
            this.setData({
                selectedWeeks:arr
            })
        },
        addOddWeeks(){
            const arr=[]
            for(let i=0;i<this.data.weekCount;i++){
                if(i%2===0){
                    arr.push(""+(i+1))
                }
            }
            this.setData({
                selectedWeeks:arr
            })
        },
        addEvenWeeks(){
            const arr=[]
            for(let i=0;i<this.data.weekCount;i++){
                if(i%2!==0){
                    arr.push(""+(i+1))
                }
            }
            this.setData({
                selectedWeeks:arr
            })
        },
        clearWeeks(){
            this.setData({
                selectedWeeks:[]
            })
        },//
        saveCustomLesson(rawinfo,index){
            let styled=null
            if(this.data.lesson.style){
                //如果是已经存在style 就不重新生成颜色
                rawinfo.style=this.data.lesson.style
                styled= rawinfo
            }else{
                styled= genCardStyle(rawinfo,index,true)
            }
            console.log(styled);
            const lessons=app.globalData.lessons
            for(let i=0;i<styled.weekArr.length;i++){
                lessons[styled.weekArr[i]-1].push(styled)
            }
            app.globalData.lessons=lessons
            wx.setStorageSync('lessons', lessons)
        },
        cancel(){
            this.setData({
                show:false
            })
        }
    },
    observers:{
        'dayOfWeek,timeRange':function(dayOfWeek,timeRange){
            if(!timeRange.length){
                return
            }
            this.setData({
                showTime:`${dayOfWeekNames[dayOfWeek-1]},第${timeRange[0]}节到第${timeRange[1]}节`
            })
        },
        //如果是修改课程
        lesson:function(lesson){
            if(lesson&&lesson.name){
                console.log(lesson);
                const {dayOfWeek,timeRange}=lesson
                this.setData({
                    ...lesson,
                    showTime:`${dayOfWeekNames[dayOfWeek-1]},第${timeRange[0]}节到第${timeRange[1]}节`,
                    title:"修改课程",
                    confirmText:"修改"
                })
            }
        },
        //关闭后重置
        show:function(show){
            console.log(show);
            if(show){
                return
            }
            this.setData({
                confirmText:"新增",
                title:"新增自定义课程",
                //
                name:"",
                classroom:"",
                teacher_name:"",
                credit:"",
                dayOfWeek:"",
                timeRange:[],
                weekRange:[],
                weekCount:app.globalData.lessons.length,
                selectedWeeks:[],
                //
                isPickerShow:false,
                //
                showTime:"请选择上课时间"
            })
        }
    }
})
