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

    },

    methods: {
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length == 0)
      },
      add2SelectedCarlistWithoutUser() {//
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
        if (found != -1) {
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
        let userInfo = this.$store.state.appconf.userInfo;
        this.$log("userInfo:" + userInfo);
        if (!this.isUserEmpty(userInfo)) {
          this.add2Car(userInfo);
        }
        /* let userInfo=this.$jsbridge.call("getUserInfo");
         if( userInfo != null && userInfo.length > 0) {
           console.log("addGoodsCar getUserInfo ret is:"+userInfo);
           this.$store.commit('SET_USER',userInfo);
           this.add2Car(userInfo);
         } else {
           //not mobile App，can not get user info
           this.add2SelectedCarlistWithoutUser();
         }*/
      },

      add2Car(userInfo) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let skuId = this.datas.skuid;
        let addtoCar = {
          "openId": userId,
          "skuId": skuId
        }
        console.log("addtoCar:" + JSON.stringify(addtoCar));
        this.$api.xapi({
          method: 'post',
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
        }).catch(function (error) {
          console.log(error)
        })
      },

      gotoCar() {
        this.$router.push("/car");
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

</style>
