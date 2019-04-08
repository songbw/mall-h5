<template>
  <header>
    <van-row>
      <van-col span="3">
        <router-link
          class="icon-go"
          :to="{ name: '首页'}"
          v-if="$route.matched[0].path=='/category'"
          replace>
        </router-link>
        <router-link
          class="icon-go"
          :to="{ name: '首页'}"
          v-else-if="$route.matched[0].path=='/car/oderList'"
          replace>
        </router-link>
        <span  class="icon-go" @click="closeWindow"  v-else-if="$route.name==='首页'">
        </span>
        <span class="icon-go" @click="$router.go(-1)" v-else>
        </span>
      </van-col>
      <van-col span="18">
        <slot name="title"></slot>
      </van-col>
      <van-col span="3">
        <slot name="right"></slot>
      </van-col>
    </van-row>
  </header>
</template>


<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  header {
    background-color: #F8FCFF;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: 0.8em 0.15em 0em 0.15em;
    height: 2.2em;

    h1 {
      .fz(font-size, 34);
      letter-spacing: .2vw;
      font-weight: 600;
      margin-right: 36vw;
    }

    span, a {
      display: inline-block;
      .fz(font-size, 46);
      transform: rotate(-180deg);

      &::before {
        color: #333;
      }
    }
  }


</style>


<script>
  export default {
    methods: {
      closeWindow() {
        this.$jsbridge.call("closeWindow");
      },
    }
  }
</script>
