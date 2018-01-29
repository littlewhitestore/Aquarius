// app.js
App({
  globalData: {
    token: null,
    token: "",
    userInfo: null,
    picUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1516107456424&di=fa76e77ada13337b47b711d45f05edf3&imgtype=0&src=http%3A%2F%2Fimage.tupian114.com%2F20121029%2F11381052.jpg.238.jpg"
  },
  header: {
    token_id: null,
  },
  config: {
    host: 'https://www.xiaobaidiandev.com/api',
    appId: "wxd4eae843e18ff7da",//小程序APPid
    mchId: "1495032292"//微信商户id
  },
  onLaunch: function () {
    this.confirmUserLogin();
  },
  confirmUserLogin() {
    var reload = false;
    wx.checkSession({
      fail: function () {
        reload = true;
        console.info("检测token状态 ，返回fail")
      },
      success: function () {
        console.info("检测token状态 ，返回success")
      }
    })
    if (!reload) {
      try {
        var value = wx.getStorageSync('token');
        if (value) {
          this.globalData.token = value;
        }
        else {
          reload = true;
        }
      } catch (e) {
        reload = true;
      }
      try {
        var value = wx.getStorageSync('user_info');
        if (value) {
          this.globalData.userInfo = value;
        }
        else {
          reload = true;
        }
      } catch (e) {
        reload = true;
      }
    }
    if (reload) {
      this.loginUser();
    }
  },
  loginUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log("code ="+code);
        wx.request({
          url: that.config.host + '/login',
          method: 'get',
          data: {
            'code': code
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            
            console.log("=========login ======");
            
            that.globalData.token = res.data.data.token;
            that.header.token_id = res.data.data.token;
            
            console.log("服务器接口返回的token=" + res.data.data.token);
            wx.setStorage({
              key: 'token',
              data: res.data.data.token,
            })
          },
          fail: function(res){
            console.log("=========login 请求失败 ======");
            console.log(res);
          }
        })
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.info("用户信息-》", res)
            wx.setStorage({
              key: 'userInfo',
              data: res.userInfo,
            })
          },
          fail: function () {
            wx.showModal({
              title: '警告',
              content: '您未搜权登录小程序，将无法使用部分功能，请点击确定按钮重新授权登录',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.userInfo"])
                        wx.getUserInfo({
                          success: function (res) {
                            that.globalData.userInfo = res.userInfo;
                            console.info("用户信息-》", res)
                            wx.setStorage({
                              key: 'userInfo',
                              data: res.userInfo,
                            })
                          }
                        })
                    }
                  })
                }
              }
            })


          }
        });
      }
    });
  },



  
});





