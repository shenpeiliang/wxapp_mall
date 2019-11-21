// pages/user/safe/index.js
var route = require('../../../../utils/service/route.js')
var user = require('../../../../utils/service/user.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                is_not_login: false,
        },

        /**
        * 菜单事件
        */
        bindTap: function (e) {
                route.service.action(e.currentTarget.dataset.route)
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                wx.showLoading({
                        title: '加载中',
                })
                //登录验证
                user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                wx.setNavigationBarTitle({
                        title: '安全中心'
                })
                wx.hideLoading()
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

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