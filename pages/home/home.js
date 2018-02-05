 var app = getApp();
 var util = require("../../utils/util.js");
// home/home.js
Page({
  data: {
    imgUrls: [],
    circular: true,
    slider: [
     
    ],
    count: 4,

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
  godetail: function (res) {
 console.log(res)
 var goods_id=res.currentTarget.dataset.id;
wx.navigateTo({
      url:"../goods/detail?goods_id="+goods_id,
       
    })

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
        if (res.data.status_code == 1) {
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
        } else if (res.data.status_code == 0) {
          wx.showToast({
            title: res.data.message,
          })
        }

      },
      fail: function(e){
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


  onLoad: function () {
    this.loadList(0);


  },


  loadList: function (offset) {
    var that = this;
    wx.request({
      url: app.config.host + '/home?token=' + util.gettoken() + "&offset=" + offset + "&count=" + that.data.count,
      method: 'get',
      data: {},
      header: {
        'ContentType': 'application/xwwwformurlencoded'
      },
      success: function (res) {
        console.log(res.data.status_code);
        if (res.data.status_code && res.data.status_code == 1) {
          if (offset == 0) {
            console.log("=====首页数据请求成功=======");
            console.log(res);
            var bannerimg = res.data.data.banner_img_list;
            var productlist = res.data.data.goods_list;


            that.setData({
              slider: bannerimg,
              productData: productlist

            });

           
          } else if (offset > 0) {
            that.data.productData = that.data.productData.concat(res.data.data.goods_list);

            that.setData({
              productData: that.data.productData
            });
          }


        } else if (res.data.status_code == 0) {
          wx.showToast({
            title: res.data.message,
          })
        } 

        console.log(that.data.productData);
      },
      fail: function (e) {
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

      }
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.loadList(0);
  },
  onReachBottom: function () {
    this.loadList(this.data.productData.length);
  },






  onShareAppMessage: function () {
    return {
      title: '小白店商城',
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