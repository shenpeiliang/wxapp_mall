//index.js
const tool = require('../../utils/tool.js')
const goods = require('../../utils/service/goods.js')

var route = require('../../utils/service/route.js')

Page({
        data: {
                app: tool.app,
                navs: [], //导航

                slides: [], //幻灯片
                //幻灯片配置
                indicatorDots: true,
                indicatorActiveColor: '#fff',
                autoplay: true,
                interval: 5000,
                duration: 1000,

                goods: [] //商品
        },
        onMyEvent: function(e) {
                console.log(e)
        },
        //导航栏跳转事件
        bindNavTap: function(e) {
                if (e.currentTarget.dataset.type == 'switch') {
                        wx.switchTab({
                                url: e.currentTarget.dataset.url
                        })
                } else {
                        wx.navigateTo({
                                url: e.currentTarget.dataset.url
                        })
                }
        },
        //幻灯片栏跳转事件
        bindSlideTap: function(e) {
                wx.navigateTo({
                        url: e.currentTarget.dataset.url
                })
        },
        /**
         * 菜单事件
         */
        bindTap: function(e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },
        //获取导航信息
        getNavs: function() {
                return [{
                                name: '天猫',
                                url: '../goods/lists/index',
                                icon: '../../images/icon-nav-01.png',
                                route: 'goodsList'
                        },
                        {
                                name: '聚划算',
                                url: '../goods/lists/index',
                                icon: '../../images/icon-nav-02.png',
                                route: 'goodsList'
                        },
                        {
                                name: '天猫国际',
                                url: '../goods/lists/index',
                                icon: '../../images/icon-nav-03.png',
                                route: 'goodsList'
                        },
                        {
                                name: '外卖',
                                url: '../goods/lists/index',
                                icon: '../../images/icon-nav-04.png',
                                route: 'goodsList'
                        },
                        {
                                name: '天猫超市',
                                url: '../goods/lists/index',
                                icon: '../../images/icon-nav-05.png',
                                route: 'goodsList'
                        },
                        {
                                name: '分类',
                                url: '../category/index',
                                icon: '../../images/icon-nav-06.png',
                                route: 'category'
                        },
                ]
        },
        //获取幻灯片
        getSlides: function() {
                return [{
                                img: '../../images/slide-1.jpg',
                                url: '../goods/detail/index?id=54'
                        },
                        {
                                img: '../../images/slide-2.jpg',
                                url: '../goods/detail/index?id=54'
                        },
                        {
                                img: '../../images/slide-1.jpg',
                                url: '../goods/detail/index?id=54'
                        },
                        {
                                img: '../../images/slide-2.jpg',
                                url: '../goods/detail/index?id=54'
                        },
                ]
        },
        getGoods: function() {
                goods.service.getGoods({
                        count: 6,
                        resolve: e => {
                                this.setData({
                                        goods: e.data.lists
                                });
                        }
                });
        },
        onShow: function() {
                wx.showLoading({
                        title: '加载中',
                })

                this.getGoods()
                this.setData({
                        navs: this.getNavs(),
                        slides: this.getSlides()
                })

                wx.hideLoading()

        },
        onLoad: function() {

                //用户信息回调 之后可能才接收到响应
                /*tool.app.userInfoReadyCallback = res => {
                        tool.user.userInfoReadyCallback(res.userInfo)
                }*/
        },
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '首页'
                })
        }
})