<template lang="html">
  <section class="changeCoupon">
    <v-header class="header"  v-if="showHeader">
      <h1 slot="title">兑换优惠券</h1>
    </v-header>
    <div class="changeCouponBody">
      <div class="changCouponTip">
        <span>兑换码使用: 在当前页输入兑换码即可兑换为相应的优惠券。一个兑换码只能兑换一张优惠券，不可重复使用</span>
      </div>
      <div class="changeCouponBox">
        <van-field class="changeCouponInputBox" v-model="couponCode" placeholder="请输入兑换码" clearable/>
        <van-button class="ChangeCouponBtn" size="large" type="danger" @click="onChangeCouponBtnClick">立即兑换</van-button>
      </div>
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
        couponCode: '',
        showHeader: true
      }
    },

    created() {
      if (this.$api.IS_GAT_APP) {
        this.showHeader = false;
      }
    },

    methods: {
      onChangeCouponBtnClick() {
        this.$log("onChangeCouponBtnClick Enter")
        this.$log(this.couponCode)
        let that = this
        if (that.couponCode.length > 0) {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
            let user = JSON.parse(userInfo);
            let options = {
              userOpenId: user.userId,
              userCouponCode: this.couponCode
            }
            that.$api.xapi({
              method: 'post',
              baseURL: this.$api.EQUITY_BASE_URL,
              url: '/coupon/redemption',
              data: options
            }).then((response) => {
             // let result = response.data.data.result;
              that.$log(response.data)
              let rt = response.data
              if(rt.msg == 'Success') {
                that.$toast("兑换成功")
              } else {
                that.$toast("兑换失败")
              }
            }).catch(function (error) {
              that.$log(error)
            })
          }
        } else {
          this.$toast("请输入正确的兑换码")
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';

  .changeCoupon {
    .changeCouponBody {
      .changCouponTip {
        margin: 10px;
      }

      .changeCouponBox {
        margin: 10px;

        .changeCouponInputBox {
          margin-top: 10px;
          border: 1px solid #ff4444;

        }

        .ChangeCouponBtn {
          margin-top: 10px;
        }
      }


    }
  }

</style>
