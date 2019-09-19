<template lang="html">
  <div class="coinBalance" v-if="showHeader">
    <v-header>
      <h1 slot="title">余额账户</h1>
    </v-header>
    <div class="coinBalanceBody">
      <div class="box"></div>
      <div class="balanceAmountBox">
        <div class="infoBox">
          <img :src="icon_coin_amount">
          <span>我的余额</span>
          <div class="amountInfo">
            <p><span>￥</span>{{amount.toFixed(2)}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import  Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        showHeader: true,
        icon_coin_amount: require('@/assets/icons/ico_coin_amount.png'),
        amount: 0,
      }
    },

    created() {
      this.$log("coin balance created Enter")
      if (this.$api.IS_GAT_APP) {
        this.showHeader = false;
      }
      let that =this
      let userInfo = this.$store.state.appconf.userInfo;

      if (!Util.isUserEmpty(userInfo)) {
        let user = JSON.parse(userInfo)
        that.$api.xapi({
          method: 'get',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/balance',
          params: {
            openId:user.openId
          }
        }).then((response) => {
          this.amount = response.data.data.amount
        }).catch(function (error) {
          that.$log(error)
        })
      }
    },

    methods: {
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .coinBalance {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .coinBalanceBody {
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

      .balanceAmountBox {
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

          img {
            height: 80px;
            width:  80px;
          }

          .amountInfo {
            .fz(font-size, 80);
            color: #333333;
            font-weight: bold;
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
