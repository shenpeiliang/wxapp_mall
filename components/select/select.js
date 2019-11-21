// components/select/select.js
/*
https://www.cnblogs.com/zjjDaily/p/9548433.html
<my-select prop-array='{{selectArray}}' bindSelectEvent='bindSelectEvent'/>
*/
Component({
        /**
         * 组件的属性列表
         */
        properties: {
                innerText: {
                        type: String,
                        value: 'default value',
                },
                width: { //宽度
                        type: String,
                        value: '400rpx'
                },
                propArray: { //option选项
                        type: Array,
                        value: []
                }
        },

        /**
         * 组件的初始数据
         */
        data: {
                selectShow: false, //初始option不显示
                //初始内容
                optionSelected: {
                        id: 0,
                        text: '请选择'
                },
                animationData: {} //右边箭头的动画
        },

        /**
         * 组件的方法列表
         */
        methods: {
                //option是否显示
                selectToggle: function() {
                        var nowShow = this.data.selectShow //获取当前option显示的状态
                        //创建动画
                        var animation = wx.createAnimation({
                                timingFunction: "ease"
                        })
                        this.animation = animation
                        if (nowShow) {
                                animation.rotate(0).step()
                                this.setData({
                                        animationData: animation.export()
                                })
                        } else {
                                animation.rotate(180).step()
                                this.setData({
                                        animationData: animation.export()
                                })
                        }
                        this.setData({
                                selectShow: !nowShow
                        })
                },
                //设置内容
                setText: function(e) {
                        //option配置项
                        var options = this.properties.propArray

                        //当前点击的索引
                        var index = e.target.dataset.index

                        //值
                        var textVal = options[index].text
                        var idVal = options[index].id


                        //再次执行动画
                        this.animation.rotate(0).step()
                        this.setData({
                                selectShow: false,
                                optionSelected: {
                                        id: idVal,
                                        text: textVal
                                },
                                animationData: this.animation.export()
                        })
                }

        },
        bindSelectEvent(optionVal) {
                //触发事件
                this.triggerEvent("bindSelectEvent", optionVal)
        }
})