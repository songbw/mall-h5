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
                  <van-cell clickable :key="index" @click="BanckCardsClick(item)">
                    <div slot="default" class="couponBox">
                      <van-col span="8" class="cardImg">
                        <img v-lazy="item.imageUrl.length?item.imageUrl: couponImg">
                      </van-col>
                      <van-col span="16" class="cardInfo">
                        <span>xxx</span>
                        <!--                           <div class="cardTitle">
                            <span>{{k.name}}</span>
                          </div>
                          <div class="cardTag">
                            <span></span>
                          </div>
                          <div class="cardFooter">
                            <van-col span="12" class="priceBox">
                              <div class="salePrice">￥{{parseFloat(k.discount).toFixed(2)}}</div>
                              <div class="originPrice">￥{{k.price}}</div>
                            </van-col>
                            <van-col span="12" class="actionBox">
                              <van-button type="danger" @click.stop="" size="small" @click="onAdd2carBtnClick(k)">立即抢购
                              </van-button>
                            </van-col>
                          </div> -->
                      </van-col>
                    </div>
                    <div slot="right-icon" class="couponBoxCheckBox">
                      <van-radio :name="item.accountId" checked-color="#3dd5c8" ref="couponBoxsCheckboxes" />
                    </div>
                  </van-cell>
                </div>
              </van-radio-group>
            </div>
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
        couponRadio: "-1",
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
      }
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
        border-radius: 10px;
      }

      .header {
        background-color: #4CAF50;
        color: white;
        padding: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

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
              margin-left: 10px;

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

          .couponBoxCheckBox {
            height: 100px;
            align-items: center;
            display: flex;
          }
        }

      }

    }
  }

</style>
