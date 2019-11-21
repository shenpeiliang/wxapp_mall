var user = require('../../utils/service/user.js')
Page({

        /**
         * 页面的初始数据
         */
        data: {
                countPic: 9,//上传图片最大数量
                showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
                uploadImgUrl: ''//图片的上传的路径
        },

        formSubmit: function (e) {
                console.log('form发生了submit事件，携带数据为：', e.detail.value, e.detail.formId)
                //发送模板消息
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/template/send',
                        data: { 
                                form_id: e.detail.formId
                        },
                        success: function (res) {
                                console.log(res)
                        }
                })

        },
        formReset: function () {
                console.log('form发生了reset事件')
        },

        //监听组件事件，返回的结果
        myEventListener: function (e) {
                console.log("上传的图片结果集合")
                console.log(e.detail.picsList)
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.systemType()
        },

        scroll(event) {
                console.log(event)
        },

        reactBottom() {
                var num = this.data.num2 + 30
                this.setData({
                        num2: num
                })
                console.log('触底-加载更多')
        },

        // 获取设备屏幕高度
        systemType() {
                wx.getSystemInfo({
                        success: (res) => {
                                let windowHeight = res.windowHeight

                                this.setData({
                                        windowHeight: windowHeight
                                })

                                console.log(res)
                        }
                })
        },

        tabChange(event) {
                this.setData({
                        tab_index: event.detail.current
                })
        },

        // tab栏选择
        selectTab(event) {
                this.setData({
                        tab_index: event.currentTarget.dataset.index
                })
        },

        // 返回顶部
        backTop() {
                let tab_index = this.data.tab_index

                this.setData({
                        ['scrollTop' + tab_index]: 0
                })
        },
})