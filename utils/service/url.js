var error = require('./error.js');

var service = {
        /**
         * json转url
         */
        jsonToUrl: function(data) {
                try {
                        var tempArr = [];
                        for (var i in data) {
                                var key = encodeURIComponent(i);
                                var value = encodeURIComponent(data[i]);
                                tempArr.push(key + '=' + value);
                        }
                        return tempArr.join('&');
                } catch (err) {
                        error.service.console(err)
                        return '';
                }
        },

        /**
         * url转json
         */
        urlToJson: function(url){
                url = decodeURIComponent(url)
                var obj = {}
                var arr = url.split('&')
                for(var i=0;i<arr.length;i++){
                        var subArr = arr[i].split('=')
                        var key = decodeURIComponent(subArr[0])
                        var value = decodeURIComponent(subArr[1])
                        obj[key] = value 
                }
                return obj
        },

        /**
         * 获取当前地址+参数后的请求地址
         */
        getCurrentPageUrlWithArgs: function(){
                var currentPage = this.getCurentPageInfo()
                var url = currentPage.route    //当前页面url
                var options = this.getCurentPageParam()    //如果要获取url中所带的参数可以查看options
                
                return url + '?' + this.jsonToUrl(options)
        },

        /**
         * 获取当前页面
         */
        getCurentPageInfo: function(){
                var pages = getCurrentPages()    //获取加载的页面
                return pages[pages.length - 1]    //获取当前页面的对象
        },

        /**
         * 获取当前页面的基础地址
         */
        getCurentPageBaseUrl: function(){
                var currentPage = this.getCurentPageInfo()
                return '/' + currentPage.route
        },

        /**
        * 获取当前页面的参数
        */
        getCurentPageParam: function () {
                var currentPage = this.getCurentPageInfo()
                return currentPage.options
        },

        /**
         * 当前地址作为url参数
         */
        currentPageToUrlParam(){
                return encodeURIComponent('／' +　this.getCurrentPageUrlWithArgs())
        }
}
//模块化处理
module.exports = {
        error: error,
        service: service
}