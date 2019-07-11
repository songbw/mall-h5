<template lang="html">
  <section>
    <van-goods-action class="goodsAction">
      <van-goods-action-mini-btn class="contactServiceBtn"
                                 text="联系客服"
                                 icon="chat-o"
                                 href="javascript:void(0)"
                                 onclick="_MEIQIA('showPanel')">
      </van-goods-action-mini-btn>
      <van-goods-action-mini-btn class="gotoCartBtn"
                                 icon="cart-o"
                                 text="购物车"
                                 @click="gotoCar">

      </van-goods-action-mini-btn>
      <van-goods-action-big-btn class="add2CartBtn" text="加入购物车" @click="addGoodsCar"/>
      <van-goods-action-big-btn class="buyDirectBtn" text="立即购买" primary @click="gotoPay"/>
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
        selStateInCarList: [],
        myCouponIcon: require('@/assets/icons/ico_mycoupon.png'),
        chCouponIcon: require('@/assets/icons/ico_changecoupon.png'),
      }
    },
    created() {

    },

    methods: {
      onCustomerSvBtnClick() {
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
            "mpu": this.datas.mpu,
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
          this.add2Car(userInfo, this.datas);
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },

      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let mpu = goods.mpu;
        let addtoCar = {
          "openId": userId,
          "mpu": mpu
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          this.$log("xxxxxxxxxxxxxxxxxxx")
          this.$log(this.result)
          this.$toast("添加到购物车成功！")
          let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
          if (cartItem == null) {
            let baseInfo = {
              "userId": user.userId,
              "skuId": goods.skuid,
              "mpu": goods.mpu,
              "count": 1,
              "choosed": true,
              "cartId": this.result,
            }
            let goodsInfo = {
              "id": goods.id,
              "skuId": goods.skuid,
              "mpu": goods.mpu,
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
          let goods = this.datas
          let baseInfo = {
            "userId": user.userId,
            "skuId": goods.skuid,
            "mpu": goods.mpu,
            "count": 1,
            "choosed": true,
            "cartId": -1,
          }
          let goodsInfo = {
            "id": goods.id,
            "skuId": goods.skuid,
            "mpu": goods.mpu,
            "image": goods.image,
            "category": goods.category,
            "name": goods.name,
            "brand": goods.brand,
            "model": goods.model,
            "price": goods.price,
          }
          let couponList = goods.coupon
          let promotionInfo = {
            "promotion": goods.promotion,
            "promotionState": Util.getPromotionState(goods)
          }
          let product = {
            "baseInfo": baseInfo,
            "goodsInfo": goodsInfo,
            "couponList": couponList,
            "promotionInfo": promotionInfo,
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

  .goodsAction {
    background-color: white;
    width: 100%;

    .contactServiceBtn {
      width: 10%;
      margin-top: 5px;
      color: black;
    }

    .gotoCartBtn {
      width: 10%;
      margin-top: 5px;
      color: black;
    }

    .add2CartBtn {
      background-color: #EA8F24;
      border-radius: 30px;
      height: 40px;
      line-height: 40px;
      margin: 8px 2px 2px 2px;
    }

    .buyDirectBtn {
      background-color: #EA3724;
      border-radius: 30px;
      height: 40px;
      line-height: 40px;
      margin: 8px 2px 2px 2px;
    }
  }


</style>
