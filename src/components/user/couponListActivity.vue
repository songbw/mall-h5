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
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
</style>
