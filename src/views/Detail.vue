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
    <v-action/>
    <!--
    <v-chose/>
    <v-content/>
    <v-baseline/>
    <v-footer/>
    -->
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

  import detail from '@/http/mock.js' //模拟数据
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
      this.goods = this.$route.query.goods;
      if (!(JSON.stringify(this.goods) == "{}")) {
        console.log("goods :" + JSON.stringify(this.goods));
        let imagesUrls = this.goods.imagesUrl;
        if (imagesUrls!=null && imagesUrls.length > 0) {
          let ulsArray = imagesUrls.split(":");
          if (ulsArray.length > 0) {
            ulsArray.forEach(items => {
              this.swiperUrls.push({"imgPath": this.$api.GOODS_URL_PREFIX + items})
            })
          }
          console.log("swiperUrls:" + JSON.stringify(this.swiperUrls))

        }
        let comtentUrls = this.goods.introductionUrl;
        if (comtentUrls.length > 0) {
          let ulsArray = comtentUrls.split(":");
          if (ulsArray.length > 0) {
            ulsArray.forEach(items => {
              this.contentUrls.push({"imgPath": this.$api.GOODS_URL_PREFIX + items})
            })
          }
          console.log("contentUrls:" + JSON.stringify(this.contentUrls))

        }


      }

      // this.swiperUrls = this.goods.imagesUrl;

    },

    data() {
      return {
        goods: {},
        swiperUrls: [],
        contentUrls: []
      }
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
  }
</style>
