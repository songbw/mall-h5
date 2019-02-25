<template lang="html">
  <section class="logisticsDetail">
    <v-header>
      <h1 slot="title">物流信息</h1>
    </v-header>
    <div class="noneInfo">
      <img :src="no_logistics_bg">
      <span>没有查询到物流信息</span>
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
        detail: {},
        status: -1,
        no_logistics_bg: require('@/assets/images/truck.png'),
      }
    },


    created() {
      this.$log("logistics created Enter")
      this.detail = this.$route.params.detail;
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

  .logisticsDetail {
    .noneInfo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: Center;

      img {
        margin: 4vw;
      }

      span {
        margin: 2vw;
      }
    }

  }
</style>
