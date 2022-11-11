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
/**
 *  为lesson设置style
 * @param {*} lesson 单个课程
 * @param {*} index  课程索引 用于设置背景图片
 */
function genCardStyle(lesson,index){
    const {timeRange,dayOfWeek}=lesson
    // const height=(timeRange[1]-timeRange[0]+1)*9
    const height=`calc(100%/11*${(timeRange[1]-timeRange[0]+1)})`
    
    const tem=timeRange[0]-1
    // const top=(tem>2?tem+1:tem)*9
    const top=`calc(100%/11*${(tem>2?tem+1:tem)})`

    // const left=(dayOfWeek-1)*14.2857
    const left=`calc(100%/7*${(dayOfWeek-1)})`
    
    return Object.assign(lesson,{
        style:`
        top:${top};left:${left};height:${height};
        background-color:rgba(${colorArr[index%20]},var(--card-opacity));`
    })
}
module.exports={
    genCardStyle
}