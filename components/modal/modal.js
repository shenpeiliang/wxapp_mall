// components/modal.js
Component({
        /**
         * 组件的属性列表
         */
        properties: {
                //是否Y轴滚动
                scrollY: {
                        type: Boolean,
                        value: true
                },
                //是否显示modal
                show: {
                        type: Boolean,
                        value: false
                },
                isShowClose: {
                        type: Boolean,
                        value: false   
                },
                //modal的高度
                height: {
                        type: String,
                        value: '80%'
                },
                width: {
                        type: String,
                        value: '90%'
                },
                //是否显示btn
                showBtn: {
                        type: Boolean,
                        value: true
                }
        },

        /**
         * 组件的初始数据
         */
        data: {
                
        },

        /**
         * 组件的方法列表
         */
        methods: {
                clickMask: function() {
                        this.setData({show: false})
                },
                clickContent: function(){},

                cancel: function() {
                        this.setData({ show: false })
                },

                confirm: function() {
                        this.triggerEvent('myEvent')
                }
                
        }
})
