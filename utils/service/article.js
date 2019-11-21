var tool = require('../tool.js');

var service = {
        /**
         * 分页列表
         */
        getPageList: function(obj){
                tool.net.post({
                        url: tool.app.globalData.appServer + '/article/lists',
                        data: {
                                sortid: obj.sid || 0,
                                count: obj.count || 8,
                                page: obj.page || 0
                        },
                        success: function (res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                })
        },
        /**
         * 详情
         */
        getDetail: function (obj) {
                tool.net.post({
                        url: tool.app.globalData.appServer + '/article/detail',
                        data: {
                                id: obj.id
                        },
                        success: function (res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                })
        }

}
//模块化处理
module.exports = {
        app: tool.app,
        tool: tool,
        service: service
}