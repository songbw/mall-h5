<template lang="html">
  <div class="orderlist">
    <v-header v-if="showHeader">
      <h1 slot="title">我的订单</h1>
    </v-header>
    <div class="orderlist-layout">
      <van-tabs v-model="active" sticky @click="onClick" :swipe-threshold=swipeThreshold swipeable>
        <van-tab v-for="(item,type) in orderTypes" :title=item.title :key="type">
          <van-list v-model="item.loading" :finished="item.finished" @load="onLoad(active)">
            <div class="orderlist-body">
              <div v-if="item.total === 0" class="no-orderlist">
                <img :src=no_orderList_bg>
                <span>您还没有相关订单</span>
              </div>
              <li v-else v-for="(k,i) in item.list" :key="i" style="list-style: none">
                <div class="orderDetail">
                  <div>
                    <van-cell :title=getMerchantName(k.merchantNo) icon="shop" :value="getOrderStatus(k.status)">
                    </van-cell>
                  </div>
                  <ul @click="onListClick(k,i)">
                    <li v-for="(sku,i)  in k.skus" :key='i' style="list-style: none">
                      <van-card :price="sku.unitPrice" :title="sku.name" :num="sku.num" :thumb="sku.image">
                        <div slot="tags" v-if="sku.salePrice != sku.unitPrice" class="cardtags">
                          <img :src="tag_promotion" v-if="sku.promotionDiscount > 0" />
                          <img :src="tag_coupon" v-if="sku.unitPrice - sku.salePrice - sku.promotionDiscount > 0" />
                        </div>
                        <div slot="footer" class="card_footer">
                          <div v-if="sku.status < 4">
                            <van-button plain round size="small" type="primary"
                              style="background-color: white;color: #ff4444;border-color: #ffcccc " @click.stop=""
                              @click="onAfterSalesServiceBtnClick(k,sku)" v-if="k.status==1||k.status==2">
                              申请售后
                            </van-button>
                          </div>
                          <div v-else-if="sku.status == 5">
                            <van-button plain round size="small" type="primary"
                              style="background-color: white;color: #888888;border-color: #f0f0f0 " @click.stop=""
                              @click="onQuerySalesServiceBtnClick(k,sku)">
                              查看售后
                            </van-button>
                          </div>
                        </div>
                      </van-card>
                    </li>
                  </ul>
                  <div style="margin: 10px 12px;color: #333333">
                    <span style="margin-left: 5px"></span>
                    <span style="float: right;">订单日期: {{formatTime(k.createdAt)}}</span>
                  </div>
                  <div class="orderDetailSummery">
                    <span v-if="k.couponDiscount != null">合计: ￥{{parseFloat(k.saleAmount).toFixed(2)}}元
                      (含运费:￥{{k.servFee.toFixed(2)}}, 优惠券:￥{{k.couponDiscount.toFixed(2)}}) </span>
                    <span v-else>合计: ￥{{parseFloat(k.saleAmount).toFixed(2)}}元 (含运费:￥{{k.servFee.toFixed(2)}})</span>
                  </div>
                  <div class="orderDetailAction">
                    <van-button plain round size="small" type="primary"
                      style="background-color: white;color: black ;border-color: #dedede"
                      @click="onConfirmBtnClick(k,i)" v-show="k.status==1">
                      确认收货
                    </van-button>
                    <van-button plain round size="small" type="primary"
                      style="background-color: #ff4444;color: white ;border-color: #ff4444" @click="onDelBtnClick(k,i)"
                      v-show="k.status==2||k.status==3">
                      删除订单
                    </van-button>
                    <van-button plain round size="small" type="primary"
                      style="background-color: white;color: black ;border-color: #dedede" @click="onCancelBtnClick(k,i)"
                      v-show="k.status==0">
                      取消订单
                    </van-button>
                    <van-button plain round size="small" type="primary"
                      style="background-color: white;color: #1989fa ;border-color: #dedede" @click="showMeqiaPanel">
                      联系客服
                    </van-button>
                    <van-button plain round size="small" type="primary"
                      style="background-color: white;color: #ff4444;border-color: #dedede " @click="onPayBtnClick(k,i)"
                      v-show="k.status==0">
                      去支付
                    </van-button>

                    <van-button plain round size="small" type="primary"
                      style="background-color: white;color: #ff4444;border-color: #dedede "
                      @click="onLogisticsBtnClick(k,i)" v-show="k.status==1">
                      查看物流
                    </van-button>
                    <van-button plain round size="small" type="primary"
                      style="background-color: white;color: #ff4444;border-color: #dedede " @click="onBuyBtnClick(k,i)"
                      v-show="k.status==2||k.status==3">
                      再次购买
                    </van-button>
                  </div>
                </div>
              </li>
            </div>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Footer from '@/common/_footer.vue'
  import Util from '@/util/common'


  export default {
    components: {
      'v-header': Header,
      'v-footer': Footer
    },


    data() {
      return {
        showHeader: true,
        active: 0,
        swipeThreshold: 5,
        no_orderList_bg: require('@/assets/icons/ico_empty_box.png'),
        tag_coupon: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_lab_coupon.png',
        tag_promotion: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_lab_promotion.png',
        launchedLoading: false,
        reload: false,
        orderTypes: [{
            "title": "全部",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": -1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "待支付",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 0,
            "loading": false,
            "finished": false,
          },
          {
            "title": "待收货",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "已完成",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 2,
            "loading": false,
            "finished": false,
          },
          {
            "title": "已取消",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 3,
            "loading": false,
            "finished": false,
          },
        ]
      }
    },

    mounted() {
      this.active = this.$store.state.appconf.currentOrderListIndex;
      setTimeout(() => {
        if (!this.launchedLoading) {
          this.onLoad(this.active)
        }
      }, 1000);
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
    },

    beforeDestroy() {
      this.hideMeqiaPanel()
    },

    methods: {
      wkycCasher(user, orderInfo) {
        this.$log("wkycCasher Enter")
        let that = this
        let payOptions = {
          appId: this.$api.APP_ID,
          orderNo: orderInfo.orderNo
        }
        let yunChengPay = {
          actPayFee: "" + orderInfo.orderAmount,
          openId: user.openId,
          orderNo: orderInfo.orderNo,
          payType: "yuncheng",
          goodsDesc: "万科云城惠民优选商品"
        }
        payOptions['yunChengPay'] = yunChengPay;
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.AGGREGATE_PAY_URL,
          url: '/wspay/pay',
          data: payOptions,
        }).then((response) => {
          this.$log(response)
          if (response.data.code == 200) {
            let params = response.data.data;
            this.wkycPay(params, orderInfo)
          } else {
            that.$toast("请求支付失败")
          }

        }).catch(function (error) {
          that.$toast("请求支付失败")
          // that.payBtnSubmitLoading = false;
        })
      },
      wkycPay(payLoad, orderInfo) {
        let that = this
        that.$log(payLoad); // 调试使用代码

        if (/iphone|ipad/.test(navigator.userAgent.toLowerCase())) {
          let temp;
          window.payOrder = function () {}
          window.webkit.messageHandlers.payOrder.postMessage(payLoad)
        } else {
          window.ycapp.payOrder(payLoad);
        }

        // 调用支付后的回调方法，只需要定义到window对象下，app会自动回调此方法
        window.payResult = function (res) {
          // 请注意此处返回的数据为json字符串，返回结果见下方内容
          let response = JSON.parse(res)
          that.$log(response);
          that.$log(response.code)
          that.$log(response.code)
          if (response.code == '0') {
            if (response.data.payStatus == 0) { //"具体的支付状态：0（成功）,-1（失败），-2（取消）",
              that.$router.replace({
                path: '/pay/cashering',
                query: {
                  outer_trade_no: orderInfo.orderNo
                }
              })
            } else {
              that.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
              that.$router.replace({
                path: '/car/orderList'
              })
            }
          } else { //取消
            that.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
            that.$router.replace({
              path: '/car/orderList'
            })
          }
        }
      },
      gotoCart() {
        this.$router.push({
          name: '购物车页'
        })
      },
      add2Car(user, goods) {
        let userId = user.userId;
        let mpu = goods.mpu;
        let selectSkuId = goods.skuId
        let addtoCar = {
          "openId": userId,
          "mpu": mpu,
          "skuId": selectSkuId,
          "count": 1
        }

        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        })
      },
      async onBuyBtnClick(k, i) {
        this.$log("onBuyBtnClick Enter")
        this.$log(k)
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          for (let i = 0; i < k.skus.length; i++) {
            let goods = k.skus[i]
            try {
              let resp = await this.add2Car(user, goods);
              this.$log("#######################################")
              this.$log(resp)
              if (resp.data.code == 200) {
                let cartItem = Util.getCartItem(this, user.userId, goods.mpu, goods.skuId)
                this.$log(goods)
                let skuId = goods.skuId
                let purchaseQty = 1
                if (skuId === undefined || skuId === null) {
                    skuId = goods.skuid
                }
                if (cartItem == null) {
                  let baseInfo = {
                    "userId": user.userId,
                    "skuId": skuId,
                    "mpu": goods.mpu,
                    "merchantId": goods.merchantId,
                    "count": 1,
                    "choosed": true,
                    "cartId": this.result,
                    "purchaseQty": purchaseQty
                  }
                  let goodsInfo = {
                    "id": goods.id,
                    "skuId": skuId,
                    "mpu": goods.mpu,
                    "merchantId": goods.merchantId,
                    "image": goods.image,
                    "category": goods.category,
                    "name": goods.name,
                    "brand": goods.brand,
                    "model": goods.model,
                    "price": goods.unitPrice,
                    "checkedPrice": goods.price
                  }
                  let couponList = []
                  let promotionInfo = {}
                  cartItem = {
                    "baseInfo": baseInfo,
                    "goodsInfo": goodsInfo,
                    "couponList": couponList,
                    "promotionInfo": promotionInfo,
                  }
                } else {
                  cartItem.baseInfo.count++;
                }
                Util.updateCartItem(this, cartItem)
              }

            } catch (e) {
              that.$log(e)
            }
          }
          this.gotoCart();
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },
      formatTime(timeString) {
        if (timeString == null)
          return ""
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
      },
      getClientName() {
        switch (this.$api.APP_ID) {
          case "09":
            return "关爱通品牌直供";
          case "10":
            return "关爱通苏宁易购";
          case "11":
            return "无锡市民卡";
          default:
            return "凤巢商城"

        }
      },
      showMeqiaPanel() {
        let userInfo = this.$store.state.appconf.userInfo;
        let userDetail = this.$store.state.appconf.userDetail;
        let userName = ""
        let userId = ""
        let telePhone = ""
        if (!Util.isUserEmpty(userInfo)) {
          let UserInfo = JSON.parse(userInfo)
          userId = UserInfo.userId
        }
        if (userDetail.length > 0) {
          let UserDetail = JSON.parse(userDetail)
          userName = UserDetail.nickname
          telePhone = UserDetail.telephone
        }
        _MEIQIA('showPanel')
        _MEIQIA('metadata', {
          name: userName, // 美洽默认字段
          tel: telePhone,
          '渠道': this.getClientName(), // 自定义字段
          '用户ID': userId,
          '当前URL': window.location.href,
          '订单号': ''
        });
      },
      hideMeqiaPanel() {
        _MEIQIA('hidePanel');
      },
      onQuerySalesServiceBtnClick(k, sku) {
        this.$router.push({
          name: '售后工单页'
        })
      },
      onAfterSalesServiceBtnClick(k, sku) {
        this.$log("onAfterSalesServiceBtnClick Enter")
        this.$router.push({
          name: "售后服务页",
          params: {
            openId: k.openId,
            tradeNo: k.tradeNo,
            goods: sku,
            contact: {
              name: k.receiverName,
              mobile: k.mobile,
              address: k.provinceName + k.cityName + k.countyName + k.address
            },
          }
        })
      },
      See(e) {
        this.$log("jump to:" + e)
        window.location.href = e
        //window.location.replace(e)
      },
      getSavedPayOrderInfo(listItem) {
        /*        this.$log("getSavedPayOrderInfo Enter #########################")
                this.$log(listItem.outTradeNo)
                this.$log(listItem.paymentNo)*/
        if (listItem.openId === listItem.outTradeNo.substr(0, listItem.openId.length)) {
          return null
        } else {
          return listItem.paymentNo;
        }
      },

      resetOrderTypeList() {
        for (let i = 0; i < this.orderTypes.length; i++) {
          this.orderTypes[i].list.splice(0, 1);
        }
        this.orderTypes.splice(0, 1);
        this.orderTypes = [{
            "title": "全部",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": -1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "待支付",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 0,
            "loading": false,
            "finished": false,
          },
          {
            "title": "待收货",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "已完成",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 2,
            "loading": false,
            "finished": false,
          },
          {
            "title": "已取消",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 3,
            "loading": false,
            "finished": false,
          },
        ]
      },
      /*statue: Number 子订单状态（0：已下单；1：待发货；2：已发货（15天后自动变为已完成）；3：已完成；4：已取消；5：失败）*/
      getSubOrderStatus(status) {
        switch (status) {
          case 0:
            return "已下单";
          case 1:
            return "待发货";
          case 2:
            return "已发货";
          case 3:
            return "已完成";
          case 4:
            return "已取消";
          case 5:
            return "失败"
          default:
            return ""
        }
      },

      getOrderStatus(status) {
        //this.$log("status is:" + status);
        switch (status) {
          case 0:
            return "待支付";
          case 1:
            return "待收货";
          case 2:
            return "已完成";
          case 3:
            return "已取消";
          default:
            return ""
        }
      },
      getMerchantName(merchantNo) {
        return "惠民优选"
        /*        if (merchantNo == 20) {
                  return "苏宁易购"
                } else if (merchantNo == 30) {
                  return "唯品会"
                } else if (merchantNo == 50) {
                  return "天猫精选"
                } else if (merchantNo == 60) {
                  return "京东"
                } else {
                  return "商城自营"
                }*/
      },
      openCashPage(user, merchantNo, orderNos, pAnOrderInfo, listItem) {
        let that = this;
        let returnUrl = ""
        if (this.$api.IS_GAT_APP) {
          if (this.$api.APP_ID === '10') {
            returnUrl = "https://gatsn.weesharing.com/pay/cashering";
          } else if (this.$api.APP_ID === '09') {
            returnUrl = "https://gatzy.weesharing.com/pay/cashering";
          }
          let options = {
            "iAppId": this.$api.APP_ID,
            "tAppId": this.$api.T_APP_ID,
            "openId": user.openId,
            "appId": this.$api.APP_ID,
            "merchantNo": merchantNo,
            "orderNos": orderNos,
            "goodsName": "商品支付订单",
            "amount": pAnOrderInfo.orderAmount,
            "returnUrl": returnUrl,
          }
          that.$log("预下单:" + JSON.stringify(options))
          that.$api.xapi({
            method: 'post',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/payment/gat',
            data: options,
          }).then((response) => {
            that.$log("预下单返回 :" + JSON.stringify(response.data))
            if (response.data.data.result != undefined) {
              let urlEncode = response.data.data.result.urlEncode;
              this.See(urlEncode)
            }
          }).catch(function (error) {
            that.$log(error)
          })
        } else {
          let options = {
            "openId": pAnOrderInfo.openId,
            "appId": this.$api.APP_ID,
            "merchantNo": merchantNo,
            "orderNos": orderNos,
            "goodsName": "商品支付订单",
            "amount": pAnOrderInfo.orderAmount,
            "returnUrl": returnUrl,
          }
          /*          let savedOrderNo = this.getSavedPayOrderInfo(listItem);
                    this.$log("savedOrderNo:" + savedOrderNo)*/
          let savedOrderNo = null //force ，renew order no
          if (savedOrderNo != null) {
            pAnOrderInfo.orderNo = savedOrderNo
            that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
            this.$router.push({
              name: "收银台页",
              params: {
                orderInfo: pAnOrderInfo
              }
            })
          } else {
            let options = {
              "iAppId": this.$api.APP_ID,
              "tAppId": this.$api.T_APP_ID,
              "openId": user.userId,
              "appId": this.$api.APP_ID,
              "merchantNo": merchantNo,
              "orderNos": orderNos,
              "goodsName": "商品支付订单",
              "amount": pAnOrderInfo.orderAmount,
              "returnUrl": returnUrl
            }
            that.$log("预下单:" + JSON.stringify(options))
            that.$api.xapi({
              method: 'post',
              baseURL: this.$api.SSO_BASE_URL,
              url: '/payment',
              data: options,
            }).then((response) => {
              that.$log("预下单返回 :" + JSON.stringify(response.data))
              if (response.data.msg === "会员不存在") {
                //未开通钱包
                let walletInfo = {
                  accessToken: user.accessToken,
                  openId: user.openId,
                }
                that.$log("walletInfo:" + JSON.stringify(walletInfo))
                //  that.$jsbridge.call("dredgeWallet", walletInfo);
              } else {
                if (response.data.data.result != undefined) {
                  let orderNo = response.data.data.result.orderNo
                  let outTradeNo = response.data.data.result.outTradeNo
                  pAnOrderInfo['orderNo'] = orderNo
                  pAnOrderInfo['outTradeNo'] = outTradeNo
                  that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
                  // that.$jsbridge.call("openCashPage", pAnOrderInfo);
                  if (this.$api.APP_ID == '14') {
                    this.wkycCasher(user, pAnOrderInfo);
                  } else {
                    this.$router.push({
                      name: "收银台页",
                      params: {
                        orderInfo: pAnOrderInfo
                      }
                    })
                  }
                }
              }
            }).catch(function (error) {
              that.$log(error)
            })
          }
        }

      },
      onCancelBtnClick(listItem, i) {
        this.$log("onCancelBtnClick Enter")
        this.$dialog.confirm({
          message: '确定取消订单?'
        }).then(() => {
          console.log("确定")
          let userInfo = this.$store.state.appconf.userInfo;
          if (Util.isUserEmpty(userInfo)) {
            this.$toast("没有用户信息，请先确认登录")
            return
          }
          this.$log(listItem)
          if (listItem.status == 0) { //待支付
            let index = this.active
            this.reload = true;
            let user = JSON.parse(userInfo)
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.ORDER_BASE_URL,
              url: '/order/unpaid/cancel',
              params: {
                appId: this.$api.APP_ID,
                openId: user.userId,
                orderNos: listItem.tradeNo
              }
            }).then((response) => {
              this.$log(response)
              if (response.data.code == 200) {
                this.onLoad(this.active)
              }
            }).catch(function (error) {
              console.log(error)
            })
          } else {
            let id = listItem.id
            let index = this.active
            this.reload = true;
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.ORDER_BASE_URL,
              url: '/order/cancel',
              params: {
                id: id,
              }
            }).then((response) => {
              if (response.data.code == 200) {
                listItem.status = 3;
                if (this.active != 0) {
                  let found = -1;
                  for (let i = 0; i < this.orderTypes[index].list.length; i++) {
                    this.$log("listItem.id:" + listItem.id)
                    this.$log("this.orderTypes[index].list[i].id:" + this.orderTypes[index].list[i].id)
                    if (listItem.id === this.orderTypes[index].list[i].id) {
                      found = i;
                      break;
                    }
                  }
                  this.$log("found is:" + found)
                  if (found != -1) {
                    this.orderTypes[index].list.splice(found, 1)
                    this.orderTypes[index].total--;
                  }
                }
              }
            }).catch(function (error) {
              console.log(error)
            })
          }

        }).catch(() => {
          console.log("不删")
        });

      },

      onPayBtnClick(listItem, i) {
        this.$log(listItem);
        let userInfo = this.$store.state.appconf.userInfo;
        if (Util.isUserEmpty(userInfo)) {
          return;
        }
        let user = JSON.parse(userInfo);
        let len = listItem.tradeNo.length;
        let orderNos = listItem.tradeNo
        let orderNo = this.$api.APP_ID + user.openId + orderNos
        let pAnOrderInfo = {
          "accessToken": user.accessToken,
          "orderNo": orderNo,
          "orderAmount": listItem.saleAmount * 100, //分
          "openId": user.openId,
          "businessType": "11"
        }
        let merchantNo = ""
        if (listItem.merchantNo != null) {
          merchantNo = listItem.merchantNo
        }
        this.openCashPage(user, merchantNo, orderNos, pAnOrderInfo, listItem)
      },

      onConfirmBtnClick(listItem, i) {
        this.$log("onConfirmBtnClick Enter")
        this.$dialog.confirm({
          message: '确认收货?'
        }).then(() => {
          let id = listItem.id
          let index = this.active
          this.reload = true;
          let options = {
            "id": id,
            "status": 2
          }
          this.$api.xapi({
            method: 'put',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/order/status',
            data: options,
          }).then((response) => {
            if (response.data.code == 200) {
              listItem.status = 2;
              if (this.active != 0) {
                let found = -1;
                for (let i = 0; i < this.orderTypes[index].list.length; i++) {
                  this.$log("listItem.id:" + listItem.id)
                  this.$log("this.orderTypes[index].list[i].id:" + this.orderTypes[index].list[i].id)
                  if (listItem.id === this.orderTypes[index].list[i].id) {
                    found = i;
                    break;
                  }
                }
                this.$log("found is:" + found)
                if (found != -1) {
                  this.orderTypes[index].list.splice(found, 1)
                  this.orderTypes[index].total--;
                }
              }
            }
          }).catch(function (error) {
            console.log(error)
          })
        }).catch(() => {});
      },

      onDelBtnClick(listItem, i) {
        this.$log("onDelBtnClick Enter")
        this.$dialog.confirm({
          message: '确定删除订单?'
        }).then(() => {
          let that = this;
          that.reload = true;
          that.orderTypes.forEach(orderTypeItem => {
            let found = -1;
            that.$log(orderTypeItem)
            for (let i = 0; i < orderTypeItem.list.length; i++) {
              if (listItem.id === orderTypeItem.list[i].id) {
                found = i;
                break;
              }
            }
            that.$log("title is:" + orderTypeItem.title + ",found is:" + found);
            if (found != -1) {
              orderTypeItem.list.splice(found, 1)
              orderTypeItem.total--;
            }
          })
          that.$api.xapi({
            method: 'delete',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/order',
            params: {
              id: listItem.id,
            }
          }).then((response) => {
            that.$log("onDelBtnClick success, response is:" + JSON.stringify(response.data))
          }).catch(function (error) {
            that.$log(error)
          })
        }).catch(() => {});
      },

      onListClick(listItem, i) {
        this.$log("onListClick Enter")
        this.$router.push({
          name: "订单详情页",
        })
        this.$store.commit('SET_CURRENT_ORDER_INFO', JSON.stringify(listItem));
      },

      onLogisticsBtnClick(listItem, i) {
        this.$log("onLogisticsBtnClick Enter")
        if (listItem.merchantId === 4) {
          this.$router.push({
            name: "怡亚通物流信息页",
            params: {
              detail: listItem
            }
          })
        } else {
          this.$router.push({
            name: "物流信息页",
            params: {
              detail: listItem
            }
          })
        }
      },

      onClick(index, title) {
        this.$log("onClick Enter, index is:" + index + ",title is:" + title)
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', index);
        this.onLoad(index)
      },

      onLoad(index) {
        this.$log("onLoad is:" + index);
        let that = this;
        that.launchedLoading = true;
        let userInfo = this.$store.state.appconf.userInfo;
        this.$log("*************  userInfo is:" + userInfo);
        if (this.reload) {
          this.resetOrderTypeList();
          this.reload = false;
        }
        //  that.$log("userInfo:"+userInfo)
        if (Util.isUserEmpty(userInfo)) {
          that.orderTypes[index].loading = false;
          return;
        }

        if (that.orderTypes[index].total == -1 || that.orderTypes[index].total > that.orderTypes[index].list.length) {
          that.orderTypes[index].loading = true;
          let user = JSON.parse(userInfo);
          let options = {
            "pageNo": that.orderTypes[index].pageNo++,
            "pageSize": 100,
            "openId": user.userId,
            "status": that.orderTypes[index].status,
          }
          this.$api.xapi({
            method: 'post',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/order/all/v2',
            data: options,
          }).then((response) => {
            if (that.orderTypes[index].status != 0) {
              this.$log(that.orderTypes[index].pageNo)
              let unpaid = response.data.data.unpaid
              if (that.orderTypes[index].status == -1 && that.orderTypes[index].pageNo == 2) { //获取首页
                if (unpaid.length > 0) {
                  that.orderTypes[index].list = []
                  if (unpaid != null) {
                    unpaid.forEach(listItem => {
                      this.$log(listItem)
                      let item = {
                        servFee: listItem.servFee,
                        saleAmount: listItem.saleAmount,
                        tradeNo: listItem.orderNos,
                        skus: [],
                        status: 0,
                        couponCode: listItem.coupon.code,
                        couponDiscount: listItem.coupon.discount,
                        couponId: listItem.coupon.id
                      }
                      if (listItem.ordersList.length > 0) {
                        item['address'] = listItem.ordersList[0].address
                        item['provinceId'] = listItem.ordersList[0].provinceId
                        item['provinceName'] = listItem.ordersList[0].provinceName
                        item['cityId'] = listItem.ordersList[0].cityId
                        item['cityName'] = listItem.ordersList[0].cityName
                        item['companyCustNo'] = listItem.ordersList[0].companyCustNo
                        item['countyId'] = listItem.ordersList[0].countyId
                        item['countyName'] = listItem.ordersList[0].countyName
                        item['createdAt'] = listItem.ordersList[0].createdAt
                        item['mobile'] = listItem.ordersList[0].mobile
                        item['openId'] = listItem.ordersList[0].openId
                        item['paymentAt'] = listItem.ordersList[0].paymentAt
                        item['paymentNo'] = listItem.ordersList[0].paymentNo
                        item['receiverName'] = listItem.ordersList[0].receiverName
                        item['zip'] = listItem.ordersList[0].zip
                        item['payStatus'] = listItem.ordersList[0].payStatus
                      }
                      listItem.ordersList.forEach(orderItem => {
                        this.$log(orderItem)
                        orderItem.skus.forEach(sku => {
                          item.skus.push(sku)
                        })
                      })
                      this.$log(item)
                      that.orderTypes[index].list.push(item);
                    })
                  }
                }
              }
              let result = response.data.data.result
              that.orderTypes[index].total = result.total;
              if (that.orderTypes[index].status == -1) {
                that.orderTypes[index].total += unpaid.length
              }
              if (result.list == undefined || result.list.length == 0) {
                that.orderTypes[index].loading = false;
                that.orderTypes[index].finished = true;
              } else {
                result.list.forEach(item => {
                  that.orderTypes[index].list.push(item);
                })
                that.orderTypes[index].loading = false;
                if (that.orderTypes[index].list.length >= that.orderTypes[index].total) {
                  that.orderTypes[index].finished = true;
                  that.$log("index:" + index);
                  that.$log(that.orderTypes[index]);
                }
              }
            } else {
              let unpaid = response.data.data.unpaid
              //this.$log(unpaid)
              that.orderTypes[index].list = []
              if (unpaid != null) {
                that.orderTypes[index].total = unpaid.length
                unpaid.forEach(listItem => {
                  this.$log(listItem)
                  let item = {
                    servFee: listItem.servFee,
                    saleAmount: listItem.saleAmount,
                    tradeNo: listItem.orderNos,
                    skus: [],
                    status: 0,
                    couponCode: listItem.coupon.code,
                    couponDiscount: listItem.coupon.discount,
                    couponId: listItem.coupon.id
                  }
                  if (listItem.ordersList.length > 0) {
                    item['address'] = listItem.ordersList[0].address
                    item['provinceId'] = listItem.ordersList[0].provinceId
                    item['provinceName'] = listItem.ordersList[0].provinceName
                    item['cityId'] = listItem.ordersList[0].cityId
                    item['cityName'] = listItem.ordersList[0].cityName
                    item['companyCustNo'] = listItem.ordersList[0].companyCustNo
                    item['countyId'] = listItem.ordersList[0].countyId
                    item['countyName'] = listItem.ordersList[0].countyName
                    item['createdAt'] = listItem.ordersList[0].createdAt
                    item['mobile'] = listItem.ordersList[0].mobile
                    item['openId'] = listItem.ordersList[0].openId
                    item['paymentAt'] = listItem.ordersList[0].paymentAt
                    item['paymentNo'] = listItem.ordersList[0].paymentNo
                    item['receiverName'] = listItem.ordersList[0].receiverName
                    item['zip'] = listItem.ordersList[0].zip
                    item['payStatus'] = listItem.ordersList[0].payStatus
                  }
                  listItem.ordersList.forEach(orderItem => {
                    this.$log(orderItem)
                    orderItem.skus.forEach(sku => {
                      item.skus.push(sku)
                    })
                  })
                  this.$log(item)
                  that.orderTypes[index].list.push(item);
                })
              } else {
                that.orderTypes[index].total = 0;
              }
              that.orderTypes[index].loading = false;
              that.orderTypes[index].finished = true;
            }

          }).catch(function (error) {
            that.$log(error)
            that.orderTypes[index].loading = false;
            that.orderTypes[index].finished = true;
          })
        } else {
          if (that.orderTypes[index].list.length >= that.orderTypes[index].total) {
            that.orderTypes[index].loading = false;
            that.orderTypes[index].finished = true;
          }
        }
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .orderlist {
    width: 100%;
    height: 100%;
    top: 0px;
    text-align: left;

    .orderlist-layout {
      margin-bottom: 3em;
      background-color: #f8f8f8;

      .section-title {
        background-color: #ffffff;
        text-align: left;
        margin: 1em;
        .fz(font-size, 30);
        color: #000000;
      }

      .orderlist-body {

        span {
          .fz(font-size, 30);
        }

        .no-orderlist {
          width: 100%;
          display: flex;
          background-color: white;
          flex-flow: column;
          text-align: center;
          justify-content: center;
          padding-top: 100px;

          img {
            margin: 0 auto;
            height: 100px;
            width: 100px;
          }
        }

        .orderDetail {
          background-color: white;
          margin-top: 1em;

          .cardtags {
            margin-top: 10px;

            >img {
              width: 30px;
              height: 30px;
            }
          }

          .orderDetailSummery {
            background-color: #ffffff;
            text-align: right;
            margin-right: 1em;
            .fz(font-size, 25);

            color: #000000;

            >span {
              display: inline-block;
              align-content: center;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              word-break: break-all;
            }
          }

          .orderDetailAction {
            text-align: right;
            margin: 1em;
            padding-bottom: 1em;

            span {
              .fz(font-size, 22);
            }
          }

          .van-card {
            background-color: #ffffff;

            &__price {
              margin-top: 0.5em;
              .fz(font-size, 40);
            }

            .card_footer {
              span {
                .fz(font-size, 22);
              }
            }
          }
        }
      }
    }


  }

</style>
