<template lang="html">
  <div class="casher" v-if="showHeader">
    <v-header>
      <h1 slot="title">订单支付</h1>
    </v-header>
    <div class="payBody">
      <div class="box"></div>
      <div class="payBox">
        <div class="infoBox">
          <div class="payAmount">
            <p><span>￥</span>{{amount}}</p>
          </div>
          <van-cell title="支付单号:">
            <div slot="default">
              <span style="font-size: x-small">{{this.orderInfo.orderNo}}</span>
            </div>
          </van-cell>
          <van-cell title="订单详情:">
            <div slot="default">
              <span>订单支付</span>
            </div>
          </van-cell>
        </div>
        <div class="pathBox">
          <van-radio-group v-model="radio">
              <van-cell title="联机账户"  :icon="icon_linkpay" clickable @click="radio = '1'">
                <van-radio slot="right-icon" name="1" />
              </van-cell>
              <van-cell title="微信支付"  :icon="icon_wechatpay" clickable @click="radio = '2'">
                <van-radio slot="right-icon" name="2" />
              </van-cell>
          </van-radio-group>
        </div>
      </div>
      <div class="footer_layout">
        <van-button type="danger" round size="large" @click="onPayBtnClick">支付</van-button>
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
        showHeader: true,
        orderInfo: {},
        icon_wechatpay: require('@/assets/icons/ico_wechatpay.png'),
        icon_linkpay: require('@/assets/icons/ico_linkpay.png'),
        radio: -1
      }
    },
    computed: {
      amount() {
        return (this.orderInfo.orderAmount / 100).toFixed(2)
      }
    },

    created() {
      this.$log("cashser created Enter")
      if (this.$api.IS_GAT_APP) {
        this.showHeader = false;
      }
      this.orderInfo = this.$route.params.orderInfo;
      this.$log(this.orderInfo);
    },

    methods: {
      onPayResult() {
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
        this.$router.replace({path: '/car/orderList'})
      },
      onPayBtnClick() {
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

    .payBody {
      .box {
        padding-top: 1em;
        position: relative;
        width: 100%;
        background-color: #ff4444;
      }

      .box:after {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -30px;
        content: ' ';
        height: 30px;
        width: 100%;
        border-radius: 0 0 30% 30%;
        background-color: #ff4444;
        overflow: hidden;
      }

      .payBox {
        display: flex;
        flex-direction: column;
        position: fixed;
        width: 100%;
        justify-content: center;
        justify-items: center;
        align-items: center;

        .infoBox {
          padding: 10px 0px;
          width: 96%;
          min-height: 150px;
          background-color: white;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;

          .payAmount {
            line-height: 100px;
            .fz(font-size, 80);
            color: #FF4444;
            font-weight: bold;
            min-height: 100px;

            span {
              .fz(font-size, 50);
            }
          }

          .van-cell{
            margin-top: -1px;
          }
        }

        .pathBox {
          margin-top: 10px;
          padding: 10px 0px;
          width: 96%;
          min-height: 100px;
          background-color: white;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .van-cell{
            margin-top: -1px;
          }
        }
      }

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

      .footer_layout {
        width: 100%;
        height: 16vw;
        display: -webkit-flex;
        display: -ms-flex;
        display: flex;
        align-items: center;
        position: fixed;
        bottom: 10px;
        left: 0;
        .van-button{
          margin: 10px;
        }
      }
    }


  }
</style>
