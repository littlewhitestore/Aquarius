
var Promisify = require('../../utils/httpsPromisify');

var app = getApp();
//goods/detail.js
Page({
  firstIndex: -1,
  data: {
    bannerApp: true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    goodsId: 0,
    slider: [],
    swiperCurrent: 0,
    detailImageList: [],
    buynum: 1,
    arr1: [],
    arr2: [],

    // 属性选择
    firstIndex: -1,
    //准备数据
    //数据结构：以一组一组来进行设定
    commodityAttr: [],
    attrValueList: [],
    currentSku:{},
    curSkuPrice:""
  },
  // backshop:function(e){
  //   console.adlog(e)
  //   wx.navigateTo({

  //   //数据结构：以一组一组来进行设定
  //   commodityAttr: [],
  //   attrValueList: []
  // },

  // 传值
  onLoad: function (option) {
    console.log(option)
    this.loadData(option)
  },





  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '小白店测试商品',
      path: '/pages/goods/detail',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  backshop: function (e) {

    wx.reLaunch({
      url: '../home/home',
      success: function (res) {
        console.log(e)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  // 弹窗
  setModalStatus: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step();

    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },
  // 加减
  changeNum: function (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.buynum <= 1) {
        buynum: 1
      } else {
        this.setData({
          buynum: this.data.buynum - 1
        })
      };
    } else {
      this.setData({
        buynum: this.data.buynum + 1
      })
    };
  },
  click1: function (res) {
    var that=this;
    console.log(res.currentTarget.dataset.id);
    var postid1 = res.currentTarget.dataset.id;
    console.log(that.data.arr1[postid1].btn_class)
    console.log(that.data.arr1)
    
    
    if (that.data.arr1[postid1].btn_class == "unselect"){//判断为选中事件
      
      that.unselecteRowBtn(that.data.arr1 ,0)
      that.data.arr1[postid1].btn_class = "selected";//改变选中样式
      that.setData({
        arr1: that.data.arr1
      });
      checkClickEv("down",0);
    } else if (that.data.arr1[postid1].btn_class == "selected") {//判断为取消事件
      that.data.arr1[postid1].btn_class = "unselect";//改变选中样式     
      that.setData({
        arr1: that.data.arr1
      });
      checkClickEv("up",0);
    } else if (that.data.arr1[postid1].btn_class == "disselect") {//不可操作的按钮 事件不处理

    }
  },

  click2: function (res) {
    var that = this;
    console.log(res.currentTarget.dataset.id);
    var postid2= res.currentTarget.dataset.id;
    if (that.data.arr2[postid2].btn_class == "unselect") {//判断为选中事件

      that.unselecteRowBtn(that.data.arr2, 1)
      that.data.arr2[postid2].btn_class = "selected";//改变选中样式
      that.setData({
        arr2: that.data.arr2
      });
      checkClickEv("down" ,1);
    } else if (that.data.arr2[postid2].btn_class == "selected") {//判断为取消事件
      that.data.arr2[postid2].btn_class = "unselect";//改变选中样式     
      that.setData({
        arr2: that.data.arr2
      });
      checkClickEv("up", 1);
    } else if (that.data.arr2[postid2].btn_class == "disselect") {//不可操作的按钮 事件不处理

    }
  },
  //取消到某一行属性按钮
  unselecteRowBtn: function(attr_row,index){
    for (var item_index in attr_row){
      if (attr_row[item_index].btn_class = "selected"){
        attr_row[item_index].btn_class = "unselect"
      }
    }
    if(index == 0){
      this.setData({
        arr1: attr_row
      })
    }else if (index ==1){
      this.setData({
        arr2: attr_row
      })
    }
    
  },
  getSelectedNum: function(){
    var selectedList = []
    var that = this;    
    if (that.data.aar1 && that.data.aar1.length >0){
      for (var index in that.data.arr1) {
        if (that.data.arr1[index].btn_class == "selected") {
          selectedList.push(that.data.arr1[index].value)
        }
      }
    }
    if (that.data.aar2 && that.data.aar2.length > 0) {
      for (var index in that.data.arr2) {
        if (that.data.arr2[index].btn_class == "selected") {
          selectedList.push(that.data.arr2[index].value)
        }
      }
    }
    
    if(num <=2){
      return selectedList;
    }
    
  },
  //点击事件后 检测点击结果与skulist比较，作出UI调整或者赋值
  checkClickEv:function(press_ev,index){
    var that = this 
    //事件发生后哪些item被选中了 返回 attr 数组
    var selectedList = getSelectedNum()
    var num = selectedList.length
    if (num == 1) {
      if(press_ev == "down"){
        //说明是选中操作 且刚选中1个
        if (that.data.goods_info.property_vector.length == 1){
          that.data.currentSku =  that.compareSkuToSelected(selectedList)
          that.setData({
            currentSku: that.data.currentSku
          })
           
        } else if (that.data.goods_info.property_vector.length == 2){
          if(index == 0){
            // 假设选中的arr与另一组arr组合后，再与sku对比，筛选出不符合sku的
            for(var i in that.data.arr2){
              var arr_list =[]
              arr_list.push(selectedList[0])
              arr_list.push(that.data.arr2[i].value)
              var sku = that.compareSkuToSelected(arr_list)
              if (sku && sku.stock>0){
                //如果有匹配的sku 且 sku的库存量大于0
                that.data.arr2[i].btn_class = "unselect"
                
              }else{
                //如果没有匹配的sku  或者 有匹配的sku的库存为0
                that.data.arr2[i].btn_class = "disselect"
              }
            }
            that.setData({
              arr2: that.data.arr2
            })
          }else if (index == 1){
            // 假设选中的arr与另一组arr组合后，再与sku对比，筛选出不符合sku的
            for (var i in that.data.arr1) {
              var arr_list = []
              arr_list.push(selectedList[0])
              arr_list.push(that.data.arr1[i].value)
              var sku = that.compareSkuToSelected(arr_list)
              if (sku && sku.stock > 0) {
                //如果有匹配的sku 且 sku的库存量大于0
                that.data.arr1[i].btn_class = "unselect"

              } else {
                //如果没有匹配的sku  或者 有匹配的sku的库存为0
                that.data.arr1[i].btn_class = "disselect"
              }
            }
            that.setData({
              arr1: that.data.arr1
            })
          }
        }
      }else if( press_ev == "up"){
        //说明是取消操作， 且从选中两个取消到1个
        
        that.caluMaxMinPrice()
        that.setData({
          currentSku: {}
        })

      }
    } else if (num == 2){
      if (press_ev == "down") {
        //说明是选中操作 且刚选中2个
      }
    }else if (num == 0){
      if (press_ev == "up") {
        //说明是取消操作 且从选中1个取消到1个
      }
    }
  },

  //2个attr组合后与skulist比较
  compareSkuToSelected:function(array_arrt){
    for (var index in this.data.goods_info.sku_list){
      if (this.compareArray(array_arrt, this.data.goods_info.sku_list[index].property_value_vector)) {
        return this.data.goods_info.sku_list[index];
      }
    }
    
  },
  compareArray:function(array_sku,array_arrt){
    if (!array_sku)
          return false;
      // compare lengths - can save a lot of time 
    if (array_sku.length != array_arrt.length)
          return false;
    for (var i = 0, l = array_sku.length; i < l; i++) {
          // Check if we have nested arrays
      if (array_sku[i] instanceof Array && array_arrt[i] instanceof Array) {
              // recurse into the nested arrays
        if (!array_sku[i].equals(array_arrt[i]))
                  return false;
      } else if (array_sku[i] != array_arrt[i]) {
              // Warning - two different object instances will never be equal: {x:20} != {x:20}
              return false;
      }
    }
      return true;
  },
  
  loadData: function(option){
    var that = this;
    that.setData({
      goods_id: option.goods_id,
    });
    Promisify.httpsPromisify(wx.request)({
      url: app.config.host + '/goods/1/detail',
      method: 'get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then(function (res) {

      console.log(res)
      if (res.data.status_code && res.data.status_code == 1) {

        var mock_sku_list = [
            {
              price: 0.01,
              sku_id: 1,
              property_value_vector: [
                "大",
                "青"
              ],
              img: "http://xiaobaidian-img-001-1255633922.picgz.myqcloud.com/banner1.jpeg",
              stock: 20
            },
            {
              price: 0.01,
              sku_id: 2,
              property_value_vector: [
                "大",
                "黄"
              ],
              img: "http://xiaobaidian-img-001-1255633922.picgz.myqcloud.com/banner1.jpeg",
              stock: 20
            },
            {
              price: 0.01,
              sku_id: 3,
              property_value_vector: [
                "中",
                "黄"
              ],
              img: "http://xiaobaidian-img-001-1255633922.picgz.myqcloud.com/banner1.jpeg",
              stock: 20
            },
            {
              price: 0.01,
              sku_id: 4,
              property_value_vector: [
                "小",
                "青"
              ],
              img: "http://xiaobaidian-img-001-1255633922.picgz.myqcloud.com/banner1.jpeg",
              stock: 20
            },
          ]
        var mock_property_vector = [
          {
            values: [
              "大",
              "中",
              "小"
            ],
            key: "尺码"
          },
          {
            values: [
              "青",
              "黄",
              "白"
            ],
            key: "颜"
          }
        ]
        res.data.data.sku_list = mock_sku_list
        res.data.data.property_vector = mock_property_vector

       
        
        that.setData({
          goods_info: res.data.data,
          slider: res.data.data.banner_img_list,
          services: res.data.data.services,
          detailImageList: res.data.data.goods_detail_img_list
          
        });
       
        console.log(that.data.goods_info);
      } else if (res.data.status_code == 0) {
        wx.showToast({
          title: res.data.message,
        })
      }

      for (var index in that.data.goods_info.property_vector) {
        var property_list = []
        for (var valueindex in that.data.goods_info.property_vector[index].values) {
          var arr2_obj = {
            key: "",
            value: "",
            id: valueindex,
            btn_class: "disable_select" //disable_select selected unselect
          }
          arr2_obj.key = that.data.goods_info.property_vector[index].key
          arr2_obj.value = that.data.goods_info.property_vector[index].values[valueindex]
          property_list.push(arr2_obj)
        }
        if (index == 0) {
          that.setData({
            arr1: property_list
          })
        } else if (index == 1) {
          that.setData({
            arr2: property_list
          })
        }
        

      }
     
      


    }).then( function(){
      
      //初始化sku attr按钮样式
      that.initAttritem()
      //计算价格
      that.caluMaxMinPrice()
    });
  },



  //判断sku弹出面板哪些能选哪些可以选择
  initAttritem: function(){
    var that = this
    
    if (that.data.goods_info.sku_list.length == 1){
      //只有一个sku 不需要弹窗
    } else if (that.data.goods_info.property_vector.length == 1 ){
      
      for (var i = 0; i < that.data.goods_info.sku_list.length; i ++){
        if (sku.stock == 0){
          that.data.arr1[i].btn_class = "disable_select"
        }
      }
      that.setData({
        arr1: that.data.arr1
      })
    } else if (that.data.goods_info.property_vector.length == 2){
      
      for (var arrt_index in that.data.arr1){
        var match = false
        for (var sku_index in that.data.goods_info.sku_list) {
          if (that.data.goods_info.sku_list[sku_index].stock <=0){
            continue
          }
          //因为确认此商品存在2个销售属性
          
          if (that.data.arr1[arrt_index].value == that.data.goods_info.sku_list[sku_index].property_value_vector[0]
            || that.data.arr1[arrt_index].value == that.data.goods_info.sku_list[sku_index].property_value_vector[1]){
            match = true
            break;
          }
        }
        if(match){
          that.data.arr1[arrt_index].btn_class = "unselect"  
          continue
        }
      }

      console.log("====初始化 arr1")
      console.log(that.data.arr1)
      that.setData({
        arr1:that.data.arr1
      })

      for (var arrt_index in that.data.arr2) {
        var match = false
        for (var sku_index in that.data.goods_info.sku_list) {
          if (that.data.goods_info.sku_list[sku_index].stock <= 0) {
            continue
          }
          //因为确认此商品存在2个销售属性
          
          var arrt_left = that.data.arr2[arrt_index].value;
          var sku_one = that.data.goods_info.sku_list[sku_index].property_value_vector[0];
          var sku_two = that.data.goods_info.sku_list[sku_index].property_value_vector[1];

          if (arrt_left == sku_one || arrt_left == sku_two) {
            console.log(" true ==" + that.data.arr2[arrt_index].value)
            match = true
            break;
          }
        }
        if (match) {
          that.data.arr2[arrt_index].btn_class = "unselect"
          continue
        }
      }
      console.log("====初始化 arr2")
      console.log(that.data.arr2)
      that.setData({
        arr2: that.data.arr2
      })
     
    }
    
  },


  caluMaxMinPrice:function(){
    var sku_price_array = []
    for (var index in this.data.goods_info.sku_list){
      sku_price_array.push(this.data.goods_info.sku_list[index].price)
    }
    function sortNumber(a, b) {
      return a - b
    }
    sku_price_array.sort(sortNumber);
    
    this.data.curSkuPrice = "¥" + sku_price_array[0] + " - " + sku_price_array[sku_price_array.length-1]
    this.setData({
      curSkuPrice: this.data.curSkuPrice
    })
  },





  // 属性选择
  onShow: function () {

    // this.setData({
    //   includeGroup: this.data.commodityAttr
    // });
    // this.distachAttrValue(this.data.commodityAttr);
    // // 只有一个属性组合的时候默认选中
    // // console.log(this.data.attrValueList);
    // if (this.data.commodityAttr.length == 1) {
    //   for (var i = 0; i < this.data.commodityAttr[0].attrValueList.length; i++) {
    //     this.data.attrValueList[i].selectedValue = this.data.commodityAttr[0].attrValueList[i].attrValue;
    //   }
    //   this.setData({
    //     attrValueList: this.data.attrValueList
    //   });
    // }
  },

  // /* 获取数据 */
  // distachAttrValue: function (commodityAttr) {
  //   /**
  //     将后台返回的数据组合成类似
  //     {
  //       attrKey:'型号',
  //       attrValueList:['1','2','3']
  //     }
  //   */
  //   // 把数据对象的数据（视图使用），写到局部内
  //   var attrValueList = this.data.attrValueList;
  //   // 遍历获取的数据
  //   for (var i = 0; i < commodityAttr.length; i++) {
  //     for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
  //       var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
  //       // console.log('属性索引', attrIndex); 
  //       // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置
  //       if (attrIndex >= 0) {
  //         // 如果属性值数组中没有该值，push新值；否则不处理
  //         if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
  //           attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
  //         }
  //       } else {
  //         attrValueList.push({
  //           attrKey: commodityAttr[i].attrValueList[j].attrKey,
  //           attrValues: [commodityAttr[i].attrValueList[j].attrValue]
  //         });
  //       }
  //     }
  //   }
  //   // console.log('result', attrValueList)
  //   for (var i = 0; i < attrValueList.length; i++) {
  //     for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
  //       if (attrValueList[i].attrValueStatus) {
  //         attrValueList[i].attrValueStatus[j] = true;
  //       } else {
  //         attrValueList[i].attrValueStatus = [];
  //         attrValueList[i].attrValueStatus[j] = true;
  //       }
  //     }
  //   }
  //   this.setData({
  //     attrValueList: attrValueList
  //   });
  // },
  // getAttrIndex: function (attrName, attrValueList) {
  //   // 判断数组中的attrKey是否有该属性值
  //   for (var i = 0; i < attrValueList.length; i++) {
  //     if (attrName == attrValueList[i].attrKey) {
  //       break;
  //     }
  //   }
  //   return i < attrValueList.length ? i : -1;
  // },
  // isValueExist: function (value, valueArr) {
  //   // 判断是否已有属性值
  //   for (var i = 0; i < valueArr.length; i++) {
  //     if (valueArr[i] == value) {
  //       break;
  //     }
  //   }
  //   return i < valueArr.length;
  // },
  // /* 选择属性值事件 */
  // selectAttrValue: function (e) {
  //   /*
  //   点选属性值，联动判断其他属性值是否可选
  //   {
  //     attrKey:'型号',
  //     attrValueList:['1','2','3'],
  //     selectedValue:'1',
  //     attrValueStatus:[true,true,true]
  //   }
  //   console.log(e.currentTarget.dataset);
  //   */
  //   var attrValueList = this.data.attrValueList;
  //   var index = e.currentTarget.dataset.index;//属性索引
  //   var key = e.currentTarget.dataset.key;
  //   var value = e.currentTarget.dataset.value;
  //   if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
  //     if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
  //       // 取消选中
  //       this.disSelectValue(attrValueList, index, key, value);
  //     } else {
  //       // 选中
  //       this.selectValue(attrValueList, index, key, value);
  //     }

  //   }
  // },
  // /* 选中 */
  // selectValue: function (attrValueList, index, key, value, unselectStatus) {
  //   // console.log('firstIndex', this.data.firstIndex);
  //   var includeGroup = [];
  //   if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
  //     var commodityAttr = this.data.commodityAttr;
  //     // 其他选中的属性值全都置空
  //     // console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus);
  //     for (var i = 0; i < attrValueList.length; i++) {
  //       for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
  //         attrValueList[i].selectedValue = '';
  //       }
  //     }
  //   } else {
  //     var commodityAttr = this.data.includeGroup;
  //   }

  //   // console.log('选中', commodityAttr, index, key, value);
  //   for (var i = 0; i < commodityAttr.length; i++) {
  //     for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
  //       if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
  //         includeGroup.push(commodityAttr[i]);
  //       }
  //     }
  //   }
  //   attrValueList[index].selectedValue = value;

  //   // 判断属性是否可选
  //   // for (var i = 0; i < attrValueList.length; i++) {
  //   //   for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
  //   //     attrValueList[i].attrValueStatus[j] = false;
  //   //   }
  //   // }
  //   // for (var k = 0; k < attrValueList.length; k++) {
  //   //   for (var i = 0; i < includeGroup.length; i++) {
  //   //     for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
  //   //       if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
  //   //         for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
  //   //           if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
  //   //             attrValueList[k].attrValueStatus[m] = true;
  //   //           }
  //   //         }
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   // console.log('结果', attrValueList);
  //   this.setData({
  //     attrValueList: attrValueList,
  //     includeGroup: includeGroup
  //   });

  //   var count = 0;
  //   for (var i = 0; i < attrValueList.length; i++) {
  //     for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
  //       if (attrValueList[i].selectedValue) {
  //         count++;
  //         break;
  //       }
  //     }
  //   }
  //   if (count < 2) {// 第一次选中，同属性的值都可选
  //     this.setData({
  //       firstIndex: index
  //     });
  //   } else {
  //     this.setData({
  //       firstIndex: -1
  //     });
  //   }
  // },
  // /* 取消选中 */
  // disSelectValue: function (attrValueList, index, key, value) {
  //   var commodityAttr = this.data.commodityAttr;
  //   attrValueList[index].selectedValue = '';

  //   // 判断属性是否可选
  //   for (var i = 0; i < attrValueList.length; i++) {
  //     for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
  //       attrValueList[i].attrValueStatus[j] = true;
  //     }
  //   }
  //   this.setData({
  //     includeGroup: commodityAttr,
  //     attrValueList: attrValueList
  //   });

  //   for (var i = 0; i < attrValueList.length; i++) {
  //     if (attrValueList[i].selectedValue) {
  //       this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
  //     }
  //   }
  // },

  // initProductData: function (data) {
  //   data["LunBoProductImageUrl"] = [];

  //   var imgs = data.LunBoProductImage.split(';');
  //   for (let url of imgs) {
  //     url && data["LunBoProductImageUrl"].push(app.d.hostImg + url);
  //   }

  //   data.Price = data.Price / 100;
  //   data.VedioImagePath = app.d.hostVideo + '/' + data.VedioImagePath;
  //   data.videoPath = app.d.hostVideo + '/' + data.videoPath;
  // },

  // //添加到收藏
  // addFavorites: function (e) {
  //   var that = this;
  //   wx.request({
  //     url: app.config.url + '/Api/Product/col',
  //     method: 'post',
  //     data: {
  //       uid: app.d.userId,
  //       pid: that.data.goodsId,
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       // //--init data        
  //       var data = res.data;
  //       if (data.status == 1) {
  //         wx.showToast({
  //           title: '操作成功！',
  //           duration: 2000
  //         });
  //         //变成已收藏，但是目前小程序可能不能改变图片，只能改样式
  //         that.data.detailData.isCollect = true;
  //       } else {
  //         wx.showToast({
  //           title: data.err,
  //           duration: 2000
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

  gobuy: function (e) { //添加到购物车
    var that = this;
    //假跳转
    wx.navigateTo({
      url: '../order/pay?goodsId=' + "1000"
    });
    // wx.request({
    //   url: app.config.host + '/Api/Shopping/add',
    //   method: 'post',
    //   data: {
    //     // uid: app.d.userId,
    //     session: app.globalData.session,
    //     pid: that.data.goodsId,
    //     num: that.data.buynum,
    //   },
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     // //--init data        
    //     var data = res.data;
    //     if (data.status == 1) {
    //       var ptype = e.currentTarget.dataset.type;
    //       if (ptype == 'buynow') {
    //         wx.redirectTo({
    //           url: '../order/pay?cartId=' + data.cart_id
    //         });
    //         return;
    //       } else {
    //         wx.showToast({
    //           title: '加入购物车成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //       }
    //     } else {
    //       wx.showToast({
    //         title: data.err,
    //         duration: 2000
    //       });
    //     }
    //   },
    //   fail: function () {
    //     // fail
    //     wx.showToast({
    //       title: '网络异常！',
    //       duration: 2000
    //     });
    //   }
    // });
  },
  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  initNavHeight: function () {////获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bannerClosed: function () {
    this.setData({
      bannerApp: false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

});
