/**
 * wx.request -->返回pormise
 */
class WRequest {
  request(options) {
    const { url } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url,
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          console.log('err:', err)
        }
      })
    })
  }
  get(options) {
    return this.request({ ...options, method: 'get' })
  }
  post(options) {
    return this.request({ ...options, method: 'post' })
  }
}
export const wRequest = new WRequest()
