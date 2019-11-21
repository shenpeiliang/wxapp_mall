// pages/user/address/home/index.js
var route = require('../../../../utils/service/route.js')
var address = require('../../../../utils/service/address.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                is_not_login: false,

                //分页数据
                pageData: [],
                pageNum: 0,
                topNum: 0, //滚动条位置
                curentPage: 0,
                isLoading: true,
                isLoadComplete: true,

                //是否是来自订单确认
                back_route: '',
                back_param: '', 


        },

        /**
         * 来自订单确认 - 选择收货地址
         */
        bindCheck: function(e){
                var that = this
                var aid = e.currentTarget.dataset.id 
                var param = that.data.back_param + encodeURIComponent('&aid=' + aid)
                
                route.service.action(that.data.back_route, '?step=' + param)
        },
        /**
         * 获取收货地址
         */
        chooseAddress: function() {
                var data = {};
                var that = this

                wx.chooseAddress({
                        success: (res) => {
                                data.tel = res.telNumber
                                data.name = res.userName
                                data.address = res.detailInfo
                                data.region = [res.provinceName, res.cityName, res.countyName]
                                //网络请求
                                address.service.save({
                                        data: data,
                                        success: function (res) {
                                                if (res.code == 'success') {
                                                        address.tool.message.showSuccess('保存成功', function () {
                                                                //选择跳转
                                                                if (that.data.back_route){
                                                                        var aid = res.data
                                                                        var param = that.data.back_param + encodeURIComponent('&aid=' + aid)
                                                                        return route.service.action(that.data.back_route, '?step=' + param)
                                                                }

                                                                //刷新数据 - 跳转
                                                                route.service.redirect('userAddress')
                                                        })
                                                } else {
                                                        address.tool.message.showError(res.data)
                                                }
                                        }
                                }, function () {
                                        this.setData({
                                                is_not_login: true
                                        })
                                })
                        },
                        fail: function (err) {
                                console.log(err)
                        }
                })
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

        /**
         * 菜单事件
         */
        bindTap: function(e) {
                var param = e.currentTarget.dataset.id ? '?id=' + e.currentTarget.dataset.id : ''
                if(this.data.back_route){
                        var mark = e.currentTarget.dataset.id ? '&' : '?'
                        param = param + mark + 'back_route=' + this.data.back_route + '&back_param=' + this.data.back_param
                }
                route.service.action(e.currentTarget.dataset.route, param)
        },

        /**
         * 删除操作
         */
        bindTapDel: function(e) {
                var id = e.currentTarget.dataset.id
                var index = e.currentTarget.dataset.index

                var that = this
                var data = that.data.pageData

                address.service.del({
                        id: id,
                        success: function(res) {
                                if (res.code == 'success') {
                                        address.tool.message.showSuccess('删除成功', function() {
                                                //重新赋值
                                                data = address.service.rebuildDataDel(data, index)
                                                that.setData({
                                                        pageData: data
                                                })

                                                //刷新数据 - 跳转 优化：排序+更新数据
                                                //route.service.redirect('userAddress')
                                        })
                                } else {
                                        address.tool.message.showError(res.data)
                                }
                        }
                }, function() {
                        that.setData({
                                is_not_login: true
                        })
                })
        },

        /**
         * 设置默认
         */
        bindTapConfig: function(e) {
                var id = e.currentTarget.dataset.id
                var index = e.currentTarget.dataset.index

                var that = this
                var data = that.data.pageData

                address.service.config({
                        id: id,
                        success: function(res) {
                                if (res.code == 'success') {
                                        address.tool.message.showSuccess('设置成功', function() {
                                                //重新赋值+排序
                                                data = address.service.rebuildDataMain(data, index)
                                                that.setData({
                                                        pageData: data
                                                })

                                                //刷新数据 - 跳转
                                                //route.service.redirect('userAddress')
                                        })
                                } else {
                                        address.tool.message.showError(res.data)
                                }
                        }
                }, function() {
                        that.setData({
                                is_not_login: true
                        })
                })
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
               this.setData({
                       //是否是来自订单确认
                       back_route: options.back_route || '',
                       back_param: options.back_param || '', 
               })
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

                address.service.getPageList({
                        page: page,
                        success: function(res) {
                                if (res.code == 'success') {
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
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {
                wx.setNavigationBarTitle({
                        title: '收货地址'
                })               
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
                wx.showLoading({
                        title: '加载中',
                })
                var that = this
                //登录验证
                address.user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                address.service.getPageList({
                        success: function (res) {
                                if (res.code == 'success') {
                                        that.setData({
                                                pageData: res.data.lists,
                                                pageNum: res.data.page
                                        })
                                }
                        }
                }, function () {
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