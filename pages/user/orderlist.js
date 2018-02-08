// pages/user/orderlist.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
var util = require("../../utils/util.js");
var Promise = require('../../libs/es6-promise.min')
var fail_count =0;
Page({
  data: {
    show:-1,
    showLoading: true,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    isStatus: 'pay',//10待付款，20待发货，30待收货 40、50已完成
    page: 0,
    refundpage: 0,
    orderList: [],
    // orderList0: [],
    // orderList1: [],
    // orderList2: [],
    // orderList3: [],
    // orderList4: [],
    count: 3,

  },


  dddetail: function (event) {
    var orderid = event.currentTarget.dataset.orderid
    console.log(event)
    wx.navigateTo({
      url: 'orderdetails?orderid=' + orderid
    })

  },


  // 生命周期 onLoad
  onLoad: function () {
    this.loadOrderList(0);
  

  },

  
   loadOrderList: function (offset) {
    var that = this;
    console.log("请求订单url==" + app.config.host + '/orders?token=' + util.gettoken() + "&offset=" + offset + "&count=" + that.data.count)
    wx.request({
      url: app.config.host + '/orders?token=' + util.gettoken()+ "&offset=" + offset + "&count=" + that.data.count,
      method: 'get',
      data: {},
      header: {
        'ContentType': 'application/xwwwformurlencoded'
      },
      success: function (res) {

      if(res.data.data.length>0){
         that.setData({
           show:1
         })
      }else{
        that.setData({
          show: 0
        })
      }
        if (fail_count==0){
          res.data.status_code = 2;
        }        
        if (res.data.status_code && res.data.status_code == 1) {
          if (offset == 0){
            that.setData({
              orderList: res.data.data,
            });
          } else if (offset > 0) {
         that.data.orderList = that.data.orderList.concat(res.data.data);
            
            that.setData({ 
              orderList: that.data.orderList,
             });
          }

           
        } else if (res.data.status_code == 0) {
          wx.showToast({
            title: res.data.message,
          })
        } else if (res.data.status_code == 2) {
          //异步方法创建
          function runAsyncLogin() {
            var p = new Promise(function (resolve, reject) {
              //做一些异步操作
              app.confirmUserLogin(resolve, reject);
              console.log("=========11测试resolve========");
              console.log(resolve);
              console.log(reject); 
            });
            return p;
          }
      
          
          //执行异步方法
          runAsyncLogin()
          .then(function (results) {//异步方法
            console.log(results); 
            console.log(util.gettoken());
            
            
            fail_count+=1;
            if(fail_count < 5) {
              that.loadOrderList(0);
            }
            
          })
          .catch(function (reason) {
              console.log(reason); 
          })  
        }
  
        console.log(that.data.orderList);
      },
      fail: function (e) {
        that.setData({
          show:0
        })
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
  
      },

      complete: function () {
        if (offset == 0) {
          wx.stopPullDownRefresh()
        } else if (offset > 0) {
          wx.stopPullDownRefresh()
        }
        wx.hideNavigationBarLoading() //完成停止加载
       
        that.setData({
          showLoading: false
        })
      }
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.loadOrderList(0);
  },
  onReachBottom: function(){
    this.loadOrderList(this.data.orderList.length);
  },

gohome:function(){
  wx.reLaunch({
    url: '../home/home',
    success: function (res) {
      console.log(res)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
},
 
  

  // onLoad: function (options) {
  //   this.initSystemInfo();
  //   this.setData({
  //     currentTab: parseInt(options.currentTab),
  //     isStatus: options.otype
  //   });

  //   if (this.data.currentTab == 4) {
  //     this.loadReturnOrderList();
  //   } else {
  //     this.loadOrderList();
  //   }
  // },

  // getOrderStatus: function () {
  //   return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  // },


  // removeOrder: function (e) {
  //   var that = this;
  //   var orderId = e.currentTarget.dataset.orderId;
  //   wx.showModal({
  //     title: '提示',
  //     content: '你确定要取消订单吗？',
  //     success: function (res) {
  //       res.confirm && wx.request({
  //         url: app.d.ceshiUrl + '/Api/Order/orders_edit',
  //         method: 'post',
  //         data: {
  //           id: orderId,
  //           type: 'cancel',
  //         },
  //         header: {
  //           'ContentType': 'application/xwwwformurlencoded'
  //         },
  //         success: function (res) {
  //           //init data
  //           var status = res.data.status;
  //           if (status == 1) {
  //             wx.showToast({
  //               title: '操作成功！',
  //               duration: 2000
  //             });
  //             that.loadOrderList();
  //           } else {
  //             wx.showToast({
  //               title: res.data.err,
  //               duration: 2000
  //             });
  //           }
  //         },
  //         fail: function () {

  //           wx.showToast({
  //             title: '网络异常！',
  //             duration: 2000
  //           });
  //         }
  //       });

  //     }
  //   });
  // },


  // recOrder: function (e) {
  //   var that = this;
  //   var orderId = e.currentTarget.dataset.orderId;
  //   wx.showModal({
  //     title: '提示',
  //     content: '你确定已收到宝贝吗？',
  //     success: function (res) {
  //       res.confirm && wx.request({
  //         url: app.d.ceshiUrl + '/Api/Order/orders_edit',
  //         method: 'post',
  //         data: {
  //           id: orderId,
  //           type: 'receive',
  //         },
  //         header: {
  //           'ContentType': 'application/xwwwformurlencoded'
  //         },
  //         success: function (res) {

  //           var status = res.data.status;
  //           if (status == 1) {
  //             wx.showToast({
  //               title: '操作成功！',
  //               duration: 2000
  //             });
  //             that.loadOrderList();
  //           } else {
  //             wx.showToast({
  //               title: res.data.err,
  //               duration: 2000
  //             });
  //           }
  //         },
  //         fail: function () {

  //           wx.showToast({
  //             title: '网络异常！',
  //             duration: 2000
  //           });
  //         }
  //       });

  //     }
  //   });
  // },

  // loadOrderList: function () {
  //   var that = this;
  //   wx.request({
  //     url: app.d.ceshiUrl + '/Api/Order/index',
  //     method: 'post',
  //     data: {
  //       uid: app.d.userId,
  //       order_type: that.data.isStatus,
  //       page: that.data.page,
  //     },
  //     header: {
  //       'ContentType': 'application/xwwwformurlencoded'
  //     },
  //     success: function (res) {
  //       //init data        
  //       var status = res.data.status;
  //       var list = res.data.ord;
  //       switch (that.data.currentTab) {
  //         case 0:
  //           that.setData({
  //             orderList0: list,
  //           });
  //           break;
  //         case 1:
  //           that.setData({
  //             orderList1: list,
  //           });
  //           break;
  //         case 2:
  //           that.setData({
  //             orderList2: list,
  //           });
  //           break;
  //         case 3:
  //           that.setData({
  //             orderList3: list,
  //           });
  //           break;
  //         case 4:
  //           that.setData({
  //             orderList4: list,
  //           });
  //           break;
  //       }
  //     },
  //     fail: function () {
  //       // fail
  //       wx.showToast({
  //         title: '网络异常！',
  //         duration: 2000
  //       });
  //     }
  //   });
  // },

  // loadReturnOrderList: function () {
  //   var that = this;
  //   wx.request({
  //     url: app.d.ceshiUrl + '/Api/Order/order_refund',
  //     method: 'post',
  //     data: {
  //       uid: app.d.userId,
  //       page: that.data.refundpage,
  //     },
  //     header: {
  //       'ContentType': 'application/xwwwformurlencoded'
  //     },
  //     success: function (res) {
  //       //init data        
  //       var data = res.data.ord;
  //       var status = res.data.status;
  //       if (status == 1) {
  //         that.setData({
  //           orderList4: that.data.orderList4.concat(data),
  //         });
  //       } else {
  //         wx.showToast({
  //           title: res.data.err,
  //             duration: 2000
  //         });
  //       }
  //     },
  //     fail: function () {
  //       // fail
  //       wx.showToast({
  //         title: '网络异常！',
  //         duration: 2000
  //       });
  //     }
  //   });
  // },

  // returnProduct:function(){
  // },
  // initSystemInfo: function () {
  //   var that = this;

  //   wx.getSystemInfo({
  //     success: function (res) {
  //       that.setData({
  //         winWidth: res.windowWidth,
  //         winHeight: res.windowHeight
  //       });
  //     }
  //   });
  // },
onShareAppMessage: function (res) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
  }
  return {
    title: '小白店订单',
    path: '/pages/user/dingdan',
    success: function (res) {
      // 转发成功
    },
    fail: function (res) {
      // 转发失败
    }
  }
},
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });

      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          !that.data.orderList0.length && that.loadOrderList();
          break;
        case 1:
          !that.data.orderList1.length && that.loadOrderList();
          break;
        case 2:
          !that.data.orderList2.length && that.loadOrderList();
          break;
        case 3:
          !that.data.orderList3.length && that.loadOrderList();
          break;
        case 4:
          that.data.orderList4.length = 0;
          that.loadReturnOrderList();
          break;
      }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  // payOrderByWechat: function (e) {
  //   var order_id = e.currentTarget.dataset.orderId;
  //   var order_sn = e.currentTarget.dataset.ordersn;
  //   if (!order_sn) {
  //     wx.showToast({
  //       title: "订单异常!",
  //       duration: 2000,
  //     });
  //     return false;
  //   }
  //   wx.request({
  //     url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
  //     data: {
  //       order_id: order_id,
  //       order_sn: order_sn,
  //       uid: app.d.userId,
  //     },
  //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //     header: {
  //       'ContentType': 'application/xwwwformurlencoded'
  //     }, // 设置请求的 header
  //     success: function (res) {
  //       if (res.data.status == 1) {
  //         var order = res.data.arr;
  //         wx.requestPayment({
  //           timeStamp: order.timeStamp,
  //           nonceStr: order.nonceStr,
  //           package: order.package,
  //           signType: 'MD5',
  //           paySign: order.paySign,
  //           success: function (res) {
  //             wx.showToast({
  //               title: "支付成功!",
  //               duration: 2000,
  //             });
  //             setTimeout(function () {
  //               wx.navigateTo({
  //                 url: '../user/dingdan?currentTab=1&otype=deliver',
  //               });
  //             }, 3000);
  //           },
  //           fail: function (res) {
  //             wx.showToast({
  //               title: res,
  //               duration: 3000
  //             })
  //           }
  //         })
  //       } else {
  //         wx.showToast({
  //           title: res.data.err,
  //           duration: 2000
  //         });
  //       }
  //     },
  //     fail: function (e) {
  //       // fail
  //       wx.showToast({
  //         title: '网络异常！',
  //         duration: 2000
  //       });
  //     }
  //   })
  // },

  /**
   * 调用服务器微信统一下单接口创建一笔微信预订单
   */
  //   prePayWechatOrder: function(orderId){
  //     var uri = "/ztb/userZBT/GetWxOrder";
  //     var method = "post";
  //     var dataMap = {
  //       SessionId: app.globalData.userInfo.sessionId,
  //       OrderNo: orderId
  //     }
  //     console.log(dataMap);
  //     var successCallback = function (response) {
  //       console.log(response);
  //     };
  //     common.sentHttpRequestToServer(uri, dataMap, method, successCallback);
  //   }
})