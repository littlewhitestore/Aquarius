var app = getApp();
// pages/order/pay.js
Page({
  data: {
    orderid: "",
    goods_id: "",
    sku_id:"",
    buy_number: 1,
    token: "",
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
    var skuId = parseInt(options.skuId);
    var num = parseInt(options.num);
    var tokenId = app.globalData.token;
    console.log("==" + goodsId + "==" + skuId + "===" + num)
    this.setData({
      token: tokenId,
      goods_id: goodsId,
      sku_id: skuId,
      buy_number: num
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
      url: app.config.host + '/settlement/buynow',
      method: 'post',
      data: {
        goods_id: that.data.goods_id,
        sku_id: that.data.sku_id,
        number: that.data.buy_number,        
        receiver: that.data.receiver,
        token: app.globalData.token,
        entry: app.globalData.entry,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status_code && res.data.status_code == 1){
          console.log(res.data.data);
          that.setData({
          total_amount: res.data.data.total_amount,
          items: res.data.data.items,
          amount_payable: res.data.data.amount_payable,
          postage: res.data.data.postage
          });
        } else if (res.data.status_code == 0){
          wx.showToast({
            title: res.data.message,
          })
        } else if (res.data.status_code == 2){
          app.confirmUserLogin();
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
      url: app.config.host + '/order/create/buynow' ,
      method: 'post',
      data: {
        goods_id: that.data.goods_id,
        sku_id: that.data.sku_id,
        number: that.data.buy_number,
        receiver: that.data.receiver,
        token: app.globalData.token,
        entry: app.globalData.entry,
        // receiver: {
        //   province: "beijing",
        //   city: "beijing",
        //   district: "chaoyang",
        //   address: "3litun",
        //   name: "xiaobai",
        //   mobile: "16612345678",
        //   postalCode: "ddsadsad",
        //   nationalCode: "086"
        // }

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {      
        console.log(res.data)
        if (res.data.status_code && res.data.status_code ==1){
          console.log(res.data.data);
          var pay_data_loc = {
            package: res.data.data.mina_payment.package,
            signType: res.data.data.mina_payment.signType,
            paySign: res.data.data.mina_payment.paySign,
            nonceStr: res.data.data.mina_payment.nonceStr,
            timeStamp: res.data.data.mina_payment.timeStamp,  
                    
          };
          that.setData({
            pay_data: pay_data_loc,
            orderid: res.data.data.order_id
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
                  url: '../order/pay-success?orderid=' + that.data.orderid,
                  
                });
                console.log(that.data);
              }, 2300);
            },
            fail: function (res) {
              if (res.errMsg == "requestPayment:fail cancel"){
                wx.showToast({
                  title: "用户取消的支付",
                  duration: 3000,
                  
                })
              }
              
            }
          })     
         
        } else if (res.data.status_code == 0) {
          wx.showToast({
            title: res.data.message,
          })
        } else if (res.data.status_code == 2) {
          app.confirmUserLogin();
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