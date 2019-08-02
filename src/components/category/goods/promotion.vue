<template lang="html">
  <section class="promotion">
    <v-header v-if="showHeader">
      <h1 slot="title">{{detail.name}}</h1>
    </v-header>
    <div class="promotionTitle">
      <van-cell>
        <span class="promotionTag">{{detail.tag}}</span>
        <v-countdown class="promotionCountDown" v-if="this.detail.status < 5 && PromotionStartTime != 0 && PromotionEndTime !=0"
                     :start_callback="countDownS_cb(1)"
                     :end_callback="countDownE_cb(1)"
                     :startTime="PromotionStartTime"
                     :endTime="PromotionEndTime"
                     :secondsTxt="''" >
        </v-countdown>
        <div class="promotionStatus" v-else>
           <span>已结束</span>
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
                    <div class="salePrice">￥{{k.price-k.discount}} </div>
                    <div class="originPrice">￥{{k.price}}</div>
                  </van-col>
                  <van-col span="12" class="actionBox">
                    <van-button type="primary"  @click.stop="" size="small" @click="onAdd2carBtnClick(k)">立即抢购</van-button>
                  </van-col>
                </div>
              </van-col>
          </div>
        </li>
      </ul>
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
      }
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 20);
      })
    },


    created() {
      let id = this.$route.params.id;
      this.$log("promotion:" + id)
      if (this.$api.APP_ID === "10") {
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
        this.PromotionStartTime = new Date(this.detail.startDate.replace(/-/g,'/')).getTime()
        this.PromotionEndTime = new Date(this.detail.endDate.replace(/-/g,'/')).getTime()
      }).catch(function (error) {
        alert(error)
      })
    },

    computed: {},

    methods: {
      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        this.$log(goods)
        let userId = user.userId;
        let mpu = goods.mpu;
        if(mpu == null) {
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
        if(mpu == null) {
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
      li{
        border-bottom: 1px solid #f0f0f0;
        .goodsCard{
          width: 100%;
          height: 8em;
          .cardImg{
            height: 100%;
            text-align: center;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .cardInfo{
            height: 100%;
            padding: 15px;
            .cardTitle{
              .fz(font-size,30);
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              word-break:break-all;
            }
            .cardTag{
              height: 15%;
            }
            .cardFooter{
              height: 50%;
              .priceBox{
                height: 100%;
                text-align: left;
                line-height: 1.5em;
                padding: 10px;
                .salePrice{
                   color: #ff4444;
                  .fz(font-size,32);
                  font-weight: bold;
                }
                .originPrice{
                  color: #707070;
                  .fz(font-size, 25);
                  text-decoration:line-through
                }
              }
              .actionBox{
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
