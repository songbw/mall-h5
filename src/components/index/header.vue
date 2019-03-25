<template lang="html">
  <mt-header title="商城">
    <router-link :to="{name:'搜索页'}" slot="left">
      <van-icon name="search" size="1em"/>
    </router-link>
    <div slot="right">
      <router-link :to="{name:'购物车页'}">
        <van-icon name="shopping-cart-o" />
      </router-link>
      <router-link :to="{name:'订单列表页'}">
        <van-icon name="notes-o" />
      </router-link>
    </div>
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
    background-color: white;
    color: #333 !important;
    .fz(font-size, 40) !important;
  }
</style>
