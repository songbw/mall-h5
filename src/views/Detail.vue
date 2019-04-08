<template lang="html">
  <div class="detail">
    <v-header class="header">
      <h1 slot="title">商品详情</h1>
    </v-header>
    <div class="detail-body">
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

  export default {
    components: {
      'v-swiper': Swiper,
      'v-chose': Chose,
      'v-content': Content,
      'v-baseline': Baseline,
      'v-header': Header,
      'v-action': Action,
      'v-countdown': CountDown
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
    created() {
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
          if(this.goods.promotion != undefined && this.goods.promotion.length > 0) {
            this.PromotionStartTime = new Date(this.goods.promotion[0].startDate).getTime()
            this.PromotionEndTime = new Date(this.goods.promotion[0].endDate).getTime()
           // this.PromotionStartTime = new Date('2019/04/1 18:08:00').getTime()
           // this.PromotionEndTime = new Date('2019/04/1 18:08:20').getTime()
            this.promotionType = this.goods.promotion[0].promotionType
            this.discount = this.goods.promotion[0].discount
            this.promotionId = this.goods.promotion[0].id
            this.hasPromotion = true;
          }
        }
      }
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
        discount:0,
        promotionId: -1,
        defaultLocation: '南京'
      }
    },
    methods: {
      countDownS_cb(data) {
        //this.$log("Start #################")
      },
      countDownE_cb (data) {
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
      width:100%;
      line-height:10vw;
      position:fixed;
      z-index:1;
      top:0;
      text-align:center;
    }
    .detail-body{
      margin-top: 11vw;
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
        margin-top: 5px;
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
