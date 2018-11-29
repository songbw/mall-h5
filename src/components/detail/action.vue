<template lang="html">
  <van-goods-action>
    <van-goods-action-mini-btn icon="chat" text="客服"/>
    <van-goods-action-mini-btn icon="cart" text="购物车"/>
    <van-goods-action-big-btn text="加入购物车"/>
    <van-goods-action-big-btn text="立即购买" primary/>
  </van-goods-action>
</template>

<script>
  import {MessageBox} from 'mint-ui';
  import {Toast} from 'mint-ui';

  export default {

    methods: {
      methods: {}
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

</style>
