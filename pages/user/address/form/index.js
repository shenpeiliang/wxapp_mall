// pages/user/address/form/index.js
var route = require('../../../../utils/service/route.js')
var address = require('../../../../utils/service/address.js')
var form = require('../../../../utils/service/form.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                region: ['请选择省', '市', '区'],
                //customItem: '全部',

                nameVal: '',
                telVal: '',
                addressVal: '',

                is_not_login: false,

                id: 0, //ID 为空则添加

                //是否是来自订单确认
                back_route: '',
                back_param: '', 
        },

        /**
        * 获取收货地址
        */
        chooseAddress: function () {
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
                                                                if (that.data.back_route) {
                                                                        var aid = that.data.id ? that.data.id : res.data
                                                                        var param = '?step=' + encodeURIComponent(that.data.back_param + '&aid=' + aid)
                                                                        return route.service.action(that.data.back_route, param)
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

        /**
         * 表单提交
         */
        formSubmit: function(e) {
                var tel = e.detail.value.tel
                var name = e.detail.value.name
                var addressVal = e.detail.value.address
                var that = this

                if (!form.validate.isName(name)) {
                        address.tool.message.showError('请填写正确的姓名')
                        return
                }

                if (!form.validate.isTel(tel)) {
                        address.tool.message.showError('请填写正确的手机号码')
                        return
                }

                if(addressVal.lenght < 6){
                        address.tool.message.showError('请填写详细地址')
                        return
                }

                var data = e.detail.value
                data.region = that.data.region
                data.id = that.data.id

                //地区选择
                if (data.region[0] == '请选择省' && data.region[1] == '市' && data.region[2] == '区') {
                        address.tool.message.showError('请选择地区')
                        return
                }

                //网络请求
                address.service.save({
                        data: data,
                        success: function(res) {
                                if (res.code == 'success') {
                                        address.tool.message.showSuccess('保存成功', function() {
                                                //选择跳转
                                                if (that.data.back_route) {
                                                        var aid = that.data.id ? that.data.id : res.data
                                                        var param = '?step=' + encodeURIComponent(that.data.back_param + '&aid=' + aid)
                                                        return route.service.action(that.data.back_route, param)
                                                }
                                                //刷新数据 - 跳转
                                                route.service.redirect('userAddress')
                                        })
                                } else {
                                        address.tool.message.showError(res.data)
                                }
                        }
                }, function() {
                        this.setData({
                                is_not_login: true
                        })
                })
        },
        /**
         * 验证用户姓名
         */
        bindInputName: function(e) {
                var name = form.validate.checkName(e.detail.value)
                this.setData({
                        nameVal: name
                })
        },

        /**
         * 键盘输入时触发 - 手机号
         */
        bindInputTel: function(e) {
                var tel = form.validate.checkTel(e.detail.value)
                this.setData({
                        telVal: tel
                })
        },
        /**
         * 城市选择器
         */
        bindRegionChange: function(e) {
                this.setData({
                        region: e.detail.value
                })
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
                this.setData({
                        id: options.id || 0,
                        //是否是来自订单确认
                        back_route: options.back_route || '',
                        back_param: decodeURIComponent(options.back_param) || '', 
                })
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
                //标题设置
                var title = '新增地址'
                var that = this

                var id = that.data.id

                if (id) {
                        title = '编辑地址'

                        //网络请求
                        address.service.getDetail({
                                id: id,
                                success: function (res) {
                                        if (res.code == 'success') {
                                                var data = res.data
                                                that.setData({
                                                        region: [data.province_t, data.city_t, data.county_t],

                                                        nameVal: data.name,
                                                        telVal: data.mobile,
                                                        addressVal: data.address,
                                                })
                                        } else {
                                                address.tool.message.showError(res.data)
                                        }
                                }
                        }, function () {
                                that.setData({
                                        is_not_login: true
                                })
                        })


                }
                wx.setNavigationBarTitle({
                        title: title
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