<template lang="html">
  <div class="detail">
    <v-header class="header">
      <h1 slot="title">商品详情</h1>
    </v-header>
    <div v-if="pageloading" style="padding-top: 2.3em">
      <v-loading></v-loading>
    </div>
    <div class="detail-body" v-else>
      <v-swiper :swiperData=swiperUrls></v-swiper>
      <div>
        <div class="promotion-price" v-if="hasPromotion">
          <van-col span="8" class="priceBox">
          <span class="sales-price">
            ￥{{this.goods.price-this.discount}}
          </span>
            <div>
              <span class="origin-price-title">原价</span>
              <span class="origin-price">
            ￥{{this.goods.price}}
          </span>
            </div>

          </van-col>
          <van-col span="16" class="promotionBox">
            <v-countdown
              @start_callback="countDownS_cb"
              @end_callback="countDownE_cb"
              :startTime="PromotionStartTime"
              :endTime="PromotionEndTime"
              :secondsTxt="''">
            </v-countdown>
          </van-col>
        </div>
        <p class="price-title" v-else>￥{{this.goods.price}}</p>
        <div class="goods-detail">
        <span class="goods-disciption">
          <i class="goods-area">南京</i>
          {{this.goods.brand}} {{this.goods.name}}
        </span>
        </div>
      </div>
      <div class="couponBox" v-if="this.goods.coupon !=undefined && this.goods.coupon.length > 0">
        <van-cell>
          <div slot="title">
             <span style="font-size: medium;font-weight: bold">
               领券
             </span>
          </div>
          <van-icon style="margin: 5px;" slot="right-icon" name="weapp-nav" class="custom-icon"
                    @click="showCouponSelector()"/>
        </van-cell>
        <van-actionsheet v-model="showCoupon" title="优惠券">
          <div class="avaliableCoupon">
            <div v-if="avaliableCouponList.length > 0">
              <van-cell title="可领取的券"></van-cell>
              <div v-for="couponInfo in avaliableCouponList">
                <van-cell>
                  <div slot="default" class="coupon-item">
                    <div class="coupon-title">
                      <div style="margin-top: 30px">
                        <span style="font-size: large; font-weight: bold">￥</span>
                        <span style="font-size: xx-large;font-weight: bold">{{couponInfo.rules.couponRules.fullReduceCoupon.reducePrice}}</span>
                      </div>
                      <span v-if="couponInfo.rules.couponRules.type === 0">满{{couponInfo.rules.couponRules.fullReduceCoupon.fullPrice}}可用</span>
                      <span  v-if="couponInfo.rules.couponRules.type === 1">代金券</span>
                      <span  v-if="couponInfo.rules.couponRules.type === 2">折扣券</span>
                    </div>
                    <div class="coupon-detail">
                      <div>
                        <span v-if="couponInfo.rules.scenario.type===1">仅限某些指定的商品</span>
                        <span v-if="couponInfo.rules.scenario.type===2">全场商品</span>
                        <span v-if="couponInfo.rules.scenario.type===3">仅限定某些品牌类商品</span>
                        <span v-if="couponInfo.rules.scenario.type===4">限提供所描述特定的服务</span>
                      </div>
                      <span style="font-size: small">{{formatEffectiveDateTime(couponInfo.effectiveStartDate,couponInfo.effectiveEndDate)}}</span>
                    </div>
                  </div>
                </van-cell>
              </div>
            </div>
            <div v-else>
            </div>
          </div>
          <div class="gottedCoupon">
            <div v-if="userCouponList.length > 0">
              <van-cell title="已领取的券"></van-cell>
              <div v-for="coupon in userCouponList">
                <van-cell>
                  <div slot="default" class="coupon-item">
                    <div class="coupon-title">
                      <div style="margin-top: 30px">
                        <span style="font-size: large; font-weight: bold">￥</span>
                        <span style="font-size: xx-large;font-weight: bold">{{coupon.couponInfo.rules.couponRules.fullReduceCoupon.reducePrice}}</span>
                      </div>
                      <span v-if="coupon.couponInfo.rules.couponRules.type === 0">满{{coupon.couponInfo.rules.couponRules.fullReduceCoupon.fullPrice}}可用</span>
                      <span  v-if="coupon.couponInfo.rules.couponRules.type === 1">代金券</span>
                      <span  v-if="coupon.couponInfo.rules.couponRules.type === 2">折扣券</span>
                    </div>
                    <div class="coupon-detail">
                      <div>
                        <span v-if="coupon.couponInfo.rules.scenario.type===1">仅限某些指定的商品</span>
                        <span v-if="coupon.couponInfo.rules.scenario.type===2">全场商品</span>
                        <span v-if="coupon.couponInfo.rules.scenario.type===3">仅限定某些品牌类商品</span>
                        <span v-if="coupon.couponInfo.rules.scenario.type===4">限提供所描述特定的服务</span>
                      </div>
                      <span style="font-size: small">{{formatEffectiveDateTime(coupon.couponInfo.effectiveStartDate,coupon.couponInfo.effectiveEndDate)}}</span>
                    </div>
                  </div>
                </van-cell>
              </div>
            </div>
            <div v-else>

            </div>
          </div>
        </van-actionsheet>
      </div>
      <v-content :contentData=contentUrls></v-content>
      <v-baseline/>
    </div>
    <v-action :datas="this.goods"/>
  </div>
</template>

<script>
  import Swiper from '@/components/detail/swiper.vue'
  import Chose from '@/components/detail/chose.vue'
  import Content from '@/components/detail/content.vue'
  import Baseline from '@/common/_baseline.vue'
  import Header from '@/common/_header.vue'
  import Action from '@/components/detail/action.vue'
  import CountDown from '@/common/_vue2-countdown.vue'
  import Loading from '@/common/_loading.vue'

  export default {
    components: {
      'v-swiper': Swiper,
      'v-chose': Chose,
      'v-content': Content,
      'v-baseline': Baseline,
      'v-header': Header,
      'v-action': Action,
      'v-countdown': CountDown,
      'v-loading': Loading
    },
    beforeRouteEnter(to, from, next) {
      // chrome
      document.body.scrollTop = 0
      // firefox
      document.documentElement.scrollTop = 0
      // safari
      window.pageYOffset = 0
      next()
    },

    mounted() {
      this.pageloading = true;
      let that = this;
      if (this.$store.state.appconf.currentGoods != undefined && this.$store.state.appconf.currentGoods.length > 0) {
        this.goods = JSON.parse(this.$store.state.appconf.currentGoods);
        this.$log(this.goods)
        if (!(JSON.stringify(this.goods) == "{}")) {
          let imagesUrls = this.goods.imagesUrl;
          if (imagesUrls != null && imagesUrls.length > 0) {
            let ulsArray = imagesUrls.split(":");
            if (ulsArray.length > 0) {
              ulsArray.forEach(items => {
                if (items != null && items.length > 0) {
                  this.swiperUrls.push({"imgPath": this.$api.GOODS_URL_PREFIX + items})
                }
              })
            }
          }
          let comtentUrls = this.goods.introductionUrl;
          if (comtentUrls != null && comtentUrls.length > 0) {
            let ulsArray = comtentUrls.split(":");
            if (ulsArray.length > 0) {
              ulsArray.forEach(items => {
                if (items != null && items.length > 0) {
                  this.contentUrls.push({"imgPath": this.$api.GOODS_URL_PREFIX + items})
                }
              })
            }
          }
          if (this.goods.promotion != undefined && this.goods.promotion.length > 0) {
            this.PromotionStartTime = new Date(this.goods.promotion[0].startDate).getTime()
            this.PromotionEndTime = new Date(this.goods.promotion[0].endDate).getTime()
            this.promotionType = this.goods.promotion[0].promotionType
            this.discount = this.goods.promotion[0].discount
            this.promotionId = this.goods.promotion[0].id
            this.hasPromotion = true;
          }
        }
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          this.userCouponList = []
          let user = JSON.parse(userInfo)
          if (this.goods.coupon != undefined) {
            this.goods.coupon.forEach(item => {
              this.$log(item)
              let options = {
                userOpenId: user.userId,
                couponId: item.id
              }
              that.$api.xapi({
                method: 'post',
                url: '/coupon/CouponByEquityId',
                data: options,
              }).then((response) => {
                let result = response.data.data.result;
                result.couponUseInfo.forEach(coupon => {
                  this.$log("已领券")
                  coupon["couponInfo"] = item
                  this.userCouponList.push(coupon)
                  this.$log(coupon)

                })
                if (item.rules.perLimited > result.couponUseInfo.length) {
                  this.$log("还有券可领")
                  this.avaliableCouponList.push(item);
                  this.$log(item)
                }
              }).catch(function (error) {
                that.$log(error)
              })
            })
          }
        } else {
          //no user
        }
      }
      this.pageloading = false;
    },

    data() {
      return {
        goods: {},
        swiperUrls: [],
        contentUrls: [],
        hasPromotion: false,
        PromotionStartTime: 0,
        PromotionEndTime: 0,
        promotionType: -1,
        discount: 0,
        promotionId: -1,
        defaultLocation: '南京',
        pageloading: true,
        showCoupon: false,
        radio: '',
        userCouponList: [],
        avaliableCouponList: []
      }
    },
    methods: {
      formatEffectiveDateTime(effectiveStartDate, effectiveEndDate) {
        return this.$moment(effectiveStartDate).format('YYYY.MM.DD') + ' - ' + this.$moment(effectiveEndDate).format('YYYY.MM.DD');
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },
      confirmedCouponSeletor() {
        this.$log(this.radio);
        this.showCoupon = false
      },
      showCouponSelector() {
        this.showCoupon = true
      },
      countDownS_cb(data) {
        //this.$log("Start #################")
      },
      countDownE_cb(data) {
        // this.$log("End   #################")
        this.hasPromotion = false;
      },
    }
  }

</script>

<style lang="less" scoped>
  @import "../assets/fz.less";
  @import "../assets/index/style.css";

  .detail {
    width: 100%;
    padding-bottom: 14vw;
    height: 100%;

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .detail-body {
      padding-top: 2.3em;
      background-color: #f0f0f0;

      .couponBox {
        display: flex;
        margin-top: 10px;
        //border-radius: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: white;

        .van-actionsheet {
          font-weight: bold;
        }

        .avaliableCoupon {
          display: block;
          background-color: #f0f0f0;
        }

        .gottedCoupon {
          display: block;
          background-color: #f0f0f0;
        }

        .coupon-item {
          height: 100px;
          display: flex;
          box-shadow:5px 10px  #f8f8f8;

          .coupon-title {
            width: 40%;
            display: inline-block;
            text-align: center;
            color: white;
            background-color: #1989fa;
            justify-content: center;
          }

          .coupon-detail {
            width: 60%;
            display: inline-block;
            text-align: left;
            background-color: white;
            color: black;
            padding: 10px;
          }
        }

      }

      .price-title {
        text-align: left;
        color: #f44336;
        .fz(font-size, 40);
        font-weight: bold;
        padding: 2vw;
        position: relative;
        background-color: #ffffff;
      }

      .promotion-price {
        background-color: white;
        padding-bottom: 0.1em;
        height: 4em;

        .priceBox {
          height: 100%;
          background-color: deeppink;
          text-align: left;
          color: white;
          font-weight: bold;
          display: flex;
          flex-direction: column;
          padding: 10px;

          .origin-price-title {
            padding: 2px;
            color: #c8c8cd;
            .fz(font-size, 25);
          }

          .origin-price {
            color: #c8c8cd;
            .fz(font-size, 25);
            text-decoration: line-through
          }

          .sales-price {
            .fz(font-size, 40);
            font-weight: bold;
          }
        }

        .promotionBox {
          height: 100%;
          background-color: #ee892f;
          text-align: center;
          line-height: 4em;
          color: white;
        }
      }

      .goods-detail {
        padding-left: 10px;
        padding-bottom: 10px;
        background-color: white;
        .fz(font-size, 30);

        .goods-area {
          background-color: #ff4444;
          .fz(font-size, 25);
          border-radius: 4px;
          padding: 0.2em;
          color: white;
        }

        .goods-disciption {
          color: #888888;
          background-color: white;
        }
      }

      #map-container {
        width: 300px;
        height: 300px;
      }
    }
  }
</style>
