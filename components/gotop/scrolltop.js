// components/gotop/scrolltop.js
Component({
        /**
         * 组件的属性列表
         */
        properties: {
                //是否显示
                isShowFloor: {
                        type: Boolean,
                        value: true
                },
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
                //滚动按钮是否显示
                scrollToUpper: function (e) {
                        var param =  'isShowFloor'
                        if (e.detail.scrollTop > 50) {
                                this.setData({
                                        [param]: false
                                });
                        } else {
                                this.setData({
                                        [param]: true
                                });
                        }
                },
                //滚动到顶部
                goTop: function () {
                        this.triggerEvent('myEvent')
                },  
        }
})
