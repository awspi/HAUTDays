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
/**
 *  为lesson设置style
 * @param {*} lesson 单个课程
 * @param {*} index  课程索引 用于设置背景图片
 */
function genCardStyle(lesson,index){
    const {timeRange,dayOfWeek}=lesson
    const height=(timeRange[1]-timeRange[0]+1)*9
    const tem=timeRange[0]-1
    const top=(tem>2?tem+1:tem)*9
    const left=(dayOfWeek-1)*14.2857
    return Object.assign(lesson,{
        style:`
        top:${top}%;left:${left}%;height:${height}%;
        background-color:${colorArr[index%20]};`
    })
}
module.exports={
    genCardStyle
}