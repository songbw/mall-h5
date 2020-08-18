<template>
  <section :style="getBoxStyle()" v-if="show">
    <div class="wrap">
      <div class='box' :style="{'background-color': decorateBgColor}">
        <van-cell v-if="datas.settings.title.textValue.length > 0" @click="gotoTargetUrl()"
          :style="{'background-color':decorateBgColor}">
          <div slot="title" class="sectionSlide-title" :style="{'text-align': datas.settings.title.textAlign}">
            <span v-if="isDailySchedule">
              {{datas.settings.title.textValue}}
            </span>
            <span v-else>
              {{titleName}}
            </span>
          </div>
          <div v-if="promotionStatus != -1">
            <div v-if="isDailySchedule" class="promotionDetail">
              <span style="color:black">{{dailyScheduleText}}</span>
              <span style="color:black"> {{dailyScheduleDetail}}</span>
              <span style="color:white;background-color: black;padding: 2px;border-radius: 3px">{{msTime.hour}}</span>
              <span style="color: black">:</span>
              <span
                style="color:white;background-color: black;padding: 2px;border-radius: 3px">{{msTime.minutes}}</span>
              <span style="color: black">:</span>
              <span
                style="color:white;background-color: black;padding: 2px;border-radius: 3px">{{msTime.seconds}}</span>
            </div>
            <div v-else>
              <v-countdown :key="activePromotion"
                v-if="promotionStatus < 5 && PromotionStartTime != 0 && PromotionEndTime !=0" class="countdownBox"
                :style="'color:blank'" @start_callback="countDownS_cb" @end_callback="countDownE_cb"
                :startTime="PromotionStartTime" :endTime="PromotionEndTime" :secondsTxt="''" backgroundColor="#000000"
                textColor="#FFFFFF" style="font-size: x-small;font-weight: lighter">
              </v-countdown>
              <div class="promotionStatusText" v-if="promotionStatus === 5">
                <span>已结束</span>
              </div>
            </div>
          </div>
        </van-cell>
        <div class="sectionSlide-banner" v-if="datas.settings.title.hasImage">
          <img v-lazy="datas.settings.title.imageUrl" @click="gotoTargetUrl() ">
        </div>
      </div>
      <div class="listBox" :style="getListStyle()">
        <div v-if="isDailySchedule" class="slidelistBox">
          <swiper :options="swiperOption" class="swiper">
            <swiper-slide class="swiper-slide" v-for="(k,index) in datas.list" @click="onGoodsClick(k)" :key="index">
              <div class="cardItem">
                <div style="width:100%">
                  <img v-lazy="k.imagePath" alt="">
                  <p class="sectionSlide-list-intro">
                    {{(k.intro != undefined && k.intro.length > 0)? k.intro : k.name}}
                  </p>
                  <div v-if="k.discount != undefined">
                    <div style="display: flex">
                      <p class="sectionSlide-list-sales-price">
                        <span>￥</span>{{parseFloat(k.discount).toFixed(2)}}
                      </p>
                      <p class="sectionSlide-list-origin-price">
                        <span>￥</span>{{k.price}}
                      </p>
                    </div>
                  </div>
                  <div v-else>
                    <p class="sectionSlide-list-sales-price">
                      <span>￥</span>{{k.price}}
                    </p>
                  </div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div v-else class="slidelistBox">
          <swiper :options="swiperOption" class="swiper">
            <swiper-slide class="swiper-slide" v-for="(k,index) in skuList" @click="onGoodsClick(k)" :key="index">
              <div class="cardItem">
                <div style="width:100%">
                  <img v-lazy="k.imagePath" alt="">
                  <p class="sectionSlide-list-intro">
                    {{(k.intro != undefined && k.intro.length > 0)? k.intro : k.name}}
                  </p>
                  <div v-if="k.discount != undefined">
                    <div style="display: flex">
                      <p class="sectionSlide-list-sales-price">
                        <span>￥</span>{{parseFloat(k.discount).toFixed(2)}}
                      </p>
                      <p class="sectionSlide-list-origin-price">
                        <span>￥</span>{{k.price}}
                      </p>
                    </div>
                  </div>
                  <div v-else>
                    <p class="sectionSlide-list-sales-price">
                      <span>￥</span>{{k.price}}
                    </p>
                  </div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import CountDown from '@/common/_vue2-countdown.vue'
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
        PromotionStartTime: 0,
        PromotionEndTime: 0,
        promotionActivityId: 0,
        promotionStatus: -1,
        decorateBgColor: '#FFFFFF',
        isDailySchedule: false,
        dailyEndTime: "",
        dailyScheduleInfo: [],
        dailyScheduleText: '',
        dailyScheduleDetail: '',
        timer: null,
        isExceedTodayMaxTime: false,
        msTime: {
          show: false,
          day: "",
          hour: "",
          minutes: "",
          seconds: "",
        },
        show: false,
        skuList: [],
        titleName: "",
        activePromotion: null,
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
    watch: {
      isDailySchedule(newValue, oldvalue) {
        if (this.timer) {
          clearInterval(this.timer)
        }
        if (newValue) {
          this.timer = setInterval(this.updateDailyScheduleText, 1000);
        }
      },
      isExceedTodayMaxTime(newValue, oldValue) {
        if (newValue) {
          this.updatePromotionInfo()
        }
      },
    },

    created() {
      this.$log("sectionListSlide Created")
      this.$log(this.datas)
      this.updatePromotionInfo();
    },

    activated() {
      this.isDailySchedule = false;
      this.updatePromotionInfo()
    },

    deactivated() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },

    methods: {
      getListStyle() {
        let skuBackgroundColor = '#FFFFFF'
        if (this.datas.settings.skuBackgroundColor != undefined)
          skuBackgroundColor = this.datas.settings.skuBackgroundColor
        let style = {
          'background-color': skuBackgroundColor
        }
        return style
      },
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
      getPromotionsStatus() {
        let ids = []
        if (this.datas.list != null && this.datas.list.length > 0) {
          this.datas.list.forEach(item => {
            ids.push(item.promotionId)
          })
        }

        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/promotion/findByIdList',
          params: {
            idList: ids.join(','),
          },
        });
      },
      async getAdaptedPromotion() {
        this.$log("getAdaptedPromotion Enter")
        if (this.datas.list != null && this.datas.list.length > 0) {
          let resp = await this.getPromotionsStatus();
          if (resp.data.code == 200) {
            let currentTime = new Date().getTime();
            let ret = resp.data.data;
            this.datas.list.forEach(item => {
              for (let i = 0; i < ret.length; i++) {
                if (ret[i].id == item.promotionId) {
                  item['status'] = ret[i].status;
                  break;
                }
              }
              item['startTime'] = new Date(this.$moment(item.startDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
              item['endTime'] = new Date(this.$moment(item.endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
              if (item['startTime'] <= currentTime) {
                if (currentTime < item['endTime']) {
                  item['actived'] = 1; //正在进行
                } else {
                  item['actived'] = 2; //已经结束
                }
              } else {
                item['actived'] = 0; //未开始
              }
            })
            this.$log(this.datas.list)
            let onGoingList = this.datas.list.filter((item) => {
              return item.actived == 1 && (item.status < 5 && item.status > 2)
            })
            if (onGoingList != null && onGoingList.length > 0) { //显示进行中最早结束的活动
              onGoingList.sort(function (a, b) {
                return a.endTime - b.endTime
              })
              return onGoingList[0]
            } else { //显示未开始最早的活动
              let unStartedList = this.datas.list.filter((item) => {
                return item.actived == 0 && (item.status < 5 && item.status > 2)
              })
              if (unStartedList != null && unStartedList.length > 0) {
                unStartedList.sort(function (a, b) {
                  return a.startTime - b.startTime
                })
                return unStartedList[0]
              }
            }
          }
        }
        return null;
      },
      updateTimer(startTime, endTime) {
        let timeDistance = endTime - startTime;
        if (timeDistance > 0) {
          this.msTime.show = true;
          this.msTime.day = Math.floor(timeDistance / 86400000);
          timeDistance -= this.msTime.day * 86400000;
          this.msTime.hour = Math.floor(timeDistance / 3600000);
          timeDistance -= this.msTime.hour * 3600000;
          this.msTime.minutes = Math.floor(timeDistance / 60000);
          timeDistance -= this.msTime.minutes * 60000;
          //是否开启秒表倒计,未完成
          //                    this.secondsFixed ? msTime.seconds = new Number(timeDistance / 1000).toFixed(2) : msTime.seconds = Math.floor( timeDistance / 1000 ).toFixed(0);
          this.msTime.seconds = Math.floor(timeDistance / 1000).toFixed(0);
          timeDistance -= this.msTime.seconds * 1000;

          if (this.msTime.hour < 10) {
            this.msTime.hour = "0" + this.msTime.hour;
          }
          if (this.msTime.minutes < 10) {
            this.msTime.minutes = "0" + this.msTime.minutes;
          }
          if (this.msTime.seconds < 10) {
            this.msTime.seconds = "0" + this.msTime.seconds;
          }
        }
      },

      getClockString(schedule) {
        let clock = schedule.substr(0, 2);
        return clock + "点场"
      },
      updateDailyScheduleText() {
        let currentTime = new Date().getTime();
        if (currentTime < this.dailyEndTime) {
          this.isExceedTodayMaxTime = false;
          if (currentTime < this.dailyScheduleInfo[0].starTime) {
            this.updateTimer(currentTime, this.dailyScheduleInfo[0].starTime - 1)

            this.dailyScheduleText = this.getClockString(this.dailyScheduleInfo[0].schedule)
            if (this.msTime.show) {
              this.dailyScheduleDetail = " 距下场 "
            }
          } else {
            let found = -1;
            for (let i = 0; i < this.dailyScheduleInfo.length - 1; i++) {
              if (currentTime >= this.dailyScheduleInfo[i].starTime &&
                currentTime < this.dailyScheduleInfo[i + 1].starTime) {
                found = i;
                break;
              }
            }
            if (found != -1) {
              this.updateTimer(currentTime, this.dailyScheduleInfo[found + 1].starTime - 1)
              this.dailyScheduleText = this.getClockString(this.dailyScheduleInfo[found].schedule)
              if (this.msTime.show) {
                this.dailyScheduleDetail = " 距下场 "
              }
            } else {
              if (currentTime > this.dailyScheduleInfo[this.dailyScheduleInfo.length - 1].starTime) {
                this.dailyScheduleText = this.getClockString(this.dailyScheduleInfo[this.dailyScheduleInfo.length - 1]
                  .schedule)
                this.updateTimer(currentTime, this.dailyEndTime - 1)
                if (this.msTime.show) {
                  this.dailyScheduleDetail = " 距结束 "
                }
              } else {}
            }
          }
        } else {
          this.isExceedTodayMaxTime = true;
        }
      },
      async updatePromotionInfo() {
        if (this.datas.settings.title.promotionDailySchedule != undefined && this.datas.settings.title
          .promotionDailySchedule) {
          let that = this
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.EQUITY_BASE_URL,
            url: '/promotion/getCurrentScheduleMpu',
            params: {
              num: 10,
            },
          }).then((response) => {
            this.$log(response.data.data.result)
            let detail = response.data.data.result
            if (detail != null) {
              this.promotionActivityId = detail.id
              this.promotionStatus = detail.status;
              if (detail.dailySchedule != undefined) {
                this.isDailySchedule = detail.dailySchedule
                this.dailyEndTime = new Date(this.$moment(detail.endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
              }
              if (this.isDailySchedule) {
                this.datas.list = [];
                detail.promotionSkus.forEach(item => {
                  let product = {
                    brand: item.brand,
                    discount: item.discount,
                    imagePath: item.image,
                    intro: item.name,
                    mpu: item.mpu,
                    name: item.name,
                    price: item.price,
                    skuid: item.skuid
                  }
                  this.datas.list.push(product)
                })
                this.$log(this.datas.list)
                detail.promotionSchedules.forEach(item => {
                  this.$log(item)
                  let info = {
                    schedule: item.schedule,
                    starTime: new Date(this.$moment(item.startTime).format('YYYY/MM/DD HH:mm:ss'))
                      .getTime(),
                  }
                  this.dailyScheduleInfo.push(info)
                })
                this.updateDailyScheduleText();
                this.show = true;
              }
            } else {
              this.show = false;
            }

          }).catch(function (error) {
            that.$log(error)
            that.show = false;
          })
        } else {
          this.activePromotion = await this.getAdaptedPromotion();
          if (this.activePromotion != null) {
            this.$log("promotion change")
            this.promotionActivityId = this.activePromotion.promotionId
            this.titleName = this.activePromotion.promotionName
            this.PromotionStartTime = this.activePromotion.startTime
            this.PromotionEndTime = this.activePromotion.endTime
            this.promotionStatus = this.activePromotion.status;
            this.skuList = this.activePromotion.skus
            this.show = true;
            this.$log("titleName:" + this.titleName)
            this.$log("promotionStatus:" + this.promotionStatus)
          }
        }
      },
      isDeepColor(hexColor) {
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
      countDownS_cb(data) {},
      countDownE_cb(data) {
        this.updatePromotionInfo()
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
        this.gotoPromotionPage(this.promotionActivityId)
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
    background-color: transparent;


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


      .slidelistBox {

        .swiper {

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

          >ul {
            display: -ms-flex;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            padding-left: 0vw;
            width: 0px;

            li {
              margin-right: .5vw;
              margin-left: .5vw;
              border-radius: 5px;
              z-index: 1;
              width: 7.2rem;

              a,
              img {
                display: block;
                width: 100%;
                height: 7.2rem;
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
