<template lang="html">
  <section class="myOptCarList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的惠民优选卡</h1>
    </v-header>
    <div class="optCardListBody">
      <div class="optCardListMain">
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
        addNewOptCardDlgShow: false,
        newOptCardNumber:"",
        newOptCardPwd:"",
        mTelphoneNumber:""
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      let that = this
      let userDetail = this.$store.state.appconf.userDetail;
      if(userDetail.length > 0) {
        this.user  = JSON.parse(userDetail)
        this.mTelphoneNumber = this.user.telephone
      }
      let options = {
        "isvalid": true,
        "phonenum": this.mTelphoneNumber
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

      }
    }
  }
</style>
