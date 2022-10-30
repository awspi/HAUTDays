import {getTotalWeeks} from './time'
const colorArr=[
    '#99CCFF',
    '#FFCC99',
    '#FFCCCC',
    '#CC6699',
    '#99CCCC',
    '#FF6666',
    '#CCCC66',
    '#66CC99',
    '#FF9966',
    '#66CCCC',
    '#6699CC',
    '#99CC99',
    '#669966',
    '#99CC99',
    '#99CCCC',
    '#66CCFF',
    '#CCCCFF',
    '#99CC66',
    '#CCCC99',
    '#FF9999'
]
function genCardStyle(lessons){
    const res=lessons.map((item,index)=>{
        const {timeRange,dayOfWeek}=item
        const height=(timeRange[1]-timeRange[0]+1)*9
        const tem=timeRange[0]-1
        const top=(tem>2?tem+1:tem)*9
        const left=(dayOfWeek-1)*14.2857
        return Object.assign(item,{
            style:`
            top:${top}%;left:${left}%;height:${height}%;
            background-color:${colorArr[index%20]};`
        })
    })
    return res
}


/**
 * 把lessons按照周数分类
 * @param {*} termRange 
 * @param {*} lessons 
 */
function assortLessons(termRange,lessons){
  //? 生成二维数组
  const totalWeeks=getTotalWeeks(termRange[0],termRange[1])
  const lessons_assorted = []
  for (let i = 1; i <= totalWeeks; i++) {
    lessons_assorted[i-1] = lessons.filter(item => i >= item.weekRange[0] && i <= item.weekRange[1])
  }
  return lessons_assorted
}
module.exports={
    genCardStyle,
    assortLessons
}