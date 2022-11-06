
const db = wx.cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
}

const saveLessons=()=>{
    db.collection('books').where({
        publishInfo: {
          country: 'United States'
        }
      }).get({
        success: function(res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log(res)
       }
})
}

const addLesson=()=>{
    
}
const delLesson=()=>{

}
const updateLesson=()=>{
    
}
