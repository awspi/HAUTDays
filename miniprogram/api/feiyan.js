import { wRequest } from '../services/index'
const BASE_URL = 'https://c.m.163.com/ug/api/wuhan/app/data/list-total'
export function getFeiyanData() {
  return wRequest.get({
    url: BASE_URL
  })
}
