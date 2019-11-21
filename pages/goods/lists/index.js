//index.js
const tool = require('../../../utils/tool.js')
const goods = require('../../../utils/service/goods.js')

var route = require('../../../utils/service/route.js')

Page({
        data: {
                app: tool.app,
                goods: [], //商品
                page: 0,
                curentPage: 0,
                isLoading: true,
                isLoadComplete: true,

                topNum: 0, //滚动位置
                searchQuery: {
                        keyword: '',
                        sort: 0,
                        sort_1: 0,
                        order: 'default'
                }, //查询条件

                 windowHeight: 0,

                 priceOrderType: '', //价格排序,

        },

        /**
         * 查看所有商品 - 取消条件
         */
        bindGetAll: function(e){
                this.setData({
                        searchQuery:  {
                                keyword: '',
                                sort: 0,
                                sort_1: 0,
                                order: 'default'
                        }   
                })
                //获取数据
                this.getGoods()
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
        scrollTop: function() {
                this.setData({
                        topNum: 0
                })
        },

        /********************************滚动组件e******************************** */

        //商品详情页
        bindTap: function(e) {
                route.service.action(e.currentTarget.dataset.route, '?id=' + e.currentTarget.dataset.id)
        },

        /**
         * 排序
         */
        bindOrder: function(e){
                var order = e.currentTarget.dataset.otype
                var searchQuery = this.data.searchQuery
                searchQuery.order = order

                //价格排序
                var priceOrderType = this.data.priceOrderType
                if (order == 'price') {
                        priceOrderType = priceOrderType == 'asc' ? 'desc' : 'asc'
                }else{
                        priceOrderType = ''
                }

                this.setData({
                        searchQuery: searchQuery,
                        priceOrderType: priceOrderType
                })

                //获取数据
                this.getGoods()

        },

        //获取商品
        getGoods: function() {
                wx.showLoading({
                        title: '加载中',
                })
                var that = this;
                
                var query = that.data.searchQuery
                var priceOrderType = that.data.priceOrderType
                
                //搜索条件 - 全局
                var queryGlobal = goods.service.getSearchQuery()

                if (queryGlobal.keyword)
                        query.keyword = queryGlobal.keyword

                if (queryGlobal.sort)
                        query.sort = queryGlobal.sort


                that.setData({
                        searchQuery: query
                })

                goods.service.getGoods({
                        sort_1: query.sort || 0, //分类
                        keyword: query.keyword || '', //关键词
                        order: query.order, //排序
                        price_order: priceOrderType, //价格排序
                        resolve: function(e) {
                                that.setData({
                                        goods: e.data.lists,
                                        page: e.data.page
                                });
                        }
                });
                
                wx.hideLoading()
        },

        onLoad: function(options) {
                var winHeight
                var that = this
                wx.getSystemInfo({
                        success: function (res) {
                                winHeight = res.windowHeight
                        }
                });


                //获取分类
                goods.service.getCategory({
                        resolve: function (e) {
                                that.setData({
                                        categoryData: e.data
                                })
                        }
                })

                that.setData({
                        windowHeight: winHeight
                })
        },
        onShow: function() {
                //获取商品 每次查询参数都不一样      
                this.getGoods()
        },
        onReady() {
                wx.setNavigationBarTitle({
                        title: '商品列表'
                })
        },
        /**
         *下拉加载更多数据
         */
        lower: function() {
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

                var query = that.data.searchQuery
                var page = that.data.curentPage + 1

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

                goods.service.getGoods({
                        keyword: query.keyword || '', //关键词
                        order: query.order || 0, //排序
                        sort_1: query.sort || 0, //分类
                        page: page,
                        resolve: function(res) {
                                that.setData({
                                        goods: that.data.goods.concat(res.data.lists),
                                        pageNum: res.data.page,
                                        curentPage: page,
                                        isLoadComplete: true,
                                        isLoading: true
                                })
                        }
                })
        }

})