var user = require('./user.js');

var service = {
        /**
         * 导航栏
         */
        getTabs: function() {
                return [{
                        title: '全部',
                        type: 0
                }, {
                        title: '待付款',
                        type: 1
                }, {
                        title: '待发货',
                        type: 2
                }, {
                        title: '已发货',
                        type: 3
                }, {
                        title: '已完成',
                        type: 4
                }, {
                        title: '已取消',
                        type: 5
                }]
        },
        /**
         * 全部列表
         */
        getAllList: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/lists',
                        data: obj.data || {},
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
                        url: user.tool.app.globalData.appServer + '/order/detail',
                        data: obj.data,
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
        * 进入订单评论
        */
        getOrderComment: function (obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/get_evaluate',
                        data: obj.data,
                        success: function (res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 保存评论内容
         */
        saveOrderComment: function (obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/save_evaluate',
                        data: obj.data,
                        success: function (res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 获取支付信息 - 前往支付页面
         */
        getPay: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/get_pay',
                        data: obj.data,
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },
        /**
         * 发起微信支付时获取参数
         */
        pay: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/pay',
                        data: obj.data,
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 更新商品数量
         */
        changeNum: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/change',
                        data: obj.data,
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 商品立即购买
         */
        save: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/buy',
                        data: obj.data || {},
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 确认收货
         */
        receive: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/receive',
                        data: obj.data || {},
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 取消订单
         */
        cancel: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/cancel',
                        data: obj.data || {},
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 订单确认页面 - 准备提交订单前页面（地址、留言） - 购物车下单或立即购买
         */
        getConfirm: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/confirm',
                        data: obj.data || {},
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 生成订单 (来自购物车或立即购买))
         */
        create: function(obj, callback) {
                user.service.authRequest({
                        url: user.tool.app.globalData.appServer + '/order/create',
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
                        url: user.tool.app.globalData.appServer + '/order/del',
                        data: obj.data,
                        success: function(res) {
                                typeof obj.success == "function" && obj.success(res)
                        }
                }, callback)
        },

        /**
         * 数据重组 状态更新
         */
        rebuildDataChange: function(data, type, sidIndex, gidIndex, selectAllStatus) {
                if (type == 'all') {
                        return this.changeSelectStateAll(data, selectAllStatus)
                } else if (type == 'store') {
                        return this.changeSelectStateStore(data, sidIndex)
                } else {
                        return this.changeSelectStateGoods(data, sidIndex, gidIndex)
                }
        },

        /**
         * 更新状态 - 单个商品
         */
        changeSelectStateGoods: function(data, sidIndex, gidIndex) {
                var res = {}

                var flag = !data[sidIndex].goods[gidIndex].is_selected
                //商品状态
                data[sidIndex].goods[gidIndex].is_selected = flag


                var goodsNum = 0 //商品总数
                var goodsSelected = 0 //被选择的商品数

                data[sidIndex].goods.map(function(item, key, arr) {
                        goodsNum = goodsNum + 1
                        if (item.is_selected)
                                goodsSelected = goodsSelected + 1
                })


                //关联店铺状态
                var selectStoreStatus = false
                //如果商品总数和被选择的数量一致被认为是全选
                if (goodsNum == goodsSelected)
                        selectStoreStatus = true

                data[sidIndex].is_selected = selectStoreStatus


                //是否已经满足全选条件
                var selectAllStatus = this.isSelectAll(data)

                res.pageData = data
                res.selectAllStatus = selectAllStatus

                return res
        },
        /**
         * 更新状态 - 单个店铺
         */
        changeSelectStateStore: function(data, sidIndex) {
                var res = {}

                //取反
                var flag = !data[sidIndex].is_selected
                data[sidIndex].is_selected = flag


                //店铺中的商品选择状态更新
                data[sidIndex].goods.map(function(item, key, arr) {
                        arr[key].is_selected = flag
                })

                //是否已经满足全选条件
                var selectAllStatus = this.isSelectAll(data)

                res.pageData = data
                res.selectAllStatus = selectAllStatus

                return res
        },
        /**
         * 更新状态 - 全部
         */
        changeSelectStateAll: function(data, selectAllStatus) {
                var res = {}
                var flag = !selectAllStatus

                Object.keys(data).forEach(function(key) {
                        data[key].is_selected = flag
                        data[key].goods.map(function(item, key, arr) {
                                arr[key].is_selected = flag
                        })
                })

                res.pageData = data
                res.selectAllStatus = flag

                return res
        },
        /**
         * 获取支付数据
         */
        getPayData: function(data) {
                var res = {
                        num: 0,
                        money: 0
                }

                Object.keys(data).forEach(function(key) {
                        //循环商品是否已经被选择
                        data[key].goods.map(function(item, key, arr) {
                                if (item.is_selected) {
                                        res.num = res.num + parseInt(item.number)
                                        res.money = res.money + parseInt(item.number) * parseFloat(item.price)
                                }
                        })
                })
                return res
        },
        /**
         * 获取删除后的新数据
         */
        getPageDataDel: function(data) {
                Object.keys(data).forEach(function(key) {
                        var goods = data[key].goods
                        for (var i = goods.length - 1; i >= 0; i--) {
                                if (goods[i].is_selected)
                                        goods.splice(i, 1)
                        }
                        //删除店铺信息
                        if (!data[key].goods.length)
                                delete data[key]
                })
                return data
        },

        /**
         * 获取所有勾选的记录
         */
        getSelectCart: function(data) {
                var res = []

                Object.keys(data).forEach(function(key) {
                        //循环商品是否已经被选择
                        data[key].goods.map(function(item, key, arr) {
                                if (item.is_selected) {
                                        res.push(item.id)
                                }
                        })
                })
                return res
        },
        /**
         * 是否是全选
         */
        isSelectAll: function(data) {
                //全选状态变化
                var selectAllStatus = false
                var goodsNum = 0 //商品总数
                var goodsSelected = 0 //被选择的商品数

                Object.keys(data).forEach(function(key) {
                        data[key].goods.map(function(item, key, arr) {
                                goodsNum = goodsNum + 1
                                if (item.is_selected)
                                        goodsSelected = goodsSelected + 1
                        })
                })

                //如果商品总数和被选择的数量一致被认为是全选
                if (goodsNum == goodsSelected)
                        selectAllStatus = true

                return selectAllStatus
        },
        /**
         * 数据重组 删除
         */
        rebuildDataDel: function(data, index) {
                data.splice(index, 1)
                return data
        }

}
//模块化处理
module.exports = {
        service: service,
        user: user
}