/**
 * 获取以学年为key的对象
 * @param {*} scores 
 */
function getExamArrange(exams) {
    const obj={}
    exams.forEach(exam=>{
        const key=(""+exam.year).slice(2)+"-"+exam.term
        //如果是首次 就初始化
        if(!Object.keys(obj).includes(key)){
            obj[key]=[]
        }
        obj[key].unshift(exam)//unshift 倒序 让后出的成绩显示在前面
    })
    return obj
}

module.exports={
    getExamArrange  
}