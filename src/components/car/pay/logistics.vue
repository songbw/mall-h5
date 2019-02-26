<template lang="html">
  <section class="logisticsDetail">
    <v-header>
      <h1 slot="title">物流信息</h1>
    </v-header>
    <div class="noneInfo">
      <img :src="no_logistics_bg">
      <span>没有查询到物流信息</span>
    </div>
    <div class="logisticsInfo">
      <van-steps direction="vertical" :active="0" active-color="#f44">
        <van-step>
          <h3>【城市】物流状态1</h3>
          <p>2016-07-12 12:40</p>
        </van-step>
        <van-step>
          <h3>【城市】物流状态2</h3>
          <p>2016-07-11 10:00</p>
        </van-step>
        <van-step>
          <h3>快件已发货</h3>
          <p>2016-07-10 09:30</p>
        </van-step>
      </van-steps>
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

    methods: {

    }
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
