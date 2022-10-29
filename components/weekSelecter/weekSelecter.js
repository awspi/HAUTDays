// components/weekSelecter/weekSelecter.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show:{
            type:Boolean,
            value:false
        },
        totalWeeks:{
            type:Number
        },
        current:{
            type:Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        firstId:"id10"
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSwiperChange(e){
            const index=e.currentTarget.dataset.current
            console.log(index);
            this.setData({
                current:index,
                firstId:"id"+(index-2)

            })
            this.triggerEvent('change',{
                current:index
            })
        }
    },
    observers:{
        current:function(id){
            if(id){
                this.setData({
                    firstId:`id${id-2}`
                });
            }
        },
    },
})
