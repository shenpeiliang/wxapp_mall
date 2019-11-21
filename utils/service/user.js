var tool = require('../tool.js');

//用户信息
var service = {
        /**
         * 初始化判断是否有openid，没有就要授权
         */
        checkLogin: function(callback) {
                var that = this
                try{
                        //没有openid或者没有userInfo
                        if (!that.getOpenid() || !that.getUserInfo()) {
                                //发起wx.login请求
                                that.login()
                                //显示授权页面
                                typeof callback == "function" && callback()
                        }
                } catch (e) {
                        tool.error.service.console(e)
                }                
                       
        },
        /**
         * 设置缓存 - 用户信息
         */
        setUserInfo: user => {
                try{
                        //缓存
                        wx.setStorageSync('userInfo', user)
                        //全局
                        tool.app.globalData.userInfo = user
                }catch(e){
                        tool.error.service.console(e)
                }
        },
        /**
         * 获取用户信息 - 用户信息
         */
        getUserInfo: function(){                
                try{                             
                        //全局
                        if(tool.app.globalData.userInfo)
                                return tool.app.globalData.userInfo
                        //缓存
                        var userInfo = wx.getStorageSync('userInfo')
                        if (userInfo){                                
                                tool.app.globalData.userInfo = userInfo
                                return userInfo
                        }
                               
                        return false                        
                }catch(e) {
                        tool.error.service.console(e)
                }
        },
        /**
         * 设置缓存 - openid信息
         */
        setOpenid: openid => {
                try {
                        //缓存
                        wx.setStorageSync('openid', openid)
                        //全局
                        tool.app.globalData.openid = openid
                } catch (e) {
                        tool.error.service.console(e)
                }
        },
        /**
         * 获取用户信息 - openid信息
         */
        getOpenid: function() {
                try {
                        //全局
                        if (tool.app.globalData.openid)
                                return tool.app.globalData.openid
                        //缓存
                        var openid = wx.getStorageSync('openid')
                        if (openid){
                                //全局
                                tool.app.globalData.openid = openid
                                //返回
                                return openid
                        }
                                
                        return false
                } catch (e) {
                        tool.error.service.console(e)
                }
        },
        /**
         * 发起wx.login
         */
        login: function(){
                wx.login({
                        success: res => {
                                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                if (res.code) {
                                        tool.net.request({
                                                url: tool.app.globalData.appServer + '/user/code2session',
                                                data: {
                                                        code: res.code
                                                },
                                                success: e => {
                                                        this.setOpenid(e.data)
                                                },
                                                fail: e => {
                                                        tool.error.service.console('wx.login：openid获取失败')
                                                }
                                        })
                                } else {
                                        tool.error.service.console('wx.login发起错误：' + res.errMsg)
                                }

                        }
                })
        },
        /**
         * 获取用户回调 - 发送用户信息到后台保存
         */
        userInfoReadyCallback: function(res, callback) {
                var data = {
                        openid: tool.app.globalData.openid,
                        rawData: res.rawData,
                        signature: res.signature,
                        encryptedData: res.encryptedData,
                        iv: res.iv
                }

                var url = tool.app.globalData.appServer + '/user/login'
                var that = this

                // 可以将 res 发送给后台解码出 unionId
                tool.net.post({
                        data: data,
                        url: url,
                        success: function(e) {
                                that.setUserInfo(e.data)
                                typeof callback == "function" && callback()
                        }
                })

        },
        /**
         * 需要验证用户登录
         * obj 传输的数据
         * callback 应该显示授权页面
         */
        authRequest: function (obj, callback) {     
                if (!this.getOpenid()){
                        //显示授权页面
                        typeof callback == "function" && callback()
                        return ;
                } 
                //添加验证的用户信息
                obj.data.openid = this.getOpenid()    
                //网络请求           
                tool.net.post(obj)
        }

}
//模块化处理
module.exports = {
        app: tool.app,
        tool: tool,
        service: service
}