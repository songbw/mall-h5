<template lang="html">
  <div class="car">
    <v-header class="header"  >
      <h1 slot="title">购物车1</h1>
    </v-header>
    <div class="cartBody">
      <van-list v-model="loading" :finished="finished" @load="onLoad" style="list-style: none">
        <div class="nothingInCar" v-cloak v-if="finished && cartList.length === 0">
          <img :src="nothingInCar_bg"/>
          <span>购物车是空的，美好的生活需要您的填充！</span>
        </div>

        <div v-else>
          <div class="carlist">
            <div class="prodInCart" v-for="(k,index) in cartList" :key="index">
              <van-swipe-cell :right-width="60">
                <div style="display: flex;justify-content: left;background-color: #ffffff">
                  <div
                    style="width: 8%;display: flex;flex-direction: column;justify-content: center; margin-left: 1em;">
                    <van-checkbox
                      v-model="k.baseInfo.choosed"
                      class="checkedBox"
                      @change="singleChecked(index,k)">
                    </van-checkbox>
                  </div>
                  <div style="width: 92%; display: flex;flex-direction: column;justify-content: center;">
                    <div class="promotionBox" v-if="k.promotionInfo.promotionState != -1">
                      <span class="promotionTitle">{{k.promotionInfo.promotion[0].tag}}</span>
                      <v-countdown class="promotionCountDown"
                                   @start_callback="countDownS_cb(index,k)"
                                   @end_callback="countDownE_cb(index,k)"
                                   :startTime="new Date(k.promotionInfo.promotion[0].startDate).getTime()"
                                   :endTime="new Date(k.promotionInfo.promotion[0].endDate).getTime()"
                                   :secondsTxt="''">
                      </v-countdown>
                    </div>
                    <div v-if="k.promotionInfo.promotionState === 1">
                      <van-card
                        :price="k.goodsInfo.checkedPrice-k.promotionInfo.promotion[0].discount"
                        :title="k.goodsInfo.name"
                        :thumb="k.goodsInfo.image"
                        :origin-price="k.goodsInfo.checkedPrice">
                        <div slot="desc">
                          <span class="prodDesc">南京</span>
                        </div>
                        <div slot="footer">
                          <van-stepper v-model="k.baseInfo.count" @change="onCountChange(k)"/>
                        </div>
                      </van-card>
                    </div>
                    <div v-else>
                      <van-card
                        desc="南京"
                        :price="k.goodsInfo.checkedPrice"
                        :title="k.goodsInfo.name"
                        :thumb="k.goodsInfo.image">
                        <div slot="footer">
                          <van-stepper v-model="k.baseInfo.count" @change="onCountChange(k)"/>
                        </div>
                      </van-card>
                    </div>
                  </div>
                </div>
                <div slot="right" @click=onDeleteBtnClick(k,index) class="rightSlot">
                  <span style="margin-left: 1em">删除</span>
                </div>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <v-cartfooter class="cartfooter"/>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import CartFooter from '@/components/car/footer.vue'
  import CountDown from '@/common/_vue2-countdown.vue'
  import Util from '@/util/common'
  import Footer from '@/common/_footer.vue'

  export default {
    components: {
      'v-header': Header,
      'v-cartfooter': CartFooter,
      "v-countdown": CountDown,
      'v-footer': Footer,
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 2);
      })
    },

    computed: {
      cartList() {
         return this.$store.state.appconf.cartList
      },

      SelfList() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("10")
        });
      },

      SuningList() {
        // `this` points to the vm instance
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("20")
        });
      },

      VIPsList() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("30")
        });
      },

      TMallList() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("50")
        });
      },

      JDList() {
        // `this` points to the vm instance
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("60")
        });
      },

    },

    data() {
      return {
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        loading: false,
        finished: false,
        selStateInCarList: [],
        nothingInCar_bg: require('@/assets/images/cart.svg'),
        launchedLoading: false,
      }
    },

    created() {
      setTimeout(() => {
        this.$log("setTimeout launchedLoading:" + this.launchedLoading)
        if (!this.launchedLoading) {
          this.onLoad()
        }
      }, 1000);
    },

    methods: {
      composeGoodsTitle(goods) {
        return (goods.brand==null?'':goods.brand) + ' '+ goods.name + ' '+ (goods.model==null? '': goods.model)
      },
      countDownS_cb(index, k) {
        k.promotionInfo.promotionState = Util.getPromotionState(k)
        Util.updateCartItem(this,  k);
      },
      countDownE_cb(index, k) {
        k.promotionInfo.promotionState = Util.getPromotionState(k)
        let len = k.promotionInfo.promotion.length;
        k.promotionInfo.promotion.splice(0, len);
        Util.updateCartItem(this,  k);
      },

      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },

      onDeleteBtnClick(k, index) {
        let that = this;
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        this.selStateInCarList.splice(index, 1);
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);

        this.$api.xapi({
          method: 'delete',
          url: '/cart',
          params: {
            id: k.id,
          }
        }).then((response) => {
          that.$log("onDeleteBtnClick success")
        }).catch(function (error) {
          that.$log(error)
        })
      },

      onCountChange(k) {
        Util.updateCartItem(this,  k);
      },

      loadCartListBy(user) {
        let userInfo = JSON.parse(user);
        let that = this
        if (this.total == -1 || this.total > this.list.length) {
          let options = {
            "openId": userInfo.userId,
            "pageNo": this.pageNo++,
            "pageSize": 999
          }
          this.$api.xapi({
            method: 'post',
            url: '/cart/all',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            this.$log("load from network car list is:" + JSON.stringify(this.result.list));
            if (this.result.list === undefined || this.result.list.length === 0) {
              this.$store.commit('SET_SELECTED_CARLIST', []);
              this.loading = false;
              this.finished = true;
            } else {
              this.result.list.forEach(item => {
                this.list.push(item);
                this.getSkuInfoBy(item, userInfo);
              })
            }
            this.loading = false;
            if (this.list.length >= this.total) {
              setTimeout(() => {
                this.finished = true;
              }, 500);
            }
          }).catch(function (error) {
            console.log(error)
            that.loading = false;
            that.finished = true;
          })
        } else {
          //load finished
          this.loading = false;
          this.finished = true;
        }
      },

      onLoad() {
        this.launchedLoading = true;
        this.$log("launchedLoading:" + this.launchedLoading)
        // let userInfo=this.$jsbridge.call("getUserInfo");
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          this.loadCartListBy(userInfo);
        } else {
          this.getCarListWithoutUser();
        }
      },

      getCarListWithoutUser() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        this.loading = false;
        this.finished = true;
      },

      updateSelectedCarlist(item, product, user) {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        let choose = true;
        let found = false;
        let goods = Object();
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == item.id && this.selStateInCarList[i].userId == user.userId) {
            //sync data
            this.selStateInCarList[i].count = item.count
            this.selStateInCarList[i].skuId = item.skuId
            this.selStateInCarList[i].price = product.price
            this.selStateInCarList[i].promotion = product.promotion
            this.selStateInCarList[i].promotionState = Util.getPromotionState(product)
            goods = this.selStateInCarList[i];
            found = true;
            break;
          }
        }
        if (!found) {
          goods = {
            "userId": user.userId,
            "id": item.id,
            "image": product.image,
            "desc": this.composeGoodsTitle(product),
            "skuId": item.skuId,
            "count": item.count,
            "price": product.price,
            "choose": true,
            "isDel": 0,
            "promotion": product.promotion,
            "promotionState": Util.getPromotionState(product)
          }
          this.selStateInCarList.push(goods);
          this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
        }
        return goods;
      },

      updateCarList(item,product,user) {
       // this.carList = this.$store.state.appconf.cartList;
       // let goods = Object();
        this.$log(item)
        this.$log(product)
        let cartItem = Util.getCartItem(this, user.userId, item.skuId)
        if (cartItem == null) {
          let baseInfo = {
            "userId": user.userId,
            "skuId": item.skuId,
            "count": item.count,
            "choosed": false,
          }
          let goodsInfo = {
            "id": product.id,
            "skuId": product.skuid,
            "image": product.image,
            "category": product.category,
            "name": product.name,
            "brand": product.brand,
            "model": product.model,
            "price": product.price,
            "checkedPrice": product.price
          }
          let couponList = product.coupon
          let promotionInfo = {
            "promotion": product.promotion,
            "promotionState": Util.getPromotionState(product)
          }
          cartItem = {
            "baseInfo": baseInfo,
            "goodsInfo": goodsInfo,
            "couponList": couponList,
            "promotionInfo": promotionInfo,
          }
        } else {
          cartItem.baseInfo.count = item.count
          cartItem.couponList = product.coupon
          cartItem.promotionInfo = {
            "promotion": product.promotion,
            "promotionState": Util.getPromotionState(product)
          }
        }
        Util.updateCartItem(this, cartItem)
        return cartItem;
      },

      getSkuInfoBy(item, user) {
        this.$api.xapi({
          method: 'get',
          url: '/prod',
          params: {
            id: item.skuId,
          }
        }).then((res) => {
          let product = res.data.data.result;
          if (product != null) {
            this.updateSelectedCarlist(item, product, user)
            this.updateCarList(item,product,user)
          } else {
            this.$log("product:" + JSON.stringify(product) + ",skuId:" + item.skuId)
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      singleChecked(index, k) {
        Util.updateCartItem(this,  k)
      }
    },
  }

</script>

<style lang="less" scoped>
  @import "../assets/fz.less";

  .car {
    width: 100%;
    height: 100%;

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .cartBody {
      margin-top: 3em;
      margin-bottom: 4.2em;

      .nothingInCar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;
        background-color: #ffffff;

        img {
          margin: 4vw;
        }

        span {
          margin: 2vw;
        }
      }

      [v-cloak] {
        display: none !important;
      }

      .van-list {
        background-color: #ffffff;
      }

      .carlist {
        background-color: #f0f0f0;

        .prodInCart {
          border-bottom: 1px solid #f0f0f0;

          .van-card {
            background-color: #ffffff;
            margin-top: 10px;

            &__price {
              margin-top: 0.5em;
              .fz(font-size, 40);
            }
          }

          .van-card__footer > div {
            display: flex !important;
            align-items: center;
            float: right;
            justify-content: space-around;
            margin-top: -3em;
          }

          .promotionBox {
            display: flex;
            margin: 15px 5px 5px 15px;
            .fz(font-size, 25);

            .promotionTitle {
              color: #ff4444;
              font-weight: bold;
            }

            .promotionCountDown {
              margin-left: 10px;
              color: black;
              .fz(font-size, 25);
            }
          }

          .van-swipe-cell {
            .rightSlot {
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: 60px;
              height: 100%;
              background-color: #ff4444;
              color: #ffffff
            }
          }
        }
      }
    }

    .cartfooter {
      margin-bottom: 3em;
    }
  }
</style>
