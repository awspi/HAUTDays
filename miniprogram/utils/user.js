const app = getApp()
/**
 * 获取微信头像 昵称 并保存到storage和globalData
 * 返回{avatarUrl nickName}
 */
async function getAvatarUrl(e) {
  //获取微信头像 昵称
  console.log(e.detail.avatarUrl)
  app.globalData.profile = Object.assign(app.globalData.profile, {
    avatarUrl: e.detail.avatarUrl
  })
  wx.setStorageSync('profile', app.globalData.profile)
  return {
    avatarUrl: e.detail.avatarUrl
  }
}
module.exports = {
  getAvatarUrl
}
