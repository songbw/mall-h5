<template lang="html">
  <section class="main">
    <div class="noneInfo" v-if="loading">
      <v-loading></v-loading>
    </div>
    <div v-else class="listBody">
      <van-tabs v-model="active" sticky @click="onClick" :swipe-threshold=swipeThreshold swipeabl>
        <van-tab v-for="(item,type) in couponTypes" :title=item.title :key="type">
          <div v-for="(k,index) in currentCardList" :key="index" v-if="currentCardList.length > 0">
            <div class="card">
              <div class="header">
                <div class="title">
                  <span>{{k.cardInfo.name}}</span>
                </div>
                <div class="price">
                  <p><span>￥</span>{{k.cardInfo.amount}}</p>
                </div>
                <div class="Number">
                  <span></span>{{k.card}}</span>
                </div>
                <div class="validDate">
                  <span>截至日期: {{formatTime(k.endTime)}}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
          </div>
        </van-tab>
      </van-tabs>

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


    computed: {
      currentCardList() {
        if (this.cardList.length > 0) {
          switch (this.active) {
            case 0:
              return this.cardList.filter((item) => {
                return item.status < 6
              })
            case 1:
              return this.cardList.filter((item) => {
                return item.status == 6
              })
            case 2:
              return this.cardList.filter((item) => {
                return item.status == 7
              })
          }
        } else {
          return []
        }
      },

      unUsedList() {
        if (this.cardList.length > 0) {

        } else {
          return []
        }
      },

      usedList() {
        if (this.cardList.length > 0) {
          return this.cardList.filter((item) => {
            return item.status == 6
          })
        } else {
          return []
        }
      },

      expiredList() {
        if (this.cardList.length > 0) {
          return this.cardList.filter((item) => {
            return item.status == 7
          })
        } else {
          return []
        }
      },


    },

    data() {
      return {
        loading: true,
        cardList: [],
        active: 0,
        swipeThreshold: 5,
        couponTypes: [{
            "title": "未使用",
          },
          {
            "title": "已使用",
          },
          {
            "title": "已过期",
          },
        ],
      }
    },

    async created() {
      let userInfo = this.$store.state.appconf.userInfo;
      if (!Util.isUserEmpty(userInfo)) {
        try {
          let user = JSON.parse(userInfo);
          let response = await this.getCardList(user.userId)
          if (response.data.code == 200) {
            this.cardList = response.data.data.result;
            //this.$log(this.cardList)
          }
        } catch (e) {

        }
      }
      this.loading = false
    },

    methods: {
      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
      },
      getCardList(userId) {
        this.$log("getCardList Enter")
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/card/find',
          params: {
            openId: userId,
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

    .listBody {
      width: 100%;
      height: 100%;
      top: 0px;
      background-color: #f8f8f8;

      .card {
        margin: 10px;
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

  }

</style>
