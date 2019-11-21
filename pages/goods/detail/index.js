//index.js
const goods = require('../../../utils/service/goods.js')
const util = require('../../../utils/util.js')

var route = require('../../../utils/service/route.js')
var cart = require('../../../utils/service/cart.js')
var order = require('../../../utils/service/order.js')
var url = require('../../../utils/service/url.js')

Page({
        data: {
                app: goods.tool.app,
                windowHeight: 0,

                slides: [], //幻灯片
                //幻灯片配置
                indicatorDots: true,
                indicatorActiveColor: '#fff',
                autoplay: true,
                interval: 5000,
                duration: 1000,

                goods: {}, //商品
                tabs: [], //标签
                curentTabIndex: 0, //当前tab索引


                isShowFloor: true, //滚动按钮是否显示
                isLoading: false, //正在加载

                isShowModal: false, //规格窗口
                goodsSpecDefaultImg: '', //默认规格图片

                selectSpecData: { //选择的商品规格
                        sid: 0,
                        quantity: 1,

                        price: 0,
                        sku: 0
                },
                numAcZero: 'num-ac-zero', //当前购买数是否为0的样式

                id: 0, //项目ID

                is_not_login: false, //是否已经登录
                dataAction: '', //购物车操作还是订单操作
        },

        /**
         * 图片预览
         */
        bindPreviewImg: function(e){
                var src = e.currentTarget.dataset.src || ''

                var uris = []

                if (src.length){
                        var uris = [src]
                }else{
                        var slides = this.data.slides
                        slides.map(function (item, key, arr) {
                                uris.push(item.img)
                        })
                }
                
                wx.previewImage({
                        urls: uris
                })
        },

        /**
         * 操作按钮 购物车、购买
         */
        bindShowModal: function(e) {
                var dataAction = e.currentTarget.dataset.action
                this.setData({
                        isShowModal: true,
                        dataAction: dataAction || ''
                })
        },

        /********************************滚动组件s******************************** */
        /**
         * 滚动事件
         */
        bindScroll: function(event) {
                /*
                页面会出现抖动情况，可能是手机比较卡，先暂时不记录滚动位置了

                var that = this
                var tabs = that.data.tabs
                var index = that.data.curentTabIndex

                tabs[index].topNum = event.detail.scrollTop

                that.setData({
                        tabs: tabs
                })
                */
        },
        /********************************滚动组件e******************************** */

        //tab配置项
        tabConfig: function() {
                this.setData({
                        tabs: [{
                                        title: '商品介绍',
                                        'content': [],
                                        topNum: 0, //滚动条位置
                                },
                                {
                                        title: '规格与包装',
                                        'content': [],
                                        topNum: 0, //滚动条位置
                                },
                                {
                                        title: '售后保障',
                                        'content': [],
                                        topNum: 0, //滚动条位置
                                },
                                {
                                        title: '商品评论',
                                        'content': [],
                                        topNum: 0, //滚动条位置
                                }
                        ]
                })
        },

        //数量变化
        changeNum: function(e) {
                var action = e.currentTarget.dataset.action
                var selectSpecData = this.data.selectSpecData


                if (action == 'ac') {
                        if (selectSpecData.quantity == 1) {
                                this.setData({
                                        numAcZero: 'num-ac-zero'
                                })
                                return;
                        }
                        selectSpecData.quantity = selectSpecData.quantity - 1
                } else {
                        if (selectSpecData.sku <= selectSpecData.quantity) {
                                return;
                        }
                        selectSpecData.quantity = selectSpecData.quantity + 1
                }

                var numAcZero = ''
                if (selectSpecData.quantity == 1) {
                        numAcZero = 'num-ac-zero'
                }

                this.setData({
                        numAcZero: numAcZero,
                        selectSpecData: selectSpecData
                })
        },

        //规格选择
        goodsSpecSelect: function(e) {
                var id = e.currentTarget.dataset.id
                var image = e.currentTarget.dataset.image
                var sku = e.currentTarget.dataset.sku
                var price = e.currentTarget.dataset.price

                var selectSpecData = this.data.selectSpecData


                selectSpecData.sid = id
                selectSpecData.sku = sku
                selectSpecData.price = price

                this.setData({
                        goodsSpecDefaultImg: image,
                        selectSpecData: selectSpecData
                })
        },
        /**
         * 点击事件
         */
        bindTap: function(e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 获取数据
         */
        getPageData: function(index) {
                var that = this
                var tabs = that.data.tabs

                if (index == 1 && !tabs[1].content.length) { //规格与包装
                        that.setData({
                                isLoading: false
                        })
                        goods.service.getGoodsDetailCon({
                                gid: that.data.goods.id,
                                type: 'param',
                                resolve: function(e) {
                                        tabs[1].content = goods.tool.common.rebuildRichTextData(e.data)
                                        //必须再次更新数组数据，否则无效
                                        that.setData({
                                                tabs: tabs,
                                        })
                                }
                        })
                } else if (index == 2 && !tabs[2].content.length) { //售后保障
                        that.setData({
                                isLoading: false
                        })

                        goods.service.getGoodsDetailCon({
                                gid: that.data.goods.id,
                                type: 'safe',
                                resolve: function(e) {
                                        tabs[2].content = goods.tool.common.rebuildRichTextData(e.data)
                                        that.setData({
                                                tabs: tabs,
                                        })
                                }
                        })
                } else if (index == 3 && !('lists' in tabs[3].content)) { //商品评论
                        that.setData({
                                isLoading: false
                        })

                        goods.service.getGoodsDetailComment({
                                gid: that.data.goods.id,
                                resolve: function(e) {
                                        e.data.lists = e.data.lists.map(function(item, index, arr) {
                                                arr[index].dateline = util.customFormatTime(item.dateline, 'Y年M月D日 h:m')
                                                return arr[index]
                                        })
                                        tabs[3].content = e.data
                                        that.setData({
                                                tabs: tabs,
                                        })
                                }
                        })
                }
                this.setData({
                        tabs: tabs,
                        curentTabIndex: index,
                        isLoading: true
                })
        },

        /**
         * 滑动事件
         */
        tabChange: function(event) {
                var index = event.detail.current
                this.getPageData(index)
        },

        /**
         * 选择标签
         */
        selectTab(event) {
                var index = event.currentTarget.dataset.index
                this.setData({
                        curentTabIndex: index
                })

        },

        onLoad: function(params) {
                var winHeight
                wx.getSystemInfo({
                        success: function(res) {
                                winHeight = res.windowHeight
                        }
                });

                this.setData({
                        windowHeight: winHeight,
                        id: params.id
                })
        },
        onShow: function() {
                wx.showLoading({
                        title: '加载中',
                })
                this.tabConfig()
                var that = this
                var tabs = that.data.tabs

                var selectSpecData = this.data.selectSpecData

                goods.service.getGoodsDetail({
                        gid: that.data.id,
                        resolve: function(e) {
                                tabs[0].content = goods.tool.common.rebuildRichTextData(e.data.content)

                                selectSpecData.sku = e.data.repertory
                                selectSpecData.price = e.data.price

                                //图片路径处理
                                var slides = []
                                if (e.data.images_list.length){
                                        slides = e.data.images_list
                                        slides.map(function (item, key, arr) {
                                                item.img = that.data.app.globalData.imgServer + item.img
                                        })
                                }

                                that.setData({
                                        goodsSpecDefaultImg: goods.tool.app.globalData.imgServer + e.data.small_img,
                                        goods: e.data,
                                        slides: slides,
                                        tabs: tabs,
                                        isLoading: true,
                                        selectSpecData: selectSpecData
                                });
                        }
                })
                wx.hideLoading()
        },
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '商品详情'
                })
        },
        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {
                var that = this
                return {
                        title: that.data.goods.title,
                        path: '/pages/goods/detail/index?id=' + that.data.id,
                        imageUrl: goods.tool.app.globalData.imgServer + that.data.goods.small_img
                }
        },
        /**
         * 确认提交事件
         */
        bindConfirm: function() {
                var that = this
                var obj = that.data.dataAction == 'cart' ? cart : order

                var data = {
                        gid: that.data.id,
                        sid: that.data.selectSpecData.sid,
                        quantity: that.data.selectSpecData.quantity,
                        ftype: that.data.dataAction
                }
                if (!data.sid)
                        return obj.user.tool.message.showError('请选择商品规格')

                obj.service.save({
                        data: data,
                        success: function(res) {
                                if (res.code == 'success') {
                                        //回调处理
                                        that.callbackFuction(res, that.data.dataAction)
                                } else {
                                        obj.user.tool.message.showError(res.data)
                                }
                        }
                }, function() {
                        that.setData({
                                is_not_login: true
                        })
                })
        },
        /**
         * 回调方法
         */
        callbackFuction: function(res, action) {
                var actions = {
                        cart: this.confirmCallbackCart,
                        order: this.confirmCallbackOrder
                }

                actions[action](res)
        },
        /**
         * 提交成功回调 - 购物车
         */
        confirmCallbackCart: function(res) {
                var that = this
                cart.user.tool.message.showSuccess(res.data, function() {
                        //恢复初始值
                        that.setData({
                                selectSpecData: { //选择的商品规格
                                        sid: 0,
                                        quantity: 1,

                                        price: that.data.goods.price,
                                        sku: that.data.goods.repertory,
                                },
                                numAcZero: 'num-ac-zero', //当前购买数是否为0的样式
                                dataAction: '', //购物车操作还是订单操作

                                isShowModal: false //窗口关闭
                        })
                })
        },
        /**
         * 提交成功回调 - 订单
         */
        confirmCallbackOrder: function(res) {
                var that = this
                var jsonData = {
                        gid: that.data.id,
                        sid: that.data.selectSpecData.sid,
                        quantity: that.data.selectSpecData.quantity,
                        ftype: that.data.dataAction
                }
                var query = '?' + url.service.jsonToUrl(jsonData)

                route.service.action('userOrderForm', query)
        }
})