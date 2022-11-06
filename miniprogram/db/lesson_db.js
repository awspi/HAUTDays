class LessonsDB {
    constructor(){
        const db= wx.cloud.database({
            env:"schoolepmpic-9ag8l",
        })
        this.collection=db.collection('lessons')
        this._ = db.command
    }
    /**
     * 保存教务系统课程列表
     * @param {Array} lessons 课程列表
     * @param {*} xh 学号
     */
    async saveLessons(lessons,xh){
        try {
            // 把cutom取出来
            const customList= await this.getLessons(String(xh),"custom")
            //合并
            const list=[...lessons,...customList]
            const res= await this.collection.doc(String(xh)).set({
                data:{
                    total:list.length,
                    list
                }
            })
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * 获取课程列表
     * @param {*} xh 学号
     * @param {*} type all raw custom
     */
    async getLessons(xh,type="all"){
        try {
            const res= await this.collection.doc(String(xh)).get()
            switch (type) {
                case "all":
                    return res.data.list
                case "raw":
                    return res.data.list.filter(lesson=>lesson.custom==false)
                case "custom":
                    return res.data.list.filter(lesson=>lesson.custom==true)
            }
            
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * 增加课程
     * @param {Object} lesson 课程信息
     * @param {*} xh 
     * @returns 返回更新后的完整课程列表
     */
    async addLesson(lesson,xh){
        try {
            const res= await this.collection.doc(String(xh)).update({
                data:{
                    list:this._.push([lesson]),
                    total:this._.inc(1)
                }
            })
            console.log(res);
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * 删除课程
     * @param {*} id 
     * @param {*} xh 
     * @returns 返回更新后的完整课程列表
     */
    async delLesson(id,xh){
        try {
            const res= await this.collection.doc(String(xh)).get()
            const count=res.data.total--
            const newList=res.data.list.filter(item=>item.id!==id)
            const ret=await this.collection.doc(String(xh)).update({
                data:{
                    list:newList,
                    total:count
                }
            })
            return ret
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * 更新课程
     * @param {*} lesson 
     * @param {*} xh 
     * 返回更新后的完整课程列表
     */
    async updateLesson(lesson,xh){
        try {
            const res= await this.collection.doc(String(xh)).get()
            console.log(res);
            const newList=res.data.list.map(item=>item.id===lesson.id?lesson:item)
            console.log(newList);
            const ret=await this.collection.doc(String(xh)).update({
                data:{
                    list:newList,
                }
            })
            console.log(ret);
            return ret
        } catch (e) {
            console.error(e)
        }
    }

}

module.exports={
    LessonsDB
}