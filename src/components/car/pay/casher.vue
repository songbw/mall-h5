<template lang="html">

  <div class="casher">
    <v-header>
      <h1 slot="title">收银台</h1>
    </v-header>
    <van-row>
      <van-col span="18" style="text-align: left;padding-left:1em;font-size: 18px;color: #000000">应付金额:</van-col>
      <van-col span="6" style="text-align: center;color: #f44336;font-size: 20px">￥100</van-col>
    </van-row>
    <h1 class="section-title">
      支付方式
    </h1>
    <van-radio-group v-model="radio" @change="onChange">
      <van-cell-group>
        <van-cell title="微信" icon="wechat" clickable @click="radio = '1'">
          <van-radio name="1" checked-color="#4b0"/>
        </van-cell>
        <van-cell title="支付宝" icon="alipay" clickable @click="radio = '2'">
          <van-radio name="2" checked-color="#4b0"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <footer class="pay-footer" ontouchstrat="" @click="payConfirm">
      <span>立即支付</span>
    </footer>
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
        radio: '1'
      }
    },
    methods: {
      onChange() {

      },


    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .casher {
    width: 100%;
    text-align: left;

    .section-title {
      .bt();
      background-color: #ffffff;
      text-align: left;
      margin: 1em;
      .fz(font-size, 30);
      color: #000000;
    }

    .pay-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding-bottom: 14vw;

      span {
        display: block;
        width: 85%;
        background-color: #fd729c;
        border-radius: 1.3vw;
        color: #fff;
        font-size: 17px;
        padding: 4vw;
        margin: 0 auto;
        text-align: center;

        &:active {
          background-color: @cl;
        }
      }
    }
  }
</style>
