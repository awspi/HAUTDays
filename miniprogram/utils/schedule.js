import {getTotalWeeks} from './time'
// const colorArr=[
//     '#99CCFF',
//     '#FFCC99',
//     '#FFCCCC',
//     '#CC6699',
//     '#99CCCC',
//     '#FF6666',
//     '#CCCC66',
//     '#66CC99',
//     '#FF9966',
//     '#66CCCC',
//     '#6699CC',
//     '#99CC99',
//     '#669966',
//     '#99CC99',
//     '#99CCCC',
//     '#66CCFF',
//     '#CCCCFF',
//     '#99CC66',
//     '#CCCC99',
//     '#FF9999'
// ]
const colorArr=[
    "153,204,255",
    "255,204,153",
    "255,204,204",
    "204,102,153",
    "153,204,204",
    "255,102,102",
    "204,204,102",
    "102,204,153",
    "255,153,102",
    "102,204,204",
    "102,153,204",
    "153,204,153",
    "102,153,102",
    "153,204,153",
    "153,204,204",
    "102,204,255",
    "204,204,255",
    "153,204,102",
    "204,204,153",
    "255,153,153"
]
function genCardStyle(lesson,index,random=false){
    const {timeRange,dayOfWeek}=lesson
    const height=(timeRange[1]-timeRange[0]+1)*9
    const tem=timeRange[0]-1
    const top=(tem>2?tem+1:tem)*9
    const left=(dayOfWeek-1)*14.2857
    let color=""
    if(random){
        color=getRandomColor()
    }else{
        color=colorArr[index%20]
    }
    console.log(color);
    return Object.assign(lesson,{
        style:`
        top:${top}%;left:${left}%;height:${height}%;
        background-color:rgba(${colorArr[index%20]},var(--card-opacity));`
    })
}

function getRandomColor() {
    let rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length == 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
}
/**
 * 
 * 保存自定义课程
 * 处理 weekArr->weekRange
 */
function saveCustomLesson(rawinfo,index){
    const styled= genCardStyle(rawinfo,index)
    console.log(styled);
    const lessons=app.globalData.lessons
    for(let i=0;i<styled.activeWeeks.length;i++){
        lessons[styled.activeWeeks[i]-1].push(styled)
    }
    app.globalData.lessons=lessons
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
    assortLessons,
    saveCustomLesson
}