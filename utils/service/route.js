var error = require('./error.js');

var config = {
        //订单
        userOrderList: {
                type: 'nav',
                uri: '/pages/user/order/lists/index'
        },
        userOrderDetail: {
                type: 'nav',
                uri: '/pages/user/order/detail/index'
        },
        userOrderForm: {
                type: 'nav',
                uri: '/pages/user/order/form/index'
        },
        userOrderPay: {
                type: 'nav',
                uri: '/pages/user/order/pay/index'
        },
        userOrderComment: {
                type: 'nav',
                uri: '/pages/user/order/comment/index'
        },
        //搜索
        search: {
                type: 'nav',
                uri: '/pages/search/index'
        },
        //文章
        articleList: {
                type: 'nav',
                uri: '/pages/article/lists/index'
        },
        articleDetail: {
                type: 'nav',
                uri: '/pages/article/detail/index'
        },
        //收货地址
        userAddress: {
                type: 'nav',
                uri: '/pages/user/address/lists/index'
        },
        userAddressForm: {
                type: 'nav',
                uri: '/pages/user/address/form/index'
        },
        //个人资料
        userInfo: {
                type: 'nav',
                uri: '/pages/user/info/index'
        },
        //安全
        userSafe: {
                type: 'nav',
                uri: '/pages/user/safe/home/index'
        },
        userSafeTel: {
                type: 'nav',
                uri: '/pages/user/safe/tel/index'
        },
        userSafePass: {
                type: 'nav',
                uri: '/pages/user/safe/pass/index'
        },
        userSafeEmail: {
                type: 'nav',
                uri: '/pages/user/safe/email/index'
        },
        //购物车
        userCart: {
                type: 'switch',
                uri: '/pages/user/cart/index'
        },
        //商品
        goodsList: {
                type: 'switch',
                uri: '/pages/goods/lists/index'
        },
        goodsDetail: {
                type: 'nav',
                uri: '/pages/goods/detail/index'
        },
        goodsComment: {
                type: 'nav',
                uri: '/pages/goods/comment/index'
        },
        //首页
        indexHome: {
                type: 'switch',
                uri: '/pages/index/index'
        },
        //分类
        category: {
                type: 'switch',
                uri: '/pages/category/index'
        },
        //会员中心
        userHome: {
                type: 'switch',
                uri: '/pages/user/home/index'
        },

}

var service = {
        /**
         * 通过uri获取路由简写
         */
        getRouteDesByUri: function(uri){
                var routes = config
                for(var key in routes) {
                        if (routes[key].uri == uri){
                                return key
                        }
                }
        },

        /**
         * 跳转
         */
        action: function(route, param) {
                if (!(route in config)) {
                        error.service.console('route错误:' + route)
                        return;
                }

                var routeData = config[route]
                if (routeData.type == 'switch') {
                        wx.switchTab({
                                url: routeData.uri
                        })
                } else {
                        wx.navigateTo({
                                url: param ? routeData.uri + param : routeData.uri
                        })
                }
        },
        /**
         * 关闭当前窗口后跳转
         */
        redirect: function(route, param) {
                if (!(route in config)) {
                        error.service.console('route错误:' + route)
                        return;
                }

                var routeData = config[route]
                wx.redirectTo({
                        url: param ? routeData.uri + param : routeData.uri
                })
        }
}

//模块化处理
module.exports = {
        config: config,
        service: service
}