// pages/user/cart/index.js
var route = require('../../../utils/service/route.js')
var cart = require('../../../utils/service/cart.js')
var url = require('../../../utils/service/url.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: cart.user.app,
                is_not_login: false,
                //分页数据
                pageData: [],

                //是否全部选中
                selectAllStatus: false,

                //支付信息
                payData: {
                        num: 0,
                        money: 0
                }
        },
        /**
         * 确认提交订单
         */
        bindConfirm: function(){
                var that = this
                var cartIds = cart.service.getSelectCart(that.data.pageData)
                if (!cartIds.length)
                        return cart.user.tool.message.showError('请选择后再操作')
                
                var jsonData = {
                        cids: cartIds,
                        ftype: 'cart'
                }

                cart.service.confirm({
                        data: jsonData,
                        success: function (res) {
                                if (res.code == 'success') {
                                        //回调处理
                                        var query = '?' + url.service.jsonToUrl(jsonData)
                                        route.service.action('userOrderForm', query)
                                } else {
                                        cart.user.tool.message.showError(res.data)
                                }
                        }
                }, function () {
                        that.setData({
                                is_not_login: true
                        })
                })
                
        },

        /**
         * 删除
         */
        bindDel: function() {
                var cartIds = cart.service.getSelectCart(this.data.pageData)
                if(!cartIds.length)
                        return cart.user.tool.message.showError('请选择后再操作')

                var that = this
                var pageData = that.data.pageData

                wx.showLoading({
                        title: '处理中..',
                })

                cart.service.del({
                        data: {
                                cid: cartIds
                        },
                        success: function (res) {
                                wx.hideLoading()
                                if (res.code == 'success') {
                                        //返回删除成功的ID（此处认为所有请求过去的都是成功的）
                                        //更新记录
                                        var newPageData = cart.service.getPageDataDel(pageData)
                                        //更新支付统计数
                                        var payData = cart.service.getPayData(newPageData)

                                        that.setData({
                                                selectAllStatus: false,
                                                pageData: JSON.stringify(newPageData) == '{}' ? false : newPageData,
                                                payData: payData
                                        })
                                } else {
                                        return cart.user.tool.message.showError(res.data)
                                }
                        }
                }, function () {
                        that.setData({
                                is_not_login: true
                        })
                })
                 
        },

        /**
         * 数量变化
         */
        bindChangeNum: function(e) {
                //店铺id
                var sid = e.currentTarget.dataset.sid
                //商品索引
                var goodsIndex = e.currentTarget.dataset.index

                //操作类型
                var action = e.currentTarget.dataset.action

                var that = this
                var data = that.data.pageData

                //购物车ID
                var cid = data[sid].goods[goodsIndex].id
                //最初数量
                var num = parseInt(data[sid].goods[goodsIndex].number)
                if (action == 'dc') {
                        num = num + 1
                } else {
                        num = num - 1
                }

                //为0不操作
                if (!num)
                        return

                wx.showLoading({
                        title: '处理中..',
                })

                cart.service.changeNum({
                        data: {
                                cid: cid,
                                num: num
                        },
                        success: function(res) {
                                wx.hideLoading()
                                if (res.code == 'success') {
                                        //数量更新
                                        data[sid].goods[goodsIndex].number = num

                                        //支付统计
                                        var payData = cart.service.getPayData(data)

                                        that.setData({
                                                pageData: data,
                                                payData: payData
                                        })
                                } else {
                                        return cart.user.tool.message.showError(res.data)
                                }
                        }
                }, function() {
                        that.setData({
                                is_not_login: true
                        })
                })
        },

        /**
         * 菜单事件
         */
        bindTap: function(e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * checkout选择事件
         */
        bindCheck: function(e) {
                var sidIndex = e.currentTarget.dataset.sid || 0
                var gidIndex = e.currentTarget.dataset.gid || 0
                var type = e.currentTarget.dataset.type

                var data = this.data.pageData
                var selectAllStatus = this.data.selectAllStatus


                //选择状态更新
                data = cart.service.rebuildDataChange(data, type, sidIndex, gidIndex, selectAllStatus)

                //支付统计
                var payData = cart.service.getPayData(data.pageData)

                this.setData({
                        pageData: data.pageData,
                        selectAllStatus: data.selectAllStatus,
                        payData: payData
                })

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '购物车'
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                wx.showLoading({
                        title: '加载中',
                })
                var that = this
                //登录验证
                cart.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                cart.service.getAllList({
                        success: function (res) {
                                if (res.code == 'success') {
                                        that.setData({
                                                //pageData: res.data,
                                                pageData: JSON.stringify(res.data) == '{}' ? false : res.data,
                                                //是否全部选中
                                                selectAllStatus: false,

                                                //支付信息
                                                payData: {
                                                        num: 0,
                                                        money: 0
                                                }
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