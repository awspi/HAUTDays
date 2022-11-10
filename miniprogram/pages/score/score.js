import * as echarts from "../../components/ec-canvas/echarts"
import {getPieData,getLineData,getYearOption,filterScore,getSchoolReport} from './utils/index'
import Toast from '@vant/weapp/toast/toast';
const app=getApp()
let pieChart
let lineChart
Page({
    /**
     * 页面的初始数据
     */
    data: {
        scores:app.globalData.scores||[],
        //成绩单
        schoolReport:getSchoolReport(app.globalData.scores),
        //echarts
        ec_pie: {
            onInit: function (canvas, width, height, dpr) {
                pieChart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
              canvas.setChart(pieChart);
              pieChart.setOption(getPieOption(app.globalData.scores));
              return pieChart;
            }
          },
        ec_line: {
            onInit: function (canvas, width, height, dpr) {
                lineChart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
              });
              canvas.setChart(lineChart);
              lineChart.setOption(getLineOption(app.globalData.scores));
      
              return lineChart;
            }
          },
        yearOption: [
        { text: '入学以来', value: "all" },
        ...getYearOption(app.globalData.scores)
        ],
        termOption: [
        { text: '全部学期', value: 'all' },
        { text: '上学期', value: 1 },
        { text: '下学期', value: 2 },
        ],
        //学期范围
        year: "all",
        term: 'all',
        //是否包含公选课
        includePublic:true,
        //成绩单
        isPopupShow:false,
        //更新button loading
        loading:false

    },
    onNaviBack(){
        wx.navigateBack()
    },
    /**
     * 查看成绩单
     */
    onScoreListhandler(){
        this.setData({ isPopupShow: true });
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
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    /**
    * popup关闭
    */
    onClose(){
        this.setData({ isPopupShow: false });
    },
    /**
     * 是否包含公选课
     */
    onSwitchChange({ detail }){
        // pieChart.setOption(getPieOption(app.globalData.scores));
        this.setData({ includePublic: !this.data.includePublic });
        updateOption(this.data.scores,this.data.year,this.data.term,this.data.includePublic)
    },
    /**
     * 改变筛选条件 year term
     */
    onYearChange({ detail }){
        this.setData({ year: detail });
        updateOption(this.data.scores,this.data.year,this.data.term,this.data.includePublic)
    },
    onTermChange({ detail }){
        this.setData({ term: detail });
        updateOption(this.data.scores,this.data.year,this.data.term,this.data.includePublic)
    },
    /**
     * 更新成绩
     */
    getExams() {
        this.setData({
            loading:true
        })
        Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '获取中...',
          });
        const profile=wx.getStorageSync('loginForm')
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getScore',
            // 传给云函数的参数
            data: {
            xh: profile.xh,
            mm: profile.password,
            }
        }).then(res=>{
            const {status,msg,data}=res.result
                //如果登录成功 把登录信息保存到本地
                if(status==='ok'){
                    wx.setStorageSync('scores',data.scores)
                    this.setData({
                        scores:data.scores
                    })
                    updateOption(this.data.scores,this.data.year,this.data.term,this.data.includePublic)
                    Toast.clear();
                    Toast.success("获取成功")
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
})

function updateOption(scores,year,term,includePublic) {
    const res=filterScore(scores,year,term,includePublic)
    pieChart.setOption(getPieOption(res));
    lineChart.setOption(getLineOption(res));
}

function getPieOption(scores) {
    if(!scores.length) return {}
   const {averageGPA,pieData}= getPieData(scores)
   return {
    title: {
      text: `${averageGPA}\n平均绩点`,
      left: 'center',
      top: 'center'
    },
    legend: {
        title: ['差', '合格', '中', '良', '优'],
        // orient: 'horizontal',
        orient: 'vertical',
        x:"left",
        y:'bottom'
      },
    series: [
      {
        type: 'pie',
        data: pieData,
        radius: ['40%', '70%'],
        label:{
            overflow: 'break',
            show: true,
            formatter: '{b}:{c}科 {d}%' 
        }
      }
    ]
  };
}
function getLineOption(scores) {
    if(!scores.length) return {}
   const {xAxisData,data}= getLineData(scores)
   return {
    xAxis: {
      type:"category",
      data: xAxisData
    },
    yAxis: {},
    series: [
      {
        data,
        type: 'line',
        label: {
          show: true,
          position: 'bottom'
        },
        lineStyle: {
              color: '#EC6A8E',
              width: 4,
          },
          itemStyle:{
              color:'#EC6A8E'
          }
      }
    ]
  };
}