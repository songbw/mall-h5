<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}">
    <div class="wrap">
      <div class='box' :style="{'background-color': decorateBgColor}">
        <van-cell v-if="datas.settings.title.textValue.length" @click="gotoTargetUrl()"
                  :style="{'background-color':decorateBgColor}">
          <div slot="title" class="sectionSlide-title" :style="{'text-align': datas.settings.title.textAlign}">
            <span :style="isDeepColor(decorateBgColor)? 'color:white':'color:blank'">
               {{datas.settings.title.textValue}}
            </span>
          </div>
          <div v-if="datas.settings.title.hasPromotionActivity" class="countdownBox"
               :style="isDeepColor(decorateBgColor)? 'color:white':'color:blank'">
            <v-countdown
              @start_callback="countDownS_cb"
              @end_callback="countDownE_cb"
              :startTime="PromotionStartTime"
              :endTime="PromotionEndTime"
              :secondsTxt="''">
            </v-countdown>
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
                {{k.intro}}
              </p>
              <div v-if="k.discount != undefined">
                <div style="display: flex">
                  <p class="sectionSlide-list-sales-price">
                    ￥{{k.price-k.discount}}
                  </p>
                  <p class="sectionSlide-list-origin-price">
                    ￥{{k.price}}
                  </p>
                </div>
              </div>
              <div v-else>
                <p class="sectionSlide-list-sales-price">
                  ￥{{k.price}}
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
        PromotionStartTime: 0,
        PromotionEndTime: 0,
        promotionActivityId: 0,
        decorateBgColor: '#FF4444'
      }
    },
    created() {
      if (this.datas.settings.title.hasPromotionActivity) {
        this.PromotionStartTime = new Date(this.datas.settings.title.promotionActivityStartDate).getTime() // new Date('2019/03/27 10:10:10').getTime()
        this.PromotionEndTime = new Date(this.datas.settings.title.promotionActivityEndDate).getTime() //new Date('2019/03/28 20:10:10').getTime()
        // this.PromotionStartTime = new Date('2019/04/1 17:59:10').getTime()
        // this.PromotionEndTime = new Date('2019/04/1 18:02:10').getTime()

        this.promotionActivityId = this.datas.settings.title.promotionActivityId
      }
    },
    methods: {
      isDeepColor(hexColor) {
        this.$log("isDeepColor:" + hexColor)
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
      countDownS_cb(data) {
        // this.$log("Start #################")
      },
      countDownE_cb(data) {
        // this.$log("End   #################")
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
      gotoGoodsPage(skuid) {
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.PRODUCT_BASE_URL,
            url: '/prod',
            params: {
              id: skuid,
            }
          }).then((res) => {
            this.updateCurrentGoods(res.data.data.result);
            this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {

        }
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
          } else  if (paths[0] === 'coupon_center') {
            this.$router.push({path:'/user/couponCenter'})
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
                this.gotoPromotionPage(paths[1]);
              }
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
          this.See(targetId);
        }
      },
      onGoodsClick(goods) {
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.PRODUCT_BASE_URL,
            url: '/prod',
            params: {
              id: goods.skuid,
            }
          }).then((res) => {
            this.updateCurrentGoods(res.data.data.result);
            this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {

        }
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
      background: #ff4444;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;

      .van-cell {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
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
      background: linear-gradient(#ff4444, #ffcccc);
      overflow: hidden;
    }
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
              margin: 4px;
              color: #707070;
              .fz(font-size, 25);
              text-decoration: line-through
            }

            p.sectionSlide-list-sales-price {
              margin: 2px;
              color: #ff4444;
              .fz(font-size, 30);
              font-weight: bold;
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
  }



</style>
