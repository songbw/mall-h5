<template lang="html">
  <section class="goodsAction">
    <van-goods-action>
      <van-goods-action-mini-btn icon="chat" text="客服"/>
      <van-goods-action-mini-btn icon="cart" text="购物车"/>
      <van-goods-action-big-btn text="加入购物车" @click="addGoodsCar"/>
      <van-goods-action-big-btn text="立即购买" primary/>
    </van-goods-action>
  </section>

</template>

<script>
  import {MessageBox} from 'mint-ui';
  import {Toast} from 'mint-ui';

  export default {
    data() {
      return {

      }
    },
    created() {
      window.cb_getUserInfo = this.cb_getUserInfo;
    },

    methods: {
      addGoodsCar() {
        console.log("add goods car Enter")
        let method = "send";//js调用的android方法名
        let action = "getUserInfo";//打电话动作
        let params = {"msg":"10086", "callback":"cb_getUserInfo", "action":action};//android接收参数，json格式
        window.jsInterface.invokeMethod(method, [JSON.stringify(params)]);
      },
      cb_getUserInfo(str) {
        console.log("UserInfo:"+JSON.stringify(str));
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

</style>
