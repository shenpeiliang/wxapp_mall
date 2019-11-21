// pages/article/lists/index.js
const article = require('../../../utils/service/article.js')
const util = require('../../../utils/util.js')
const route = require('../../../utils/service/route.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                title: '',
                pageData: [],
                pageNum: 0,
                topNum: 0, //滚动条位置

                curentPage: 0,
                isLoading: true,
                isLoadComplete: true,
        },

        /********************************滚动组件s******************************** */
        /**
         * 滚动事件
         */
        bindScroll: function (e) {
                this.selectComponent("#scrolltop").scrollToUpper(e)
        },
        /**
         * 滚动到头部
         */
        scrollTop: function () {
                this.setData({
                        topNum: 0
                })
        },

        /********************************滚动组件e******************************** */
        
        /**
         * 菜单事件
         */
        bindTap: function (e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         *下拉加载更多数据
         */
        lower: function() {
                var that = this
                var page = that.data.curentPage + 1;
                if (that.data.pageNum == page) {
                        that.setData({
                                isLoadComplete: false,
                                isLoading: true
                        })

                        return
                }

                that.setData({
                        isLoading: false
                })
             
                article.service.getPageList({
                        page: page,
                        success: function (res) {
                                if (res.code == 'success') {
                                        var data = res.data.lists.map(function (item, index, arr) {
                                                arr[index].dateline = util.customFormatTime(item.dateline, 'Y年M月D日 h:m')
                                                arr[index].small_img = article.app.globalData.imgServer + item.small_img
                                                return arr[index]
                                        })

                                        that.setData({
                                                pageData: that.data.pageData.concat(data),
                                                pageNum: res.data.page,
                                                curentPage: page,
                                                isLoadComplete: true,
                                                isLoading: true
                                        })
                                }

                        }
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
                
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                wx.showLoading({
                        title: '加载中',
                })
                var that = this
                var title = '图文列表'
                article.service.getPageList({
                        success: function (res) {
                                if ('sort' in res.data)
                                        title = res.data.sort
                                if (res.code == 'success') {
                                        var data = res.data.lists.map(function (item, index, arr) {
                                                arr[index].dateline = util.customFormatTime(item.dateline, 'Y年M月D日 h:m')
                                                arr[index].small_img = article.app.globalData.imgServer + item.small_img
                                                return arr[index]
                                        })

                                        that.setData({
                                                pageData: data,
                                                pageNum: res.data.page
                                        })

                                        //设置动态标题栏
                                        wx.setNavigationBarTitle({
                                                title: title
                                        })
                                }

                        }
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