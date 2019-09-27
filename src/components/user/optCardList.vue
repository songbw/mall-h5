<template lang="html">
  <section class="myOptCarList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的惠民优选卡</h1>
    </v-header>
    <div class="optCardListBody">
      <div class="optCardListMain">
        <div class="optcardList" v-if="optCardList.length > 0">

        </div>
        <div v-else-if="optCardList.length == 0 && launchedLoaded" class="noCards">
          <img :src="icon_noCards">
          <span style="font-size: large;color: black">亲，卡包已空啦</span>
        </div>
      </div>
    </div>
    <div class="optcardListBottomFunc">
        <div @click="onaddOptCardButtonCouponClick()"  class="addOptCardButton">
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
        user:{},
        launchedLoaded: true,
        optCardList:[],
        icon_noCards: require('@/assets/icons/ico_empty_card.png'),
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      this.user = this.$route.params.user;
    },

    methods: {

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
