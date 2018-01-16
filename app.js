// app.js
App({
  globalData: {
    session: null,
    userInfo: null,
  },
  header:{
    session_id: null,
  },
  config: {
    host: 'https://www.xiaobaidiandev.com/api'
  },
  onLaunch: function () {
    this.confirmUserLogin();
  },
  confirmUserLogin() {
    var reload = false;
    wx.checkSession({
      fail: function () {
        reload = true;
        console.info("检测session状态 ，返回fail")
      },
      success: function(){
        console.info("检测session状态 ，返回success")
      }
    })
    if (!reload) {
      try {
        var value = wx.getStorageSync('session');
        if (value) {
          this.globalData.sessionn = value;
        }
        else {
          reload = true;
        }
      } catch(e) {
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
            that.globalData.session = res.data.session;
            that.header.session_id = res.data.session;
            console.info("服务器接口返回的session=" + res.data.session);
            wx.setStorage({
              key: 'session',
              data: res.data.session,
            }) 
          }
        })
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.info("用户信息-》",res)
            wx.setStorage({
              key: 'userInfo',
              data: res.userInfo,
            })
          }
        });
      }
    });
  },



  // getUserSessionKey: function (code) {
  //   //用户的订单状态
  //   var that = this;
  //   wx.request({
  //     url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
  //     method: 'post',
  //     data: {
  //       code: code
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       //--init data        
  //       var data = res.data;
  //       if (data.status == 0) {
  //         wx.showToast({
  //           title: data.err,
  //           duration: 2000
  //         });
  //         return false;
  //       }

  //       that.globalData.userInfo['sessionId'] = data.session_key;
  //       that.globalData.userInfo['openid'] = data.openid;
  //       that.onLoginUser();
  //     },
  //     fail: function (e) {
  //       wx.showToast({
  //         title: '网络异常！err:getsessionkeys',
  //         duration: 2000
  //       });
  //     },
  //   });
  // },
  // onLoginUser: function () {
  //   var that = this;
  //   var user = that.globalData.userInfo;
  //   wx.request({
  //     url: that.d.ceshiUrl + '/Api/Login/authlogin',
  //     method: 'post',
  //     data: {
  //       SessionId: user.sessionId,
  //       gender: user.gender,
  //       NickName: user.nickName,
  //       HeadUrl: user.avatarUrl,
  //       openid: user.openid
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       //--init data        
  //       var data = res.data.arr;
  //       var status = res.data.status;
  //       if (status != 1) {
  //         wx.showToast({
  //           title: res.data.err,
  //           duration: 3000
  //         });
  //         return false;
  //       }
  //       that.globalData.userInfo['id'] = data.ID;
  //       that.globalData.userInfo['NickName'] = data.NickName;
  //       that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
  //       var userId = data.ID;
  //       if (!userId) {
  //         wx.showToast({
  //           title: '登录失败！',
  //           duration: 3000
  //         });
  //         return false;
  //       }
  //       that.d.userId = userId;
  //     },
  //     fail: function (e) {
  //       wx.showToast({
  //         title: '网络异常！err:authlogin',
  //         duration: 2000
  //       });
  //     },
  //   });
  // },
});





