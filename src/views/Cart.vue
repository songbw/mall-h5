<template lang="html">
  <div class="car">
    <v-header class="header"  v-if="showHeader">
      <h1 slot="title">购物车</h1>
    </v-header>

    <div class="cartBody">
      <div class="box" :style="{'padding-top':showHeader? '3em':'1em'}"></div>
      <van-list v-model="loading" :finished="finished" @load="onLoad" style="list-style: none">
      </van-list>
      <div v-if="finished">
        <div class="emptyCart" v-if="dataLoaded && cartList.length === 0">
          <div class="nothingInCar">
            <img :src="nothingInCar_bg"/>
            <span>您的购物车还没有商品，快去挑选吧</span>
            <van-button round type="danger" style="width:35%;font-size: medium" @click="gotoCategoryPage()">去逛逛</van-button>
          </div>
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
                      checked-color="#FF4444"
                      @change="singleChecked(index,k)">
                    </van-checkbox>
                  </div>
                  <div style="width: 92%; display: flex;flex-direction: column;justify-content: center;">
                    <div class="promotionBox" v-if="k.promotionInfo.promotion!= undefined && k.promotionInfo.promotionState != -1">
                      <span class="promotionTitle">{{k.promotionInfo.promotion[0].tag}}</span>
                      <v-countdown class="promotionCountDown"
                                   @start_callback="countDownS_cb(index,k)"
                                   @end_callback="countDownE_cb(index,k)"
                                   :startTime="getDateTime(k.promotionInfo.promotion[0].startDate)"
                                   :endTime="getDateTime(k.promotionInfo.promotion[0].endDate)"
                                   :secondsTxt="''">
                      </v-countdown>
                    </div>
                    <div>
                      <van-card
                        desc="南京"
                        :price="k.goodsInfo.dprice"
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
            <v-cartfooter class="cartfooter"/>
          </div>
        </div>
      </div>
    </div>

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
    },

    data() {
      return {
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        loading: false,
        finished: false,
        nothingInCar_bg: require('@/assets/icons/ico_empty_cart.png'),
        launchedLoading: false,
        showHeader: true,
        dataLoaded: false,
      }
    },

    created() {
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
      setTimeout(() => {
        this.$log("setTimeout launchedLoading:" + this.launchedLoading)
        if (!this.launchedLoading) {
          this.onLoad()
        }
      }, 1000);
    },

    methods: {
      getDateTime(time) {
        return   new Date(this.$moment(time).format('YYYY/MM/DD HH:mm:ss')).getTime()
      },
      gotoCategoryPage(){
        this.$router.replace({'name': '分类页'})
      },
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

      onDeleteBtnClick(k,index) {
        Util.deletCartItem(this,k)
        let that = this;
        this.$api.xapi({
          method: 'delete',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          params: {
            id: k.baseInfo.cartId,
          }
        }).then((response) => {
          that.$log("onDeleteBtnClick success")
        }).catch(function (error) {
          that.$log(error)
        })
      },

      onCountChange(k) {
        Util.updateCartItem(this,  k);
        let options = {
          "id": k.baseInfo.cartId,
          "count": k.baseInfo.count
        }
        this.$api.xapi({
          method: 'put',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart/num',
          data: options,
        }).then((response) => {
        }).catch(function (error) {
          console.log(error)
        })
      },

      loadCartListBy(user) {
        let userInfo = JSON.parse(user);
        let that = this
        if (this.total == -1 || this.total > this.list.length) {
          let options = {
            "openId": userInfo.userId,
            "pageNo": this.pageNo++,
            "pageSize": 80
          }
          this.$api.xapi({
            method: 'post',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/cart/all',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            this.$log("load from network car list is:" + JSON.stringify(this.result.list));
            if (this.result.list === undefined || this.result.list.length === 0) {
             // this.$store.commit('SET_SELECTED_CARLIST', []);
              this.loading = false;
              this.finished = true;
              this.dataLoaded = true;
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
                this.dataLoaded = true;
              }, 1000);
            }
          }).catch(function (error) {
            console.log(error)
            that.loading = false;
            that.finished = true;
          })
        } else {
          //load finished
          this.loading = false;
          if( !this.finished ) {
            this.finished = true;
          }
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
        this.loading = false;
        this.finished = true;
      },


      updateCarList(item,product,user) {
       // this.carList = this.$store.state.appconf.cartList;
       // let goods = Object();
        this.$log(item)
        this.$log(product)
        let cartItem = Util.getCartItem(this, user.userId, item.mpu)
        if (cartItem == null) {
          let baseInfo = {
            "userId": user.userId,
            "skuId": product.skuid,
            "mpu": product.mpu,
            "merchantId": product.merchantId,
            "count": item.count,
            "choosed": false,
            "cartId": item.id
          }
          let goodsInfo = {
            "id": product.id,
            "skuId": product.skuid,
            "mpu": product.mpu,
            "merchantId": product.merchantId,
            "image": product.image,
            "category": product.category,
            "name": product.name,
            "brand": product.brand,
            "model": product.model,
            "price": product.price,
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
          cartItem.baseInfo.cartId =  item.id
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
        this.$log(item)
        this.$api.xapi({
          method: 'get',
          baseURL: this.$api.PRODUCT_BASE_URL,
          url: '/prod',
          params: {
            mpu: item.mpu,
          }
        }).then((res) => {
          if(res.data != null) {
            let product = res.data.data.result;
            if (product != null) {
              this.updateCarList(item,product,user)
              this.dataLoaded = true
            } else {
              this.$log("product:" + JSON.stringify(product) + ",mpu:" + item.mpu)
            }
          }
        }).catch((error) => {
          console.log(error)
          this.dataLoaded = true
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
    top: 0px;
    background-color: #f8f8f8;

    .box {
           padding-top: 3em;
           position: relative;
           width: 100%;
           line-height: 15vw;
           background-color: #ff4444;
    }
    .box:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -60px;
      content: ' ';
      height: 60px;
      width: 100%;
      border-radius: 0 0 30% 30%;
      background-color:  #ff4444;
      overflow: hidden;
    }

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .cartBody {
      .emptyCart{
        display: flex;
        position: fixed;
        width:100%;
        height: 82%;
        justify-content: center;
        justify-items: center;
        .nothingInCar {
          width: 96%;
          background-color: white;
          border-radius: 5px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;
          img {
            height: 150px;
          }

          span {
            margin: 1vw 0vw 5vw 0vw;
            .fz(font-size, 32);
          }
        }
      }

      .van-list {
        background-color: #ffffff;
      }

      .carlist {
        padding-bottom: 8rem;
        justify-content: center;
        justify-items: center;
        background-color: #f8f8f8;
        .prodInCart {
          margin: 10px;

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
