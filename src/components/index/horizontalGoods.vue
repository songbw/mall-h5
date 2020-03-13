<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}">
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
             <span v-if="datas.settings.title.textLinkValue != undefined && datas.settings.title.textLinkValue.length > 0">
               {{datas.settings.title.textLinkValue}}
             </span>
          </div>
        </van-cell>
        <div class="sectionSlide-banner" v-if="datas.settings.title.hasImage">
          <img v-lazy="datas.settings.title.imageUrl" @click="gotoTargetUrl() ">
        </div>
      </div>
      <div class="listBox">
        <div class="sectionSlide-list">
          <ul>
            <li v-for="(k,index) in datas.list" @click="onGoodsClick(k)" :key="index">
              <img v-lazy="k.imagePath">
              <p class="sectionSlide-list-intro">
                {{(k.intro != undefined && k.intro.length > 0)? k.intro : k.name}}
              </p>
              <div>
                <p class="sectionSlide-list-sales-price">
                  <span>￥</span>{{k.price}}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import CountDown from '@/common/_vue2-countdown.vue'

  export default {
    components: {
      "v-countdown": CountDown
    },
    props: ['datas', 'mBackgroundColor'],

    data() {
      return {
        decorateBgColor: '#FFFFFF',
      }
    },
  

    created() {
      this.$log("horizontal goods enter @@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      this.$log(this.datas)
    },

    methods: {
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
        this.$router.push({path: '/category/goods/promotion/' + promotionId});
      },
      gotoGoodsPage(mpu) {
        this.$router.push({path:"/detail",query:{
            mpu:mpu
          }});
      },
      gotoTargetUrl() {
        let targetId = this.datas.settings.title.targetUrl
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({path: '/index/' + id});
        } else if (targetId.startsWith("route://")) {
          let target = targetId.substr(8);
          let paths = target.split("/");
          this.$log(paths);
          if (paths[0] === 'category') {
            this.$router.push({path: '/category'})
          } else if (paths[0] === 'coupon_center') {
            this.$router.push({path: '/user/couponCenter'})
          } else if (paths[0] === 'commodity') {
            try {
              if (paths[1] != null)
                this.gotoGoodsPage(paths[1]);
            } catch (e) {
            }
          } else if (paths[0] === 'promotion') {
            try {
              if (paths[1] != null) {
                //this.gotoGoodsPage(paths[1]);
                //this.$log("promotion:"+paths[1])
                //this.gotoPromotionPage(paths[1]);
                 this.gotoPromotionPage(this.promotionActivityId)
              }
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
          this.See(targetId);
        } else {
          if(this.promotionActivityId != undefined && this.isDailySchedule) {
              this.gotoPromotionPage(this.promotionActivityId)
          }
        }
      },
      onGoodsClick(goods) {
        let mpu = goods.mpu
        if (mpu == null) {
          mpu = goods.skuid;
        }
        this.$router.push({path:"/detail",query:{
            mpu:mpu
          }});
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
    padding-bottom: 5px;

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
      .sectionSlide-title{
        .fz(font-size,35);
        font-weight: bold;
        color: #333333;
        //text-shadow:5px 2px 6px #000
      }
    }

/*    .box:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -60px;
      content: ' ';
      height: 60px;
      width: 100%;
      border-radius: 0 0 30% 30%;
      background: linear-gradient(#ffffff, #ffcccc);
      overflow: hidden;
    }*/

    .listBox {
      width: 100%;
      justify-content: center;

      .sectionSlide-list {
        width: 100%;
        overflow-x: auto;
        padding-top: 2px;
        padding-bottom: 2px;


        /*原生滑动*/
        -webkit-overflow-scrolling: touch;

        > ul {
          display: -ms-flex;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          padding-left: 0vw;
          width: 0px;
          background-color: #3dd5c8;

          li {
            margin-right: 1vw;
            margin-left: 1vw;
            width: 27vw;
            border-radius: 10px;
            z-index: 1;

            a,
            img {
              display: block;
              width: 100%;
              height: 6.1em;
              border-top-right-radius: 10px;
              border-top-left-radius: 10px;
            }

            h2,
            p {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            h2 {
              .fz(font-size, 30);
              padding-top: 2vw;
              color: #333;
            }

            p.sectionSlide-list-intro {
              padding-top: 1vw;
              .fz(font-size, 23);
              color: #323233;
            }

            p.sectionSlide-list-origin-price {
              margin: 2px;
              color: #707070;
              .fz(font-size, 15);
              text-decoration: line-through;

              span {
                .fz(font-size, 10);
              }
            }

            p.sectionSlide-list-sales-price {
              margin: 2px;
              color: #ff4444;
              .fz(font-size, 20);

              span {
                .fz(font-size, 12);
              }
            }
          }
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

    .promotionDetail{
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
