//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    //时效性https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkSession.html
    //签名下载 https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html

  },
  globalData: {
        //显示加载中的超时时间
          showLoadingTimeout: 3000,
          //imgServer: 'http://mall.cn',
          //appServer: 'http://mall.cn/appserver',
          imgServer: 'https://mall.7keit.com',
          appServer: 'https://mall.7keit.com/appserver',
        
          userInfo: null, //用户信息
          openid: '', //用户ID

          goodsSearchQuery: {
                  keyword: '',
                  sort: 0,
          }, //商品搜索条件      
  }
})