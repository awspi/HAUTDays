import {markData} from './static/index'
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