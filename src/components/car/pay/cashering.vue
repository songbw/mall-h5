<template lang="html">
  <div class="cashering">
    <v-header>
      <h1 slot="title">订单支付中</h1>
    </v-header>
    <div class="box"></div>
    <div class="casheringBox">
      <div class="casheringBoxCard">
        <img :src="ico_clock"/>
        <span>支付完成，页面自动跳转</span>
      </div>
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
        payInfo: {},
        ico_clock: require('@/assets/icons/ico_clock.png'),
      }
    },
    computed: {
      amount() {
        /*        return (this.orderInfo.orderAmount/100).toFixed(2)*/
      }
    },

    created() {
      this.$log("cashser created Enter")
      this.$log(this.$route.query)
      this.payInfo = this.$route.query
    },

    methods: {}
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .cashering {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .box {
      padding-top: 2em;
      position: relative;
      width: 100%;
      line-height: 15vw;
      background-color: #ff4444;
    }

    .box:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -60px;
      content: ' ';
      height: 60px;
      width: 100%;
      border-radius: 0 0 30% 30%;
      background-color: #ff4444;
      overflow: hidden;
    }

    .casheringBox {
      display: flex;
      position: fixed;
      width: 100%;
      height: 85%;
      justify-content: center;
      justify-items: center;

      .casheringBoxCard {
        z-index: 1;
        width: 96%;
        background-color: white;
        border-radius: 5px;
        height: 100%;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;

        img {
          height: 120px;
          width: 120px;
        }

        span {
          margin: 5vw 0vw 5vw 0vw;
          .fz(font-size, 30);
          color: #8c8c8c;
        }
      }
    }
  }
</style>
