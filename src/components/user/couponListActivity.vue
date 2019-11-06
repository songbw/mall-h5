<template lang="html">
  <div class="couponActivity">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">优惠活动</h1>
    </v-header>
    <div class="couponActivityMain">
      <div class="couponActivityInfo">
        <div class="coupon coupon-red-gradient coupon-wave-left coupon-wave-right">
          <div class="coupon-info coupon-hole coupon-info-right-dashed">
            <div class="coupon-price">
              <span>{{formateCouponPrice(this.coupon.couponInfo.rules.couponRules)}}</span>
            </div>
          </div>
          <div class="coupon-get">
            <div>
              <div class="coupon-desc">{{formateCouponDescription(this.coupon.couponInfo.rules.couponRules)}}</div>
              <div class="coupon-expire-date">
                {{formatEffectiveDateTime(this.coupon.couponInfo.effectiveStartDate,this.coupon.couponInfo.effectiveEndDate)}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="couponActivityList">
        <div>
          <van-list v-model="loading"
                    :finished="finished"
                    @load="onLoad">
            <li v-for="(k,index) in list" :key="index">
              <div class="goodsCard" @click="onGoodCardClick(k)">
                <div class="card-layout">
                  <van-col span="8" class="cardImg">
                    <img v-lazy="k.image">
                  </van-col>
                  <van-col span="16" class="cardInfo">
                    <div class="promotionBox" v-if="k.promotion!= undefined &&  k.promotionState != -1">
                      <span class="promotionTitle">{{k.promotion[0].tag}}</span>
                      <v-countdown class="promotionCountDown"
                                   @start_callback="countDownS_cb(index,k)"
                                   @end_callback="countDownE_cb(index,k)"
                                   :startTime="getDateTime(k.promotion[0].startDate)"
                                   :endTime="getDateTime(k.promotion[0].endDate)"
                                   :secondsTxt="''">
                      </v-countdown>
                    </div>
                    <div class="cardTitle">
                      <span>{{k.name}}</span>
                    </div>
                    <div class="cardTag">
                      <span></span>
                    </div>
                    <div class="cardFooter">
                      <div  class="priceBox">
                        <div class="salePrice">￥{{k.dprice}}</div>
                      </div>
                      <div class="goodsBuyBox">
                          <van-button size="mini" @click.stop="" @click="onBuyBtnClick(k)"></van-button>
                      </div>
                    </div>
                  </van-col>
                </div>
              </div>
            </li>
          </van-list>
        </div>
      </div>
    </div>
    <div class="couponActivityBottomFunc">
      <van-col span="16" class="payInfo">
        <div @click="onCouponCenterClick()">
          <div class="amountPay">
            <span style="color: #515151">小计:</span>
            <span style="color: red">￥{{allPay}}</span>
          </div>
          <div>
            <span style="color: #8a8a8a;font-size: x-small">{{payTip}}</span>
          </div>
        </div>
      </van-col>
      <van-col span="8" class="gotoCar">
        <div @click="onGotoCarClick()">
          <span>去购物车</span>
        </div>
      </van-col>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'
  import CountDown from '@/common/_vue2-countdown.vue'

  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      "v-countdown": CountDown,
    },
    data() {
      return {
        currentCouponPageInfo: '',
        list: [],
        total: -1,
        pageNo: 1,
        loading: false,
        finished: false,
        launchedLoading: false,
        showHeader: true
      }
    },

    beforeCreate() {
      this.$log("mounted Enter")
      this.currentCouponPageInfo = this.$store.state.appconf.currentCouponPageInfo;
      if (this.currentCouponPageInfo.length) {
        this.coupon = JSON.parse(this.currentCouponPageInfo);
        let couponInfo = this.coupon.couponInfo;
        let rules = couponInfo.rules;
        let scenario = rules.scenario;
        let couponRules = rules.couponRules;
      }
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
    },

    computed: {
      allPay() {
        let payAmount = 0
        let cartList = this.$store.state.appconf.cartList;
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          this.$log("##########################")
          cartList.forEach(item => {
            this.$log(item)
            if (item.baseInfo.userId == user.userId) {
              let found = -1
              for (let i = 0; i < item.couponList.length; i++) {
                if (item.couponList[i].id == this.coupon.couponInfo.id) {
                  found = i;
                  break;
                }
              }
              if (found != -1) {
                this.$log("@@@@@@@@@@@@@@@@@@@@@@@@@@")
                if (item.baseInfo.choosed)
                  payAmount += item.goodsInfo.dprice * item.baseInfo.count
              }
            }
          })
        }
        this.$store.commit('SET_CART_LIST', cartList);
        return payAmount.toFixed(2);
      },

      payTip() {
        if (this.allPay == 0)
          return "快去选购商品参加活动吧"
        else {
          let rules = this.coupon.couponInfo.rules.couponRules
          switch (rules.type) {
            case 0://满减券
              // return '￥' + rules.fullReduceCoupon.fullPrice;
              if (rules.fullReduceCoupon.fullPrice > this.allPay) {
                let amount = rules.fullReduceCoupon.fullPrice - this.allPay
                return "再买￥" + amount + "可享受优惠"
              } else {
                return "已满足优惠条件，下单使用该券可立减￥" + rules.fullReduceCoupon.reducePrice
              }
            case 1://代金券
              return "已满足优惠条件，下单使用该券可立减￥" + rules.cashCoupon.amount
            case 2://折扣券
              //return "已满足优惠条件，下单使用该券可" + rules.discountCoupon.discountRatio * 10 + ' 折'+"优惠"
              if (rules.discountCoupon.fullPrice > this.allPay) {
                let amount = rules.discountCoupon.fullPrice - this.allPay
                return "再买￥" + amount + "可享受优惠"
              } else {
                return "已满足优惠条件，下单使用该券可" + (rules.discountCoupon.discountRatio * 10).toFixed(1) + ' 折' + "优惠"
              }
            default:
              return ""
          }
        }
      },
    },


    mounted() {
      setTimeout(() => {
        if (!this.launchedLoading) {
          this.onLoad()
        }
      }, 1000);
    }
    ,

    methods: {
      getDateTime(time) {
        return   new Date(this.$moment(time).format('YYYY/MM/DD HH:mm:ss')).getTime()
      },
      countDownS_cb(index, k) {
        k['promotionState'] = Util.getPromotionState(k)
        k['dprice']=Util.getDisplayPrice(k.price,k)
      },
      countDownE_cb(index, k) {
        k['promotionState'] = Util.getPromotionState(k)
        k['dprice']=Util.getDisplayPrice(k.price,k)
      },

      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      onGoodCardClick(goods) {
        this.$log("onGoodCardClick Enter")
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
              mpu: goods.mpu,
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
      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let mpu = goods.mpu;
        let that = this
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
          this.$log("xxxxxxxxxxxxxxxxxxx")
          this.$log(this.result)
          this.$toast("添加到购物车成功！")
          let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
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
            cartItem.couponList.push(this.coupon.couponInfo)
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

      onGotoCarClick() {
        this.$router.push({name: '购物车页'})
      },

      onBuyBtnClick(goods) {
        this.$log("onBuyBtnClick Enter");
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          this.add2Car(userInfo, goods)
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      }
      ,
      onLoad() {
        let that = this;
        this.launchedLoading = true
        try {
          //获取goods信息，update current googds
          if (this.total == -1 || this.total > this.list.length) {
            this.loading = true;
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.EQUITY_BASE_URL,
              url: '/coupon/skuById',
              params: {
                id: this.coupon.couponInfo.id,
                limit: 10,
                offset: this.pageNo++
              }
            }).then((res) => {
              let result = res.data.data.result;
              this.total = result.couponSkus.total;
              if (result.couponSkus.list == undefined || result.couponSkus.list.length == 0) {
                that.loading = false;
                that.finished = true;
              } else {
                result.couponSkus.list.forEach(item => {
                  item['promotionState'] = Util.getPromotionState(item)
                  item['dprice']=Util.getDisplayPrice(item.price,item)
                  that.list.push(item);
                })
                that.loading = false;
                if (that.list.length >= that.total) {
                  that.finished = true;
                  that.$log(that.list)
                }
              }
            }).catch((error) => {
              console.log(error)
              that.loading = false;
              that.finished = true;
            })
          }
        } catch (e) {
          if (that.list.length >= that.total) {
            that.loading = false;
            that.finished = true;
          }
        }
      }
      ,
      formateCouponPrice(rules) {
        switch (rules.type) {
          case 0://满减券
            return '￥' + rules.fullReduceCoupon.reducePrice;
          case 1://代金券
            return '￥' + rules.cashCoupon.amount;
          case 2://折扣券
            return (rules.discountCoupon.discountRatio * 10).toFixed(1) + ' 折';
          default:
            return ""
        }
      }
      ,
      formateReleasePercentage(coupon) {
        if (coupon.releaseTotal == 0)
          return 100;
        let percentage = (Math.round(coupon.releaseNum / coupon.releaseTotal * 10000) / 100.00);
        return percentage;
      }
      ,
      formateCouponDescription(rules) {
        switch (rules.type) {
          case 0://满减券
            return '满' + rules.fullReduceCoupon.fullPrice + '元可用';
          case 1://代金券
            return '代金券';
          case 2://折扣券
            if (rules.discountCoupon.fullPrice > 0) {
              return '满' + rules.discountCoupon.fullPrice + '元可用';
            } else {
              return '折扣券 ';
            }
          default:
            return ""
        }

      }
      ,
      formatEffectiveDateTime(effectiveStartDate, effectiveEndDate) {
        return this.$moment(effectiveStartDate).format('YYYY.MM.DD HH:MM:ss') + ' - ' + this.$moment(effectiveEndDate).format('YYYY.MM.DD HH:MM:ss' +
          '');
      }
      ,
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';

  .couponActivity {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .couponActivityMain {
      width: 100%;
      .couponActivityInfo {
        background-color: #FFAA00;
        width: 100%;
        display: flex;

        .coupon {
          background-color: #ff4444;
          display: flex;
          color: white;
          position: relative;
          padding-left: .5rem;
          padding-right: .5rem;
          margin: .5rem;
          /** 这里不能用百分号，因为百分号是分别相对宽和高计算的，会导致弧度不同  */
          border-top-right-radius: .3rem;
          border-bottom-right-radius: .3rem;
          overflow: hidden;
          width: 100%;

          .coupon-info-right-dashed {
            border-right: 2px dashed #c8c9cc;
          }

          .coupon-info-right-solid {
            border-right: 2px solid white;
          }

          /* 使用两个边框为圆角的白色div制造半圆缺角，有个缺点是这个缺角必须与背景色相同（clip-path不好弄） */

          .coupon-hole::before, .coupon-hole::after {
            content: '';
            width: 1rem;
            height: 1rem;
            background-color: #FFAA00;
            border-radius: 50%;
            position: absolute;
            right: -.5rem;
          }

          .coupon-info {
            padding: 0.5rem 0.5rem 0.5rem;
            width: 25%;
            position: relative;
          }

          .coupon-get {
            padding: .5rem;
            /** 这里使用flex是为了让文字居中 */
            display: flex;
            margin-left: 10px;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 75%;
            position: relative;
            .fz(font-size, 25);
          }

          .coupon-get > .coupon-desc {
            font-size: 150%;
            margin-bottom: .5rem;
            font-weight: bold;
          }

          .coupon-get-already::after {
            content: '';
            width: 5rem;
            height: 5rem;
            background-size: 5rem 5rem;
            background-image: url('data:image/png;base64,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');
            position: absolute;
            top: -1rem;
            right: -1rem;
          }

          .coupon-get-used::after {
            content: '';
            width: 5rem;
            height: 5rem;
            background-size: 5rem 5rem;
            background-image: url('data:image/png;base64,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');
            position: absolute;
            top: -1rem;
            right: -1rem;
          }

          .coupon-get-expired::after {
            content: '';
            width: 5rem;
            height: 5rem;
            background-size: 5rem 5rem;
            background-image: url('data:image/png;base64,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');
            position: absolute;
            top: -1rem;
            right: -1rem;
          }

          .coupon-info::before {
            top: -.5rem;
          }

          .coupon-info::after {
            bottom: -.5rem;
          }

          .coupon-info > div {
            margin-bottom: .2rem;
          }

          .coupon-price {
            font-size: 150%;
            font-weight: bold;
            display: flex;
          }

          .coupon-expire-date {
            .fz(font-size, 20);
          }

          .coupon-suppler {
            span {
              background-color: #ff4444;
              padding: 2px 5px;
              color: white;
              border-radius: 8px;
              .fz(font-size, 25);
            }

            i {
              .fz(font-size, 28);
            }
          }
        }

        /* 左边框的波浪 */

        .coupon-wave-left::before, .coupon-wave-right::after {
          content: '';
          position: absolute;
          top: 0;
          height: 100%;
          width: 14px;
          background-image: radial-gradient(#FFAA00 0, #FFAA00 4px, transparent 4px);
          /** 如果只设置为半径的两倍(直径)，那么半圆之间没有类似堤岸的间隔 */
          background-size: 14px 14px;
          background-position: 0 2px;
          background-repeat: repeat-y;
          z-index: 1;
        }

        .coupon-wave-left::before {
          left: -7px;
        }

        .coupon-wave-right::after {
          right: -7px;
        }
      }

      .couponActivityList {
        text-align: left;
        width: 100%;
        background-color: #f8f8f8;
        display: flex;
        flex-direction: column;
        margin-bottom: 3em;
        li {
          list-style: none;
          border-radius: 10px;
          margin: 5px;
          .goodsCard {
            width: 100%;
            .card-layout{
              height:8rem;
              justify-content: center;
              .promotionBox {
                display: flex;
                .fz(font-size, 25);
                margin-bottom: 5px;

                .promotionTitle {
                  color: #ff4444;
                  font-weight: bold;
                }
                .promotionCountDown {
                  margin-left: 10px;
                  color: black;
                  .fz(font-size, 25);
                }
              }
              .cardImg {
                height: 100%;
                text-align: center;

                img {
                  width: 100%;
                  height: 100%;
                  border-top-left-radius: 10px;
                  border-bottom-left-radius: 10px;
                }
              }
              .cardInfo {
                height: 100%;
                padding: 5px;

                .cardTitle {
                  height: 60%;
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
                  height: 25%;
                  width: 100%;
                  display: flex;
                  .priceBox {
                    width: 80%;
                    text-align: left;
                    margin-top: 4px;
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

                  .goodsBuyBox {
                    justify-content: center;
                    float: right;

                    .van-button {
                      margin: 1vw;
                      background: url('../../assets/icons/ico_add_cart.png') no-repeat center;
                      background-size: 15px 15px;
                      border: none;
                      float: right;
                    }

                    .van-button:active {
                      opacity: 0;
                    }
                  }
                }
              }
            }
          }
        }
      }

    }

    .couponActivityBottomFunc {
      background-color: white;
      width: 100%;
      height: 3em;
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #ffffff;
      z-index: 5;

      .payInfo {
        height: 100%;
        background-color: white;
        text-align: left;
        color: #ee892f;
        padding-left: 10px;
        padding-top: 3px;
      }

      .gotoCar {
        height: 100%;
        background-color: #FF4444;
        text-align: center;
        line-height: 3em;
        color: white;
      }
    }
  }
</style>
