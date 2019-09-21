<template lang="html">
  <div class="casher">
    <v-header  v-if="showHeader">
      <h1 slot="title">订单支付</h1>
    </v-header>
    <div class="payBody">
      <div class="box"></div>
      <div class="payBox">
        <div class="infoBox">
          <div class="payAmount">
            <p><span>￥</span>{{amount}}</p>
          </div>
          <div style="width: 100%;display: flex">
            <span style="margin:10px;font-size: small;text-align: left;width: 100%" >支付订单:</span>
            <span style="margin-top:15px;margin-right:5px; font-size: xx-small;text-align: left;width: 100%">{{this.orderInfo.outTradeNo}}</span>
          </div>
          <div style="  width: 100%;
          display: flex;
          flex-direction: row;">
            <div style="width: 70%">
              <span style="margin:10px;font-size: small;float: left" >订单详情:</span>
            </div>
            <div style="width: 30%">
              <span style="margin:10px;font-size: small;float: right" >订单支付</span>
            </div>
          </div>
        </div>
        <div class="pathBox">
          <van-radio-group v-model="radio">
              <van-cell title="联机账户"  :icon="icon_linkpay" clickable @click="radio = '1'">
                <van-radio slot="right-icon" name="1" />
              </van-cell>
              <van-cell title="微信支付"  :icon="icon_wechatpay" >
                <van-radio slot="right-icon" disabled name="2"/>
              </van-cell>
          </van-radio-group>
        </div>
      </div>
      <div class="footer_layout">
        <van-button type="danger" round size="large" @click="onPayBtnClick">
          确认支付￥{{amount}}
        </van-button>
      </div>
      <van-actionsheet v-model="showLinkPayDialog"  title="联机账户支付">
        <div  class="linkPayDialog">
            <van-field
              v-model="linkPayAccount"
              required
              clearable
              label="卡号"
              maxlength="30"
              label-width="40px"
              placeholder="请输入卡号"
            />

            <van-field
              v-model="linkPayPwd"
              :type="isLinkPwdVisable?'number':'password'"
              maxlength="30"
              clearable
              label="密码"
              label-width="40px"
              placeholder="请输入密码"
              :right-icon="isLinkPwdVisable?'eye-o':'closed-eye'"
              required
              @click-right-icon="togLinkPayPwdVisable()"
            />
          <div style=" width: 100%;position: fixed;bottom: 10px;">
            <van-button type="danger" size="large" round @click="gotoLinkPay">去支付</van-button>
          </div>
        </div>
      </van-actionsheet>
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
        radio: -1,
        showLinkPayDialog: false,
        linkPayAccount:"",
        linkPayPwd:"",
        isLinkPwdVisable:false,
      }
    },
    computed: {
      amount() {
        return (this.orderInfo.orderAmount / 100).toFixed(2)
      }
    },

    created() {
      this.$log("cashser created Enter")
      this.showHeader = this.$api.HAS_HEADER;
      this.orderInfo = this.$route.params.orderInfo;
      this.$log(this.orderInfo);
    },

    methods: {
      gotoLinkPay() {
        this.$log("gotoLinkPay Enter")
        this.$log(this.linkPayAccount)
        this.$log(this.linkPayPwd)
        if(this.linkPayAccount.length == 0) {
          this.$toast("请输入卡号")
          return
        }
        if(this.linkPayPwd.length == 0) {
          this.$toast("请输入卡密码")
          return
        }
        let options = {
          "payType": "pos",
          "orderNo": this.orderInfo.orderNo,
          "actPayFree": this.orderInfo.orderAmount,
          "cardNo":this.linkPayAccount,
          "cardPwd":this.linkPayPwd
        }
        this.$log(options)
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.AGGREGATE_PAY_URL,
          url: '/wspay/pay',
          data: options,
        }).then((response) => {
          this.$log(response)
          if(response.data.code == 200) {
            this.$router.replace({
              path: '/pay/cashering',
              query:{
                outer_trade_no:this.orderInfo.orderNo
              }})
          } else {
            this.$toast(response.data.message)
          }
        }).catch(function (error) {

        })
      },
      togLinkPayPwdVisable() {
         this.isLinkPwdVisable = !this.isLinkPwdVisable
      },
      onPayResult() {
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
        this.$router.replace({path: '/car/orderList'})
      },
      onPayBtnClick() {
        this.$log("onPayBtnClick Enter")
        if(this.radio == '1') {
           this.$log("link pay clicked")
           this.showLinkPayDialog = true;
        } else if(this.radio == '2') {
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
        } else {
          this.$toast("请选择支付方式")
        }
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
      .linkPayDialog{
        width: 100%;
        align-items: center;
      }

      .van-actionsheet {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        min-height: 400px;
      }

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
