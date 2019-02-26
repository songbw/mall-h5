<template lang="html">
  <section class="goodsAction">
    <van-goods-action>
      <van-goods-action-mini-btn icon="cart-o" text="购物车" @click="gotoCar"/>
      <van-goods-action-big-btn text="加入购物车" @click="addGoodsCar"/>
      <van-goods-action-big-btn text="立即购买" primary @click="gotoPay"/>
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
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          this.add2Car(userInfo);
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },

      add2Car(userInfo) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let skuId = this.datas.skuid;
        let addtoCar = {
          "openId": userId,
          "skuId": skuId
        }
        this.$api.xapi({
          method: 'post',
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          this.$toast("添加购物车成功!")
        }).catch(function (error) {
          console.log(error)
        })
      },

      gotoPay() {
        this.$log("gotoPay Enter")
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
