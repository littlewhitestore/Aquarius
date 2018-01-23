var app = getApp();
// pages/order/pay.js
Page({
  data: {
    goods_id: 1,
    buy_number: 1,
    session: "",
    postage: "",
    items: [],
    total_amount: "",
    amount_payable: "",
    receiver: null
  },
  onLoad: function (options) {
    console.log("=======支付页面=========");
    console.log(!options.hasOwnProperty("goodsId") + "|" + (options.goodsId != ""))
    if (!options.hasOwnProperty("goodsId") || options.goodsId ==""){
      wx.showModal({
        title: '错误提示',
        content: '信息有误，返回详情',
        showCancel: false,
        confirmText: "返回",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({

            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      
      return;

    }
    var goodsId = parseInt(options.goodsId);

    var sessionId = app.globalData.session;
    this.setData({
      session: sessionId,
      goods_id: goodsId
    });
    
    this.loadDataAndSettlement({});
  },
  loadDataAndSettlement: function (address) {
    var that = this;
    wx.showLoading({
      title: '刷新中。。。',
      mask: true
    })
    wx.request({
      url: app.config.host + '/settlement?session='+app.globalData.session,
      method: 'post',
      data: {
        product_id: that.data.goods_id,
        number: that.data.buy_number,        
        receiver: address
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //that.initProductData(res.data);
        // var adds = res.data.adds;
        // if (adds) {
        //   var addrId = adds.id;
        //   that.setData({
        //     address: adds,
        //     addrId: addrId
        //   });
        // }
        console.log(res.data);
        if ("success"===res.data.status)
          console.log(res.data.data);
        that.setData({
          total_amount: res.data.data.total_amount,
          items: res.data.data.items,
          amount_payable: res.data.data.amount_payable
        });
        //endInitData
      },
      complete: function(){
        wx.hideLoading()
      }
    });
  },
  //提交订单
  submitOrder: function(){
    var that = this;
    //订单信息验证
    if (that.data.receiver){
      wx.showToast({
        title: '请完善收货地址信息',
      })
      return;
    }
      
    
    wx.showLoading({
      title: "正在提交订单。。",
      mask: true
    })
    wx.request({
      url: app.config.host + '/order/buynow?session=' + app.globalData.session,
      method: 'post',
      data: {
        product_id: that.data.goods_id,
        number: that.data.buy_number,
        receiver: address
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //that.initProductData(res.data);
        // var adds = res.data.adds;
        // if (adds) {
        //   var addrId = adds.id;
        //   that.setData({
        //     address: adds,
        //     addrId: addrId
        //   });
        // }
        console.log(res.data);
        if ("success" === res.data.status)
          console.log(res.data.data);
        that.setData({
          total_amount: res.data.data.total_amount,
          items: res.data.data.items,
          amount_payable: res.data.data.amount_payable
        });
        //endInitData
      },
      complete: function () {
        wx.hideLoading()
      }
    });  
  },
  
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value,
    })
  },

  //选择优惠券
  getvou: function (e) {
    var vid = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.vprice;
    var cprice = parseFloat(zprice) - parseFloat(price);
    this.setData({
      total: cprice,
      vid: vid
    })
  },

  //确认订单
  createProductOrder: function () {
    this.setData({
      btnDisabled: false,
    })

    //创建订单
    var that = this;
    wx.request({
      url: app.config.host + '/Api/Payment/payment',
      method: 'post',
      data: {
        uid: that.data.userId,
        cart_id: that.data.cartId,
        type: that.data.paytype,
        aid: that.data.addrId,//地址的id
        remark: that.data.remark,//用户备注
        price: that.data.total,//总价
        vid: that.data.vid,//优惠券ID
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if (data.status == 1) {
          //创建订单成功
          if (data.arr.pay_type == 'cash') {
            wx.showToast({
              title: "请自行联系商家进行发货!",
              duration: 3000
            });
            return false;
          }
          if (data.arr.pay_type == 'weixin') {
            //微信支付
            that.wxpay(data.arr);
          }
        } else {
          wx.showToast({
            title: "下单失败!",
            duration: 2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },

  settlement: function () {
    wx.request({
      url: app.config.host + '/settlement',
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        paymentInfo = res.data.payment_info
        wx.requestPayment({
          timeStamp: paymentInfo.time_stamp,
          nonceStr: paymentInfo.nonce_str,
          package: paymentInfo.package,
          signType: paymentInfo.sign_type,
          paySign: paymentInfo.sign,
          success: function (res) {
            wx.showToast({
              title: "支付成功!",
              duration: 2000,
            });
            setTimeout(function () {
              wx.navigateTo({
                url: '../user/dingdan?currentTab=1&otype=deliver',
              });
            }, 2500);
          },
          fail: function (res) {
            wx.showToast({
              title: res,
              duration: 3000
            })
          }
        })
      }
    })
  },

  //调起微信支付
  wxpay: function (order) {
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        order_sn: order.order_sn,
        uid: this.data.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 2500);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },
  //请求地址
  setAddressData: function(){
    console.log("========进入选择地址==========");
    var that = this;
    wx.chooseAddress({      
      success: function (res) {
        var addressData = { 
          province: res.provinceName,
          city: res.cityName,
          district: res.countyName,
          address: res.detailInfo,
          name: res.userName,
          mobile: res.telNumber,
          postalCode: res.postalCode,
          nationalCode: res.nationalCode
          }; 
        that.setData({
          receiver: addressData
        });
        console.log(that.data.receiver);
        console.log("地址添加后=====" + (that.data.receiver == null));
        that.loadDataAndSettlement(that.data.receiver)
      }
    })
  },

  //让用户选择地址
  getWxAddress: function(){
    console.info("=======进入调用地址方法=======");
    var that = this;
    wx.getSetting({
      success: (res) =>{
                //如果没有地址权限
        if (!res.authSetting.hasOwnProperty("scope.address")){
          console.info("=======进入地址权限校验失败=======");
          wx.authorize({
            scope: 'scope.address',
            success: (data) =>{
              console.info("=======授权地址=======");
              
              that.setAddressData();
              return;
            },
            fail: () =>{
              //用户拒绝使用微信地址 弹出
              console.info("=======用户拒绝授权地址=======");
              wx.showModal({
                title: '提示',
                content: '您未搜权小程序使用微信收货地址(通讯地址)，将无法下单，请点击确定按钮重新授权登录',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting["scope.address"]){
                         
                          that.setAddressData()
                          return;
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }else{
          console.info("=======用户已经授权地址=======");
          that.setAddressData();
        }
        
        // for(var i=0; i<res.authSetting.length;++i){
        //   console.info(res.authSetting[i]);
        //   console.info(item);
        //   console.info(res.authSetting[i].key);
        //   console.info(res.authSetting[i].value);
        // }
      }
    

    })
  }


});