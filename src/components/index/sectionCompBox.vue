<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}" v-if="show">
    <div class="compbox">
      <div class="left">
        <div v-if="datas.settings.left.textValue.length" @click="gotoLeftTargetUrl()" class="boxTitle">
          <div slot="title" class="titleText">
            <span>
               {{datas.settings.left.textValue}}
            </span>
          </div>
          <div v-if="datas.settings.left.hasPromotionActivity && left.PromotionStatus != -1" class="titleDetail">
            <div v-if="left.isDailySchedule" class="dailyDetail">
              <div class="dailyTitleBox">
                <span>{{left.dailyScheduleText}}</span>
              </div>
              <div class="dailyTimeBox">
                <span>{{left.msTime.hour}}</span>
                <span>:</span>
                <span>{{left.msTime.minutes}}</span>
                <span>:</span>
                <span>{{left.msTime.seconds}}</span>
              </div>
            </div>
            <div v-else style="margin-top: 2px;float: right;margin-right: 2px">
              <v-countdown v-if="left.PromotionStatus  < 5 && left.PromotionStartTime != 0 && left.PromotionEndTime !=0"
                           class="countdownBox"
                           @start_callback="countDownS_cb"
                           @end_callback="countDownE_cb"
                           :startTime="left.PromotionStartTime"
                           :endTime="left.PromotionEndTime"
                           :secondsTxt="''"
                           tipText=""
                           tipTextEnd=""
                           backgroundColor="#FF4444"
                           textColor="#FFFFFF"
                           style="font-size:10%;;font-weight: lighter">
              </v-countdown>
              <div class="promotionStatusText" v-if="left.PromotionStatus  === 5">
                <span>已结束</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sectionSlide-banner" v-if="datas.settings.left.hasImage">
          <img v-lazy="datas.settings.left.imageUrl" @click="gotoLeftTargetUrl() ">
        </div>
        <div>
          <ul class="sectionGoods-list2">
            <li v-for="(k,index) in left.list" @click="onGoodsClick(k)" :key="index">
              <img v-lazy="k.imagePath || k.image">
              <div class="goodsFooter">
                <div v-if="k.discount != undefined">
                  <div class="goodsPriceBox">
                    <p>
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{ parseFloat(k.discount).toFixed(2)}}
                    </p>
                  </div>
                  <div class="goodsPromotionPriceBox">
                    <p>
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{k.price}}
                    </p>
                  </div>
                </div>
                <div v-else>
                  <div class="goodsPriceBox">
                    <p>
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{k.price}}
                    </p>
                  </div>
                  <div style="height: .9em">
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <div v-if="datas.settings.right.textValue.length" @click="gotoRightTargetUrl()" class="boxTitle">
          <div slot="title" class="titleText">
            <span>
               {{datas.settings.right.textValue}}
            </span>
          </div>
          <div v-if="datas.settings.right.hasPromotionActivity && right.PromotionStatus != -1" class="titleDetail">
            <div v-if="right.isDailySchedule" class="dailyDetail">
              <div class="dailyTitleBox">
                <span>{{right.dailyScheduleText}}</span>
              </div>
              <div class="dailyTimeBox">
                <span>{{right.msTime.hour}}</span>
                <span>:</span>
                <span>{{right.msTime.minutes}}</span>
                <span>:</span>
                <span>{{right.msTime.seconds}}</span>
              </div>
            </div>
<!--            <div v-else style="margin-top: 2px;float: right;margin-right: 2px">
              <v-countdown v-if="right.PromotionStatus < 5 && right.PromotionStartTime != 0 && right.PromotionEndTime !=0"
                           class="countdownBox"
                           @start_callback="countDownS_cb"
                           @end_callback="countDownE_cb"
                           :startTime="right.PromotionStartTime"
                           :endTime="right.PromotionEndTime"
                           :secondsTxt="''"
                           tipText=""
                           tipTextEnd=""
                           backgroundColor="#FF4444"
                           textColor="#FFFFFF"
                           style="font-size:10%;;font-weight: lighter">
              </v-countdown>
              <div class="promotionStatusText" v-if="right.PromotionStatus === 5">
                <span>已结束</span>
              </div>
            </div>-->
          </div>
        </div>
        <div class="sectionSlide-banner" v-if="datas.settings.right.hasImage">
          <img v-lazy="datas.settings.right.imageUrl" @click="gotoLeftTargetUrl() ">
        </div>
        <div>
          <ul class="sectionGoods-list2">
            <li v-for="(k,index) in right.list" @click="onGoodsClick(k)" :key="index">
              <img v-lazy="k.imagePath || k.image">
              <div class="goodsFooter">
                <div v-if="k.discount != undefined">
                  <div class="goodsPriceBox">
                    <p>
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{parseFloat(k.discount).toFixed(2)}}
                    </p>
                  </div>
                  <div class="goodsPromotionPriceBox">
                    <p>
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{k.price}}
                    </p>
                  </div>
                </div>
                <div v-else>
                  <div class="goodsPriceBox">
                    <p>
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{k.price}}
                    </p>
                  </div>
                  <div style="height: .9em">

                  </div>
                </div>
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

    computed: {
      show() {
        this.$log("left show:"+this.left.show+",right show:"+this.right.show)
        return this.left.show && this.right.show
      },
      leftIsDailySchedule() {
        return this.left.isDailySchedule
      },
      leftIsExceedTodayMaxTime() {
        return this.left.isExceedTodayMaxTime
      },
      rightIsDailySchedule() {
        return this.right.isDailySchedule
      },
      rightIsExceedTodayMaxTime() {
        return this.right.isExceedTodayMaxTime
      }
    },

    watch: {
      leftIsDailySchedule(newValue, oldVal) {
        if (this.left.timer) {
          clearInterval(this.left.timer)
        }
        if (newValue) {
          this.left.timer = setInterval(this.updateLeftDailyScheduleText, 1000);
        }
      },
      leftIsExceedTodayMaxTime(newValue, oldValue) {
        this.$log("left.isExceedTodayMaxTime Changed，newValue:" + newValue)
        if (newValue) {
          this.updateLeftPromotionInfo()
        }
      },
      rightIsDailySchedule(newValue, oldVal) {
        if (this.right.timer) {
          clearInterval(this.right.timer)
        }
        if (newValue) {
          this.right.timer = setInterval(this.updateRightDailyScheduleText, 1000);
        }
      },
      rightIsExceedTodayMaxTime(newValue, oldValue) {
        this.$log("right.isExceedTodayMaxTime Changed，newValue:" + newValue)
        if (newValue) {
          this.updateRightPromotionInfo()
        }
      },
    },

    activated() {
      if (this.datas.settings.left.hasPromotionActivity) {
        this.left.isDailySchedule = false;
        this.updateLeftPromotionInfo()
      }
      if (this.datas.settings.right.hasPromotionActivity) {
        this.right.isDailySchedule = false;
        this.updateRightPromotionInfo()
      }
    },

    deactivated() {
      if (this.left.timer) {
        clearInterval(this.left.timer)
      }
      if (this.right.timer) {
        clearInterval(this.right.timer)
      }
    },

    data() {
      return {
        countPerLine: 2,
        left: {
          list: [],
          isDailySchedule: false,
          dailyEndTime: "",
          dailyScheduleInfo: [],
          dailyScheduleText: '',
          dailyScheduleDetail: '',
          timer: null,
          isExceedTodayMaxTime: false,
          PromotionStatus: -1,
          msTime: {
            show: false,
            day: "",
            hour: "",
            minutes: "",
            seconds: "",
          },
          show: false,
        },
        right: {
          list: [],
          isDailySchedule: false,
          dailyEndTime: "",
          dailyScheduleInfo: [],
          dailyScheduleText: '',
          dailyScheduleDetail: '',
          timer: null,
          isExceedTodayMaxTime: false,
          PromotionStatus: -1,
          msTime: {
            show: false,
            day: "",
            hour: "",
            minutes: "",
            seconds: "",
          },
          show: false,
        }
      }
    },
    created() {
      this.$log(this.datas)
      //this.$log(this.datas.list)
      this.left.list = this.datas.list.filter(function (item) {
        if (item.side === 'left')
          return item
      })
      this.right.list = this.datas.list.filter(function (item) {
        if (item.side === 'right')
          return item
      })
      this.countPerLine = this.datas.settings.countPerLine;
      this.updateLeftPromotionInfo();
      this.updateRightPromotionInfo();

    },
    methods: {
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      onGoodsClick(goods) {
        this.$log("onGoodsClick Enter")
        this.$log(goods)
        let mpu = goods.mpu
        if(mpu == null) {
          mpu = goods.skuid;
        }
        this.$router.push({path:"/detail",query:{
            mpu:mpu
          }});
/*        try {
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

        }*/
      },
      gotoPromotionPage(promotionId) {
        this.$router.push({path: '/category/goods/promotion/' + promotionId});
      },
      See(e) {
        window.location.href = e
      },
      getClockString(schedule) {
        let clock = schedule.substr(0, 2);
        return clock + "点场"
      },
      gotoLeftTargetUrl() {
        let targetId = this.left.targetUrl
        this.$log(this.datas.settings.left)
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
                this.gotoPromotionPage(this.left.promotionActivityId)
              }
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
          this.See(targetId);
        }
      },
      gotoRightTargetUrl() {
        let targetId = this.right.targetUrl
        this.$log(this.datas.settings.right)
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
                this.gotoPromotionPage(this.right.promotionActivityId)
              }
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
          this.See(targetId);
        }
      },
      updateLeftTimer(startTime, endTime) {
        let timeDistance = endTime - startTime;
        if (timeDistance > 0) {
          this.left.msTime.show = true;
          this.left.msTime.day = Math.floor(timeDistance / 86400000);
          timeDistance -= this.left.msTime.day * 86400000;
          this.left.msTime.hour = Math.floor(timeDistance / 3600000);
          timeDistance -= this.left.msTime.hour * 3600000;
          this.left.msTime.minutes = Math.floor(timeDistance / 60000);
          timeDistance -= this.left.msTime.minutes * 60000;
          this.left.msTime.seconds = Math.floor(timeDistance / 1000).toFixed(0);
          timeDistance -= this.left.msTime.seconds * 1000;

          if (this.left.msTime.hour < 10) {
            this.left.msTime.hour = "0" + this.left.msTime.hour;
          }
          if (this.left.msTime.minutes < 10) {
            this.left.msTime.minutes = "0" + this.left.msTime.minutes;
          }
          if (this.left.msTime.seconds < 10) {
            this.left.msTime.seconds = "0" + this.left.msTime.seconds;
          }
        }
      },
      updateRightTimer(startTime, endTime) {
        let timeDistance = endTime - startTime;
        if (timeDistance > 0) {
          this.right.msTime.show = true;
          this.right.msTime.day = Math.floor(timeDistance / 86400000);
          timeDistance -= this.right.msTime.day * 86400000;
          this.right.msTime.hour = Math.floor(timeDistance / 3600000);
          timeDistance -= this.right.msTime.hour * 3600000;
          this.right.msTime.minutes = Math.floor(timeDistance / 60000);
          timeDistance -= this.right.msTime.minutes * 60000;
          this.right.msTime.seconds = Math.floor(timeDistance / 1000).toFixed(0);
          timeDistance -= this.right.msTime.seconds * 1000;

          if (this.right.msTime.hour < 10) {
            this.right.msTime.hour = "0" + this.right.msTime.hour;
          }
          if (this.right.msTime.minutes < 10) {
            this.right.msTime.minutes = "0" + this.right.msTime.minutes;
          }
          if (this.right.msTime.seconds < 10) {
            this.right.msTime.seconds = "0" + this.right.msTime.seconds;
          }
        }
      },
      updateLeftDailyScheduleText() {
        let currentTime = new Date().getTime();
        if (currentTime < this.left.dailyEndTime) {
          this.left.isExceedTodayMaxTime = false;
          if (currentTime < this.left.dailyScheduleInfo[0].starTime) {
            this.updateLeftTimer(currentTime, this.left.dailyScheduleInfo[0].starTime - 1)

            this.left.dailyScheduleText = this.getClockString(this.left.dailyScheduleInfo[0].schedule)
            if (this.left.msTime.show) {
              this.left.dailyScheduleDetail = " 距下场 "
            }
          } else {
            let found = -1;
            for (let i = 0; i < this.left.dailyScheduleInfo.length - 1; i++) {
              if (currentTime >= this.left.dailyScheduleInfo[i].starTime &&
                currentTime < this.left.dailyScheduleInfo[i + 1].starTime) {
                found = i;
                break;
              }
            }
            if (found != -1) {
              this.updateLeftTimer(currentTime, this.left.dailyScheduleInfo[found + 1].starTime - 1)
              this.left.dailyScheduleText = this.getClockString(this.left.dailyScheduleInfo[found].schedule)
              if (this.left.msTime.show) {
                this.left.dailyScheduleDetail = " 距下场 "
              }
            } else {
              if (currentTime > this.left.dailyScheduleInfo[this.left.dailyScheduleInfo.length - 1].starTime) {
                this.left.dailyScheduleText = this.getClockString(this.left.dailyScheduleInfo[this.left.dailyScheduleInfo.length - 1].schedule)
                this.updateLeftTimer(currentTime, this.left.dailyEndTime - 1)
                if (this.left.msTime.show) {
                  this.left.dailyScheduleDetail = " 距结束 "
                }
              } else {
              }
            }
          }
        } else {
          this.left.isExceedTodayMaxTime = true;
        }
      },
      updateRightDailyScheduleText() {
        let currentTime = new Date().getTime();
        if (currentTime < this.right.dailyEndTime) {
          this.right.isExceedTodayMaxTime = false;
          if (currentTime < this.right.dailyScheduleInfo[0].starTime) {
            this.updateRightTimer(currentTime, this.right.dailyScheduleInfo[0].starTime - 1)

            this.right.dailyScheduleText = this.getClockString(this.right.dailyScheduleInfo[0].schedule)
            if (this.right.msTime.show) {
              this.right.dailyScheduleDetail = " 距下场 "
            }
          } else {
            let found = -1;
            for (let i = 0; i < this.right.dailyScheduleInfo.length - 1; i++) {
              if (currentTime >= this.right.dailyScheduleInfo[i].starTime &&
                currentTime < this.right.dailyScheduleInfo[i + 1].starTime) {
                found = i;
                break;
              }
            }
            if (found != -1) {
              this.updateRightTimer(currentTime, this.right.dailyScheduleInfo[found + 1].starTime - 1)
              this.right.dailyScheduleText = this.getClockString(this.right.dailyScheduleInfo[found].schedule)
              if (this.right.msTime.show) {
                this.right.dailyScheduleDetail = " 距下场 "
              }
            } else {
              if (currentTime > this.right.dailyScheduleInfo[this.right.dailyScheduleInfo.length - 1].starTime) {
                this.right.dailyScheduleText = this.getClockString(this.right.dailyScheduleInfo[this.right.dailyScheduleInfo.length - 1].schedule)
                this.updateRightTimer(currentTime, this.right.dailyEndTime - 1)
                if (this.right.msTime.show) {
                  this.right.dailyScheduleDetail = " 距结束 "
                }
              } else {
              }
            }
          }
        } else {
          this.right.isExceedTodayMaxTime = true;
        }
      },
      updateLeftPromotionInfo() {
        this.left.targetUrl = this.datas.settings.left.targetUrl
        if (this.datas.settings.left.promotionDailySchedule != undefined && this.datas.settings.left.promotionDailySchedule) {
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
              this.left.promotionActivityId = detail.id
              this.left.PromotionStatus = detail.status;
              this.$log(detail.dailySchedule)
              if (detail.dailySchedule != undefined) {
                this.left.isDailySchedule = detail.dailySchedule
                this.left.dailyEndTime = new Date(this.$moment(detail.endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
              }
              if (this.left.isDailySchedule) {
                this.left.targetUrl = "route://promotion/" + this.left.promotionActivityId
                this.left.list = [];
                if(detail.promotionSkus != null)  {
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
                    this.left.list.push(product)
                  })
                }
                this.left.dailyScheduleInfo = []
                detail.promotionSchedules.forEach(item => {
                  this.$log(item)
                  let info = {
                    schedule: item.schedule,
                    starTime: new Date(this.$moment(item.startTime).format('YYYY/MM/DD HH:mm:ss')).getTime(),
                  }
                  this.left.dailyScheduleInfo.push(info)
                })
                this.updateLeftDailyScheduleText();
                this.left.show = true;
                this.$log(this.left)
              }
            } else {
              this.left.show = false;
            }
          }).catch(function (error) {
            that.$log(error)
            that.left.show = false;
          })
        } else {
          if (this.datas.settings.left.promotionActivityId > 0) {
            let that = this
            this.left.promotionActivityId = this.datas.settings.left.promotionActivityId
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.EQUITY_BASE_URL,
              url: '/promotion/findPromotion',
              params: {
                id: this.datas.settings.left.promotionActivityId,
              },
            }).then((response) => {
              this.$log(response.data.data.result)
              let detail = response.data.data.result
              if (detail != null) {
                this.$log(detail)
                this.left.PromotionStartTime = new Date(detail.startDate.replace(/-/g, '/')).getTime()
                this.left.PromotionEndTime = new Date(detail.endDate.replace(/-/g, '/')).getTime()
                this.left.PromotionStatus = detail.status;
                if(detail.promotionSkus != null)  {
                  this.left.list = [];
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
                    this.left.list.push(product)
                  })
                }
                this.$log(this.left.PromotionStartTime)
                this.$log(this.left.PromotionEndTime)
                this.$log(this.left.PromotionStatus)
                this.left.show = true;
              } else {
                this.left.show = false;
              }
              this.$log(this.left)
            }).catch(function (error) {
              that.$log(error)
              that.left.show = false;
            })
          } else {
            if(this.left.list.length > 0) {
              this.left.show = true;
            }
          }
        }
      },
      updateRightPromotionInfo() {
        this.right.targetUrl = this.datas.settings.right.targetUrl
        if (this.datas.settings.right.promotionDailySchedule != undefined && this.datas.settings.right.promotionDailySchedule) {
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
              this.right.promotionActivityId = detail.id
              this.right.PromotionStatus = detail.status;
              this.$log(detail.dailySchedule)
              if (detail.dailySchedule != undefined) {
                this.right.isDailySchedule = detail.dailySchedule
                this.right.dailyEndTime = new Date(this.$moment(detail.endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
              }
              if (this.right.isDailySchedule) {
                this.right.targetUrl = "route://promotion/" + this.right.promotionActivityId
                this.right.list = [];
                if(detail.promotionSkus != null)  {
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
                    this.right.list.push(product)
                  })
                }
                this.right.dailyScheduleInfo = []
                detail.promotionSchedules.forEach(item => {
                  this.$log(item)
                  let info = {
                    schedule: item.schedule,
                    starTime: new Date(this.$moment(item.startTime).format('YYYY/MM/DD HH:mm:ss')).getTime(),
                  }
                  this.right.dailyScheduleInfo.push(info)
                })
                this.updateRightDailyScheduleText();
                this.right.show = true;
                this.$log(this.right)
              }
            } else {
              this.right.show = false;
            }
          }).catch(function (error) {
            that.$log(error)
            that.right.show = false;
          })
        } else {
          if (this.datas.settings.right.promotionActivityId > 0) {
            let that = this
            this.right.promotionActivityId = this.datas.settings.right.promotionActivityId
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.EQUITY_BASE_URL,
              url: '/promotion/findPromotion',
              params: {
                id: this.datas.settings.right.promotionActivityId,
              },
            }).then((response) => {
              this.$log(response.data.data.result)
              let detail = response.data.data.result
              if (detail != null) {
                this.$log(detail)
                this.right.PromotionStartTime = new Date(detail.startDate.replace(/-/g, '/')).getTime()
                this.right.PromotionEndTime = new Date(detail.endDate.replace(/-/g, '/')).getTime()
                this.right.PromotionStatus = detail.status;
                if(detail.promotionSkus != null)  {
                  this.right.list = [];
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
                    this.right.list.push(product)
                  })
                }
                this.$log(this.right.PromotionStatus)
                this.$log(this.right.PromotionStartTime)
                this.$log(this.right.PromotionEndTime)
                this.right.show = true;
              } else {
                this.right.show = false;
              }
              this.$log(this.right)
            }).catch(function (error) {
              that.$log(error)
              that.right.show = false;
            })
          } else {
            if(this.right.list.length > 0) {
              this.right.show = true;
            }
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .compbox {
    display: flex;
    background-color: white;
    border-radius: 10px;
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;

    .boxTitle {
      display: flex;
      background-color: white;
      padding: 3px;
      width: 100%;

      .titleText {
        width: 45%;
        .fz(font-size, 30);
        font-weight: bold;
        color: #333333
      }

      .titleDetail {
        width: 55%;
        padding: 3px 2px;

        .dailyDetail {
          display: flex;
          float: left;
          margin-right: 3px;
          .fz(font-size, 15);

          .dailyTitleBox {
            background-color: #ff4444;
            color: white;
            text-align: center;
            justify-items: center;
            padding: 2px 0px;
          }

          .dailyTimeBox {
            padding: 2px 2px;
            border: 1px #ff4444 solid;
            text-align: center;
            justify-items: center;
            color: #ff4444;
            .fz(font-size, 17);
          }
        }

      }
    }
    .promotionStatusText{
      .fz(font-size,10)
    }
    .countdownStyle{
       .fz(font-size,10)
    }


    .sectionSlide-banner {
      display: block;
      width: 100%;

      img {
        display: block;
        width: 100%
      }
    }

    .left {
      width: 50%;
      height: 100%;
      .sectionGoods-list2 {
        width: 100%;
        display: -ms-flex;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: flex-start;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        overflow: hidden;

        li {
          width: 47%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          border-radius: 15px;
          margin: 3px 2px;

          img {
            width: 100%;
            display: inline-block;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .goodsFooter {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: Center;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding-bottom: 3px;
            width: 100%;

            .goodsPriceBox {
              color: #ff4444;
              > span {
                display: inline-block;
                align-content: center;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
                color: #ff4444;
                .fz(font-size, 30);
              }
            }

            .goodsPromotionPriceBox {
              color: #8c8c8c;
              text-decoration: line-through;
              .fz(font-size, 28);
              > span {
                display: inline-block;
                align-content: center;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
              }
            }
          }
        }
      }
    }

    .right {
      width: 50%;
      height: 100%;
      border-left: 1px solid #f0f0f0;
      .sectionGoods-list2 {
        width: 100%;
        display: -ms-flex;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: flex-start;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        overflow: hidden;

        li {
          width: 47%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          border-radius: 15px;
          margin: 3px 2px;

          img {
            width: 100%;
            display: inline-block;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .goodsFooter {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: Center;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding-bottom: 3px;
            width: 100%;

            .goodsPriceBox {
              color: #ff4444;
              > span {
                display: inline-block;
                align-content: center;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
                color: #ff4444;
                .fz(font-size, 30);
              }
            }

            .goodsPromotionPriceBox {
              color: #8c8c8c;
              text-decoration: line-through;
              .fz(font-size, 28);
              > span {
                display: inline-block;
                align-content: center;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
              }
            }
          }
        }
      }
    }
  }

</style>
