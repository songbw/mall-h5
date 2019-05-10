<template lang="html">
  <section class="couponCenter">
    <v-header class="header">
      <h1 slot="title">领券中心</h1>
    </v-header>
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
    computed: {},

    created() {

    },

    computed: {},

    methods: {}
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .couponCenter {

  }
</style>
