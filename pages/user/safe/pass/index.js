// pages/user/safe/pass/index.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
                is_not_login: false,
                
                inputConfig : {
                        pwdOld: {
                                isPassword: true,
                                icon: 'icon-close-eye'
                        },
                        pwdNew: {
                                isPassword: true,
                                icon: 'icon-close-eye'
                        },
                        pwdNewRe: {
                                isPassword: true,
                                icon: 'icon-close-eye'
                        },
                }
        },
        /**
         * 修改文本框类型
         */
        changeInputType: function(e){
                var item = e.currentTarget.dataset.item
                var that = this

                var inputConfig = that.data.inputConfig
                //类型
                inputConfig[item].isPassword = !inputConfig[item].isPassword
                //图标
                inputConfig[item].icon = inputConfig[item].icon == 'icon-close-eye' ? 'icon-zhengyan' : 'icon-close-eye'

                that.setData({
                        inputConfig: inputConfig 
                })
        },
        /**
         * 表单提交 需要绑定平台账号才打开
         */
        formSubmit: function(e){
                //console.log(e.detail)
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                wx.showLoading({
                        title: '加载中',
                })
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                wx.setNavigationBarTitle({
                        title: '密码修改'
                })
                wx.hideLoading()
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

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