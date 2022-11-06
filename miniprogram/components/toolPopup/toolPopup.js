const app=getApp()

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
        isPopupShow:false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClose(){
            this.setData({
                isPopupShow:false
            })
        },
        onUpdateHandler(){

        },
        onChangeBgHandler(){

        },
        onNotifyHandler(){

        },
        onHelpHandler(){
            
        }
    },
    observers:{
        show:function(show){
            if(show){
            this.setData({
                isPopupShow:true
            });
            }
        }
    }
})
