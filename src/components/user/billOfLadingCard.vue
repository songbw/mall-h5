<template lang="html">
  <section class="main">
    <div class="noneInfo" v-if="loading">
      <v-loading></v-loading>
    </div>
    <div v-else class="cardBody">
      <div class="title">
        <span>-{{cardDetail.cardInfo.name}}-</span>
      </div>
      <div class="card" v-if="cardDetail != null">
        <div class="header">
          <div class="Number">
            <span>券码:{{cardDetail.card}}</span>
          </div>
          <div class="price">
            <p><span>￥</span>{{parseFloat(cardDetail.cardInfo.amount).toFixed(2)}}</p>
          </div>
          <div class="validDate">
            <span>有效期:{{formatTime(cardDetail.activateTime)}} - {{formatTime(cardDetail.endTime)}}</span>
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
                        <img v-lazy="item.imageUrl.length?item.imageUrl: couponImg" alt="">
                      </van-col>
                      <van-col span="16" class="couponInfo">
                        <div class="coupon-price">
                          <span v-if="item.rules.couponRules.type == 4">
                            {{item.name}}
                          </span>
                          <span v-if="item.rules.couponRules.type == 5">
                            {{formateCouponDetail(item.rules.couponRules)}}
                          </span>
                        </div>
                        <div class="coupon-desc">
                          <span>{{formateCouponDescription(item)}}</span>
                        </div>
                        <div class="coupon-expire-date">
                          <span style="color:#ef3949;" v-if="item.rules.couponRules.type == 4"
                            @click="gotoCouponDetail(item)" @click.stop="">查看详情
                            ></span>
                          <div v-if="item.rules.couponRules.type == 5">
                            <span v-if="item.rules.scenario.type == 1 || item.rules.scenario.type == 3"
                              style="color:#ef3949;" @click="gotoCouponDetail(item)" @click.stop="">
                              查看详情
                            </span>
                            <span v-else style="color:#888888;">
                              {{formatEffectiveDateTime(item.effectiveStartDate,item.effectiveEndDate)}}
                            </span>
                          </div>

                        </div>
                      </van-col>
                    </div>
                    <div slot="icon" class="couponBoxCheckBox" v-if="cardDetail.status == 3">
                      <van-radio :name="item.id" @click="onRadioBtnClick(item)" @click.stop="" checked-color="#4CAF50"
                        ref="couponBoxsCheckboxes" />
                    </div>
                  </van-cell>
                </div>
              </van-radio-group>
            </div>
          </div>
        </div>
        <div style="padding-top:10px;background-color: #f6f6f6;width=100%;font-weight:600">
          <van-button size="large" type="primary" @click="onBuyBtnClick">下单提货
          </van-button>
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
        amount: 0,
        totalPrice: 0
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
      this.loading = false
    },

    methods: {

      isCardActivied() {
        let ret = "";
        this.$log("isCardActivied Enter")
        this.$log(this.cardDetail)
        if (this.cardDetail.status === 3 || this.cardDetail.status === 4) {
          let startTime = new Date(this.$moment(this.cardDetail.activateTime).format('YYYY/MM/DD HH:mm:ss')).getTime()
          let endTime = new Date(this.$moment(this.cardDetail.endTime).format('YYYY/MM/DD HH:mm:ss')).getTime()
          let current = new Date().getTime()
          this.$log(startTime)
          this.$log(endTime)
          this.$log(current)
          if (current < startTime) {
            ret = "提货券未激活" //券活动未开始
          } else if (current <= endTime) {
            ret = "success" //活动开始
          } else {
            ret = "提货券已过期" // 活动已经结束
          }
        }
        this.$log(ret)
        return ret
      },

      getGoodsList(couponId) {
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/coupon/skuById',
          params: {
            id: couponId,
            limit: 10,
            offset: 1
          }
        })

      },

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

        this.$router.push({
          name: "提货券商品页",
          query: {
            id: coupon.id,
            amount: this.cardDetail.cardInfo.amount
          },

        });
      },

      isCouponActivied(coupon) {
        this.$log(coupon)
        let ret = "";
        let startTime = new Date(this.$moment(coupon.couponInfo.effectiveStartDate).format('YYYY/MM/DD HH:mm:ss'))
          .getTime() //new Date(coupon.couponInfo.effectiveStartDate.replace(/-/g,'/')).getTime()
        let endTime = new Date(this.$moment(coupon.couponInfo.effectiveEndDate).format('YYYY/MM/DD HH:mm:ss'))
          .getTime() //new Date(coupon.couponInfo.effectiveEndDate.replace(/-/g,'/')).getTime()
        let current = new Date().getTime()
        if (current < startTime) {
          ret = "优惠券活动未开始" //券活动未开始
        } else if (current <= endTime) {
          ret = "success" //活动开始
        } else {
          ret = "优惠券已无效" // 活动已经结束
        }
        return ret
      },

      useConpon(coupon) {
        this.$log("useConpon Enter")
        let ret = this.isCouponActivied(coupon);
        if (ret == "success") { //未使用
          let couponInfo = coupon.couponInfo;
          switch (couponInfo.rules.scenario.type) {
            case 1: {
              this.$store.commit('SET_CURRENT_COUPON_PAGE_INFO', JSON.stringify(coupon));
              this.$router.push("/user/couponListActivity");
              return;
            }
            case 2: {
              this.$router.push({
                path: "/category"
              });
              return
            }
            case 3: {
              //this.$router.push({path: "/category/" + couponInfo.rules.scenario.categories[0]});
              if (couponInfo.rules.scenario.categories.length > 0) {
                let categeries = couponInfo.rules.scenario.categories[0]
                for (let i = 1; i < couponInfo.rules.scenario.categories.length; i++) {
                  categeries += "_" + couponInfo.rules.scenario.categories[i]
                }
                this.$router.push({
                  path: "/category/goods/list?category=" + categeries
                });
              }

              return
            }
          }

        }
      },

      getCardStatusDesc(status) {
        switch (status) {
          case 1:
            return "提货券状态:已创建";
          case 2:
            return "提货券状态:已激活";
          case 3:
            return "提货券状态:已绑定";
          case 4:
            return "提货券状态:已兑换";
          case 5:
            return "提货券状态:已占用";
          case 6:
            return "提货券状态:已使用";
          case 7:
            return "提货券状态:已过期";
        }
      },

      async onBuyBtnClick() {
        this.$log("onBuyBtnClick Enter")
        let that = this
        this.$log(this.cardDetail)
        let userInfo = this.$store.state.appconf.userInfo;
        if (Util.isUserEmpty(userInfo)) {
          this.$toast("没有用户信息，请先登录再下单")
          return
        }
        if (this.cardDetail == null) {
          return
        }
        if (this.cardDetail.status != 3 && this.cardDetail.status != 4) {
          if (this.cardDetail.status < 3) {
            this.$toast("提货券未兑换，请联系客服")
          } else {
            this.$toast(this.getCardStatusDesc(this.cardDetail.status))
          }
          return
        }

        let ret = this.isCardActivied()
        if (ret != "success" && ret.length > 0) {
          this.$toast(ret)
          return
        }

        let user = JSON.parse(userInfo)

        if (this.cardDetail.status === 3) {
          if (this.couponRadio.length == 0) {
            this.$toast("请选择你要兑换的券")
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
              let couponInfo = null
              let found = -1;
              for (let i = 0; i < this.cardDetail.coupons.length; i++) {
                if (this.cardDetail.coupons[i].id === response.data.data.result.couponId) {
                  found = i;
                  break;
                }
              }
              if (found != -1) {
                coupon = {
                  id: response.data.data.result.id,
                  userCouponCode: response.data.data.result.userCouponCode,
                  couponInfo: this.cardDetail.coupons[found]
                }
              }

            } else {
              this.$toast(respone.data.msg)
            }
          } else {
            coupon = {
              id: this.cardDetail.coupons[0].couponUseInfo[0].id,
              userCouponCode: this.cardDetail.coupons[0].couponUseInfo[0].userCouponCode,
              couponInfo: this.cardDetail.coupons[0]
            }
          }
          if (coupon.couponInfo.rules.couponRules.type === 4) {
            //提货礼包券
            let response = await this.getGoodsList(coupon.couponInfo.id)
            this.$log(response)
            if (response.data.code === 200) {
              this.amount = this.cardDetail.cardInfo.amount
              let goodsList = response.data.data.result.couponSkus.list
              //开始下单
              let list = []

              //处理price
              goodsList.forEach(goods => {
                if (goods.merchantId == 4) {
                  if (goods.skuList.length > 0) {
                    goods.price = parseFloat((goods.skuList[0].price / 100).toFixed(2))
                  }
                }
                goods['dprice'] = 0;
                this.totalPrice = this.totalPrice + parseFloat(goods.price)
              })

              if (this.totalPrice > this.amount) {
                let tmpAmount = 0
                for (let i = 0; i < goodsList.length; i++) {
                  goodsList[i].dprice = Math.floor((goodsList[i].price * this.amount / this.totalPrice) *
                    100) / 100;
                  this.$log(goodsList[i].dprice)
                  tmpAmount = parseFloat((tmpAmount + goodsList[i].dprice).toFixed(2))
                }
                this.$log(tmpAmount)
                let diff = parseFloat((this.amount - tmpAmount).toFixed(2))
                this.$log("diff:" + diff)
                if (diff > 0) {
                  for (let i = 0; i < goodsList.length; i++) {
                    let temptPrice = parseFloat((diff + goodsList[i].dprice).toFixed(2))
                    this.$log(temptPrice)
                    if (goodsList[i].price >= temptPrice) {
                      goodsList[i].dprice = temptPrice
                      this.$log(goodsList[i].dprice)
                      break;
                    }
                  }
                }
              } else {
                for (let i = 0; i < goodsList.length; i++) {
                  goodsList[i].dprice = goodsList[i].price
                }
              }

              goodsList.forEach(goods => {
                let skuId = goods.skuid
                if (goods.merchantId == 4) {
                  if (goods.skuList.length > 0) {
                    skuId = goods.skuList[0].code
                  }
                }
                let baseInfo = {
                  "userId": user.userId,
                  "skuId": skuId,
                  "mpu": goods.mpu,
                  "merchantId": goods.merchantId,
                  "count": 1,
                  "choosed": true,
                  "cartId": -1,
                }

                let goodsInfo = {
                  "id": goods.id,
                  "skuId": skuId,
                  "mpu": goods.mpu,
                  "merchantId": goods.merchantId,
                  "image": goods.image,
                  "category": goods.category,
                  "name": goods.name,
                  "brand": goods.brand,
                  "model": goods.model,
                  "dprice": goods.dprice,
                  "price": goods.price,
                  "checkedPrice": goods.price,
                  "type": goods.type == undefined ? 0 : goods.type
                }
                let couponList = []
                let promotionInfo = {
                  "promotion": [],
                  "promotionState": -1
                }
                let product = {
                  "baseInfo": baseInfo,
                  "goodsInfo": goodsInfo,
                  "couponList": couponList,
                  "promotionInfo": promotionInfo,
                }
                this.$log(product)
                list.push(product)
              })
              this.$log(list)
              let pickupProdInfo = {
                list: list,
                coupon: coupon
              }
              this.$store.commit('SET_PICKUP_PRODUCTS_INFO', pickupProdInfo);
              this.$log(pickupProdInfo)
              this.$router.push({
                path: '/car/pay/pickupGoods'
              })
            }
          } else if (coupon.couponInfo.rules.couponRules.type === 5) {
            //提货代金券
            this.$log("提货代金券")
            this.useConpon(coupon)
          } else {
            this.$toast("未识别的提货券类型")
          }

        } catch (e) {
          that.$log(e)
          that.$toast("下单提货失败")
        }
      },

      formatEffectiveDateTime(effectiveStartDate, effectiveEndDate) {
        return this.$moment(effectiveStartDate).format('YYYY.MM.DD') + ' - ' + this.$moment(effectiveEndDate)
          .format(
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
        this.$log(rules)
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
            case 5:
              return "代金券"
            default:
              return ""
        }
      },

      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString).format('YYYY年MM月DD日')
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
    background-color: #f6f6f6;

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
        padding: 10px;
      }

      .title {
        padding: 20px 20px 10px 20px;
        text-align: center;
        .fz(font-size, 30)
      }

      .header {
        background: url('https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_pickupcard_bg.png') no-repeat;
        background-size: 100% 100%;
        color: white;
        padding: 10px 10px 0px 10px;

        .Number {
          text-align: left;
          letter-spacing: .5px;
          padding: 0px 0px 10px 0px;
          font-weight: 300;
          .fz(font-size, 25);
        }

        .price {
          text-align: left;
          padding: 0px 0px 10px 0px;
          .fz(font-size, 80);
          font-weight: 600;

          span {
            .fz(font-size, 30);
          }

        }

        .validDate {
          text-align: left;
          .fz(font-size, 24);
          padding: 0px 0px 3px 0px;

          >span {
            padding-top: 10px;
          }
        }
      }

      .container {
        padding-bottom: 5px;
        background-color: white;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;

        .couponListCheckBox {
          .van-cell {
            background: white;
          }

          .couponBox {
            height: 100px;
            margin-left: 10px;
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
                .fz(font-size, 28);
                color: #999999;
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

              .coupon-expire-date {
                margin-left: 5px;
                .fz(font-size, 28);
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
      background: #ef3949;
      border: none;

      &--large {
        width: 100%;
        height: 40px;
        line-height: 40px;
      }
    }
  }

</style>
