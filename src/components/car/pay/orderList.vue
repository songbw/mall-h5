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
                        <div slot="footer" class="card_footer">
                          <div v-if="sku.status < 4">
                            <van-button plain round size="small" type="primary"
                                        style="background-color: white;color: #ff4444;border-color: #ffcccc "
                                        @click.stop=""
                                        @click="onAfterSalesServiceBtnClick(k,sku)" v-if="k.status==1||k.status==2">
                              申请售后
                            </van-button>
                          </div>
                          <div v-else-if="sku.status == 5">
                            <van-button plain round size="small" type="primary"
                                        style="background-color: white;color: #888888;border-color: #f0f0f0 "
                                        @click.stop=""
                                        @click="onQuerySalesServiceBtnClick(k,sku)">
                              查看售后
                            </van-button>
                          </div>
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
                                @click="showMeqiaPanel">
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
  import Util from '@/util/common'


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
      this.showHeader = this.$api.HAS_HEADER;
    },

    beforeDestroy (){
      this.hideMeqiaPanel()
    },

    methods: {
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
      showMeqiaPanel () {
        let userInfo = this.$store.state.appconf.userInfo;
        let userDetail = this.$store.state.appconf.userDetail;
        let userName = ""
        let userId = ""
        let telePhone = ""
        if(!Util.isUserEmpty(userInfo)) {
          let UserInfo = JSON.parse(userInfo)
          userId = UserInfo.userId
        }
        if(userDetail.length > 0) {
          let UserDetail  = JSON.parse(userDetail)
          userName =  UserDetail.nickname
          telePhone = UserDetail.telephone
        }
        _MEIQIA('showPanel')
        _MEIQIA('metadata', {
          name: userName, // 美洽默认字段
          tel:telePhone,
          '渠道': this.getClientName(), // 自定义字段
          '用户ID': userId,
          '当前URL': window.location.href,
          '订单号': ''
        });
      },
      hideMeqiaPanel(){
        _MEIQIA('hidePanel');
      },
      onQuerySalesServiceBtnClick(k,sku) {
        this.$router.push({name: '售后工单页'})
      },
      onAfterSalesServiceBtnClick(k,sku) {
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
      /*statue: Number 子订单状态（0：已下单；1：待发货；2：已发货（15天后自动变为已完成）；3：已完成；4：已取消；5：失败）*/
      getSubOrderStatus(status) {
        switch(status) {
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
        if(this.$api.IS_GAT_APP)
        {
          if(this.$api.APP_ID==='10') {
            returnUrl  =   "https://gatsn.weesharing.com/pay/cashering";
          } else if(this.$api.APP_ID==='09') {
            returnUrl  =   "https://gatzy.weesharing.com/pay/cashering";
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
          let savedOrderNo = this.getSavedPayOrderInfo(listItem);
          this.$log("savedOrderNo:" + savedOrderNo)
          savedOrderNo = null //force ，renew order no
          if (savedOrderNo != null) {
            pAnOrderInfo.orderNo = savedOrderNo
            that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
           // that.$jsbridge.call("openCashPage", pAnOrderInfo);
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
/*            that.$log("预下单:" + JSON.stringify(options))
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
                  let outTradeNo =  response.data.data.result.outTradeNo
                  pAnOrderInfo['orderNo'] = orderNo
                  pAnOrderInfo['outTradeNo'] = outTradeNo
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
            })*/
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
        if (Util.isUserEmpty(userInfo)) {
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

            .card_footer{
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
