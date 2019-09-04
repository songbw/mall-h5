<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}" v-if="show">
    <div class="compbox">
      <div class="left">
        <div v-if="datas.settings.left.textValue.length" @click="gotoLeftTargetUrl()"  class="boxTitle">
          <div slot="title" class="titleText">
            <span>
               {{datas.settings.left.textValue}}
            </span>
          </div>
          <div v-if="datas.settings.left.hasPromotionActivity && left.PromotionStatus != -1" class="titleDetail">
            <div>{{left.msTime.hour}}</div>
            <div v-if="left.isDailySchedule" style="font-size: x-small">
              <span>{{left.dailyScheduleText}}</span>
              <span> {{left.dailyScheduleDetail}}</span>
              <span style="color:#ff4444;background-color: white;padding: 2px">{{left.msTime.hour}}</span>
              <span style="color: white">:</span>
              <span style="color:#ff4444;background-color: white;padding: 2px">{{left.msTime.minutes}}</span>
              <span style="color: white">:</span>
              <span style="color:#ff4444;background-color: white;padding: 2px">{{left.msTime.seconds}}</span>
            </div>
            <div v-else>
              <v-countdown v-if="left.promotionStatus < 5 && left.PromotionStartTime != 0 && left.PromotionEndTime !=0"
                           class="countdownBox"
                           @start_callback="countDownS_cb"
                           @end_callback="countDownE_cb"
                           :startTime="left.PromotionStartTime"
                           :endTime="left.PromotionEndTime"
                           :secondsTxt="''"
                           backgroundColor="#FFFFFF"
                           textColor="#FF4444"
                           style="font-size: x-small;font-weight: lighter">
              </v-countdown>
              <div class="promotionStatusText" v-if="left.promotionStatus === 5">
                <span style="color: white">已结束</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sectionSlide-banner" v-if="datas.settings.left.hasImage">
          <img v-lazy="datas.settings.left.imageUrl" @click="gotoLeftTargetUrl() ">
        </div>
      </div>
      <div class="right">

      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: ['datas', 'mBackgroundColor'],

    watch: {
/*      left:isDailySchedule(newValue, oldvalue) {
        if (this.left.timer) {
          clearInterval(this.timer)
        }
        if (newValue) {
          this.timer = setInterval(this.updateDailyScheduleText, 1000);
        }
      },
     left:isExceedTodayMaxTime(newValue, oldValue) {
        if (newValue) {
          this.updatePromotionInfo()
        }
      },*/
    },

    data() {
      return {
        countPerLine: 2,
        show: true,
        left: {
          list:[],
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
          show:false,
        },
        right: {
          list:[],
          show:false,
        }
      }
    },
    created() {
      this.$log(this.datas)
      //this.$log(this.datas.list)
      this.left.list = this.datas.list.filter(function (item)  {
         if(item.side === 'left')
           return item
      })
      this.right.list = this.datas.list.filter(function (item)  {
        if(item.side === 'right')
          return item
      })
      this.countPerLine = this.datas.settings.countPerLine;

//      this.left.hasPromotionActivity =

      this.updateLeftPromotionInfo();

    },
    methods: {
      See(e) {
        window.location.href = e
      },
      getClockString(schedule) {
        let clock = schedule.substr(0,2);
        return clock + "点场"
      },
      gotoLeftTargetUrl() {
        let targetId = this.datas.settings.left.targetUrl
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
      updateLeftTimer(startTime, endTime) {
        let timeDistance = endTime - startTime;
        if (timeDistance > 0) {
          this.left.msTime.show = true;
          this.left.msTime.day = Math.floor(timeDistance / 86400000);
          timeDistance -= this.left.msTime.day * 86400000;
          thisleft.msTime.hour = Math.floor(timeDistance / 3600000);
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
      updateLeftDailyScheduleText() {
        let currentTime = new Date().getTime();
        if (currentTime < this.left.dailyEndTime) {
          this.left.isExceedTodayMaxTime = false;
          if (currentTime < this.left.dailyScheduleInfo[0].starTime) {
            this.updateLeftTimer(currentTime, this.left.dailyScheduleInfo[0].starTime-1)

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
              this.updateLeftTimer(currentTime, this.left.dailyScheduleInfo[found + 1].starTime-1)
              this.left.dailyScheduleText = this.getClockString(this.left.dailyScheduleInfo[found].schedule)
              if (this.left.msTime.show) {
                this.left.dailyScheduleDetail = " 距下场 "
              }
            } else {
              if (currentTime > this.left.dailyScheduleInfo[this.left.dailyScheduleInfo.length-1].starTime) {
                this.left.dailyScheduleText = this.getClockString(this.left.dailyScheduleInfo[this.left.dailyScheduleInfo.length-1].schedule)
                this.updateLeftTimer(currentTime, this.left.dailyEndTime-1)
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
      updateLeftPromotionInfo() {
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
            this.$log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
            this.$log(response.data.data.result)
            let detail = response.data.data.result
            if(detail != null) {
              this.left.promotionActivityId = detail.id
              this.left.PromotionStatus = detail.status;
              if (detail.dailySchedule != undefined) {
                this.left.isDailySchedule = detail.dailySchedule
                this.left.dailyEndTime = new Date(this.$moment(detail.endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
              }
              if (this.left.isDailySchedule) {
                this.left.list= [];
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
                this.$log("11111111111111111111111111")
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
              if(detail != null) {
                this.$log(detail)
                this.left.PromotionStartTime = new Date(detail.startDate.replace(/-/g, '/')).getTime()
                this.left.PromotionEndTime = new Date(detail.endDate.replace(/-/g, '/')).getTime()
                this.left.PromotionStatus = detail.status;
                this.$log(this.left.PromotionStartTime)
                this.$log(this.left.PromotionEndTime)
                this.left.show = true;
              } else {
                this.left.show = false;
              }
              this.$log("2222222222222222222222")
              this.$log(this.left)
            }).catch(function (error) {
              that.$log(error)
              that.left.show = false;
            })
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .compbox{
    background-color: white;
    border-radius: 10px;
    padding: 5px;
    background-color: #c8c9cc;
    margin-left: 5px;
    margin-right: 5px;
    height: 300px;
    display: flex;

    .boxTitle{
      display: flex;
      background-color: white;
      padding: 3px;
      .tilteText{
        .fz(font-size,25);
        font-weight: bold;
      }
      .titleDetail{
        float: right;
      }
    }

    .left{
       width: 50%;
       height: 100%;
       background-color: red;
    }
    .right{
      width: 50%;
      height: 100%;
      background-color: #1989fa;
    }
  }

</style>
