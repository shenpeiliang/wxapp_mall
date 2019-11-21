// pages/user/order/lists/index.js
var route = require('../../../../utils/service/route.js')
var order = require('../../../../utils/service/order.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: order.user.app,
                windowHeight: 0,
                tabs: order.service.getTabs(), //导航
                currentTab: 0,

                is_not_login: false,

                orderStatus: 0, //当前要查看的订单类型

                num1: 30,
                pageData: [{
                        lists: [],
                        page: 0,
                        curentPage: 0,
                        isLoading: true,
                        isLoadComplete: true
                }, {
                        lists: [],
                        page: 0,
                        curentPage: 0,
                        isLoading: true,
                        isLoadComplete: true
                }, {
                        lists: [],
                        page: 0,
                        curentPage: 0,
                        isLoading: true,
                        isLoadComplete: true
                }, {
                        lists: [],
                        page: 0,
                        curentPage: 0,
                        isLoading: true,
                        isLoadComplete: true
                }, {
                        lists: [],
                        page: 0,
                        curentPage: 0,
                        isLoading: true,
                        isLoadComplete: true
                }, {
                        lists: [],
                        page: 0,
                        curentPage: 0,
                        isLoading: true,
                        isLoadComplete: true
                }, ], //页面列表
        },
        /**
         * 菜单事件
         */
        bindTap: function(e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 取消订单
         */
        bindCancel: function(e) {
                var id = e.currentTarget.dataset.id
                var that = this
                //登录验证
                order.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                wx.showLoading({
                        title: '处理中..',
                })

                order.service.cancel({
                        data: {
                                id: id
                        },
                        success: function (res) {
                                if (res.code == 'success') {
                                        order.user.tool.message.showSuccess(res.data, function(){
                                                //刷新
                                                route.service.redirect('userOrderList')
                                        })                                        
                                } else {
                                        order.user.tool.message.showError(res.data)
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
         * 确认收货
         */
        bindReceive: function (e) {
                var id = e.currentTarget.dataset.id
                var that = this
                //登录验证
                order.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                wx.showLoading({
                        title: '处理中..',
                })

                order.service.receive({
                        data: {
                                id: id
                        },
                        success: function (res) {
                                if (res.code == 'success') {
                                        order.user.tool.message.showSuccess(res.data, function () {
                                                //刷新
                                                route.service.redirect('userOrderList')
                                        })
                                } else {
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
         * 滑动事件
         */
        tabChange(event) {
                var status = event.detail.current
                this.setData({
                        currentTab: status,
                        orderStatus: status
                })

                //获取列表数据
                this.getPageList()
        },
        /**
         * 选择标签
         */
        selectTab(event) {
                var status = event.currentTarget.dataset.index
                this.setData({
                        currentTab: status,
                        orderStatus: status
                })
        },

        /**
         * 滚动到底部
         */
        lower: function(e) {
                var that = this
                //类型
                var status = that.data.orderStatus

                //当前数据
                var curentData = that.data.pageData[status]
                //当前分页
                var curentPage = curentData.curentPage

                var page = curentPage + 1;
                if (curentData.page == page) {
                        that.data.pageData[status].isLoading = true
                        that.data.pageData[status].isLoadComplete = false
                        that.setData({
                                pageData: that.data.pageData
                        })

                        return
                }
                
                //获取列表数据
                that.getPageList(page)
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                var winHeight
                wx.getSystemInfo({
                        success: function(res) {
                                winHeight = res.windowHeight
                        }
                });
                var status = options.id || 0
                this.setData({
                        windowHeight: winHeight,
                        currentTab: status,
                        orderStatus: status
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '我的订单'
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
                //获取列表数据
                that.getPageList()
        },

        /**
         * 获取列表数据
         */
        getPageList: function(pageNum) {
                var pageNum = pageNum || 0
                var that = this
                //类型
                var status = that.data.orderStatus

                var pageData = that.data.pageData


                //是否已经请求获取过数据了
                if (pageData[status].page)
                        return

                wx.showLoading({
                        title: '加载中',
                })


                order.service.getAllList({
                        data: {
                                status: status
                        },
                        success: function(res) {
                                if (res.code == 'success') {
                                        pageData[status].lists = res.data.lists,
                                        pageData[status].page = res.data.page

                                        //分页
                                        if (pageNum)
                                                pageData[status].curentPage = pageNum

                                        that.setData({
                                                pageData: pageData
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