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
      return {
        selStateInCarList: []
      }
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

      add2SelectedCarlistWithoutUser () {//
        console.log("add2SelectedCarlistNoUser Enter");
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList;
        let choose = true;
        let found = -1;
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == this.datas.id && this.selStateInCarList[i].userId == -1) {
            found = i;
            break;
          }
        }
        if(found != -1) {
          this.selStateInCarList[found].count++;
        } else {
          this.selStateInCarList.push({
            "userId": -1,
            "id": this.datas.id,
            "image": this.datas.image,
            "desc": this.datas.brand + ' ' + this.datas.name + ' ' + this.datas.model,
            "skuId": this.datas.skuId,
            "count": 1,
            "price": this.datas.price,
            "choose": true,
            "isDel": 0
          });
        }
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
      },

      addGoodsCar() {
        console.log("add goods car Enter")
        try {
          let method = "send";//js调用的android方法名
          let action = "getUserInfo";//打电话动作
          let params = {"callback": "onAdd2Car", "action": action};//android接收参数，json格式
          if( window.jsInterface != undefined)
              window.jsInterface.invokeMethod(method, [JSON.stringify(params)]);
          else {
            //not mobile App，can not get user info
            this.add2SelectedCarlistWithoutUser();
          }
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
          else {
            //not mobile App，can not get user info ，goto car directly
            console.log("gotoCar  UserInfo" );
            this.$router.push("/car");
          }
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
