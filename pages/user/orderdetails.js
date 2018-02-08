// user/orderdetails.js
var app = getApp();
var common = require("../../utils/common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },


  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log("==========order detail====");
  //     console.log(res.target);
  //   }
  //   return {
  //     title: '小白店订单详情',
  //     path: '/pages/user/dd',
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var orderid = options.orderid;
    var that = this;
    wx.request({
      url: app.config.host + '/orders/' + orderid + '?token=' + util.gettoken(),
      method: 'get',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
       if (res.data.status_code && res.data.status_code == 1) {
        that.setData({
          orderinfo: res.data.data,
          timestamp: res.data.timestamp

        });
        console.log(res)
     
  } else if (res.data.status_code == 0) {
    wx.showToast({
      title: res.data.message,
    })
  } else if (res.data.status_code == 2) {
    app.confirmUserLogin();
    
  }   
     
        
        var times = (that.data.timestamp)*1000;

      var date = new Date(times);
  
       var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
       var  D = (date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1) + ' ';


       var  h = (date.getHours() + 1 < 10 ? '0' + (date.getHours() + 1) : date.getHours()+ 1) + ':';
       var  m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1) + ':';
        var s = (date.getSeconds() + 1 < 10 ? '0' + (date.getSeconds() + 1) : date.getSeconds()+ 1) ;
      var time=Y + M + D + h + m + s;

        that.setData({
      
          time:time
        });

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })





  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }


})