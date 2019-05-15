<template lang="html">
  <section class="changeCoupon">
    <v-header class="header">
      <h1 slot="title">兑换优惠券</h1>
    </v-header>
    <div class="changeCouponBody">
      <div class="changCouponTip">
        <span>兑换码使用: 在当前页输入兑换码即可兑换为相应的优惠券。一个兑换码只能兑换一张优惠券，不可重复使用</span>
      </div>
      <div class="changeCouponBox">
        <van-field class="changeCouponInputBox" v-model="couponCode" placeholder="请输入兑换码"  clearable />
        <van-button class="ChangeCouponBtn" size="large" type="danger">立即兑换</van-button>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },

    data() {
      return {
        couponCode:''
      }
    },

    created() {

    },

    methods: {}
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';

  .changeCoupon{
    .changeCouponBody{
      .changCouponTip{
        margin: 10px;
      }

      .changeCouponBox{
        margin: 10px;
        .changeCouponInputBox{
          margin-top: 10px;
          border: 1px solid #ff4444;

        }
        .ChangeCouponBtn{
          margin-top: 10px;
        }
      }


    }
  }

</style>
