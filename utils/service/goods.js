/*
*常用工具类整合
*/
var tool = require('../tool.js');

//常用服务
var service = {
        //跳转到商品详情页
        navigateToDetail: function(e, index){
                var base_url = '../goods/detail/index?id='
                index = index || 0
                if(index){
                        var parent_dir = '../'
                        base_url = parent_dir.repeat(index) + base_url
                }
                wx.navigateTo({
                        url: base_url + e.currentTarget.dataset.id
                })
        },
        /**
         * 获取分类信息
         */
        getCategory: function (obj){
                var data = {
                        url: tool.app.globalData.appServer + '/goods/category',
                        success: obj.resolve
                }
                tool.net.request(data) 
        },
        //获取商品详情
        getGoodsDetail: function(obj){
                var postData = {
                        url: tool.app.globalData.appServer + '/goods/detail',
                        data: {
                                id: obj.gid

                        },
                        success: obj.resolve
                }
                tool.net.post(postData) 
        },
        //获取商品详情附属信息
        getGoodsDetailCon: function (obj) {
                var postData = {
                        url: tool.app.globalData.appServer + '/goods/more',
                        data: {
                                gid: obj.gid,
                                type: obj.type

                        },
                        success: obj.resolve
                }
                tool.net.post(postData)  
        },
        //获取商品评论
        getGoodsDetailComment: function (obj) {
                var postData = {
                        url: tool.app.globalData.appServer + '/goods/comment',
                        data: {
                                gid: obj.gid

                        },
                        success: obj.resolve
                }
                tool.net.post(postData)
        },
        //获取商品列表
        getGoods: function(obj) {
                var postData = {
                        url: tool.app.globalData.appServer + '/goods/lists',
                        data: {
                                page: obj.page || 0,
                                count: obj.count || 8,
                                keyword: obj.keyword || '',
                                sort: obj.sort || 0,
                                sort_1: obj.sort_1 || 0,
                                order: obj.order || '',
                                price_order: obj.price_order || ''

                        },
                        success: obj.resolve                      
                }
                tool.net.post(postData)
        },
        /**
         * 设置查询条件
         * 解决switchTab不能带参数问题
         */
        setSearchQuery: function(option){
                var obj = {
                        keyword: option.keyword || '',
                        sort: option.sort || 0 //分类
                }

                tool.app.globalData.goodsSearchQuery = obj
        },
        /**
         * 获取查询条件 之后会自动清空，需要自行保存
         */
        getSearchQuery: function(){
                var result = tool.app.globalData.goodsSearchQuery

                //恢复默认值
                tool.app.globalData.goodsSearchQuery = {
                        keyword: '',
                        sort: 0
                }                       

                return result
        }
}

//模块化处理
module.exports = {
        app: tool.app,
        tool: tool,
        service: service       
}
