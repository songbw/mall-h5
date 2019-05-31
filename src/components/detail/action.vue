<template lang="html">
  <section class="goodsAction">
    <van-goods-action>
      <van-goods-action-mini-btn style="color: #00a4ff" icon="chat-o"  href="javascript:void(0)" onclick="_MEIQIA('showPanel')">联系客服</van-goods-action-mini-btn>
      <van-goods-action-mini-btn style="color: #ea545d" icon="cart-o" text="购物车" @click="gotoCar"/>
      <van-goods-action-big-btn text="加入购物车" @click="addGoodsCar"/>
      <van-goods-action-big-btn text="立即购买" primary @click="gotoPay"/>
    </van-goods-action>
  </section>

</template>

<script>
  import Util from '@/util/common'

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
      onCustomerSvBtnClick(){
        this.$log("onCustomerSvBtnClick Enter")
        _MEIQIA('showPanel');
      },
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
          this.add2Car(userInfo,this.datas);
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },

      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let skuId = goods.skuid;
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
          this.$log("xxxxxxxxxxxxxxxxxxx")
          this.$log(this.result)
          this.$toast("添加到购物车成功！")
          let cartItem = Util.getCartItem(this, user.userId, goods.skuid)
          if (cartItem == null) {
            let baseInfo = {
              "userId": user.userId,
              "skuId": goods.skuid,
              "count": 1,
              "choosed": true,
              "cartId": this.result,
            }
            let goodsInfo = {
              "id": goods.id,
              "skuId": goods.skuid,
              "image": goods.image,
              "category": goods.category,
              "name": goods.name,
              "brand": goods.brand,
              "model": goods.model,
              "price": goods.price,
              "checkedPrice": goods.price
            }
            let couponList = []
            let promotionInfo = {}
            cartItem = {
              "baseInfo": baseInfo,
              "goodsInfo": goodsInfo,
              "couponList": couponList,
              "promotionInfo": promotionInfo,
            }
          } else {
            cartItem.baseInfo.count++;
            let found = -1;
            for (let i = 0; i < cartItem.couponList.length; i++) {
              if (cartItem.couponList[i].coupon.couponInfo.id == this.coupon.couponInfo.id) {
                found = i;
                break;
              }
            }
            if (found != -1) {
              cartItem.couponList.splice(found, 1)
            }
            cartItem.couponList.push(this.coupon.couponInfo)
          }
          Util.updateCartItem(this, cartItem)
        }).catch(function (error) {
          console.log(error)
        })
      },

      gotoPay() {
        this.$log("gotoPay Enter")
        this.$log(this.datas);
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          let product = {
            count: 1,
            desc: this.datas.brand + ' ' + this.datas.name + ' ' + this.datas.model,
            id: this.datas.id,
            image: this.datas.image,
            isDel: 0,
            price: this.datas.price,
            skuId: this.datas.skuid,
            userId: user.userId,
            promotion: this.datas.promotion,
            promotionState: Util.getPromotionState(this.datas)
          }
          this.$store.commit('SET_PAY_DIRECT_PRODUCT', JSON.stringify(product));
          this.$router.push({path: '/car/pay/direct'})
/*          this.$router.push({
            name: "支付页",
            params: {
              tryPayed: tryPayed
            }
          })*/

        } else {
          this.$toast("没有用户信息，请先登录再购买")
        }
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
