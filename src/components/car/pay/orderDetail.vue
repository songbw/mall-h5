<template lang="html">
  <section class="orderDetail">
    <v-header>
      <h1 slot="title">订单详情</h1>
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


    created() {

    },

    computed: {
    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .orderDetail {
    width: 100%;
    text-align: left;

  }
</style>
