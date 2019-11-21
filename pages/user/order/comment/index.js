// pages/user/order/comment/index.js
var route = require('../../../../utils/service/route.js')
var order = require('../../../../utils/service/order.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                app: order.user.app,
                id: 0, //项目ID
                pageData: [], //页面列表

                is_not_login: false,

                grades: [{
                        id: 1,
                        title: '生气',
                        des: '很抱歉这是一次不愉快的购物体验，可以告诉我们遇到了什么问题，我们一定会重视问题帮您解决'
                }, {
                        id: 2,
                        title: '失望',
                        des: '一定是遇到什么问题了，快来说说吧，我们一定会重视问题帮您解决'
                }, {
                        id: 3,
                        title: '一般',
                        des: '告诉我们宝贝美中不足的地方吧，我们一定会努力改进的'
                }, {
                        id: 4,
                        title: '满意',
                        des: '说说宝贝的使用感受吧，大家都在等着您的心得呢'
                }, {
                        id: 5,
                        title: '非常满意',
                        des: '看来宝贝不错，快给小伙伴们分享一下宝贝的优点吧'
                }, ], //等级配置

                serviceGrade: {
                        goods: 5,
                        store: 5,
                        freight: 5
                }, //服务等级
        },

        /**
        * 菜单事件
        */
        bindTap: function (e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 选择等级
         */
        bindSelectGrade: function(event) {
                var that = this
                var index = event.currentTarget.dataset.id
                var gIndex = event.currentTarget.dataset.gidx

                var data = that.data.pageData
                var grades = that.data.grades

                data[gIndex].grade = grades[index].id

                that.setData({
                        pageData: data
                })

        },

        /**
         * 服务打分
         */
        bindSelectGradeService: function(event) {
                var that = this
                var index = event.currentTarget.dataset.id
                var service = event.currentTarget.dataset.service

                var grades = that.data.grades
                var serviceData = that.data.serviceGrade

                serviceData[service] = grades[index].id

                that.setData({
                        serviceGrade: serviceData
                })
        },

        /**
         * 评论内容监听
         */
        bindInput: function (e) {
                var that = this
                var pageData = that.data.pageData

                pageData[e.currentTarget.dataset.gidx].content = e.detail.value

                that.setData({
                        pageData: pageData
                })
        },


        /**
         * 提交事件
         */
        bindSave: function(event) {
                var that = this
                var data = that.data.pageData
                var serviceData = that.data.serviceGrade

                var postData = {
                        oid: that.data.id,
                        goods: serviceData.goods,
                        store: serviceData.store,
                        freight: serviceData.freight,
                        msg: []

                }

                Object.keys(data).forEach(function (key) {
                        var tmp = {}
                        tmp['o_g_id'] = data[key].id
                        tmp['grade'] = data[key].grade
                        tmp['content'] = data[key].content
                        postData.msg.push(tmp)
                })
                postData.msg = JSON.stringify(postData.msg)

                //登录验证
                order.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                wx.showLoading({
                        title: '处理中',
                })

                order.service.saveOrderComment({
                        data: postData,
                        success: function(res) {
                                if (res.code == 'success') {
                                        order.user.tool.message.showSuccess('提交成功', function() {
                                                //跳转回订单列表页面
                                                return route.service.action('userOrderList')
                                        })
                                } else {
                                        order.user.tool.message.showError(res.data)
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
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                this.setData({
                        id: options.id
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '订单评论'
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

                order.service.getOrderComment({
                        data: {
                                id: that.data.id
                        },
                        success: function(res) {
                                if (res.code == 'success') {
                                        that.setData({
                                                pageData: res.data
                                        })
                                } else {
                                        order.user.tool.message.showError(res.data)
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