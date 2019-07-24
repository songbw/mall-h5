<template lang="html">
  <div class="casher">
    <v-header>
      <h1 slot="title">订单支付中</h1>
    </v-header>
    <div class="pay-order">
      <van-cell title="订单单号:">
        <div slot="default">
          <span>{{this.orderInfo.orderNo}}</span>
        </div>
      </van-cell>
      <van-cell title="订单详情:">
        <div slot="default">
          <span>订单支付中</span>
        </div>
      </van-cell>
    </div>
    <div class="pay-amount">
      <span>
        ￥{{amount}}
      </span>
    </div>
    <div class="footer_layout">
      <van-button type="primary" size="large" @click="onPayBtnClick">支付</van-button>
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
         orderInfo:{}
      }
    },
    computed: {
      amount() {
        return (this.orderInfo.orderAmount/100).toFixed(2)
      }
    },

    created() {
      this.$log("cashser created Enter")
      this.orderInfo = this.$route.params.orderInfo;
      this.$log(this.orderInfo);
    },

    methods: {
      onPayResult() {
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
        this.$router.replace({path: '/car/orderList'})
      },
      onPayBtnClick(){
        this.$log("onPayBtnClick Enter")
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.TESTSTUB_PAYMENT_BASE_URL,
          url: '/payment',
          data: this.orderInfo,
        }).then((response) => {
          this.$log(response)
          this.onPayResult()
        }).catch(function (error) {

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .casher {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .pay-order {
      background-color: white;
      margin-top: 10px;
    }
    .pay-amount {
      background-color: white;
      margin-top: 10px;
      display: flex;
      text-align: center;
      justify-content: center;
      height: 200px;
      line-height: 200px;
      color: #ff4444;
      font-size: xx-large;
      font-weight: bold;
    }
    .footer_layout{
      width: 100%;
      height: 16vw;
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
    }
  }
</style>
