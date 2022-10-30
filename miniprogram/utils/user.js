const app=getApp()
/**
 * 获取微信头像 昵称 并保存到storage和globalData
 * 返回{avatarUrl nickName}
 */
async function getUserProfile(){
        //获取微信头像 昵称 
        const res= await wx.getUserProfile({
            desc: '展示用户信息', 
        })
        app.globalData.profile=Object.assign(app.globalData.profile,{
            avatarUrl:res.userInfo.avatarUrl,
            nickName:res.userInfo.nickName
        })
        wx.setStorageSync('profile', app.globalData.profile)
        return {
            avatarUrl:res.userInfo.avatarUrl,
            nickName:res.userInfo.nickName
        }

}
module.exports={
    getUserProfile
}