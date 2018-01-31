// pages/order/pay-success.js
Page({
  data:{
    order_id:""
  },

  onLoad: function (options){
    if (options && options.orderid){
      this.setData({
        order_id: options.orderid
      })
    }
  },
  go_dd(){
    var that = this;
    wx.redirectTo({
      url: '../user/dd?orderid=' + that.data.order_id,

    });
  }

})