<template lang="html">
  <section class="main">
    <div class="noneInfo" v-if="Loading">
      <v-loading></v-loading>
    </div>
    <div v-else class="cardBody">
      <div class="card" v-if="cardDetail != null">
        <div class="header">
          <div class="title">
            <span>{{cardDetail.cardInfo.name}}</span>
          </div>
          <div class="price">
            <p><span>￥</span>{{cardDetail.cardInfo.amount}}</p>
          </div>
          <div class="Number">
            <span></span>{{cardDetail.card}}</span>
          </div>

          <div class="validDate">
            <span>截至日期: {{formatTime(cardDetail.endTime)}}</span>
          </div>
        </div>

        <div class="container">
          <div class="couponListCheckBox">
            <div v-if="cardDetail.coupons.length > 0">
              <van-radio-group v-model="couponRadio">
                <div v-for="(item, index) in cardDetail.coupons">
                  <van-cell clickable :key="index" @click="couponItemClick(item)">
                    <div slot="default" class="couponBox">
                      <van-col span="8" class="couponImage">
                        <img v-lazy="item.imageUrl.length?item.imageUrl: couponImg">
                      </van-col>
                      <van-col span="16" class="couponInfo">
                        <div class="coupon-price">
                          <span
                            v-if="item.rules.couponRules.type !=2 && formateCouponPrice(item.rules.couponRules).length > 0"
                            style="margin-right: -7px">￥</span>
                          {{formateCouponPrice(item.rules.couponRules)}}
                          <span>{{formateCouponDetail(item.rules.couponRules)}}</span>
                        </div>
                        <div class="coupon-desc">
                          <span>{{formateCouponDescription(item)}}</span>
                          <span style="color:#4CAF50;float:right;margin-right: 1px"
                            v-if="item.rules.couponRules.type == 4" @click="gotoCouponDetail(item)" @click.stop="">详情
                            ></span>
                        </div>
                        <div class="coupon-expire-date">
                          {{formatEffectiveDateTime(item.effectiveStartDate,item.effectiveEndDate)}}
                        </div>
                      </van-col>
                    </div>
                    <div slot="right-icon" class="couponBoxCheckBox" v-if="item.status == 3">
                      <van-radio :name="item.id" @click="onRadioBtnClick(item)" @click.stop="" checked-color="#4CAF50"
                        ref="couponBoxsCheckboxes" />
                    </div>
                  </van-cell>
                </div>
              </van-radio-group>
            </div>
          </div>
          <div style="margin-top:10px">
            <van-button size="large" type="primary" @click="onBuyBtnClick">下单提货
            </van-button>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
  import Loading from '@/common/_loading.vue'
  import Util from "@/util/common";

  export default {
    components: {
      'v-loading': Loading
    },

    data() {
      return {
        loading: true,
        cardNumber: "",
        cardDetail: null,
        couponRadio: "",
        selectedRadio: "",
        couponImg: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_coupon.png',
      }
    },

    async created() {
      this.$log("created Enter")
      this.cardNumber = this.$route.query.id;
      this.$log("cardNumber:" + this.cardNumber);
      if (this.cardNumber.length > 0) {
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          try {
            let user = JSON.parse(userInfo);
            let response = await this.getCardInfo(user.userId)
            if (response.data.code == 200) {
              this.cardDetail = response.data.data.result;
            }
          } catch (e) {}
        }
      }
      this.Loading = false
    },

    methods: {
      onRadioBtnClick(coupon) {
        this.$log("onRadioBtnClick Enter")
        this.$log(this.couponRadio)
        if (this.selectedRadio != this.couponRadio) {
          this.selectedRadio = this.couponRadio
        } else {
          this.couponRadio = -1
          this.selectedRadio = -1
        }

      },

      couponItemClick(coupon) {
        this.$log("couponItemClick Enter")
        if (this.selectedRadio > 0) {
          if (this.couponRadio === this.selectedRadio) {
            this.couponRadio = -1
            this.selectedRadio = -1;
          } else {
            this.couponRadio = coupon.id
            this.selectedRadio = this.couponRadio;
          }
        } else {
          this.couponRadio = coupon.id
          this.selectedRadio = this.couponRadio;
        }
      },

      gotoCouponDetail(coupon) {
        this.$log("gotoCouponDetail Enter")
        this.$log(coupon)
      },

      async onBuyBtnClick() {
        this.$log("onBuyBtnClick Enter")
        let that = this
        if (this.cardDetail == null)
          return
        if(this.cardDetail.status != 3 || this.cardDetail.status != 4)
          return
        if (this.cardDetail.status === 3) {
          if (this.couponRadio.length == 0) {
            this.$toast("请选择提货礼包")
            return
          }
        }
        try {
          //兑换
          this.$log(this.cardDetail)
          this.$log(this.couponRadio)
          let coupon = null
          if (this.cardDetail.status == 3) {
            let response = await this.changeToCoupon(this.cardDetail.card, this.couponRadio)
            this.$log(response)
            if (response.data.code == 200) {
            
            } else {
              this.$toast(respone.data.msg)
            }
          } else {
            coupon = {
              id: this.cardDetail,
              userCouponCode:this.cardDetail.userCouponCode,

            }
            coupon = thid.cardDetail.coupons[0]
          }
          


        } catch (e) {
          that.$log(e.response.data.message)
          that.$toast("下单提货失败, 原因:" + e.response.data.message)
        }
      },

      formatEffectiveDateTime(effectiveStartDate, effectiveEndDate) {
        return this.$moment(effectiveStartDate).format('YYYY.MM.DD') + ' - ' + this.$moment(effectiveEndDate).format(
          'YYYY.MM.DD');
      },
      formateCouponPrice(rules) {
        switch (rules.type) {
          case 0: //满减券
            return rules.fullReduceCoupon.reducePrice.toFixed(2);
          case 1: //代金券
            return rules.cashCoupon.amount.toFixed(2);
          case 2: //折扣券
            return (rules.discountCoupon.discountRatio * 10).toFixed(1) + ' 折';
          case 3: //服务券
            this.$log(rules)
            return rules.serviceCoupon.price.toFixed(2)
          case 4:
            if (rules.cashCoupon.amount > 0)
              return rules.cashCoupon.amount.toFixed(2);
            else
              return ""
          default:
            return ""
        }
      },

      formateCouponDescription(couponInfo) {
        switch (couponInfo.rules.scenario.type) {
          case 1:
            return "限指定的商品可用";
          case 2:
            return "全场商品可用";
          case 3:
            return "限指定品类商品可用";
          default:
            return "限特定的服务可用"
        }
      },

      formateCouponDetail(rules) {
        switch (rules.type) {
          case 0: //满减券
            return '满' + rules.fullReduceCoupon.fullPrice + '元可用';
          case 1: //代金券
            return '代金券';
          case 2: //折扣券
            if (rules.discountCoupon.fullPrice > 0) {
              return '满' + rules.discountCoupon.fullPrice + '元可用';
            } else {
              return '折扣券 ';
            }
            case 4:
              return '礼包套餐'
            default:
              return ""
        }
      },

      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
      },

      getCardInfo(userId) {
        this.$log("getCardInfo Enter:" + userId)
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/card/findByCard',
          params: {
            openId: userId,
            card: this.cardNumber
          }
        })
      },

      changeToCoupon(card, couponId) {
        this.$log("getCardInfo Enter:")
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/card/exchange',
          data: {
            card: card,
            couponId: couponId
          }
        })
      },


    }
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .main {
    width: 100%;
    height: 100%;
    top: 0px;

    .noneInfo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: Center;

      img {
        margin: 4vw;
      }

      span {
        margin: 2vw;
      }
    }

    .cardBody {
      .card {
        margin: 10px;
        min-height: 200px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); //设置两层阴影
      }

      .header {
        background-color: #4CAF50;
        color: white;
        padding: 10px;

        .title {
          text-align: center;
          .fz(font-size, 40)
        }

        .Number {
          text-align: center;
          letter-spacing: 2px;
          padding: 0px 0px 10px 0px;
          .fz(font-size, 35);
        }

        .price {
          text-align: center;
          padding: 10px 0px 10px 0px;
          .fz(font-size, 80);

          span {
            .fz(font-size, 30);
          }

        }

        .validDate {
          text-align: right;
          .fz(font-size, 24)
        }
      }

      .container {
        padding: 10px;
        background-color: #f8f8f8;

        .couponListCheckBox {
          .van-cell {
            margin-top: -1px;
            background: white;
            border-radius: 5px;
          }

          .couponBox {
            height: 100px;
            margin: 2px 10px 2px 0px;
            display: flex;
            line-height: 30px;
            color: #333333;
            font-size: large;

            .couponImage {
              height: 100%;
              text-align: center;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .couponInfo {
              height: 100%;
              margin: 5px;
              color: black;

              .coupon-desc {
                margin-left: 3px;
                .fz(font-size, 22);
              }

              .coupon-price {
                margin-left: 2px;
                .fz(font-size, 30);
                font-weight: bold;
                color: black;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
              }

              .coupon-price>span {
                font-weight: normal;
              }

              .coupon-expire-date {
                margin-left: 5px;
                .fz(font-size, 22);
              }

            }
          }

          .couponBoxCheckBox {
            height: 100px;
            align-items: center;
            display: flex;
          }
        }

      }

    }

    .van-button {
      background: linear-gradient(to right, rgb(91, 230, 186), #4CAF50);
      border: none;

      &--large {
        width: 100%;
        height: 40px;
        line-height: 40px;
      }
    }
  }

</style>
