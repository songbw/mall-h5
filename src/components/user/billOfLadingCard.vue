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
            <span>截至日期: {{formatTime(cardDetail.createTime)}}</span>
          </div>
        </div>

        <div class="container">
          <p>January 1, 2016</p>
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
      }

    }
  }

</style>
