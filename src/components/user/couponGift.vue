<template lang="html">
  <div class="giftcoupon"  v-if="showHeader">
    <v-header>
      <h1 slot="title">新人礼包</h1>
    </v-header>
    <div class="giftcouponBody">
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
      }
    },

    created() {
      this.$log("cashser created Enter")
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
      let that = this
      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.EQUITY_BASE_URL,
        url: '/coupon/giftCoupon'
      }).then((response) => {

      }).catch(function (error) {
        that.$log(error)
      })
    },

    methods: {
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .giftcoupon {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;
    .giftcouponBody{

    }

  }
</style>
