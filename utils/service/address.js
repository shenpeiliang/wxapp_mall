var user = require('./user.js');

var service = {
        /**
         * 分页列表
         */
        getPageList: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/address/lists',
                        data: {
                                count: obj.count || 8,
                                page: obj.page || 0
                        },
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },
        /**
         * 详情
         */
        getDetail: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/address/detail',
                        data: {
                                id: obj.id
                        },
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },
        /**
         * 保存
         */
        save: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/address/save',
                        data: obj.data || {},
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },
        /**
         * 删除
         */
        del: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/address/del',
                        data: {
                                id: obj.id
                        },
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },
        /**
         * 设置默认
         */
        config: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/address/config',
                        data: {
                                id: obj.id
                        },
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },
        /**
         * 数据重组 默认
         */
        rebuildDataMain: function(data, index) {
                var res = data.map(function(item, key, arr) {
                        if (key == index) {
                                arr[key].main = 1
                        } else {
                                arr[key].main = 0
                        }

                        return arr[key]
                })
                return this.order(res)
        },
        /**
         * 数据重组 删除
         */
        rebuildDataDel: function(data, index) {
                data.splice(index, 1)
                return data
        },

        /**
         * 降序
         */
        downOrder: function(x, y) {
                return y.main - x.main
        },
        /**
         * 排序
         */
        order: function(data) {
                return data.sort(this.downOrder)
        }


}
//模块化处理
module.exports = {
        app: user.app,
        tool: user.tool,
        service: service,
        user: user
}