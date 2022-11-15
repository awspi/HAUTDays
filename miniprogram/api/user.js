import { wRequest } from '../services/index'
const BASE_URL = 'https://6a55c234-d419-42b9-98d8-4733827bec98.bspapp.com'

export function uploadImg({ base64Img, type }) {
  const { xh } = wx.getStorageSync('profile')
  return wRequest.post({
    url: BASE_URL + '/uploadImage',
    data: {
      base64Img,
      type,
      xh
    }
  })
}

export function getUserInfo() {
  const { xh } = wx.getStorageSync('profile')
  return wRequest.post({
    url: BASE_URL + '/getUserInfo',
    data: {
      xh
    }
  })
}

export function getNotice() {
  return wRequest.get({
    url: BASE_URL + '/getNotice'
  })
}
