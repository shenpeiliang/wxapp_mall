// pages/article/detail/index.js
const article = require('../../../utils/service/article.js')
const util = require('../../../utils/util.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                pageData: [],
                topNum: 0, //滚动条位置

                id: 0, //参数ID
        },

        /********************************滚动组件s******************************** */
        /**
         * 滚动事件
         */
        bindScroll: function(e) {
                this.selectComponent("#scrolltop").scrollToUpper(e)
        },
        /**
         * 滚动到头部
         */
        scrollTop: function(){
                this.setData({
                        topNum: 0
                })
        },

        /********************************滚动组件e******************************** */

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.setData({
                        id: options.id,
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                wx.setNavigationBarTitle({
                        title: '详情'
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                wx.showLoading({
                        title: '加载中',
                })
                var that = this
                article.service.getDetail({
                        id: that.data.id,
                        success: function (res) {
                                if (res.code == 'success') {
                                        var data = res.data
                                        data.dateline = util.customFormatTime(data.dateline, 'Y年M月D日 h:m')
                                        data.small_img = article.app.globalData.imgServer + data.small_img

                                        data.content = article.tool.common.rebuildRichTextData(data.content)

                                        that.setData({
                                                pageData: data
                                        })

                                }

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
                var that = this
                return {
                        title: that.data.pageData.title,
                        path: '/pages/article/detail/index?id=' + that.data.id,
                        imageUrl: that.data.pageData.small_img
                }
        }
})