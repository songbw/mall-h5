<template lang="html">
  <div class="cashering">
    <v-header v-if="showHeader">
      <h1 slot="title">订单支付中</h1>
    </v-header>
    <div class="box"></div>
    <div class="casheringBox">
      <div class="casheringBoxCard">
        <img :src="ico_clock"/>
        <span>{{payInfoText}}</span>
        <van-button @click="onJumpOutBtnClick">直接跳出</van-button>
      </div>
    </div>
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
        showHeader: false,
        payInfo: {},
        ico_clock: require('@/assets/icons/ico_clock.png'),
        timer: '',
        value: 0,
        payInfoText:'完成支付后，页面将自动跳转...'
      }
    },

    mounted() {
      this.timer = setInterval(this.checkPaymentStatus, 1000);
    },

    beforeDestroy() {
      clearInterval(this.timer);
    },

    created() {
      this.$log("cashser created Enter")
      this.$log(this.$route.query)
      this.payInfo = this.$route.query
    },

    methods: {
      onJumpOutBtnClick() {
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
        this.$router.replace({path: '/car/orderList'})
      },
      quertPaymentStatus() {
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.AGGREGATE_PAY_URL,
          url: '/wspay/query/prepay',
          params: {
            orderNo: this.payInfo.outer_trade_no
          }
        })
      },
      quertOrderStatus() {
        return  this.$api.xapi({
          method: 'get',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/order/payment/status',
          params: {
            outerTradeNo: this.payInfo.outer_trade_no
          }
        })
      },
      async checkPaymentStatus() {
        this.value++;
        let that = this;
        if(this.value < 50) {
          try{
            let orderStatusResp =  await  this.quertOrderStatus ()
            this.$log(orderStatusResp.data)
            if(orderStatusResp.data.code == 200) {
              let rt = orderStatusResp.data.data.result
              if(rt === 'success') {
                this.payInfoText = "支付成功!"
                this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
                this.$router.replace({path: '/car/orderList'})
                return;
              }
            }
            let paymentStatusResp =  await  this.quertPaymentStatus()
            this.$log(paymentStatusResp)
            if(paymentStatusResp.data.code == 200) {
              this.$log(paymentStatusResp.data.data)
              let rt = paymentStatusResp.data.data
              if(rt == 2) {
                this.payInfoText = "支付失败!"
                this.$toast("支付失败!")
                this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
                this.$router.replace({path: '/car/orderList'})
                return;
              }
            }
          } catch (e) {
            that.$log(e)
            that.pageloading = false;
            this.payInfoText = "网络错误!"
            this.$toast(this.payInfoText)
            this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0)
            this.$router.replace({path: '/car/orderList'})
          }
        } else {
          this.payInfoText = "支付超时"
          this.$toast(this.payInfoText)
          this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
          this.$router.replace({path: '/car/orderList'})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .cashering {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .box {
      position: relative;
      width: 100%;
      line-height: 15vw;
      background-color: #ff4444;
    }

    .box:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -60px;
      content: ' ';
      height: 60px;
      width: 100%;
      border-radius: 0 0 30% 30%;
      background-color: #ff4444;
      overflow: hidden;
    }

    .casheringBox {
      display: flex;
      position: fixed;
      width: 100%;
      height: 90%;
      justify-content: center;
      justify-items: center;
      margin-top: 20px;

      .casheringBoxCard {
        z-index: 1;
        width: 96%;
        background-color: white;
        border-radius: 5px;
        height: 100%;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;

        img {
          height: 120px;
          width: 120px;
        }

        span {
          margin: 5vw 0vw 5vw 0vw;
          .fz(font-size, 30);
          color: #8c8c8c;
        }
      }
    }
  }
</style>
