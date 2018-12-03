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
    props: {
      datas: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {}
    },
    created() {
      window.cb_getUserInfo = this.cb_getUserInfo;
    },

    methods: {
      addGoodsCar() {
        console.log("add goods car Enter")
        let method = "send";//js调用的android方法名
        let action = "getUserInfo";//打电话动作
        let params = {"callback": "cb_getUserInfo", "action": action};//android接收参数，json格式
        window.jsInterface.invokeMethod(method, [JSON.stringify(params)]);
      },


      cb_getUserInfo(str) {
        console.log("cb_getUserInfo enter UserInfo:" + JSON.stringify(str));
        let userId = str.userId.toString();
        let skuId = this.datas.skuid;
        let addtoCar = {
          "openId": userId,
          "skuId": skuId
        }
        console.log("addtoCar:" + JSON.stringify(addtoCar));
        if (str.code === 200) {
          this.$api.xapi({
            method: 'post',
            url: '/cart',
            data: addtoCar,
          }).then((response) => {
            this.result = response.data.data.result;
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          //nothing to do
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

</style>
