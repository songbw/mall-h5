<template>
  <header :style="{'background-color':mBackgroundColor}">
    <van-row type="flex">
      <van-col span="3">
        <div style="margin-top: 3px">
          <van-icon name="arrow-left" @click="$router.replace({name: '首页'})" v-if="$route.matched[0].path=='/category'"></van-icon>
          <van-icon name="arrow-left" @click="$router.replace({name: '首页'})" v-else-if="$route.matched[0].path=='/car/oderList'"></van-icon>
          <van-icon name="arrow-left"@click="closeWindow" v-else-if="$route.name==='首页'"></van-icon>
          <van-icon name="arrow-left" @click="$router.go(-1)" v-else></van-icon>
        </div>
      </van-col>
      <van-col span="18">
        <slot name="title"></slot>
      </van-col>
      <van-col span="3" style="margin-top: 3px">
        <slot name="right"></slot>
      </van-col>
    </van-row>
  </header>
</template>


<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  header {
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: 0.8em 0.15em 0em 0.15em;
    height: 2.2em;
    background-color: #FF4444;
    color: white;



  }


</style>


<script>
  export default {
    props: ['mBackgroundColor'],

    methods: {
      closeWindow() {
        this.$jsbridge.call("closeWindow");
      },
    }
  }
</script>
