<template lang="html">
  <section class="myOptCarList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的惠民优选卡</h1>
    </v-header>
    <div class="optCardListBody">
      <div class="optCardListMain">
        <div class="optcardList" v-if="optCardList.length > 0">
          <div v-for="(k,index) in optCardList" :key="index" class="optCard">
            <div class="cardMain">
              <van-col span="8" class="cardImg">
                <img :src="icon_optCardsReal">
              </van-col>
              <van-col span="16" class="cardInfo">
                <span>卡号: {{k.cardnum}}</span>
                <p style="margin-top: 3px">面值: <span>{{(k.amount/100).toFixed(2)}}元</span></p>
                <span style="font-size: small;color: #515151;margin-top: 3px">有效期: {{formatTime(k.expiryDate)}}</span>
              </van-col>
            </div>
            <div class="cardFooter">
               <span class="cardBalance">余额: {{(k.balance/100).toFixed(2)}}元</span>
               <span class="cardDetail" @click="onCardDetailBtnClick">交易明细 ></span>
            </div>

          </div>
        </div>
        <div v-else-if="launchedLoaded && optCardList.length == 0" class="noCards">
          <img :src="icon_noCards">
          <span style="font-size: large;color: black">亲，卡包已空啦</span>
        </div>
      </div>
    </div>
    <div class="optcardListBottomFunc">
      <div @click="onaddOptCardButtonCouponClick()" class="addOptCardButton">
        <span>绑定惠民优选卡</span>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'

  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      'v-footer': Footer
    },

    data() {
      return {
        user: {},
        launchedLoaded: false,
        optCardList: [],
        icon_noCards: require('@/assets/icons/ico_empty_card.png'),
        icon_optCardsReal: require('@/assets/icons/ico_optCards_real.png'),
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      let that = this
      that.user = this.$route.params.user;
      this.$log(this.user)
      let options = {
        "isvalid": true,
        "phonenum": "18801011130"//"13810864380"
      }
      that.$api.xapi({
        method: 'post',
        baseURL: this.$api.OPTCARDS_URL,
        url: '/woc/cardinfo/getcardlist',
        data: options
      }).then((response) => {
        that.$log(response.data.data)
        that.optCardList = response.data.data
        that.launchedLoaded = true
      }).catch(function (error) {

      })
    },

    methods: {
      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString,"YYYYMMDDHHmmss").format('YYYY/MM/DD')
      },
      onCardDetailBtnClick(){
        this.$log("onCardDetailBtnClick Enter")
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .myOptCarList {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .optCardListBody {
      .optCardListMain {
        width: 100%;
        padding-bottom: 3em;

        .noCards {
          width: 100%;
          background-color: #f8f8f8;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;
          height: 500px;

          img {
            height: 130px;
            width: 130px;
          }

          span {
            margin: 2vw;
          }

          .noCoupon_line1 {
            font-weight: lighter;
            color: black;
            .fz(font-size, 35);
          }

          .noCoupon_line2 {
            font-weight: lighter;
            color: #8c8c8c;
            .fz(font-size, 28);
          }

        }

        .optcardList {
          display: flex;
          flex-direction: column;
          background-color: #f8f8f8;
          justify-items: center;

          .optCard {
            background-color: white;
            display: flex;
            flex-direction: column;
            color: black;
            position: relative;
            padding-left: .5rem;
            padding-right: .5rem;
            margin: .5rem;
            /** 这里不能用百分号，因为百分号是分别相对宽和高计算的，会导致弧度不同  */
            border-top-right-radius: .3rem;
            border-bottom-right-radius: .3rem;
            overflow: hidden;

            .cardMain {
              .cardImg {
                padding: 5px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .cardInfo {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 5px;
                span{
                }
              }

            }

            .cardFooter {
              display: flex;
              padding: 10px;
              width: 100%;
              border-top: 1px dashed #cccccc;
              .cardBalance{
                width: 70%;
                text-align: left;
              }
              .cardDetail{
                width: 30%;
                text-align: center;
                color: #ff4444;
              }
            }
          }
        }
      }
    }

    .optcardListBottomFunc {
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


      .addOptCardButton {
        width: 100%;
        height: 100%;
        background-color: #FF4444;
        text-align: center;
        line-height: 3em;
        color: white;
      }
    }
  }
</style>
