<template lang="html">
  <section class="changeCoupon">
    <v-header class="header">
      <h1 slot="title">兑换优惠券</h1>
    </v-header>
    <div class="changeCouponBody">
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

    }
  }

</style>
