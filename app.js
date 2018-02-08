// app.js
App({
  globalData: {
    token: "",
    entry:"paris",
    userInfo: null,
    picUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1516107456424&di=fa76e77ada13337b47b711d45f05edf3&imgtype=0&src=http%3A%2F%2Fimage.tupian114.com%2F20121029%2F11381052.jpg.238.jpg",
    login_fail_time: 0,
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
    this.globalData.login_fail_time = 0;
  },
  confirmUserLogin(resolve, reject) {
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
      this.loginUser(resolve, reject);
    }
  },
  loginUser: function (resolve, reject) {
    console.log("=========33测试resolve===========");
    console.log(resolve);
    console.log(reject);
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log("code ="+code);
        wx.request({
          url: that.config.host + '/login',
          method: 'get',
          data: {
            'code': code,
            'entry':that.globalData.entry,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {            
            console.log("=========login ======"); 
            console.log(res);           
            if(res.data.status_code == 1){
              that.globalData.token = res.data.data.token;
              that.header.token_id = res.data.data.token;
              wx.setStorageSync('token', res.data.data.token);
              try {
                var value = wx.getStorageSync('token')
                if (value) {
                  console.log("setStorage成功=" + value);
                  if (resolve) {
                    resolve("resolve 登录大逻辑完成")
                  }
                  // Do something with return value
                }
              } catch (e) {
                // Do something when catch error
                if (reject) {
                  reject("reject 登录大逻辑fail!!")
                }
                console.log("setStoragefail");
              }          
              console.log("setStorage方法执行顺序后");
              
            } else if (res.data.status_code == 0){
              wx.showToast({
                title: res.data.message,
              })
              
            }
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo;
                that.uploadUserInfo(resolve, reject,res);
                console.info("用户信息-》", res);
                console.log(JSON.stringify(res.userInfo));
                wx.setStorageSync('userInfo', "JSON.stringify(res.userInfo)")
              },
              fail: function () {
                wx.showModal({
                  title: '提示',
                  content: '您未搜权登录小程序，将无法使用部分功能，请点击确定按钮重新授权登录',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        data: {
                          withCredentials: true
                        },
                        success: (res) => {
                          if (res.authSetting["scope.userInfo"])
                            wx.getUserInfo({
                              success: function (res) {
                                that.globalData.userInfo = res.userInfo;
                                console.info("用户信息-》", res);
                                that.uploadUserInfo(resolve, reject,res);
                                wx.setStorageSync({
                                  key: 'userInfo',
                                  data: "res.userInfo",
                                })
                              }
                            })
                        },
                        fail: (res) => {

                        }
                      })
                    }
                  }
                })
              }
            });
          },
          fail: function(res){
            console.log("=========login 请求失败 ======");
            console.log(res);
          }
        })
        
      }
    });
  },
  //上传用户信息
  uploadUserInfo: function (resolve, reject,res){
    var that = this;
    var login_fail_time = that.globalData.login_fail_time;
    
    if (login_fail_time >5){
      console.log("=======上传用户信息 错误超过5次=====");
      return;
    }
    console.log("=======u校验用户信息=====");
    wx.request({
      url: that.config.host + '/wechat/user/info/upload',
      method: 'post',
      data: {
        'user_info': res.userInfo,
        'raw_data': res.rawData,
        'signature': res.signature,
        'encrypted_data': res.encryptedData,
        'iv': res.iv,
        'token': that.globalData.token,
        'entry': that.globalData.entry
      },
      header: {
        'Content-Type': 'application/json'
      },
      success:(res) =>{
        if ("success" == res.data.message){
          console.log("=======u用户信息校验成功=====");
          
        }
      },
      fail:() => {
        login_fail_time ++;
        this.confirmUserLogin();
        
      }
    })
  }


  
});





