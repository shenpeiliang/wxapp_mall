/*
*常用工具类整合
*/
var error = require('./service/error.js');
var app = getApp();

//常用方法
var common = {
        //处理富文本图片
        rebuildRichTextData: function (data) {
                var res = data.replace(/((width)|(max\-width)):\s*\d{1,}[%(px)]{1,2}(\;)?/gi, '')

                res = res.replace(/<img([\s\w"=]+)src=\"[\w\/\.]+"/gi, function (match) {
                        var length_before = match.indexOf('src="') + 5;
                        return match.substring(0, length_before) + app.globalData.imgServer + match.substring(length_before) + ' class="rich-text-img" ';
                })
                
                return res
        },
        /*
        var json = {
                sh: '上海',
                name: 'dff'
        }
        array.map(value,key,arr)

        json转url参数
        */
        jsonEncodeURI: function(json){
                var params = Object.keys(json).map(function (key) {
                        // body...
                        return encodeURIComponent(key) + "=" + encodeURIComponent(json[key])
                }).join("&")

                return params
        }               
        
}

//网络
var net = {
        request: function (obj) {
                var header = obj.header || {}
                if(!header['Content-Type']){
                        header['Content-Type'] = 'application/x-www-form-urlencoded'
                }
                if (!header['Authorization']) {
                        header['Authorization'] = app.globalData.token
                }
                try{
                        wx.request({
                                url: obj.url,
                                data: obj.data || {},
                                header: header,
                                method: obj.method || 'GET',
                                dataType: obj.dataType || 'json',
                                responseType: obj.responseType || 'text',
                                success: function (res) {
                                        typeof obj.success == "function" && obj.success(res.data)
                                },
                                fail: obj.fail || function () { },
                                complete: obj.complete || function () { }
                        })
                } catch (e) {
                        error.service.console(e)
                }
                
        },
        post: function (obj){
                obj.method = 'POST'
                this.request(obj)
        }
}
var message = {
        //提示框
        showMessage: function(obj){
                wx.showToast({
                        title: obj.title || '',
                        icon: obj.icon || 'none',
                        success: function () {
                                typeof obj.success == "function" && obj.success()
                        },
                        fail: obj.fail || function () { },
                        complete: obj.complete || function () { } 
                })
        },
        //成功提示
        showSuccess: function(title, callback){
                this.showMessage({
                        title:title,
                        icon:'success',
                        success: typeof callback == "function" && callback()
                })
        },
        //错误提示
        showError: function (title, callback){
                this.showMessage({
                         title: title,
                         success: typeof callback == "function" && callback()
                })
        },
        //加载中提示
        showLoading: function(title, time){
                wx.showLoading({
                        title: title || '加载中...',
                })
                //超时自动关闭
                setTimeout(function(){
                        wx.hideLoading()
                },time || app.globalData.showLoadingTimeout)
        },
        //关闭加载中提示
        hideLoading: function(){
                wx.hideLoading()
        }
}

//模块化处理
module.exports = {
        app: app,
        error: error,
        common: common,
        net: net,
        message: message        
}
