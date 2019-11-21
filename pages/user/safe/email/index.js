// pages/user/safe/tel/index.js
var form = require('../../../../utils/service/form.js')
var user = require('../../../../utils/service/user.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                getCodeTxt: '获取验证码',
                iniGetCodeMaxTime: 60,
                getCodeCurrentTime: 60, //倒计时
                canGetCode: true, //允许操作

                emailVal: '', //邮箱地址
                codeVal: '', //验证码

                emailBanded: '', //当前绑定的邮箱地址

                is_not_login: false,

                timer: null //定时器
        },
        /**
         * 表单提交
         */
        formSubmit: function (e) {
                var email = e.detail.value.email
                var code = e.detail.value.code
                var that = this

                if (!form.validate.isCode(code)) {
                        user.tool.message.showError('请填写正确的验证码')
                        return
                }

                if (!form.validate.isEmail(email)) {
                        user.tool.message.showError('请填写正确的邮箱地址')
                        return
                }

                //网络请求
                user.service.authRequest({
                        url: user.app.globalData.appServer + '/safe/email',
                        data: e.detail.value,
                        success: function (res) {
                                if (res.code == 'success') {
                                        user.tool.message.showSuccess('保存成功')
                                        that.setData({
                                                getCodeTxt: '获取验证码',
                                                iniGetCodeMaxTime: 60,
                                                getCodeCurrentTime: 60, //倒计时
                                                canGetCode: true, //允许操作

                                                emailVal: '', //邮箱地址
                                                codeVal: '', //验证码

                                                emailBanded: res.data
                                        })
                                        if (that.data.timer)
                                                clearInterval(that.data.timer)
                                } else {
                                        user.tool.message.showError(res.data)
                                }
                        }
                }, function () {
                        this.setData({
                                is_not_login: true
                        })
                })
        },
        /**
         * 键盘输入时触发 - 邮箱地址
         */
        bindInputEmail: function (e) {
                var email = form.validate.checkEmail(e.detail.value)
                this.setData({
                        emailVal: email
                })
        },
        /**
         * 键盘输入时触发 - 验证码
         */
        bindInputCode: function (e) {
                var code = form.validate.checkCode(e.detail.value)
                this.setData({
                        code: code
                })
        },

        /**
         * 获取验证码
         */
        getCode: function (e) {
                var that = this
                var email = that.data.emailVal

                if (!form.validate.isEmail(email)) {
                        user.tool.message.showError('请填写邮箱地址')
                        return
                }

                var currentTime = that.data.getCodeCurrentTime
                var is_able = that.data.canGetCode

                var txt = ''

                var timer = setInterval(function () {
                        if (currentTime <= 0) {
                                txt = '重新获取'
                                is_able = true
                                currentTime = that.data.iniGetCodeMaxTime
                                clearInterval(timer)
                        } else {
                                if (that.data.canGetCode) {
                                        //发送请求
                                        user.service.authRequest({
                                                data: { email: email },
                                                url: user.app.globalData.appServer + '/safe/get_email_code',
                                                success: function (res) {
                                                        if (res.code == 'success') {
                                                                console.log(res.data)
                                                                user.tool.message.showSuccess('发送成功，请前往邮箱获取验证码')
                                                        } else {
                                                                user.tool.message.showError(res.data)
                                                        }
                                                }
                                        })

                                        that.setData({
                                                timer: timer
                                        })
                                }

                                txt = '请等待' + currentTime + 's'
                                is_able = false
                                currentTime--
                        }
                        that.setData({
                                getCodeTxt: txt,
                                getCodeCurrentTime: currentTime,
                                canGetCode: is_able
                        })
                }, 1000)

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                wx.setNavigationBarTitle({
                        title: '邮箱绑定'
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

                //登录验证
                user.service.checkLogin(callback => {
                        that.setData({
                                is_not_login: true
                        })
                })

                //获取绑定的邮箱地址
                user.service.authRequest({
                        data: {},
                        url: user.app.globalData.appServer + '/safe/get_email',
                        success: function (res) {
                                if (res.code == 'success') {
                                        if (res.data.length) {
                                                that.setData({
                                                        emailBanded: res.data
                                                })
                                        }
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

        }
})