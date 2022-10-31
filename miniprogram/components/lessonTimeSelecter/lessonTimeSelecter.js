import {genLimitedTime} from '../../utils/time'
const dayOfWeek= ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
const start=genLimitedTime(1)
const rawEnd=genLimitedTime(1)
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show:{
            type:Boolean,
            value:false
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        indexOffset:0,
        columns: [
            {
              values: dayOfWeek,
              className: 'column1',
            },
            {
              values: start,
              className: 'column2',
            },
            {
                values: rawEnd,
                className: 'column3',
                defaultIndex: 1,
              },
          ],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event) {
            const { picker, value, index } = event.detail;
            if(index===1){
                //如果开始节被修改 则重新计算合法结束节
                const start = picker.getColumnIndex(1)+1
                this.setData({
                    indexOffset:picker.getColumnIndex(1)
                })
                picker.setColumnValues(2, genLimitedTime(start));
                picker.setColumnIndex(2,0)
                console.log(picker.getColumnIndex(1));
            }
          },
          onCancel(){
            this.setData({
                show:false
            })
            const picker=this.selectComponent('#picker')
            picker.setIndexes([0,0,0])
            picker.setColumnValues(2, rawEnd);
          },
          onConfirm(event){
            const {index } = event.detail;
            this.triggerEvent("selected",{
                dayOfWeek:index[0]+1,
                timeRange:[index[1]+1,index[2]+1+this.data.indexOffset]
            })
            this.setData({
                show:false
            })
            const picker=this.selectComponent('#picker')
            picker.setIndexes([0,0,0])
            picker.setColumnValues(2, rawEnd);
          }
    },
})
