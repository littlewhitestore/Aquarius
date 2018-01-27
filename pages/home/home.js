 var app = getApp();

Page({
  data: {
    imgUrls: [],
    circular: true,
    slider: [
     
    ],
    swiperCurrent: 0,

    productData: [],
    proCat: [],
    page: 2,
    index: 2,
    brand: [],
    // 滑动
    imgUrl: [],
    kbs: [],
    lastcat: [],
    course: []
  },
  gotop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  godetail: function () {
    wx.navigateTo({
      url:"../goods/detail?goods_id="+1234,
       
    })

  },

//下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  //加载更多
  onReachBottom: function () {
    console.log('正在加载')
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true,
        // productData: [
       
        // ],
      })
    }, 1000)
  },

  //跳转商品列表页   
  listdetail: function (e) {
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title=' + e.currentTarget.dataset.title,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //跳转商品搜索页  
  suo: function (e) {
    wx.navigateTo({
      url: '../search/search',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //后四个分类跳转
  other: function (e) {
    var ptype = e.currentTarget.dataset.ptype;
    var title = e.currentTarget.dataset.text;
    if (ptype == 'news') {
      wx.navigateTo({
        url: '../inf/inf'
      });
    } else if (ptype == 'jxys') {
      wx.navigateTo({
        url: '../synopsis/synopsis?title=教学优势&wedId=2'
      });
    } else if (ptype == 'xyfc') {
      wx.navigateTo({
        url: '../student_style/student_style'
      });
    } else if (ptype == 'gywm') {
      wx.navigateTo({
        url: '../synopsis/synopsis?title=关于我们&wedId=1'
      });
    }
  },

  //品牌街跳转商家详情页
  jj: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../listdetail/listdetail?brandId=' + id,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },


  tian: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../works/works',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getlist',
      method: 'post',
      data: { page: page },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var prolist = res.data.prolist;
        if (prolist == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page + 1,
          productData: that.data.productData.concat(prolist)
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },



  onLoad: function (options) {
    var that = this;
    var sessionId = app.globalData.session;
    that.setData({
      sessionId: sessionId,
    });
    wx.request({
      url: app.config.host + '/home?sessionId=' + app.globalData.session,
      method: 'get',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("=====首页数据请求成功=======");
        console.log(res);
        var bannerimg = res.data.data.banner_img_list;
        var productlist=res.data.data.goods_list;
        
        
        that.setData({
          slider: bannerimg,
          productData: productlist
         
        });
       
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！'+e,
          duration: 2000
        });
        console.log("=====首页数据请求失败=======");
        console.log(e);
      },
    })

  },
  onShareAppMessage: function () {
    return {
      title: '宠物美容学校',
      path: '/pages/home/home',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }



});