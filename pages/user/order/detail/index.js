// pages/user/order/detail/index.js
var route = require('../../../../utils/service/route.js')
var order = require('../../../../utils/service/order.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: order.user.app,
                id: 0, //项目ID
                pageData: [], //页面列表

                is_not_login: false,
        },

        /**
         * 复制
         */
        bindCopy: function(e){
               var sn = e.currentTarget.dataset.sn
                wx.setClipboardData({
                        data: sn,
                        success(res) {
                                order.user.tool.message.showSuccess('复制成功')
                        }
                })
        },

        /**
        * 菜单事件
        */
        bindTap: function (e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.setData({
                        id: options.id
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                wx.setNavigationBarTitle({
                        title: '订单详情'
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
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

                order.service.getDetail({
                        data: {
                                id: that.data.id
                        },
                        success: function (res) {
                                if (res.code == 'success') {
                                        that.setData({
                                                pageData: res.data
                                        })
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
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})