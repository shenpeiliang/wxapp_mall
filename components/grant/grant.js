// components/grant.js
var user = require('../../utils/service/user.js')

var url = require('../../utils/service/url.js')
var route = require('../../utils/service/route.js')

Component({
        /**
         * 组件的属性列表
         */
        properties: {
                //是否显示modal
                show: {
                        type: Boolean,
                        value: false
                }
        },

        /**
         * 组件的初始数据
         */
        data: {
                 //判断小程序的API，回调，参数，组件等是否在当前版本可用。
                canIUse: wx.canIUse('button.open-type.getUserInfo'),
                show: true
        },

        /**
         * 组件的方法列表
         */
        methods: {
                //绑定获取用户信息事件
                bindGetUserInfo: function(e){
                        //获取用户                        
                        user.service.userInfoReadyCallback(e.detail, callback => {
                                this.setData({
                                        show: false
                                })
                                //获取当前页面地址并刷新
                                var currentUri = route.service.getRouteDesByUri(url.service.getCurentPageBaseUrl())
                                route.service.action(currentUri)
                        })
                        
                },
        }
})
