var app = getApp();
// pages/order/pay.js
Page({
  data: {
    orderid: "4",
    goods_id: 1,
    buy_number: 1,
    session: "",
    postage: "",
    items: [],
    total_amount: "",
    amount_payable: "",
    receiver: null,
    pay_data:null
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
    
    this.loadDataAndSettlement();
  },
  loadDataAndSettlement: function () {
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
        receiver: that.data.receiver
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
        if ("success"===res.data.status){
          console.log(res.data.data);
          that.setData({
          total_amount: res.data.data.total_amount,
          items: res.data.data.items,
          amount_payable: "0.01",
          postage: res.data.data.postage
          });
        }else{
          wx.showToast({
            title: res.data.message,
          })
        }   

        //endInitData
      },
      complete: function(){
        console.log(that.data.items);
        wx.hideLoading()
      }
    });
  },
  //提交订单
  submitOrder: function(){
    var that = this;
    //订单信息验证
    if (!that.data.receiver){
      wx.showToast({
        title: '请完善收货地址信息',
      })
      return;
    };

    if (!that.data.amount_payable) {
      wx.showToast({
        title: '请刷新',
      })
      return;
    };  
    
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
        // receiver: that.data.receiver,
        receiver: {
          province: "beijing",
          city: "beijing",
          district: "chaoyang",
          address: "3litun",
          name: "xiaobai",
          mobile: "16612345678",
          postalCode: "ddsadsad",
          nationalCode: "086"
        }

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {      
        console.log(res.data)
        if ("success" === res.data.status){
          console.log(res.data.data);
          var pay_data_loc = {
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            nonceStr: res.data.data.nonceStr,
            timeStamp: res.data.data.timeStamp,            
          };
          that.setData({
            pay_data: pay_data_loc
          });        
          wx.requestPayment({
            timeStamp: that.data.pay_data.timeStamp+"",
            nonceStr: that.data.pay_data.nonceStr,
            package: that.data.pay_data.package,
            signType: that.data.pay_data.signType,
            paySign: that.data.pay_data.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '../user/dd?orderid=' + that.data.orderid,
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: res.requestPayment,
                duration: 3000
              })
            }
          })
         
         
        }
          
        //endInitData
      },
      complete: function () {
        wx.hideLoading()
      }
    });  
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
        that.loadDataAndSettlement();
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
  },
  //减购买数量
  minus: function(){
    var that = this;

    if (that.data.buy_number>1){
      this.setData({
        buy_number: that.data.buy_number - 1
      })
      this.loadDataAndSettlement();
    }
      
  },
  //加购买数量
  plus: function(){
    var that = this;
    this.setData({
      buy_number: that.data.buy_number + 1
    })
    this.loadDataAndSettlement();
  } 


});