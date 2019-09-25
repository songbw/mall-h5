<template lang="html">
  <section class="promotion">
    <v-header v-if="showHeader" class="header">
      <h1 slot="title">{{detail.name}}</h1>
    </v-header>
    <div v-if="this.dailySchedule" class="seckillBody">
      <div class="seckillNavTitle" :style="showHeader?'top:3em': 'top: 0em'">
        <div v-for="(item,type) in seckillTypes" :key="type" class="seckilltab" @click="onTabClick(type)">
          <div class="tab-item">
            <span :class="active == type? 'title_active' : 'title_norm'">{{item.title}}</span>
            <span :class="active == type? 'title_active' : 'title_norm'"
                  style="font-size: x-small">{{item.status}}</span>
          </div>
        </div>
        <div>
        </div>
      </div>
      <div class="seckillList" :style="showHeader?'padding-top:5.6em':'padding-top:2.6em'">
        <div v-for="(promotionActive,index) in seckillTypes" :key="index">
          <div v-if="active===index">
            <ul>
              <li v-for="(k,i) in seckillTypes[index].list" :key="i">
                <div class="goodsCard" @click="onGoodsClick(k)">
                  <van-col span="8" class="cardImg">
                    <img v-lazy="k.image">
                  </van-col>
                  <van-col span="16" class="cardInfo">
                    <div class="cardTitle">
                      <span>{{k.name}}</span>
                    </div>
                    <div class="cardTag">
                      <span></span>
                    </div>
                    <div class="cardFooter">
                      <van-col span="12" class="priceBox">
                        <div class="salePrice">￥{{(k.price-k.discount).toFixed(2)}}</div>
                        <div class="originPrice">￥{{k.price}}</div>
                      </van-col>
                      <van-col span="12" class="actionBox">
                        <van-button type="danger" @click.stop="" size="small" @click="onAdd2carBtnClick(k)">立即抢购
                        </van-button>
                      </van-col>
                    </div>
                  </van-col>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="promotionTitle" :style="showHeader?'padding-top:3em': 'padding-top: 0em'">
        <van-cell>
          <span class="promotionTag">{{detail.tag}}</span>
          <v-countdown class="promotionCountDown"
                       v-if="this.detail.status < 5 && PromotionStartTime != 0 && PromotionEndTime !=0"
                       :start_callback="countDownS_cb(1)"
                       :end_callback="countDownE_cb(1)"
                       :startTime="PromotionStartTime"
                       :endTime="PromotionEndTime"
                       :secondsTxt="''">
          </v-countdown>
          <div v-else>
            <div class="promotionStatus" v-if="this.detail.status === 5 ">
              <span>已结束</span>
            </div>
          </div>
        </van-cell>
      </div>
      <div class="promotionBody">
        <ul>
          <li v-for="(k,index) in detail.promotionSkus" :key="index">
            <div class="goodsCard" @click="onGoodsClick(k)">
              <van-col span="8" class="cardImg">
                <img v-lazy="k.image">
              </van-col>
              <van-col span="16" class="cardInfo">
                <div class="cardTitle">
                  <span>{{k.name}}</span>
                </div>
                <div class="cardTag">
                  <span></span>
                </div>
                <div class="cardFooter">
                  <van-col span="12" class="priceBox">
                    <div class="salePrice">￥{{(k.price-k.discount).toFixed(2)}}</div>
                    <div class="originPrice">￥{{k.price}}</div>
                  </van-col>
                  <van-col span="12" class="actionBox">
                    <van-button type="danger" @click.stop="" size="small" @click="onAdd2carBtnClick(k)">立即抢购
                    </van-button>
                  </van-col>
                </div>
              </van-col>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import CountDown from '@/common/_vue2-countdown.vue'
  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
      "v-countdown": CountDown
    },
    data() {
      return {
        detail: {},
        PromotionStartTime: 0,
        PromotionEndTime: 0,
        showHeader: true,
        dailySchedule: false,
        seckillTypes: [],
        active: 0,
        timer: null,
      }
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 20);
      })
    },

    watch: {
      dailySchedule(newValue, oldvalue) {
        if (this.timer) {
          clearInterval(this.timer)
        }
        if (newValue) {
          this.timer = setInterval(this.updateDaylySheduleActivityStatus, 1000);
        }
      }
    },

    created() {
      let id = this.$route.params.id;
      let that = this
      this.$log("promotion:" + id)
      if (this.$api.IS_GAT_APP) {
        this.showHeader = false;
      }
      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.EQUITY_BASE_URL,
        url: '/promotion/findPromotion',
        params: {
          id: id,
          detail: true
        },
      }).then((response) => {
        this.$log(response.data.data.result)
        this.detail = response.data.data.result
        if (this.detail.dailySchedule != undefined) {
          this.dailySchedule = this.detail.dailySchedule
        }
        if (this.dailySchedule) {
          this.detail.promotionSchedules.forEach(item => {
            let promotionActivity = {
              id: item.id,
              title: item.schedule,
              list: this.detail.promotionSkus.filter((v) => {
                if (v.scheduleId === item.id)
                  return v;
              }),
              status: "即将开始",
              startTime: this.getDateTime(item.startTime),
              endTime: this.getDateTime(item.endTime),
            }
            this.seckillTypes.push(promotionActivity)
            this.updateDaylySheduleActivityStatus();
          })
          this.$log(this.seckillTypes)
        } else {
          this.PromotionStartTime =  this.getDateTime(this.detail.startDate)
          this.PromotionEndTime = this.getDateTime(this.detail.endDate)
        }
      }).catch(function (error) {
        that.$log(error)
      })

    },


    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    computed: {},

    methods: {
      getDateTime(time) {
        return   new Date(this.$moment(time).format('YYYY/MM/DD HH:mm:ss')).getTime()
      },
      updateDaylySheduleActivityStatus() {
        for (let i = 0; i < this.seckillTypes.length; i++) {
          this.isOnGoingActivity(i)
        }
      },
      isOnGoingActivity(index) {
        let currentTime = new Date().getTime()
       //this.$log(index + ", startTime:" + this.seckillTypes[index].startTime + ",endTime:" + this.seckillTypes[index].endTime + ",currentTime:" + currentTime)
        if (currentTime < this.seckillTypes[index].startTime) {
          this.seckillTypes[index].status = "即将开抢"
          return false
        } else if (index < (this.seckillTypes.length - 1) && currentTime > this.seckillTypes[index + 1].startTime) { //currentTime >=  this.seckillTypes[index].startTime
          this.seckillTypes[index].status = "已开抢"
          return false
        } else {
          this.seckillTypes[index].status = "正在疯抢"
          return true
        }
      },
      onTabClick(type) {
        this.$log("tab:" + type)
        this.active = type
      },
      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        this.$log(goods)
        let userId = user.userId;
        let mpu = goods.mpu;
        if (mpu == null) {
          mpu = goods.skuid;
        }
        let addtoCar = {
          "openId": userId,
          "mpu": mpu
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          this.$log(this.result)
          this.$toast("添加到购物车成功！")
          let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
          this.$log(goods)
          if (cartItem == null) {
            let baseInfo = {
              "userId": user.userId,
              "skuId": goods.skuid,
              "mpu": goods.mpu,
              "merchantId": goods.merchantId,
              "count": 1,
              "choosed": true,
              "cartId": this.result,
            }
            let goodsInfo = {
              "id": goods.id,
              "skuId": goods.skuid,
              "mpu": goods.mpu,
              "merchantId": goods.merchantId,
              "image": goods.image,
              "category": goods.category,
              "name": goods.name,
              "brand": goods.brand,
              "model": goods.model,
              "price": goods.price,
              "checkedPrice": goods.price
            }
            let couponList = []
            let promotionInfo = {}
            cartItem = {
              "baseInfo": baseInfo,
              "goodsInfo": goodsInfo,
              "couponList": couponList,
              "promotionInfo": promotionInfo,
            }
          } else {
            cartItem.baseInfo.count++;
            let found = -1;
            for (let i = 0; i < cartItem.couponList.length; i++) {
              if (cartItem.couponList[i].coupon.couponInfo.id == this.coupon.couponInfo.id) {
                found = i;
                break;
              }
            }
            if (found != -1) {
              cartItem.couponList.splice(found, 1)
            }
            cartItem.couponList.push(this.coupon.couponInfo)
          }
          Util.updateCartItem(this, cartItem)
        }).catch(function (error) {
          console.log(error)
        })
      },
      onAdd2carBtnClick(goods) {
        this.$log("onAdd2carBtnClick")
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          this.add2Car(userInfo, goods);
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },
      onGoodsClick(goods) {
        this.$log("onGoodsClick Enter")
        this.$log(goods)
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
      countDownS_cb: function (x) {
        //console.log(x)
      },
      countDownE_cb: function (x) {
        //console.log(x)
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      onBuyBtnClick(k) {
        this.$log("onBuyBtnClick Enter")
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.PRODUCT_BASE_URL,
            url: '/prod',
            params: {
              mpu: k.mpu,
            }
          }).then((res) => {
            this.updateCurrentGoods(res.data.data.result);
            this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {

        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .promotion {
    width: 100%;
    height: 100%;
    top: 0px;

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .seckillBody {
      background-color: #f8f8f8;

      .seckillNavTitle {
        display: flex;
        justify-items: center;
        width: 100%;
        position: fixed;
        top: 3em;
        z-index: 5;
        left: 0;

        .seckilltab {
          display: flex;
          justify-content: center;
          align-items: Center;
          width: 100%;
          background-color: #ff4444;
          color: #ffaaaa;
        }

        .tab-item {
          display: flex;
          flex-direction: column;
          align-items: Center;
          padding-top: 5px;
          padding-bottom: 5px;
        }

        .title_active {
          color: white;
        }

        .title_norm {
          color: #ffaaaa;
        }

      }

      .seckillList {
        padding-top: 5.6em;

        li {
          border-bottom: 1px solid #f0f0f0;

          .goodsCard {
            width: 100%;
            height: 8em;

            .cardImg {
              height: 100%;
              text-align: center;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .cardInfo {
              height: 100%;
              padding: 15px;

              .cardTitle {
                .fz(font-size, 30);
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break: break-all;
              }

              .cardTag {
                height: 15%;
              }

              .cardFooter {
                height: 50%;

                .priceBox {
                  height: 100%;
                  text-align: left;
                  line-height: 1.5em;
                  padding: 10px;

                  .salePrice {
                    color: #ff4444;
                    .fz(font-size, 32);
                    font-weight: bold;
                  }

                  .originPrice {
                    color: #707070;
                    .fz(font-size, 25);
                    text-decoration: line-through
                  }
                }

                .actionBox {
                  height: 100%;
                  text-align: center;
                  line-height: 3em;
                }
              }

            }
          }
        }
      }
    }

    .promotionTitle {
      color: black;
      font-weight: bold;

      .promotionTag {
        float: left;
      }

      .promotionCountDown {
        float: right;
      }

      .promotionStatus {
        float: right;
      }
    }

    .promotionBody {
      li {
        border-bottom: 1px solid #f0f0f0;

        .goodsCard {
          width: 100%;
          height: 8em;

          .cardImg {
            height: 100%;
            text-align: center;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .cardInfo {
            height: 100%;
            padding: 15px;

            .cardTitle {
              .fz(font-size, 30);
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              word-break: break-all;
            }

            .cardTag {
              height: 15%;
            }

            .cardFooter {
              height: 50%;

              .priceBox {
                height: 100%;
                text-align: left;
                line-height: 1.5em;
                padding: 10px;

                .salePrice {
                  color: #ff4444;
                  .fz(font-size, 32);
                  font-weight: bold;
                }

                .originPrice {
                  color: #707070;
                  .fz(font-size, 25);
                  text-decoration: line-through
                }
              }

              .actionBox {
                height: 100%;
                text-align: center;
                line-height: 3em;
              }
            }

          }
        }
      }
    }
  }
</style>
