// pages/search/index.js
var goods = require('../../utils/service/goods.js')
var route = require('../../utils/service/route.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                windowHeight: 0,
        },


        /**
         * 绑定搜索事件处理
         */
        searchEvent: function(param) {
                //设置搜索条件
                goods.service.setSearchQuery({
                        keyword: param.detail
                })

                route.service.action('goodsList')
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                var winHeight
                wx.getSystemInfo({
                        success: function (res) {
                                winHeight = res.windowHeight
                        }
                });
                this.setData({
                        windowHeight: winHeight
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({ title: '搜索' })     
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {

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