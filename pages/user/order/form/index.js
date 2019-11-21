// pages/user/order/form/index.js
var route = require('../../../../utils/service/route.js')
var order = require('../../../../utils/service/order.js')

var url = require('../../../../utils/service/url.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: order.user.app,
                gid: 0, //商品ID
                sid: 0, //商品规格ID
                quantity: 0, //商品数量
                ftype: '', //来源
                cids: '', //购物车ID
                pageData: [], //页面列表
                
                aid: 0, //收货地址ID

                ConfirmDisable: true, //点击提交按钮是否可点

                jsapiParams: {}, //微信支付参数
                pid: 0, //支付ID

                is_not_login: false,
        },

        /**
         * 去支付事件
         */
        bindPay: function(e){
                var that = this
                var jsapiParams = that.data.jsapiParams

                that.wechat_pay(jsapiParams)
        },

        /**
         * 发起微信支付
         */
        wechat_pay: function (jsapiParams) {
                //发起支付请求
                wx.requestPayment({
                        timeStamp: jsapiParams.timeStamp,
                        nonceStr: jsapiParams.nonceStr,
                        package: jsapiParams.package,
                        signType: 'MD5',
                        paySign: jsapiParams.paySign,
                        success(res) {
                                console.log(res)
                                order.user.tool.message.showSuccess('支付成功', function () {
                                        //跳转到支付成功页面

                                })
                        },
                        fail(res) {
                                console.log(res)
                                order.user.tool.message.showError('支付失败')
                        }
                })
        },

        /**
         * 提交订单
         */
        bindConfirm: function(e){
                var that = this
                //登录验证
                order.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                //是否看点击提交
                if (!that.data.ConfirmDisable)
                        return

                //是否有收获地址
                if(!that.data.aid)
                        return order.user.tool.message.showError('请选择收货地址')

                //第二次支付操作 微信支付参数正常
                if (that.data.jsapiParams.length && !that.data.pid)
                        return that.wechat_pay(that.data.jsapiParams)

                //第二次支付操作 微信支付参数不正常
                if (that.data.pid && !that.data.jsapiParams.length){
                        order.service.pay({
                                data: {
                                        pid: that.data.pid
                                },
                                success: function (res) {
                                        if (res.code == 'success') {
                                                var jsapiParams = res.data

                                                that.setData({
                                                        jsapiParams: jsapiParams  
                                                })

                                                that.wechat_pay(jsapiParams)
                                        } else {
                                                return order.user.tool.message.showError(res.data)
                                        }
                                }
                        }, function () {
                                that.setData({
                                        is_not_login: true
                                })
                        })
                }                      


                wx.showLoading({
                        title: '处理中..',
                })

                var data = {
                        gid: that.data.gid,
                        sid: that.data.sid,
                        quantity: that.data.quantity,
                        cids: that.data.cids,
                        ftype: that.data.ftype,
                        aid: that.data.aid,
                        msg: []             
                }

                //留言处理
                var pageData = that.data.pageData
                Object.keys(pageData.lists).forEach(function (key) {
                        var tmp = {}
                        tmp['sid'] = key
                        tmp['content'] = pageData.lists[key].msg
                        data.msg.push(tmp)
                })
                data.msg = JSON.stringify(data.msg)
                
                order.service.create({
                        data: data,
                        success: function (res) {
                                if (res.code == 'success') {
                                        var jsapiParams = res.data
                                        wx.requestPayment({
                                                timeStamp: jsapiParams.timeStamp,
                                                nonceStr: jsapiParams.nonceStr,
                                                package: jsapiParams.package,
                                                signType: 'MD5',
                                                paySign: jsapiParams.paySign,
                                                success(res) {
                                                        console.log(res)
                                                        order.user.tool.message.showSuccess('支付成功', function () {
                                                                //跳转到订单页面
                                                                route.service.redirect('userOrderList')
                                                        })
                                                },
                                                fail(res) {
                                                        console.log(res)
                                                        order.user.tool.message.showError('支付失败')
                                                }
                                        })
                                } else {
                                        if('pid' in res.data){
                                                that.setData({
                                                        pid: res.data.pid
                                                })
                                                order.user.tool.message.showError(res.data.error)
                                        }else{
                                                order.user.tool.message.showError(res.data)
                                        }
                                        
                                }                                
                        }
                }, function () {
                        that.setData({
                                is_not_login: true
                        })
                })

                //还原可点击状态
                that.setData({
                        ConfirmDisable: true
                })

                wx.hideLoading()
        },
        /**
         * 留言输入监听
         */
        bindInput: function(e){
                var that = this
                var pageData = that.data.pageData

                pageData.lists[e.currentTarget.dataset.sid].msg = e.detail.value

                that.setData({
                        pageData: pageData
                })
        },


        /**
         * 菜单事件
         */
        bindTap: function(e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 选择地址
         */
        bindSelectAddress: function(e) {
                var that = this
                var param = '?' + url.service.jsonToUrl({
                        //userOrderForm
                        back_route: route.service.getRouteDesByUri(url.service.getCurentPageBaseUrl()),
                        //gid=3&quantity=1 此处不能通过页面获取
                        back_param: url.service.jsonToUrl({
                                gid: that.data.gid,
                                sid: that.data.sid,
                                quantity: that.data.quantity,
                                ftype: that.data.ftype,
                                cids: that.data.cids
                        })
                })
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                var gid = options.gid || 0
                var sid = options.sid || 0
                var quantity = options.quantity || 0
                var ftype = options.ftype || ''
                var cids = decodeURIComponent(options.cids) || ''
                var aid = options.aid || 0

                if (options.step) { //选择地址后跳转
                        var stepObj = url.service.urlToJson(options.step)
                        
                        gid = stepObj.gid || 0
                        sid = stepObj.sid || 0
                        quantity = stepObj.quantity || 0
                        ftype = stepObj.ftype || ''
                        cids = stepObj.cids || ''
                        aid = stepObj.aid || 0
                }
                
                this.setData({
                        gid: gid,
                        sid: sid,
                        quantity: quantity,
                        ftype: ftype,
                        cids: cids,
                        aid: aid
                })

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '订单确认'
                })
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                var that = this
                //登录验证
                order.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                wx.showLoading({
                        title: '加载中',
                })

                order.service.getConfirm({
                        data: {
                                gid: that.data.gid,
                                sid: that.data.sid,
                                quantity: that.data.quantity,
                                cids: that.data.cids,
                                ftype: that.data.ftype,
                                aid: that.data.aid
                        },
                        success: function(res) {
                                if (res.code == 'success') {
                                        that.setData({
                                                aid: res.data.address.id || 0,
                                                pageData: res.data
                                        })
                                }
                        }
                }, function() {
                        that.setData({
                                is_not_login: true
                        })
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