<template lang="html">
  <div class="detail">
    <v-header class="header">
      <h1 slot="title">商品详情</h1>
    </v-header>
    <v-swiper :swiperData=swiperUrls></v-swiper>
    <div>
      <p class="price-title">￥{{this.goods.price}}</p>
      <p class="goods-disciption">{{this.goods.brand}} {{this.goods.name}}</p>
    </div>
    <v-content :contentData=contentUrls></v-content>
    <v-baseline/>
    <v-action :datas="this.goods"/>
  </div>
</template>

<script>
  import Swiper from '@/components/detail/swiper.vue'
  import Chose from '@/components/detail/chose.vue'
  import Content from '@/components/detail/content.vue'
  import Footer from '@/components/detail/footer.vue'
  import Baseline from '@/common/_baseline.vue'
  import Header from '@/common/_header.vue'
  import Action from '@/components/detail/action.vue'

  export default {
    components: {
      'v-swiper': Swiper,
      'v-chose': Chose,
      'v-content': Content,
      'v-footer': Footer,
      'v-baseline': Baseline,
      'v-header': Header,
      'v-action': Action
    },

    created() {
      if(this.$store.state.appconf.currentGoods != undefined &&  this.$store.state.appconf.currentGoods.length > 0) {
        this.goods = JSON.parse(this.$store.state.appconf.currentGoods);
        if (!(JSON.stringify(this.goods) == "{}")) {
          //console.log("created goods :" + JSON.stringify(this.goods));
          let imagesUrls = this.goods.imagesUrl;
          if (imagesUrls != null && imagesUrls.length > 0) {
            let ulsArray = imagesUrls.split(":");
            if (ulsArray.length > 0) {
              ulsArray.forEach(items => {
                if(items != null && items.length >0) {
                  this.swiperUrls.push({"imgPath": this.$api.GOODS_URL_PREFIX + items})
                }
              })
            }
            //console.log("swiperUrls:" + JSON.stringify(this.swiperUrls))
          }
          let comtentUrls = this.goods.introductionUrl;
          if (comtentUrls != null && comtentUrls.length > 0) {
            let ulsArray = comtentUrls.split(":");
            if (ulsArray.length > 0) {
              ulsArray.forEach(items => {
                if(items != null && items.length >0) {
                  this.contentUrls.push({"imgPath": this.$api.GOODS_URL_PREFIX + items})
                }
              })
            }
            //console.log("contentUrls:" + JSON.stringify(this.contentUrls))
          }
        }
      }
    },

    data() {
      return {
        goods: {},
        swiperUrls: [],
        contentUrls: []
      }
    },
    methods: {
    }
  }

</script>

<style lang="less" scoped>
  @import "../assets/fz.less";
  @import "../assets/index/style.css";

  .detail {
    width: 100%;
    padding-bottom: 14vw;

    .price-title {
      text-align: left;
      color: #f44336;
      .fz(font-size, 40);
      font-weight: bold;
      padding: 2vw;
      position: relative;
      background-color: #ffffff;
    }

    .goods-disciption {
      text-align: left;
      .fz(font-size, 30);
      color: #888888;
      padding: 2vw;
      position: relative;
      background-color: #ffffff;
    }

    #map-container {
      width: 300px;
      height: 300px;
    }
  }
</style>
