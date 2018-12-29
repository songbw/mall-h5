<template lang="html">
  <section class="goodsAction">
    <van-goods-action>
      <van-goods-action-mini-btn icon="chat" text="客服"/>
      <van-goods-action-mini-btn icon="cart" text="购物车" @click="gotoCar"/>
      <van-goods-action-big-btn text="加入购物车" @click="addGoodsCar"/>
      <van-goods-action-big-btn text="立即购买" primary/>
    </van-goods-action>
  </section>

</template>

<script>
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
      window.onAdd2Car = this.onAdd2Car;
      window.onGotoCar = this.onGotoCar;
    },

    methods: {
      updateUserInfo(user) {
        console.log("UserInfo:" + JSON.stringify(user));
        this.$store.commit('SET_USER',JSON.stringify(user));
      },

      addGoodsCar() {
        console.log("add goods car Enter")
        try {
          let method = "send";//js调用的android方法名
          let action = "getUserInfo";//打电话动作
          let params = {"callback": "onAdd2Car", "action": action};//android接收参数，json格式
          if( window.jsInterface != undefined)
              window.jsInterface.invokeMethod(method, [JSON.stringify(params)]);
        } catch (e) {
           //ignore
          console.log("addGoodsCar error:"+e)
        }

      },

      onAdd2Car(str) {
        this.updateUserInfo(str);
        this.add2Car(str);
      },

      add2Car(user) {
        let userId = user.userId.toString();
        let skuId = this.datas.skuid;
        let addtoCar = {
          "openId": userId,
          "skuId": skuId
        }
        console.log("addtoCar:" + JSON.stringify(addtoCar));
        if (user.code === 200) {
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
      },
      gotoCar() {
        console.log("goto car Enter")
        try {
          let method = "send";//js调用的android方法名
          let action = "getUserInfo";//打电话动作
          let params = {"callback": "onGotoCar", "action": action};//android接收参数，json格式
          if ( window.jsInterface != undefined)
            window.jsInterface.invokeMethod(method, [JSON.stringify(params)]);
        } catch (e) {
           console.log("gotoCar error:"+e)
        }
      },

      onGotoCar(str) {
        console.log("onAdd2Car enter UserInfo:" + JSON.stringify(str));
        this.updateUserInfo(str);
        this.$router.push("/car");
      },



    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

</style>
