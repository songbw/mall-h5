<template lang="html">
  <div class="casher">
    <v-header>
      <h1 slot="title">收银台...</h1>
    </v-header>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        notifyUrl: '',
        appId: -1,
      }
    },
    computed: {
    },

    Created() {
      try {
        let that = this;
        that.$log("Casher beforeCreate Enter");
        that.$log(this.$route.query)
        let merchantNo = this.$route.query.merchantNo;
        let userId = this.$route.query.userId;
        let orderNo = this.$route.query.orderNo;
        let amount = this.$route.query.amount;
        let isOutlink = this.$route.query.isOutlink;
        let isPayDirect = this.$route.query.isPayDirect;
        if(isOutlink == undefined)
          isOutlink = true;
        if(isPayDirect == undefined)
          isPayDirect = false;
        that.$log("merchantNo:" + merchantNo + ",userId:" + userId + ",orderNo:" + orderNo + ",amount:" + amount
        +"isOutlink:"+isOutlink)
        let openId = userId.substring(2)
        let orderNos = JSON.stringify(orderNo.substr(len - 8)).replace(/\"/g, "");
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          if(user.openId == openId) {
            let options = {
              "openId": user.openId,
              "appId": this.$api.APP_ID,
              "merchantNo": merchantNo,
              "orderNos": orderNos,
              "goodsName": "商品支付订单",
              "amount": amount
            }
            that.$log("预下单:" + JSON.stringify(options))
            that.$api.xapi({
              method: 'post',
              url: '/zhcs/payment',
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
/*                  if(!isOutlink) {
                    if (isPayDirect) {
                      that.$store.commit('SET_PAY_DIRECT_PRODUCT', '')
                    } else {
                      //that.deleteOrderedGoodsInCar();
                      let selStateInCarList = this.$store.state.appconf.selStateInCarList
                      let allPlayList = this.$store.state.appconf.payList
                      that.$log("selStateInCarList:")
                      that.$log(selStateInCarList)
                      that.$log("allPlayList")
                      that.$log(allPlayList)
                      that.$log("#####################################")
                    }
                  }*/
                  let pAnOrderInfo = {
                    "accessToken": user.accessToken,
                    "orderNo": orderNo,
                    "orderAmount": amount * 100,//分
                    "openId": user.openId,
                    "businessType": "11"
                  }
                 // this.addPreOrderList(response.data.data.result);
                  that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
                  that.$jsbridge.call("openCashPage", pAnOrderInfo);
                }
              }
            }).catch(function (error) {
              that.$log(error)
            })
          } else {
            this.$log("error: openId is not the correct!")
          }

        }
      } catch (e) {
        that.$log(e)
      }
    },

    methods: {
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .casher {
    width: 100%;
    opacity: 0.1;
  }
</style>
