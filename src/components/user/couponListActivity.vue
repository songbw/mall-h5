<template lang="html">
  <div class="couponActivity">
    <v-header class="header">
      <h1 slot="title">优惠活动</h1>
    </v-header>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
    },
    data() {
      return {
        currentCouponPageInfo:'',

      }
    },

    mounted() {
      this.$log("mounted Enter")
      this.currentCouponPageInfo = this.$store.state.appconf.currentCouponPageInfo;
      if( this.currentCouponPageInfo.length ) {
        this.coupon = JSON.parse(this.currentCouponPageInfo);
        this.$log(this.coupon)
        let couponInfo = this.coupon.couponInfo;
        let rules = couponInfo.rules;
        let scenario = rules.scenario;
        let couponRules = rules.couponRules;
        //scenario: 使用场景，包含如下属性
        //type: 类型（1：特定商品类，2：全场类，3：类目品牌类, 4:服务类）

        //couponRules
        //type： int 类型（0：满减券 1:代金券 2:折扣券 3:服务券）
      }
    }


  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
</style>
