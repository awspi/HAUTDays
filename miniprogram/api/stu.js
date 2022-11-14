import { wRequest } from '../services/index'
const BASE_URL = 'https://6a55c234-d419-42b9-98d8-4733827bec98.bspapp.com'
/**
 * 获取用户信息、课程信息等
 * @param {*} xh
 * @param {*} mm
 */
export function getData(xh, mm) {
  return wRequest.post({
    url: BASE_URL + '/getData',
    data: {
      xh,
      mm
    }
  })
}

/**
 * 获取成绩列表
 * @param {*} xh
 * @param {*} mm
 */
export function getScore(xh, mm) {
  return wRequest.post({
    url: BASE_URL + '/getScore',
    data: {
      xh,
      mm
    }
  })
}
/**
 * 获取考试列表
 * @param {*} xh
 * @param {*} mm
 */
export function getExam(xh, mm) {
  return wRequest.post({
    url: BASE_URL + '/getExam',
    data: {
      xh,
      mm
    }
  })
}

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
