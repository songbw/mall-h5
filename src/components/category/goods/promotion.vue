<template lang="html">
  <section class="promotion">
    <v-header>
      <h1 slot="title">商城活动</h1>
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
        detail: {},
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
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .promotion {

  }
</style>
