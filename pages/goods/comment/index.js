// pages/goods/comment/index.js
const tool = require('../../../utils/tool.js')
const goods = require('../../../utils/service/goods.js')
const util = require('../../../utils/util.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: tool.app,
                lists: [],
                page: 1,
                curentPage: 1,
                isLoading: true,
                isLoadComplete: true,
                id: 0, //项目ID
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.setData({
                        id: options.id,
                })
        },
        /**
         *下拉加载更多数据
        */
        lower: function () {
                if (this.data.page == this.data.curentPage) {
                        if (this.data.isLoadComplete) {
                                this.setData({
                                        isLoadComplete: false
                                })
                        }

                        return
                }

                this.setData({
                        isLoading: false
                })
                var that = this
                
                goods.service.getGoods({
                        resolve: function (e) {
                                var responseData = e.data.lists.map(function (item, index, arr) {
                                        arr[index].dateline = util.customFormatTime(item.dateline, 'Y年M月D日 h:m')
                                        return arr[index]
                                })
                                that.setData({
                                        lists: responseData,
                                        curentPage: ++that.data.curentPage,
                                        isLoading: true
                                })
                        }
                        
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                wx.setNavigationBarTitle({ title: '商品评论' })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                wx.showLoading({
                        title: '加载中',
                })

                var that = this

                goods.service.getGoodsDetailComment({
                        gid: that.data.id,
                        resolve: function (e) {
                                var responseData = e.data.lists.map(function (item, index, arr) {
                                        arr[index].dateline = util.customFormatTime(item.dateline, 'Y年M月D日 h:m')
                                        return arr[index]
                                })
                                that.setData({
                                        lists: responseData,
                                })
                        }
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