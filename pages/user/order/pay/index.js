// pages/user/order/pay/index.js
var route = require('../../../../utils/service/route.js')
var order = require('../../../../utils/service/order.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: order.user.app,

                pageData: [], //页面列表

                id: 0,

                jsapiParams: {}, //微信支付参数

                is_not_login: false,
        },
        

        /**
         * 菜单事件
         */
        bindTap: function(e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 发起微信支付
         */
        wechat_pay: function(jsapiParams){
                //发起支付请求
                wx.requestPayment({
                        timeStamp: jsapiParams.timeStamp,
                        nonceStr: jsapiParams.nonceStr,
                        package: jsapiParams.package,
                        signType: 'MD5',
                        paySign: jsapiParams.paySign,
                        success(res) {
                                console.log(res)
                                order.user.tool.message.showSuccess('支付成功', function () {
                                        //跳转到支付成功页面

                                })
                        },
                        fail(res) {
                                console.log(res)
                                order.user.tool.message.showError('支付失败')
                        }
                })
        },

        /**
         * 发起支付
         */
        bindConfirm: function(e) {
                var pid = e.currentTarget.dataset.pid
                var that = this
                //登录验证
                order.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                //第二次支付操作
                if (that.data.jsapiParams.length)
                        return that.wechat_pay(that.data.jsapiParams)

                wx.showLoading({
                        title: '加载中',
                })

                order.service.pay({
                        data: {
                                pid: pid
                        },
                        success: function (res) {
                                if (res.code == 'success') {
                                        var jsapiParams = res.data
                                        that.wechat_pay(jsapiParams)
                                }else{
                                        return order.user.tool.message.showError(res.data)
                                }
                        }
                }, function () {
                        that.setData({
                                is_not_login: true
                        })
                })
                wx.hideLoading()                
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                var id = options.id || 0

                this.setData({
                        id: id
                })

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '订单支付'
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                var that = this
                //登录验证
                order.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                wx.showLoading({
                        title: '加载中',
                })

                order.service.getPay({
                        data: {
                                id: that.data.id
                        },
                        success: function(res) {
                                if (res.code == 'success') {
                                        that.setData({
                                                pageData: res.data
                                        })
                                }
                        }
                }, function() {
                        that.setData({
                                is_not_login: true
                        })
                })
                wx.hideLoading()
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function() {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function() {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function() {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {

        }
})