<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}">
    <div class="wrap">
      <div class='box' :style="{'background-color': decorateBgColor}">
        <van-cell v-if="datas.settings.title.textValue.length" @click="gotoTargetUrl()"
                  :style="{'background-color':decorateBgColor}">
          <div slot="title" class="sectionSlide-title" :style="{'text-align': datas.settings.title.textAlign}">
            <span style="color:white">
               {{datas.settings.title.textValue}}
            </span>
          </div>

          <div v-if="datas.settings.title.hasPromotionActivity && PromotionStatus != -1">
            <div v-if="isDailySchedule">
              <span :style="isDeepColor(decorateBgColor)? 'color:white':'color:blank'">{{dailyScheduleText}}</span>
            </div>
            <div v-else>
              <v-countdown v-if="promotionStatus.status < 5 && PromotionStartTime != 0 && PromotionEndTime !=0"
                           class="countdownBox"
                           :style="isDeepColor(decorateBgColor)? 'color:white':'color:blank'"
                           @start_callback="countDownS_cb"
                           @end_callback="countDownE_cb"
                           :startTime="PromotionStartTime"
                           :endTime="PromotionEndTime"
                           :secondsTxt="''"
                           backgroundColor="#FFFFFF"
                           textColor="#FF4444">
              </v-countdown>
              <div class="promotionStatusText" v-if="promotionStatus.status === 5">
                <span style="color: white">已结束</span>
              </div>
            </div>
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
              <div v-if="k.discount != undefined">
                <div style="display: flex">
                  <p class="sectionSlide-list-sales-price">
                    <span>￥</span>{{k.price-k.discount}}
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
        promotionStatus: -1,
        decorateBgColor: '#FF4444',
        isDailySchedule: false,
        dailyEndTime: "",
        dailyScheduleInfo: [],
        dailyScheduleText: '',
        timer: null,
        isExceedTodayMaxTime: false,
        msTime: {
          show: false,
          day: "",
          hour: "",
          minutes: "",
          seconds: "",
        },
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
      isExceedTodayMaxTime(newValue,oldValue) {
         if(newValue) {
           this.updatePromotionInfo()
         }
      },
    },

      created() {
        if (this.datas.settings.title.hasPromotionActivity) {
          this.PromotionStartTime = new Date(this.datas.settings.title.promotionActivityStartDate.replace(/-/g, '/')).getTime()
          this.PromotionEndTime = new Date(this.datas.settings.title.promotionActivityEndDate.replace(/-/g, '/')).getTime()
          this.promotionActivityId = this.datas.settings.title.promotionActivityId
          this.updatePromotionInfo();
        }

      },

      activated() {
        if (this.datas.settings.title.hasPromotionActivity) {
          this.isDailySchedule = false;
          this.updatePromotionInfo()
        }
      },

      deactivated() {
        if (this.timer) {
          clearInterval(this.timer)
        }
      },

      methods: {
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

        updateDailyScheduleText() {
          let currentTime = new Date().getTime();
          if( currentTime < this.dailyEndTime) {
            this.isExceedTodayMaxTime = false;
            if (currentTime < this.dailyScheduleInfo[0].starTime) {
              this.updateTimer(currentTime, this.dailyScheduleInfo[0].starTime)
              this.dailyScheduleText = this.dailyScheduleInfo[0].schedule + "场"
              if( this.msTime.show) {
                this.dailyScheduleText += " 据下场 "+this.msTime.hour+":"+this.msTime.minutes+":"+this.msTime.seconds
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
                this.updateTimer(currentTime, this.dailyScheduleInfo[found+1].starTime)
                this.dailyScheduleText = this.dailyScheduleInfo[found].schedule + "场"
                if( this.msTime.show) {
                  this.dailyScheduleText += " 据下场 "+this.msTime.hour+":"+this.msTime.minutes+":"+this.msTime.seconds
                }
              } else {
                if (currentTime > this.dailyScheduleInfo[this.dailyScheduleInfo.length]) {
                  this.dailyScheduleText = this.dailyScheduleInfo[this.dailyScheduleInfo.length].schedule + "场正在疯抢"
                } else {
                }
              }
            }
          } else {
            this.isExceedTodayMaxTime = true;
          }
        },
        updatePromotionInfo() {
          if (this.promotionActivityId > 0) {
            let that = this
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.EQUITY_BASE_URL,
              url: '/promotion/findPromotion',
              params: {
                id: this.promotionActivityId,
              },
            }).then((response) => {
              this.$log(response.data.data.result)
              let detail = response.data.data.result
              if (detail.dailySchedule != undefined) {
                this.isDailySchedule = detail.dailySchedule
                this.dailyEndTime =  new Date(this.$moment(detail.endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
              }
              if (this.isDailySchedule) {
                // this.dailyScheduleInfo = detail.promotionSchedules
                detail.promotionSchedules.forEach(item => {
                  this.$log(item)
                  let info = {
                    schedule: item.schedule,
                    starTime: new Date(this.$moment(item.startTime).format('YYYY/MM/DD HH:mm:ss')).getTime(),
                  }
                  this.dailyScheduleInfo.push(info)
                })
                this.updateDailyScheduleText();
              } else {
                this.PromotionStartTime = new Date(detail.startDate.replace(/-/g, '/')).getTime()
                this.PromotionEndTime = new Date(detail.endDate.replace(/-/g, '/')).getTime()
              }
              this.PromotionStatus = detail.status;
            }).catch(function (error) {
              that.$log(error)
            })
          }
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
        gotoGoodsPage(mpu) {
          try {
            //获取goods信息，update current googds
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.PRODUCT_BASE_URL,
              url: '/prod',
              params: {
                mpu: mpu,
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
          let mpu = goods.mpu
          if (mpu == null) {
            mpu = goods.skuid;
          }
          try {
            //获取goods信息，update current googds
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.PRODUCT_BASE_URL,
              url: '/prod',
              params: {
                mpu: mpu,
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
              margin: 6px 2px 2px 2px;
              color: #707070;
              .fz(font-size, 20);
              text-decoration: line-through;

              span {
                .fz(font-size, 15);
              }
            }

            p.sectionSlide-list-sales-price {
              margin: 2px;
              color: #ff4444;
              .fz(font-size, 28);

              span {
                .fz(font-size, 20);
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
  }


</style>
