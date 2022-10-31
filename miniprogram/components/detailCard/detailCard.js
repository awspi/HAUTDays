// components/detailCard/detailCard.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
    lesson:{
        type:Object
    },
    show:{
        type:Boolean,
        value:false
    }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isDetailCardVisible:false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClose() {
            this.setData({ isDetailCardVisible: false });
        },
    },
    observers:{
        show:function(show){
            if(show){
            this.setData({
                isDetailCardVisible:true
            });
            }
        }
    }
})
