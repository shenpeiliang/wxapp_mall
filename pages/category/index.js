// pages/category/index.js
//参考https://www.jianshu.com/p/e5d90ebe9214
var goods = require('../../utils/service/goods.js')
var route = require('../../utils/service/route.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: goods.app,
                windowHeight: 0,

                prefix: 'cate_', //ID前缀
                currentTab: 'cate_0', //默认跳转到的ID

                data: null,
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
         * 跳转处理
         */
        bindLinkTap: function(e) {
                //设置搜索条件
                goods.service.setSearchQuery({
                        sort: e.currentTarget.dataset.cid
                })

                route.service.action('goodsList')
        },
        /** 
         * 点击tab切换 
         */
        swichNav: function (e) {
                var that = this;
                var curentTab = this.data.prefix + e.target.dataset.id
                if (this.data.currentTab == curentTab) {
                        return false;
                } else {
                        that.setData({
                                toView: curentTab
                        })
                }
        },
        bindScroll: function (e) {
                this.matching(e.detail.scrollTop)
        },
        /**
         * 匹配滚动楼层
         */
        matching: function (scrollToVal) {
                //获取各节点信息
                let query = wx.createSelectorQuery()
                let that = this

                query.selectAll('.section-area').fields({
                        size: true, //尺寸
                        rect: true//位置
                })
                query.exec(function (res) {
                        let rangeStart = 0 //开始区间
                        let dom = res[0]
                        for (let i = 0; i < dom.length; i++) {
                                
                                if (scrollToVal >= rangeStart && scrollToVal <= rangeStart + dom[i].height) {
                                        that.setData({
                                                currentTab: that.data.prefix + i
                                        })
                                        break;
                                }
                                rangeStart = rangeStart + dom[i].height
                        }
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                wx.setNavigationBarTitle({ title: '商品分类' })               
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                wx.showLoading({
                        title: '加载中',
                })

                var that = this
                goods.service.getCategory({
                        resolve: function (e) {
                                that.setData({
                                        data: e.data
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