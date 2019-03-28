<template>
  <section class="sectionSlide" :style="{'margin-bottom': datas.settings.marginBottom+'px'}">
    <van-cell v-if="datas.settings.title.textValue.length" @click="gotoTargetUrl()">
      <h1 slot="title" class="sectionSlide-title" :style="{'text-align': datas.settings.title.textAlign}">
        {{datas.settings.title.textValue}}
      </h1>
      <div v-if="datas.settings.title.hasPromotionActivity" class="countdownBox">
        <v-countdown
          :start_callback="countDownS_cb(1)"
          :end_callback="countDownE_cb(1)"
          :startTime="PromotionStartTime"
          :endTime="PromotionEndTime"
          :secondsTxt="''">
        </v-countdown>
      </div>
    </van-cell>
    <div class="sectionSlide-banner" v-if="datas.settings.title.hasImage">
      <img v-lazy="datas.settings.title.imageUrl" @click="gotoTargetUrl() ">
    </div>
    <div class="sectionSlide-list">
      <ul>
        <li v-for="(k,index) in datas.list" @click="onGoodsClick(k)" :key="index">
          <img v-lazy="k.imagePath">
          <p class="sectionSlide-list-intro">
            {{k.intro}}
          </p>
          <div v-if="k.discount != undefined">
            <p class="sectionSlide-list-sales-price">
              ￥{{k.price-k.discount}}
            </p>
            <p class="sectionSlide-list-origin-price">
              ￥{{k.price}}
            </p>
          </div>
          <div v-else>
            <p class="sectionSlide-list-sales-price">
              ￥{{k.price}}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import {Lazyload} from 'mint-ui';
  import CountDown from 'vue2-countdown'

  export default {
    components: {
      "v-countdown": CountDown
    },
    props: {
      datas: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        PromotionStartTime: 0,
        PromotionEndTime: 0,
        promotionActivityId: 0
      }
    },
    created() {
      if (this.datas.settings.title.hasPromotionActivity) {
        this.PromotionStartTime =new Date(this.datas.settings.title.promotionActivityStartDate).getTime() // new Date('2019/03/27 10:10:10').getTime()
        this.PromotionEndTime = new Date(this.datas.settings.title.promotionActivityEndDate).getTime() //new Date('2019/03/28 20:10:10').getTime()
       // this.PromotionStartTime = new Date('2019/03/28 10:10:10').getTime()
       // this.PromotionEndTime = new Date('2019/03/28 20:10:10').getTime()

        this.promotionActivityId = this.datas.settings.title.promotionActivityId
      }
    },
    methods: {
      countDownS_cb: function (x) {
        //console.log(x)
      },
      countDownE_cb: function (x) {
        //console.log(x)
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
        let targetId =  this.datas.settings.title.targetUrl
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({path: '/index/' + id});
        } else if (targetId.startsWith("route://")) {
          let target = targetId.substr(8);
          let paths = target.split("/");
          this.$log(paths);
          if (paths[0] === 'category') {
            this.$router.push({path: '/category'})
          } else if (paths[0] === 'commodity') {
            try {
              if (paths[1] != null)
                this.gotoGoodsPage(paths[1]);
            } catch (e) {
            }
          } else if( paths[0] === 'promotion') {
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

  .sectionSlide-title {
    text-align: left;
    .fz(font-size, 40);
    font-weight: bold;
    position: relative;
    background-color: #ffffff;
  }

  .sectionSlide-list {
    overflow-x: auto;
    width: 100%;
    .pt();
    /*原生滑动*/
    -webkit-overflow-scrolling: touch;

    > ul {
      display: -ms-flex;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      padding: 0vw;
      width: 100%;

      li {
        margin-right: 5vw;
        width: 26vw;

        a,
        img {
          display: block;
          width: 100%;
          height: 6em;
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
          color: #707070;
          .fz(font-size, 25);
          text-decoration:line-through
        }
        p.sectionSlide-list-sales-price {
          color: #ff4444;
          .fz(font-size, 30);
          font-weight: bold;
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
  .countdownBox{
    color: black;
    font-weight: bold;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-break:break-all;
  }

</style>
