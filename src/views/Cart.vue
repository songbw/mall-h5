<template lang="html">
  <div class="car">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">购物车</h1>
    </v-header>

    <div class="cartBody">
      <div class="box" :style="{'padding-top':showHeader? '3em':'1em'}" v-if="finished"></div>
      <van-list v-model="loading"
                :finished="finished"
                @load="onLoad"
                loading-text="正在加载..."
                style="list-style: none;background-color: #f8f8f8;">
      </van-list>
      <div v-if="finished">
        <div class="emptyCart" v-if="dataLoaded && cartList.length === 0">
          <div class="nothingInCar">
            <img :src="nothingInCar_bg"/>
            <span>您的购物车还没有商品，快去挑选吧</span>
            <van-button round type="danger" style="width:35%;font-size: medium" @click="gotoCategoryPage()">去逛逛
            </van-button>
          </div>
        </div>
        <div v-else>
          <div class="carlist">
            <div class="prodInCart" v-for="(k,index) in cartList" :key="index">
              <van-swipe-cell :right-width="60">
                <div style="display: flex;justify-content: left;background-color: #ffffff">
                  <div v-if="k.valid"
                       style="width: 8%;display: flex;flex-direction: column;justify-content: center; margin-left: 1em;">
                    <van-checkbox
                      v-model="k.baseInfo.choosed"
                      checked-color="#FF4444"
                      @change="singleChecked(index,k)">
                    </van-checkbox>
                  </div>
                  <div v-else
                       style="width: 8%;display: flex;flex-direction: column;justify-content: center; margin-left: 1em;">
                    <van-checkbox
                      disabled
                      v-model="k.baseInfo.choosed"
                      checked-color="#FF4444"
                      @change="singleChecked(index,k)">
                    </van-checkbox>
                  </div>
                  <div style="width: 92%; display: flex;flex-direction: column;justify-content: center;">
                    <div class="promotionBox"
                         v-if="k.promotionInfo.promotion!= undefined && k.promotionInfo.promotionState != -1">
                      <span class="promotionTitle">{{k.promotionInfo.promotion[0].tag}}</span>
                      <v-countdown :key="k" class="promotionCountDown"
                                   @start_callback="countDownS_cb(index,k)"
                                   @end_callback="countDownE_cb(index,k)"
                                   :startTime="getDateTime(k.promotionInfo.promotion[0].startDate)"
                                   :endTime="getDateTime(k.promotionInfo.promotion[0].endDate)"
                                   :secondsTxt="''">
                      </v-countdown>
                    </div>
                    <div class="goodsValid" v-if="k.valid">
                      <van-card
                        :desc="addressCode.cityName != undefined ? addressCode.cityName: '南京'"
                        :price="k.goodsInfo.dprice"
                        :title="k.goodsInfo.name"
                        :thumb="k.goodsInfo.image"
                        @click="gotoDetailPage(k)">
                        <div slot="footer" @click.stop="">
                          <van-stepper v-model="k.baseInfo.count" @click.stop="" @change="onCountChange(k)"/>
                        </div>
                      </van-card>
                    </div>
                    <div class="goodsInvalid" v-else>
                      <van-card
                        desc="无货"
                        :price="k.goodsInfo.dprice"
                        :title="k.goodsInfo.name"
                        :thumb="k.goodsInfo.image"
                        @click="gotoDetailPage(k)">
                        <div slot="footer" @click.stop="">
                          <van-stepper v-model="k.baseInfo.count" @click.stop="" disabled @change="onCountChange(k)"/>
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
  import {configWechat} from '@/util/wechat'
  import wx from 'weixin-js-sdk'

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
        this.$store.state.appconf.cartList.forEach(item => {
          this.$log(item)
          if (item.baseInfo.merchantId === 2) {
            item['valid'] = true;
            for (let i = 0; i < this.inventoryListOfAoyi.length; i++) {
              if (this.inventoryListOfAoyi[i].state == 0 && this.inventoryListOfAoyi[i].skuId === item.baseInfo.skuId) {
                item['valid'] = false;
                item.baseInfo.choosed = false;
                break;
              }
            }
          } else {
            item['valid'] = true;
            for (let i = 0; i < this.inventoryListOfZy.length; i++) {
              if (this.inventoryListOfZy[i].state == 0 && this.inventoryListOfZy[i].mpu === item.baseInfo.mpu) {
                item['valid'] = false;
                item.baseInfo.choosed = false;
                break;
              }
            }
          }
        })
        this.$log(this.$store.state.appconf.cartList)
        return this.$store.state.appconf.cartList
      },
    },

    data() {
      return {
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        inventoryListOfAoyi: [],
        inventoryListOfZy: [],
        loading: false,
        finished: false,
        nothingInCar_bg: require('@/assets/icons/ico_empty_cart.png'),
        launchedLoading: false,
        showHeader: true,
        dataLoaded: false,
        addressCode: {
          "provinceName": "江苏省",
          "provinceId": "100",
          "cityName": "无锡市",
          "cityId": "510",
          "countyName": "崇安区",
          "countyId": "01"
        }
      }
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
      this.wechatShareConfig()
      setTimeout(() => {
        this.$log("setTimeout launchedLoading:" + this.launchedLoading)
        if (!this.launchedLoading) {
          this.onLoad()
        }
      }, 1000);
    },

    methods: {
      wechatShareConfig() {
        this.$log('shareConfig Enter')
        if(this.$api.APP_ID === '01') {
          try{
            configWechat(this, () => {
              wx.hideOptionMenu()
            })
          } catch (e) {
          }
        }
      },
      gotoDetailPage(sku){
        this.$router.push({path:"/detail",query:{
            mpu:sku.baseInfo.mpu
          }});
      },
      updateAoyiInventory(skus) {
        this.$log(this.addressCode)
        let options = {
          "cityId": this.addressCode.cityId,
          "countyId": this.addressCode.countyId,
          "skus": skus,
        }
        this.$log("updateAoyiInventory options:" + JSON.stringify(options));
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.PRODUCT_BASE_URL,
          url: '/prod/inventory',
          data: options,
        })
      },
      updateOtherInventory(skus) {
        let options = {
          "inventories": skus
        }
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.PRODUCT_BASE_URL,
          url: '/prod/inventory/self',
          data: options,
        })
      },

      async updateInventorList(list) {
        this.$log("updateInventorList Enter")
        let addressList = this.$store.state.appconf.addressList;
        let address = this.addressCode;
        this.$log(this.$store.state.appconf.addressList)
        if (addressList == null || addressList == undefined || addressList.length == 0 ) {
          let resp = await this.getAddressList()
          if (resp != null || resp != undefined) {
            addressList = resp.data.data.result.list
          }
        }
        let id = this.$store.state.appconf.usedAddressId;
        if(id == undefined)
        {
          id = -1
        }
        try {
          if (id == -1) {
            if (addressList != undefined && addressList.length > 0) {
              for (let i = 0; i < addressList.length; i++) {
                if (addressList[i].status == 1) {
                  id = addressList[i].id;
                  address = addressList[i]
                  break;
                }
              }
              if ( id == -1) {
                id = addressList[0].id;
                address = addressList[0]
              }
            }
          } else {
            let found = -1;
            for (let i = 0; i < addressList.length; i++) {
              if (id == addressList[i].id) {
                found = i;
                break;
              }
            }
            if (found != -1) {
              address = addressList[found]
            } else {
              id = addressList[0].id
              address = addressList[0]
            }
          }
        } catch (e) {
        }
        this.addressCode = address
        this.$log(this.addressCode)

        let inventorySkus = [];
        let inventorySkusOfZy = [];
        list.forEach(item => {
          this.$log(item)
          if (item.merchantId == 2) {
            inventorySkus.push({"skuId": item.mpu, "remainNum": item.count,"price":item.price})
          } else {
            inventorySkusOfZy.push({"mpu": item.mpu, "remainNum": item.count})
          }
        })

        if (inventorySkus.length > 0) {
          let resp = await this.updateAoyiInventory(inventorySkus)
          this.inventoryListOfAoyi = resp.data.data.result
          // this.$log(this.inventoryListOfAoyi)
        }
        if (inventorySkusOfZy.length > 0) {
          let resp = await this.updateOtherInventory(inventorySkusOfZy)
          this.inventoryListOfZy = resp.data.data.result
          this.$log(this.inventoryListOfZy)
        }
      },

      getAddressList() {
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          let options = {
            "openId": user.userId,
            "pageNo": 1,
            "pageSize": "20",
          }
          return this.$api.xapi({
            method: 'post',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/receiver/all',
            data: options,
          })
        } else {
          //{"provinceId": "100", "cityId": "510", "countyId": "06"}
          return null
        }

      },


      getDateTime(time) {
        return new Date(this.$moment(time).format('YYYY/MM/DD HH:mm:ss')).getTime()
      },
      gotoCategoryPage() {
        this.$router.replace({'name': '分类页'})
      },
      composeGoodsTitle(goods) {
        return (goods.brand == null ? '' : goods.brand) + ' ' + goods.name + ' ' + (goods.model == null ? '' : goods.model)
      },
      countDownS_cb(index, k) {
        k.promotionInfo.promotionState = Util.getPromotionState(this,k)
        Util.updateCartItem(this, k);
      },
      countDownE_cb(index, k) {
        k.promotionInfo.promotionState = Util.getPromotionState(this,k)
        let len = k.promotionInfo.promotion.length;
        k.promotionInfo.promotion.splice(0, len);
        Util.updateCartItem(this, k);
      },


      onDeleteBtnClick(k, index) {
        Util.deletCartItem(this, k)
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
        Util.updateCartItem(this, k);
        let options = {
          "id": k.baseInfo.cartId,
          "count": k.baseInfo.count,
          "mpu": k.baseInfo.mpu
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

      async loadCartListBy(user) {
        let userInfo = JSON.parse(user);
        let that = this
        if (this.total == -1 || this.total > this.list.length) {
          let options = {
            "openId": userInfo.userId,
            "pageNo": this.pageNo++,
            "pageSize": 100
          }
          this.$api.xapi({
            method: 'post',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/cart/all',
            data: options,
          }).then(async (response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            this.$log("load from network car list object is:");
            this.$log(this.result.object)
            if (this.result.object.cart === undefined || this.result.object.cart.length === 0) {
              this.loading = false;
              this.finished = true;
              this.dataLoaded = true;
            } else {
              let cartList = this.result.object.cart
              let couponsAndProms = this.result.object.couponProm
              //let couponList = this.result.object.
              let res = await this.updateInventorList(cartList)
              this.result.object.cart.forEach(item => {
                this.list.push(item);
                this.upDateSkuInfo(item, couponsAndProms, userInfo)
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
            that.$log(error)
            that.loading = false;
            that.finished = true;
            that.dataLoaded = true;
          })
        } else {
          //load finished
          this.loading = false;
          if (!this.finished) {
            this.finished = true;
          }
        }
      },

      onLoad() {
        this.launchedLoading = true;
        this.$log("launchedLoading:" + this.launchedLoading)
        // let userInfo=this.$jsbridge.call("getUserInfo");
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          this.loadCartListBy(userInfo);
        } else {
          this.getCarListWithoutUser();
        }
      },

      getCarListWithoutUser() {
        this.loading = false;
        this.finished = true;
        this.dataLoaded = true;
      },


      upDateSkuInfo(item, couponAndProms, user) {
        this.$log(item)
        let cartItem = Util.getCartItem(this, user.userId, item.mpu)
        this.$log(cartItem)
        if (cartItem == null) {
          let baseInfo = {
            "userId": user.userId,
            "skuId": item.skuid,
            "mpu": item.mpu,
            "merchantId": item.merchantId,
            "count": item.count,
            "choosed": false,
            "cartId": item.id
          }
          let goodsInfo = {
            "id": item.id,
            "skuId": item.skuid,
            "mpu": item.mpu,
            "merchantId": item.merchantId,
            "image": item.image,
            "category": item.category,
            "name": item.name,
            "brand": item.brand,
            "model": item.model,
            "price": item.price,
            "state": item.state,
            "type":  item.type == undefined? 0:item.type
          }
          let couponList = []
          let promotion = []
          if (couponAndProms != null) {
            for (let i = 0; i < couponAndProms.length; i++) {
              if (couponAndProms[i].mpu == item.mpu) {
                couponList = couponAndProms[i].coupons
                promotion = couponAndProms[i].promotions
                break;
              }
            }
          }
          let promotionInfo = {
            "promotion": promotion,
            "promotionState": Util.getPromotionState(this,{promotion: promotion})
          }
          cartItem = {
            "baseInfo": baseInfo,
            "goodsInfo": goodsInfo,
            "couponList": couponList,
            "promotionInfo": promotionInfo,
          }
        } else {
          cartItem.baseInfo.count = item.count
          cartItem.baseInfo.cartId = item.id
          cartItem.baseInfo.merchantId = item.merchantId
          cartItem.goodsInfo.merchantId = item.merchantId
          cartItem.goodsInfo.price = item.price
          cartItem.goodsInfo.type =  (item.type == undefined? 0:item.type)
          let couponList = []
          let promotion = []
          if (couponAndProms != null) {
            for (let i = 0; i < couponAndProms.length; i++) {
              if (couponAndProms[i].mpu == item.mpu) {
                couponList = couponAndProms[i].coupons
                promotion = couponAndProms[i].promotions
                break;
              }
            }
          }
          let promotionInfo = {
            "promotion": promotion,
            "promotionState": Util.getPromotionState(this,{promotion: promotion})
          }
          cartItem.couponList = couponList
          cartItem.promotionInfo = promotionInfo
        }
        Util.updateCartItem(this, cartItem)
      },


      singleChecked(index, k) {
        Util.updateCartItem(this, k)
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
      background-color: #ff4444;
      overflow: hidden;
    }

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .cartBody {
      .emptyCart {
        display: flex;
        position: fixed;
        width: 100%;
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

          .goodsValid {
            .van-card {
              background-color: #ffffff;
              margin-top: 10px;

              &__price {
                margin-top: 0.5em;
                .fz(font-size, 35);
              }
            }
          }

          .goodsInvalid {
            .van-card {
              background-color: #ffffff;
              margin-top: 10px;

              &__price {
                margin-top: 0.5em;
                .fz(font-size, 35);
                color: #515151;
              }

              &__desc {
                color: #ff4444;
              }
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
