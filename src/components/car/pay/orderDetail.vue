<template lang="html">
  <section class="orderDetail">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">订单详情</h1>
    </v-header>
    <div class="order-body">
      <div class="order-status">
        <div class="statusInfo">
          <img :src="orderIcon" />
          {{getOrderStatus()}}
        </div>
      </div>
      <div class="user-info">
        <div class="custom-text">
          <van-icon name="location" />
          <span>{{detail.receiverName}} {{detail.mobile}}</span>
        </div>
        <div class="custom-text">
          <span>{{detail.provinceName}}{{detail.cityName}}{{detail.countyName}}{{detail.address}}</span>
        </div>
      </div>
      <div class="order-list">
        <van-cell :title=getMerchantName(detail.merchantNo) icon="shop" />
        <ul>
          <li v-for="(sku,i)  in detail.skus" :key='i' style="list-style: none">
            <van-card :price="sku.unitPrice" :title="sku.name" :num="sku.num" :thumb="sku.image"
              @click="gotoDetailPage(sku)">
              <div slot="tags" v-if="sku.salePrice != sku.unitPrice" class="cardtags">
                <img :src="tag_promotion" v-if="sku.promotionDiscount > 0" />
                <img :src="tag_coupon" v-if="sku.unitPrice - sku.salePrice - sku.promotionDiscount > 0" />
              </div>
              <div slot="footer">
                <div v-if="sku.status < 4">
                  <van-button plain round size="small" type="primary"
                    style="background-color: white;color: black;border-color: #dedede " @click.stop=""
                    @click="onAfterSalesServiceBtnClick(sku)" v-if="status==1||status==2">
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
        <div class="orderSummery">
          <span v-if="detail.couponDiscount != null">合计: ￥{{detail.saleAmount.toFixed(2)}}元
            (含运费￥{{detail.servFee.toFixed(2)}}元, 优惠券:￥{{getCouponDiscount(detail)}}) </span>
          <span v-else>合计: ￥{{parseFloat(detail.saleAmount).toFixed(2)}}元 (含运费:￥{{detail.servFee.toFixed(2)}})</span>
        </div>
        <div class="orderDetailAction">
          <van-button plain round size="small" type="primary"
            style="background-color: #f44336;color: white;border-color: #f44336" @click="onCancelBtnClick(detail)"
            v-show="status==0">
            取消订单
          </van-button>
          <van-button plain round size="small" type="primary"
            style="background-color: #26a2ff;color: white;border-color: #26a2ff" @click="onPayBtnClick(detail)"
            v-show="status==0">
            去支付
          </van-button>
          <van-button plain round size="small" type="primary"
            style="background-color: #26a2ff;color: white;border-color: #26a2ff " @click="onLogisticsBtnClick(detail)"
            v-show="status==1">
            查询物流
          </van-button>
          <van-button plain round size="small" type="primary"
            style="background-color: #f44336;color: white;border-color: #f44336 " @click="onConfirmBtnClick(detail)"
            v-show="status==1">
            确认收货
          </van-button>
          <van-button plain round size="small" type="primary"
            style="background-color: white;color: #ff4444;border-color: #dedede " @click="onBuyBtnClick(detail)"
            v-show="status==2||status==3">
            再次购买
          </van-button>
        </div>
      </div>
      <div class="pay-settlement">
        <van-cell title="商品原价:">
          <div slot="default">
            <span style="color: black">￥{{productPrice}}</span>
          </div>
        </van-cell>
        <van-cell title="运费:">
          <div slot="default">
            <span style="color: #ff4444">+￥{{freightFee}}</span>
          </div>
        </van-cell>
        <!--        <van-cell title="活动优惠:">
                  <div slot="default">
                    <span style="color: #ff4444">-￥{{promotionDiscout}}</span>
                  </div>
                </van-cell>-->
        <van-cell title="优惠券:">
          <div slot="default">
            <span style="color: #ff4444">-￥{{couponDiscount}}</span>
          </div>
        </van-cell>
        <van-cell>
          <div slot="title">
            <span style="font-weight: bold;color: black;">合计:</span>
          </div>
          <div slot="default">
            <span style="font-weight: bold;color: black;">￥{{detail.saleAmount.toFixed(2)}}</span>
          </div>
        </van-cell>
      </div>
      <div class="order-detail">
        <van-cell title="订单信息" icon="info-o" />
        <span>
          订单编号:
          <p>{{getDisplayOderNo(detail.tradeNo)}}</p>
        </span>
        <span>
          创建时间:
          <p>{{formatTime(detail.createdAt)}}</p>
        </span>
        <span v-if="detail.payStatus == 5 && detail.paymentAt != null">
          成交时间:
          <p>{{formatTime(detail.paymentAt)}}</p>
        </span>
      </div>
    </div>
    <div class="order-ServerInfo">
      <van-col span="12" class="chat">
        <div @click="showMeqiaPanel">
          <van-icon name="service" size="1em"> 联系客服</van-icon>
        </div>
      </van-col>
      <van-col span="12" class="phone">
        <div>
          <span>电话: {{getOrderServicePhone()}}</span>
        </div>
      </van-col>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        showHeader: true,
        detail: {},
        status: -1,
        orderIcon: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/order.png',
        tag_coupon: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_lab_coupon.png',
        tag_promotion: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_lab_promotion.png',
        coupon: {},
      }
    },

    created() {
      this.$log("order detail created Enter");
      this.showHeader = this.$api.HAS_HEADER;
      //this.detail = this.$route.params.detail;
      this.detail = JSON.parse(this.$store.state.appconf.currentOrderInfo);
      this.$log(this.detail)
      this.status = this.detail.status;
    },

    beforeDestroy() {
      this.hideMeqiaPanel()
    },

    computed: {
      productPrice() {
        let productPrice = 0;
        this.detail.skus.forEach(sku => {
          productPrice += sku.unitPrice * sku.num;
        })
        return productPrice.toFixed(2)
      },

      freightFee() {
        return this.detail.servFee.toFixed(2)
      },

      promotionDiscout() {
        let promotionDiscount = 0;
        this.detail.skus.forEach(sku => {
          promotionDiscount += sku.promotionDiscount * sku.num;
        })
        return promotionDiscount.toFixed(2)
      },

      couponDiscount() {
        return this.getCouponDiscount(this.detail)
      }

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
      getCouponDiscount(k) {
        let couponDiscount = 0;
        if (k != undefined) {
          k.skus.forEach(sku => {
            couponDiscount += sku.skuCouponDiscount
          })
        }
        return (couponDiscount / 100).toFixed(2)
      },

      gotoCart() {
        this.$router.push({
          name: '购物车页'
        })
      },
      add2Car(user, goods) {
        let userId = user.userId;
        let mpu = goods.mpu;
        let count = 1;
        let selectSkuId = goods.skuId
        let addtoCar = {
          "openId": userId,
          "mpu": mpu,
          "skuId": selectSkuId,
          "count": count
        }
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        })
      },
      async onBuyBtnClick(k) {
        this.$log("onBuyBtnClick Enter")
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          for (let i = 0; i < k.skus.length; i++) {
            let goods = k.skus[i]
            try {
              let resp = await this.add2Car(user, goods);
              if (resp.data.code == 200) {
                let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
                if (cartItem == null) {
                  let baseInfo = {
                    "userId": user.userId,
                    "skuId": goods.skuId,
                    "mpu": goods.mpu,
                    "merchantId": goods.merchantId,
                    "count": 1,
                    "choosed": true,
                    "cartId": this.result,
                  }
                  let goodsInfo = {
                    "id": goods.id,
                    "skuId": goods.skuId,
                    "mpu": goods.mpu,
                    "merchantId": goods.merchantId,
                    "image": goods.image,
                    "category": goods.category,
                    "name": goods.name,
                    "brand": goods.brand,
                    "model": goods.model,
                    "price": goods.unitPrice,
                    "checkedPrice": goods.price,
                    "type": goods.type == undefined ? 0 : goods.type
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
                  cartItem.goodsInfo.type = (goods.type == undefined ? 0 : goods.type)
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

      See(e) {
        this.$log("jump to:" + e)
        window.location.href = e
      },
      gotoDetailPage(sku) {
        this.$router.push({
          path: "/detail",
          query: {
            mpu: sku.mpu
          }
        });
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
          '订单号': this.detail.tradeNo
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
      onAfterSalesServiceBtnClick(sku) {
        this.$log("onAfterSalesServiceBtnClick Enter")
        this.$router.push({
          name: "售后服务页",
          params: {
            openId: this.detail.openId,
            tradeNo: this.detail.tradeNo,
            goods: sku,
            contact: {
              name: this.detail.receiverName,
              mobile: this.detail.mobile,
              address: this.detail.provinceName + this.detail.cityName + this.detail.countyName + this.detail
                .address
            },
          }
        })
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
          let savedOrderNo = null //force renew order no
          if (savedOrderNo != null) {
            pAnOrderInfo.orderNo = savedOrderNo
            that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
            //that.$jsbridge.call("openCashPage", pAnOrderInfo);
            this.$router.replace({
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
              "returnUrl": returnUrl,
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
                    this.$router.replace({
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

      onLogisticsBtnClick(detail) {
        this.$log("onLogisticsBtnClick Enter")
        if (detail.merchantId === 4) {
          this.$router.push({
            name: "怡亚通物流信息页",
            params: {
              detail: detail
            }
          })
        } else {
          this.$router.push({
            name: "物流信息页",
            params: {
              detail: detail
            }
          })
        }
      },
      onConfirmBtnClick(detail) {
        this.$dialog.confirm({
          message: '确认收货?'
        }).then(() => {
          let id = detail.id
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
              this.status = 2;
              this.detail.status = this.status
              this.$store.commit('SET_CURRENT_ORDER_INFO', JSON.stringify(this.detail));
            }
            //已取消
          }).catch(function (error) {
            console.log(error)
          })
        }).catch(() => {});
      },
      onPayBtnClick(listItem) {
        this.$log(listItem);
        let userInfo = this.$store.state.appconf.userInfo;
        if (Util.isUserEmpty(userInfo)) {
          return;
        }
        let user = JSON.parse(userInfo);
        let len = listItem.tradeNo.length;
        let orderNos = JSON.stringify(listItem.tradeNo.substr(len - 8)).replace(/\"/g, "");
        let orderNo = this.$api.APP_ID + listItem.merchantNo + user.openId + orderNos
        let hasVirtualGoods = false
        for (let i = 0; i < listItem.skus.length; i++) {
          if (listItem.skus[i].productType != undefined && listItem.skus[i].productType != 0) {
            hasVirtualGoods = true;
            break;
          }
        }
        let pAnOrderInfo = {
          "accessToken": user.accessToken,
          "orderNo": orderNo,
          "orderAmount": listItem.saleAmount * 100, //分
          "openId": user.openId,
          "businessType": "11",
          "hasVirtualGoods": hasVirtualGoods
        }
        let merchantNo = ""
        if (listItem.merchantNo != null) {
          merchantNo = listItem.merchantNo
        }
        this.openCashPage(user, listItem.merchantNo, orderNos, pAnOrderInfo, listItem)
      },
      onCancelBtnClick(detail) {
        this.$dialog.confirm({
          message: '确定取消订单?'
        }).then(() => {
          console.log("确定")
          let userInfo = this.$store.state.appconf.userInfo;
          if (Util.isUserEmpty(userInfo)) {
            this.$toast("没有用户信息，请先确认登录")
            return
          }
          let user = JSON.parse(userInfo)
          if (detail.status == 0) { //待支付
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.ORDER_BASE_URL,
              url: '/order/unpaid/cancel',
              params: {
                appId: this.$api.APP_ID,
                openId: user.userId,
                orderNos: detail.tradeNo
              }
            }).then((response) => {
              if (response.data.code == 200) {
                this.status = 3;
                this.detail.status = this.status
                this.$store.commit('SET_CURRENT_ORDER_INFO', JSON.stringify(this.detail));
              }
              //已取消
            }).catch(function (error) {
              console.log(error)
            })
          } else {
            let id = detail.id
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.ORDER_BASE_URL,
              url: '/order/cancel',
              params: {
                id: id,
              }
            }).then((response) => {
              if (response.data.code == 200) {
                this.status = 3;
                this.detail.status = this.status
                this.$store.commit('SET_CURRENT_ORDER_INFO', JSON.stringify(this.detail));
              }
              //已取消
            }).catch(function (error) {
              console.log(error)
            })
          }
        }).catch(() => {
          console.log("不删")
        });
      },
      getOrderStatus() {
        let status = this.status;
        switch (status) {
          case 0: {
            return "待支付";
          }
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
      getOrderServicePhone() {
        return this.$api.SERVR_PHONE_NUM;
      },

      formatTime(timeString) {
        //2019-01-27T07:56:27.000+0000
        if (timeString == null)
          return null
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
      },

      getDisplayOderNo(orderNo) {
        if (this.$api.APP_ID === "10") {
          if (this.detail.aoyiId != undefined && this.detail.aoyiId > 0) {
            return this.detail.aoyiId
          }
        }
        if (orderNo.length > 8)
          return orderNo.substr(orderNo.length - 8).replace(/\"/g, "")
        else
          return orderNo;
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
    }
  }

</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .orderDetail {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;
    text-align: left;

    .header {
      width: 100%;
    }

    .order-body {
      padding-bottom: 4em;
      background-color: #f8f8f8;

      .order-status {
        background: url('https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/redbg.png') no-repeat;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        color: white;
        height: 5em;

        .statusInfo {
          padding: 1em;
          .fz(font-size, 40);
          font-weight: bold;

          img {
            height: 40px;
            width: 40px;
            margin-right: 2px;
          }
        }
      }

      .user-info {
        background-color: white;
        padding: 1em;

        .van-icon {
          margin-right: 0.5em;
        }

        .custom-text {
          .fz(font-size, 30);
          font-weight: bold;
          margin-top: 0.25em
        }
      }

      .orderDetailAction {
        text-align: right;
        margin-top: 1em;
        margin-right: 1em;
      }

      .order-list {
        background-color: white;
        margin-top: 1em;
        padding-bottom: 0.5em;

        .orderSummery {
          background-color: #ffffff;
          text-align: right;
          margin-right: 1em;
          .fz(font-size, 25);
          color: #000000;
          padding-top: 0.5em;
        }

        .van-card {
          background-color: #ffffff;

          .cardtags {
            margin-top: 10px;

            >img {
              width: 30px;
              height: 30px;
            }
          }
        }
      }

      .order-logistics {
        background-color: white;
        margin-top: 1em;

        >span {
          .fz(font-size, 30);
          margin: 1em;
          color: #000000;
        }
      }

      .order-detail {
        background-color: white;
        margin-top: 1em;
        padding-bottom: 0.1em;

        .van-cell {
          background-color: white;
          margin-top: -1px;
          color: #000000;
        }

        >span {
          .fz(font-size, 25);
          margin-left: 1em;
          color: #000000;

          >p {
            .fz(font-size, 25);
            margin: 0em 0em 0.5em 1em;
            color: #000000;
          }
        }


      }

      .pay-settlement {
        margin-top: 10px;
      }
    }

    .order-ServerInfo {
      background-color: white;
      width: 100%;
      height: 3em;
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #ffffff;
      z-index: 5;

      .chat {
        height: 100%;
        background-color: white;
        text-align: center;
        line-height: 3em;
        color: #FF4444;
        font-weight: bold;
      }

      .phone {
        height: 100%;
        background-color: #FF4444;
        text-align: center;
        line-height: 3em;
        color: white;
      }
    }
  }

</style>
