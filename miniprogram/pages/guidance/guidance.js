const markData=[
    [34.833393,113.556099,"D区宿舍"],
    [34.833466,113.554167,"C区宿舍"],
    [34.83357,113.552288,"B区宿舍"],
    [34.83358,113.550344,"A区宿舍"],
    [34.832342,113.556079,"第二餐厅"],
    [34.832326,113.554585,"第一餐厅"],
    [34.831609,113.556317,"洗浴中心"],
    [34.830893,113.555835,"第三餐厅"],
    [34.829948,113.55724,"东门"],
    [34.829049,113.556773,"菜鸟驿站"],
    [34.829504,113.556755,"校医院"],
    [34.832479,113.553469,"钟楼广场"],
    [34.832535,113.551726,"25号楼"],
    [34.832661,113.5528,"24号楼"],
    [34.8309,113.551454,"图书馆"],
    [34.83366,113.548221,"东操场"],
    [34.833708,113.546777,"西操场"],
    [34.833935,113.545455,"篮球场"],
    [34.833135,113.545411,"排球场"],
    [34.832164,113.545298,"网球场"],
    [34.832921,113.543896,"F区宿舍"],
    [34.831731,113.543927,"E区宿舍"],
    [34.831214,113.545377,"体育训练中心"],
    [34.832444,113.548795,"篮球场"],
    [34.832342,113.548012,"篮球场"],
    [34.832149,113.5467,"篮球场"],
    [34.830833,113.542859,"西门"],
    [34.830418,113.543661,"35号楼"],
    [34.830036,113.543807,"工程训练中心"],
    [34.82906,113.544019,"38号楼"],
    [34.828005,113.545059,"34号楼"],
    [34.829199,113.545279,"32号楼"],
    [34.829233,113.546641,"31号楼"],
    [34.829105,113.548267,"8号楼"],
    [34.83017,113.548279,"9号楼"],
    [34.830148,113.550583,"7号楼"],
    [34.829063,113.550378,"6号楼"],
    [34.830129,113.552506,"5号楼"],
    [34.829103,113.552598,"4号楼"],
    [34.829091,113.554198,"3号楼"],
    [34.8312,113.554133,"18号楼"],
    [34.829104,113.551448,"下沉广场"],
    [34.827905,113.552977,"办公楼"],
    [34.827711,113.551467,"南门"],
]
const markers=markData.map((item,index)=>genMark(...item,index))
Page({

    /**
     * 页面的初始数据
     */
    data: {
        markers:markers
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    onNaviBack(){
        wx.navigateBack()
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})


function genMark(latitude,longitude,content,id) {
    return{
        id,
        latitude,
        longitude,
        height: 1,
        width: 1,
        iconPath: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        callout: {
            content,
            display: 'ALWAYS',
            bgColor: '#fff',
            padding: 1,
            color: '#ec6a8e',
            borderWidth: 2,
            borderRadius: 3
        }
    }
}