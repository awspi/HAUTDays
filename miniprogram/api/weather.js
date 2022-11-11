import { wRequest } from '../services/index'
async function getWeather() {
  const url =
    'https://wis.qq.com/weather/common?source=xw&weather_type=forecast_1h|forecast_24h|index|alarm|limit|tips'
  const region = {
    province: '河南',
    city: '郑州'
  }
  try {
    const {
      data: { forecast_1h }
    } = await wRequest.get({
      url: url,
      data: region,
      header: {
        'content-type': 'application/json'
      }
    })
    const { weather, degree } = forecast_1h[0]
    return { weather, degree }
  } catch (e) {
    console.log(e)
  }
}
module.exports = {
  getWeather
}
