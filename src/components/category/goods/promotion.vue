<template lang="html">
  <section class="promotion">
    <v-header>
      <h1 slot="title">{{detail.name}}</h1>
    </v-header>
    <div class="promotionTitle">
      <van-cell>
        <span class="promotionTag">{{detail.tag}}</span>
        <v-countdown class="promotionCountDown" v-if="PromotionStartTime != 0 && PromotionEndTime !=0"
                     :start_callback="countDownS_cb(1)"
                     :end_callback="countDownE_cb(1)"
                     :startTime="PromotionStartTime"
                     :endTime="PromotionEndTime"
                     :secondsTxt="''">
        </v-countdown>
      </van-cell>
    </div>
    <div class="promotionBody">
      <ul>
        <li v-for="(k,index) in detail.promotionSkus" :key="index">
          <div class="goodsCard">
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
                    <van-button type="primary" size="small" @click="onBuyBtnClick(k)">立即抢购</van-button>
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
      }
    },

    created() {
      let id = this.$route.params.id;
      this.$log("promotion:" + id)

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
        this.PromotionStartTime = new Date(this.detail.startDate).getTime()
        this.PromotionEndTime = new Date(this.detail.endDate).getTime()
      }).catch(function (error) {
        alert(error)
      })
    },

    computed: {},

    methods: {
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
    background-color: #f8f8f8;

    .promotionTitle {
      color: black;
      font-weight: bold;
      .promotionTag {
        float: left;
      }

      .promotionCountDown {
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
