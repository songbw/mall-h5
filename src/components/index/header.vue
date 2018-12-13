<template lang="html">
  <mt-header title="商城">
    <router-link :to="{name:''}" slot="left">
    <mt-button icon="search"></mt-button>
  </router-link>
    <router-link :to="{name:'购物车页'}" slot="right">
      <van-icon name="cart"  color="red" size="1em"/>
    </router-link>
  </mt-header>
</template>

<script>
  export default {}
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';

  .mint-header {
    padding: 6.8vw 4.8vw;
    background-color: #fff;
    color: #333 !important;
    .fz(font-size, 40) !important;
  }
</style>
