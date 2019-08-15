<template lang="html">
  <div class="orderlist">
    <v-header  v-if="showHeader">
      <h1 slot="title">我的订单</h1>
    </v-header>
    <div class="orderlist-layout">
      <van-tabs v-model="active" sticky @click="onClick" :swipe-threshold=swipeThreshold swipeable>
        <van-tab v-for="(item,type) in orderTypes" :title=item.title :key="type">
          <van-list v-model="item.loading"
                    :finished="item.finished"
                    @load="onLoad(active)">
            <div class="orderlist-body">
              <div v-if="item.total === 0" class="no-orderlist">
                <img :src=no_orderList_bg>
                <span>您还没有相关订单</span>
              </div>
              <li v-else v-for="(k,i) in item.list" :key="i" style="list-style: none">

                <div class="orderDetail">
                  <div>
                    <van-cell :title=getMerchantName(k.merchantNo) icon="shop" :value="getOrderStatus(k.status)">
                      <!--                   <van-icon slot="right-icon" name="delete" style="" @click="onDelBtnClick(k,i)"
                                                   style="margin: 0.25em 0em 0.3em 0.3em "
                                                   v-show="k.status==2||k.status==3"/>-->
                    </van-cell>
                  </div>
                  <ul @click="onListClick(k,i)">
                    <li v-for="(sku,i)  in k.skus" :key='i' style="list-style: none">
                      <van-card
                        :price="sku.unitPrice"
                        :title="sku.name"
                        :num="sku.num"
                        :thumb="sku.image">
                        <div slot="tags"  v-if="sku.salePrice != sku.unitPrice" class="cardtags">
                          <img :src="tag_promotion"  v-if="sku.promotionDiscount > 0"/>
                          <img :src="tag_coupon" v-if="sku.unitPrice - sku.salePrice - sku.promotionDiscount > 0" />
                        </div>
                      </van-card>
                    </li>
                  </ul>
                  <div class="orderDetailSummery">
                    <span v-if="k.couponDiscount != null">合计: ￥{{parseFloat(k.saleAmount).toFixed(2)}}元 (含运费:￥{{k.servFee.toFixed(2)}}, 优惠券:￥{{k.couponDiscount.toFixed(2)}}) </span>
                    <span v-else>合计: ￥{{parseFloat(k.saleAmount).toFixed(2)}}元 (含运费:￥{{k.servFee.toFixed(2)}})</span>
                  </div>
                  <div class="orderDetailAction">
                    <van-button plain round size="small" type="primary"
                                style="background-color: white;color: black ;border-color: #dedede"
                                @click="onConfirmBtnClick(k,i)" v-show="k.status==1">
                      确认收货
                    </van-button>
                    <van-button plain round size="small" type="primary"
                                style="background-color: #ff4444;color: white ;border-color: #ff4444"
                                @click="onDelBtnClick(k,i)" v-show="k.status==2||k.status==3">
                      删除订单
                    </van-button>
                    <van-button plain round size="small" type="primary"
                                style="background-color: white;color: black ;border-color: #dedede"
                                @click="onCancelBtnClick(k,i)" v-show="k.status==0">
                      取消订单
                    </van-button>
                    <van-button plain round size="small" type="primary"
                                style="background-color: white;color: #1989fa ;border-color: #dedede"
                                href="javascript:void(0)" onclick="_MEIQIA('showPanel')">
                      联系客服
                    </van-button>
                    <van-button plain round size="small" type="primary"
                                style="background-color: white;color: #ff4444;border-color: #dedede "
                                @click="onPayBtnClick(k,i)" v-show="k.status==0">
                      去支付
                    </van-button>

                    <van-button plain round size="small" type="primary"
                                style="background-color: white;color: #ff4444;border-color: #dedede "
                                @click="onLogisticsBtnClick(k,i)" v-show="k.status==1">
                      查看物流
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

  export default {
    components: {
      'v-header': Header,
      'v-footer':Footer
    },

    data() {
      return {
        showHeader: true,
        active: 0,
        swipeThreshold: 5,
        no_orderList_bg: require('@/assets/images/emptyBox.png'),
        tag_coupon: require('@/assets/icons/ico_lab_coupon.png'),
        tag_promotion: require('@/assets/icons/ico_lab_promotion.png'),
        launchedLoading: false,
        reload:false,
        orderTypes: [
          {
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
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
    },

    methods: {
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
        for(let i = 0 ; i< this.orderTypes.length ; i++) {
          this.orderTypes[i].list.splice(0,1);
        }
        this.orderTypes.splice(0,1);
        this.orderTypes = [
          {
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
        if (merchantNo == 20) {
          return "苏宁易购"
        } else if (merchantNo == 30) {
          return "唯品会"
        } else if (merchantNo == 50) {
          return "天猫精选"
        } else if (merchantNo == 60) {
          return "京东"
        } else {
          return "商城自营"
        }
      },
      openCashPage(user, merchantNo, orderNos, pAnOrderInfo, listItem) {
        let that = this;
        let returnUrl = ""
        if(this.$api.APP_ID === "10")
        {
          returnUrl  =   "https://mall.weesharing.com/pay/cashering";
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
            url: '/payment',
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
          let savedOrderNo = this.getSavedPayOrderInfo(listItem);
          this.$log("savedOrderNo:" + savedOrderNo)
          if (savedOrderNo != null) {
            pAnOrderInfo.orderNo = savedOrderNo
            that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
            that.$jsbridge.call("openCashPage", pAnOrderInfo);
            this.$router.replace({
              name: "收银台页",
              params: {
                orderInfo: pAnOrderInfo
              }
            })
          } else {
            that.$log("预下单:" + JSON.stringify(options))
            that.$api.xapi({
              baseURL: this.$api.SSO_BASE_URL,
              // url: '/zhcs/payment',
              url: '/payment/pingan',
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
                that.$jsbridge.call("dredgeWallet", walletInfo);
              } else {
                if (response.data.data.result != undefined) {
                  let orderNo = response.data.data.result.orderNo
                  pAnOrderInfo.orderNo = orderNo
                  that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
                  that.$jsbridge.call("openCashPage", pAnOrderInfo);
                  this.$router.replace({
                    name: "收银台页",
                    params: {
                      orderInfo: pAnOrderInfo
                    }
                  })
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
          let id = listItem.id
          let index = this.active
          this.reload = true;
          let options = {
            "id": id,
            "status": 3
          }
          this.$api.xapi({
            method: 'put',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/order/status',
            data: options,
          }).then((response) => {
            if (response.data.code == 200) {
              listItem.status = 3;
              if(this.active != 0) {
                let found = -1;
                for (let i = 0; i < this.orderTypes[index].list.length; i++) {
                  this.$log("listItem.id:"+listItem.id)
                  this.$log("this.orderTypes[index].list[i].id:"+this.orderTypes[index].list[i].id)
                  if (listItem.id === this.orderTypes[index].list[i].id) {
                    found = i;
                    break;
                  }
                }
                this.$log("found is:"+found)
                if (found != -1) {
                  this.orderTypes[index].list.splice(found, 1)
                  this.orderTypes[index].total--;
                }
              }
            }
          }).catch(function (error) {
            console.log(error)
          })
        }).catch(() => {
          console.log("不删")
        });

      },

      onPayBtnClick(listItem, i) {
        this.$log(listItem);
        let userInfo = this.$store.state.appconf.userInfo;
        if (this.isUserEmpty(userInfo)) {
          return;
        }
        let user = JSON.parse(userInfo);
        let len = listItem.tradeNo.length;
        let orderNos = JSON.stringify(listItem.tradeNo.substr(len - 8)).replace(/\"/g, "");
        let orderNo = this.$api.APP_ID + listItem.merchantNo + user.openId + orderNos
        let pAnOrderInfo = {
          "accessToken": user.accessToken,
          "orderNo": orderNo,
          "orderAmount": listItem.saleAmount * 100,//分
          "openId": user.openId,
          "businessType": "11"
        }
        this.openCashPage(user, listItem.merchantNo, orderNos, pAnOrderInfo, listItem)
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
              if(this.active != 0) {
                let found = -1;
                for (let i = 0; i < this.orderTypes[index].list.length; i++) {
                  this.$log("listItem.id:"+listItem.id)
                  this.$log("this.orderTypes[index].list[i].id:"+this.orderTypes[index].list[i].id)
                  if (listItem.id === this.orderTypes[index].list[i].id) {
                    found = i;
                    break;
                  }
                }
                this.$log("found is:"+found)
                if (found != -1) {
                  this.orderTypes[index].list.splice(found, 1)
                  this.orderTypes[index].total--;
                }
              }
            }
          }).catch(function (error) {
            console.log(error)
          })
        }).catch(() => {
        });
      },

      onDelBtnClick(listItem, i) {
        this.$log("onCancelBtnClick Enter")
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
        }).catch(() => {
        });
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
        this.$router.push({
          name: "物流信息页",
          params: {
            detail: listItem
          }
        })
      },

      onClick(index, title) {
        this.$log("onClick Enter, index is:" + index + ",title is:" + title)
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', index);
        this.onLoad(index)
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },
      onLoad(index) {
        this.$log("onLoad is:" + index);
        let that = this;
        that.launchedLoading = true;
        let userInfo = this.$store.state.appconf.userInfo;
        this.$log("*************  userInfo is:" + userInfo);
        if(this.reload) {
          this.resetOrderTypeList();
          this.reload = false;
        }
        //  that.$log("userInfo:"+userInfo)
        if (that.isUserEmpty(userInfo)) {
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
            url: '/order/all',
            data: options,
          }).then((response) => {
            let result = response.data.data.result
            that.orderTypes[index].total = result.total;
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

    .orderlist-layout{
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

          img {
            margin: 0 auto;
            height: 150px;
            width: 150px;
          }
        }

        .orderDetail {
          background-color: white;
          margin-top: 1em;

          .cardtags{
            margin-top: 10px;
            >img{
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
          }
        }
      }
    }



  }
</style>
