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
              <van-col span="8" class="goodsImg">
                <img v-lazy="k.image">
              </van-col>
              <van-col span="16">

              </van-col>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import CountDown from 'vue2-countdown'

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
        //  this.$log(this.PromotionStartTime)
        // this.$log(this.PromotionEndTime)
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
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .promotion {
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
          .goodsImg{
            height: 100%;
            text-align: center;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

    }
  }
</style>
