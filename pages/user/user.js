var app = getApp()
Page( {
  data: {
    userInfo: {
      'nickName': 'abc'
    },
    orderInfo:{},
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo: [ {
        icon: '../../images/iconfont-dingdan.png',
        text: '我的订单',
        isunread: true,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-card.png',
        text: '我的代金券',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-icontuan.png',
        text: '我的拼团',
        isunread: true,
        unreadNum: 1
      }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址管理'
      }, {
        icon: '../../images/iconfont-kefu.png',
        text: '联系客服'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '常见问题'
      }],
       loadingText: '加载中...',
       loadingHidden: false,
  },
  onLoad: function () {
      var that = this
      app.confirmUserLogin();
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.loadOrderStatus();
  },
  onShow:function(){
    this.loadOrderStatus();
  },


  
  loadOrderStatus:function(){
    //获取用户订单数据
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getorder',
      method:'post',
      data: {
        userId:app.d.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if(status==1){
          var orderInfo = res.data.orderInfo;
          that.setData({
            orderInfo: orderInfo
          });
        }else{
          wx.showToast({
            title: '非法操作.',
            duration: 2000
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  add:function(){
     wx:wx.chooseAddress({
       success: function(res) {
         console.log(JSON.stringify(res))
       },
       fail: function(res) {

         console.log(JSON.stringify(err))
       },
     
     })

  },
  about:function(){
     wx:wx.navigateTo({
       url: 'about',
      
     })

  },
  chat:function(){
    
  }

  
})