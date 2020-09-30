<template>
  <!--   <section
    :style="{'margin-left':datas.settings.marginX+'px',
    'margin-right':datas.settings.marginX+'px',
    'margin-bottom': datas.settings.marginBottom+'px',
    'background-color':mBackgroundColor}"> -->
  <section :style="getBoxStyle()">
    <div class="wrap">
      <div class='box' :style="{'background-color': decorateBgColor}">
        <van-cell v-if="datas.settings.title.textValue.length" @click="gotoTargetUrl()"
          :style="{'background-color':decorateBgColor}">
          <div slot="title" class="sectionSlide-title" :style="{'text-align': datas.settings.title.textAlign}">
            <span>
              {{datas.settings.title.textValue}}
            </span>
          </div>
          <div slot="default" v-if="datas.settings.title.textAlign =='left'">
            <span
              v-if="datas.settings.title.textLinkValue != undefined && datas.settings.title.textLinkValue.length > 0">
              {{datas.settings.title.textLinkValue}}
            </span>
          </div>
        </van-cell>
        <div class="sectionSlide-banner" v-if="datas.settings.title.hasImage">
          <img v-lazy="datas.settings.title.imageUrl" @click="gotoTargetUrl() ">
        </div>
      </div>
      <div class="listBox" :style="getListStyle()">
        <swiper :options="swiperOption" class="swiper">
          <swiper-slide class="swiper-slide" v-for="(k,index) in datas.list" :key="index">
            <div class="cardItem" @click="onGoodsClick(k)">
              <div style="width:100%">
                <img v-lazy="k.imagePath" alt="">
                <p class="sectionSlide-list-intro">
                  {{(k.intro != undefined && k.intro.length > 0)? k.intro : k.name}}
                </p>
                <div>
                  <p class="sectionSlide-list-sales-price">
                    <span>￥</span>{{(k.discount != undefined?parseFloat(k.discount).toFixed(2):k.price)}}
                  </p>
                </div>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script>
  import CountDown from '@/common/_vue2-countdown.vue'
  // import style
  //import 'swiper/css/swiper.css'
  import 'swiper/swiper-bundle.css'
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'

  export default {
    components: {
      "v-countdown": CountDown
    },
    props: ['datas', 'mBackgroundColor'],

    data() {
      return {
        decorateBgColor: '#FFFFFF',
        swiperOption: {
          speed: 800, //滑动速度
          direction: "horizontal", //滑动方向
          slidesPerView: 3.1,
          slidesPerGroup: 3,
          spaceBetween: 5,
          freeModeFluid: true,
          scrollContainer: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          loop: false,
          pagination: {
            el: ".swiper-pagination",
            type: "bullets",
          },
        }
      }
    },



    created() {
      // this.$log(this.datas)
    },

    methods: {
      getBoxStyle() {
        let marginX = 0;
        if (this.datas.settings.marginX != undefined)
          marginX = this.datas.settings.marginX
        let style = {
          'margin-left': marginX + 'px',
          'margin-right': marginX + 'px',
          'margin-bottom': this.datas.settings.marginBottom + 'px',
          'background-color': this.mBackgroundColor
        }
        return style;
      },

      getListStyle() {
        let skuBackgroundColor = '#FFFFFF'
        if (this.datas.settings.skuBackgroundColor != undefined)
          skuBackgroundColor = this.datas.settings.skuBackgroundColor
        let style = {
          'background-color': skuBackgroundColor
        }
        return style
      },

      isDeepColor(hexColor) {
        // this.$log("isDeepColor:" + hexColor)
        /*        if(hexColor == undefined)
                  return false;*/
        if (hexColor.substr(0, 1) == "#") hexColor = hexColor.substring(1);
        hexColor = hexColor.toLowerCase();
        let b = new Array();
        for (let x = 0; x < 3; x++) {
          b[0] = hexColor.substr(x * 2, 2)
          b[3] = "0123456789abcdef";
          b[1] = b[0].substr(0, 1)
          b[2] = b[0].substr(1, 1)
          b[20 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2])
        }
        let grayLevel = b[20] * 0.299 + b[21] * 0.587 + b[22] * 0.114
        if (grayLevel >= 192)
          return false
        else
          return true;
      },

      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      See(e) {
        window.location.href = e
      },
      gotoPromotionPage(promotionId) {
        this.$router.push({
          path: '/category/goods/promotion/' + promotionId
        });
      },
      gotoGoodsPage(mpu) {
        this.$router.push({
          path: "/detail",
          query: {
            mpu: mpu
          }
        });
      },
      gotoTargetUrl() {
        let targetId = this.datas.settings.title.targetUrl
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({
            path: '/index/' + id
          });
        } else if (targetId.startsWith("route://")) {
          let target = targetId.substr(8);
          let paths = target.split("/");
          this.$log(paths);
          if (paths[0] === 'category') {
            this.$router.push({
              path: '/category'
            })
          } else if (paths[0] === 'coupon_center') {
            this.$router.push({
              path: '/user/couponCenter'
            })
          } else if (paths[0] === 'commodity') {
            try {
              if (paths[1] != null)
                this.gotoGoodsPage(paths[1]);
            } catch (e) {}
          } else if (paths[0] === 'promotion') {
            try {
              if (paths[1] != null) {
                //this.gotoGoodsPage(paths[1]);
                //this.$log("promotion:"+paths[1])
                //this.gotoPromotionPage(paths[1]);
                this.gotoPromotionPage(this.promotionActivityId)
              }
            } catch (e) {}
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
          this.See(targetId);
        } else {
          if (this.promotionActivityId != undefined && this.isDailySchedule) {
            this.gotoPromotionPage(this.promotionActivityId)
          }
        }
      },
      onGoodsClick(goods) {
        let mpu = goods.mpu
        if (mpu == null) {
          mpu = goods.skuid;
        }
        this.$router.push({
          path: "/detail",
          query: {
            mpu: mpu
          }
        });
      },
    }
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .wrap {
    border-radius: 10px;
    background-color: white;

    .box {
      position: relative;
      width: 100%;
      line-height: 15vw;
      background: #ffffff;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;

      .van-cell {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      .sectionSlide-title {
        .fz(font-size, 35);
        font-weight: bold;
        color: #333333;
        //text-shadow:5px 2px 6px #000
      }
    }


    .listBox {
      width: 100%;
      justify-content: center;
      height: auto;

      margin-left: auto;
      margin-right: auto;

      .swiper {
        padding: 5px;
      }


      .swiper-slide {
        .cardItem {
          border-radius: 5px;
          background: white;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;

          a,
          img {
            display: block;
            width: 100%;
            height: 7.1em;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
          }

          p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 2px;
          }

          p.sectionSlide-list-intro {
            padding-top: 1vw;
            .fz(font-size, 23);
            color: #323233;
          }

          p.sectionSlide-list-sales-price {
            margin: 2px;
            color: #ff4444;
            .fz(font-size, 25);

            span {
              .fz(font-size, 15);
            }
          }

          p.sectionSlide-list-origin-price {
            margin: 2px;
            color: #707070;
            .fz(font-size, 25);
            text-decoration: line-through;

            span {
              .fz(font-size, 15);
            }
          }

        }
      }

      /* Arrows */
      .swiper-button-prev,
      .swiper-button-next {
        position: absolute;
        top: 50%;
        width: 17px;
        height: 24px;
        z-index: 10;
        cursor: pointer;
        -moz-background-size: 17px 24px;
        -webkit-background-size: 17px 24px;
        background-size: 17px 24px;
        background-position: center;
        background-repeat: no-repeat;

        &.swiper-button-disabled {
          opacity: 0.35;
          cursor: auto;
          pointer-events: none;
        }
      }

    }

  
    .sectionSlide-banner {
      display: block;
      width: 100%;

      img {
        display: block;
        width: 100%
      }
    }

    .countdownBox {
      .fz(font-size, 22);
      color: black;
      font-weight: bold;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-break: break-all;
    }

    .promotionDetail {
      font-size: x-small;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-break: break-all;
    }
  }

</style>
