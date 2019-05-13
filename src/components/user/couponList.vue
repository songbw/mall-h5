<template lang="html">
  <section class="couponList">
    <v-header class="header">
      <h1 slot="title">优惠券</h1>
    </v-header>
    <div class="couponListBody">
      <div class="couponListMain">
        <van-tabs v-model="active" sticky @click="onClick" :swipe-threshold=swipeThreshold swipeable>
          <van-tab v-for="(item,type) in couponTypes" :title=item.title :key="type">
            <div class="couponList">
              <div class="coupon-item">
                <div class="couponStyle">
                  <div class="info-box">
                    <p class="nick">优惠券</p>
                    <div class="coupon-money">
                      <div class="lay of">￥<em>10</em></div>
                      <div class="lay">
                        <p class="tit">代金券</p>
                        <p class="demand">满100元可用</p>
                      </div>
                    </div>
                    <p class="validDate">2019.6.10 10:10 - 2019.6.20 10:10 </p>
                  </div>
                  <div class="get-btn" @click="useCouponClick()">
                    <span>立即使用</span>
                  </div>
                </div>
              </div>
              <div class="coupon-item">
                <div class="couponStyle have">
                  <div class="info-box">
                    <p class="nick">优惠券</p>
                    <div class="coupon-money">
                      <div class="lay of">￥<em>10</em></div>
                      <div class="lay">
                        <p class="tit">代金券</p>
                        <p class="demand">满100元可用</p>
                      </div>
                    </div>
                    <p class="validDate">2019.6.10 10:10 - 2019.6.20 10:10 </p>
                  </div>
                  <div class="get-btn">
                    <span>已过期</span>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      'v-footer': Footer
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 3);
      })
    },
    data() {
      return {
        active: 0,
        swipeThreshold: 5,
        couponTypes: [
          {
            "title": "未使用",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": -1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "使用记录",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 0,
            "loading": false,
            "finished": false,
          },
          {
            "title": "已过期",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 0,
            "loading": false,
            "finished": false,
          },
        ],
        /*        couponConfig: {
                  width: 120, // 卡券宽度
                  height: 160, // 卡券高度
                  borderRadius: 10, // 卡券四个角的圆角半径
                  borderColor: '#ffffff', // 边框颜色
                  borderWidth: 0.5, // 边框粗细
                  borderOpcity: 1, // 边框透明度
                  borderDash: null, // 边框虚线数组, 直线是 null, 虚线的话给一个数组,如[2,2]
                  showLine: true, // 是否显示分割线
                  lineColor: '#33cc44', // 分割线颜色
                  lineWidth: 0.4, // 分割线粗细
                  lineOpcity: 1, // 分割线透明度
                  lineDash: [3, 5], // 分割线虚线数组, 同 边框虚线数组
                  lineOffset: 5, // 分割线跟卡券两侧的距离, 为 0 则相连
                  cutPosition: 80, // 裁切口的位置
                  cutRadius: 10, // 裁切口的半径
                  cutSlope: 1.5, // 裁切口的弧度
                  background: '#ffffff' // 背景颜色, 优先级低于 slot 的背景
                }*/
      }
    },
    methods: {
      useCouponClick(){
        this.$log("useCouponClick Enter")
      },
      onOrderListBarClick(type) {
        //订单类型
        this.$log("onOrderListBarClick:" + type);
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', type);
        this.$router.push({name: '订单列表页'})
      },
      oncouponListClick() {
        this.$log("oncouponListClick Enter")
        this.$router.push("/user/couponList")
      }

    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .couponList {
    width: 100%;
    height: 100vh;

    .couponListBody {
      .couponListMain {
        width: 100%;
        .couponList {
          .coupon-item{
            margin: 5px;
          }
          .coupon-item .nick {
            color: #fff;

          }
          .coupon-item .validDate {
            color: #fff;
            .fz(font-size, 25);
          }

          .coupon-item .coupon-money {
            width: 100%;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            font-size: 1.2rem;
            align-items: center;
          }

          .coupon-item .coupon-money em {
            font-size: 3.8rem;
          }

          .coupon-item .coupon-money .lay:last-child {
            flex: 1;
            padding: 0 3%;
            line-height: 1.66rem;
          }

          .couponStyle {
            width: 100%;
            height: 8rem;
            position: relative;
            margin: 5% 0;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border: 1px solid #E5004F;
          }

          .couponStyle .info-box {
            -webkit-box: 1;
            -webkit-flex: 1;
            flex: 1;
            padding: 0 2% 0 6%;
            position: relative;
          }

          .couponStyle {
            background-color: #FFAA00;
            -webkit-border-radius: 1rem;
            border-radius: 1rem;
            border: none;
            color: #fff;
          }

          .couponStyle .get-btn {
            width: 28%;
            height: 7rem;
            position: relative;
            -webkit-perspective: 180;
            perspective: 180;
          }

          .couponStyle .get-btn:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #F8B551;
            transform: rotateY(-28deg);
            z-index: 1;
            -webkit-border-radius: .66rem;
            border-radius: .66rem;
            -webkit-box-shadow: -3px 0 8px #793030;
            box-shadow: -3px 0 8px #793030;
          }

          .couponStyle .get-btn span {
            width: 4rem;
            word-break: break-all;
            font-size: 1.8rem;
            color: #454545;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-30%, -50%);
            transform: translate(-30%, -50%);
            z-index: 3;
          }

          /* 已领取 */

          .couponStyle.have, .couponStyle.have .get-btn:after, .style-six.have, .style-seven.have {
            background-color: #c1c1c1;
          }

          .couponStyle.have .get-btn:after {
            -webkit-box-shadow: -3px 0 8px #8c8c8c;
            box-shadow: -3px 0 8px #8c8c8c;
          }

          .couponStyle.have .get-btn span {
            width: 5rem;
            font-size: 1.5rem;
            color: #fff;
          }
        }

      }
    }
  }
</style>
