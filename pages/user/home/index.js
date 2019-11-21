// pages/user/home/index.js
var user = require('../../../utils/service/user.js')
var route = require('../../../utils/service/route.js')

Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: user.app,
                is_not_login: false
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                wx.showLoading({
                        title: '加载中',
                })
                //登录验证
                user.service.checkLogin(callback => {
                        this.setData({
                                is_not_login: true
                        })
                })
        },

        /**
         * 菜单事件
         */
        bindTap: function(e){
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param) 
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '会员中心'
                })
                wx.hideLoading()
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