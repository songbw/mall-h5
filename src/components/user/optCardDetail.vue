<template lang="html">
  <section class="myOptCardDetail">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">惠民优选卡详情</h1>
    </v-header>
    <div class="optCardDetailBody">
      <div class="optCardDetailMain">
        <van-tabs v-model="active">
          <van-tab title="消费记录">
            <div v-if="launchedLoaded && creditList.length > 0">
              <div v-for="(k,index) in creditList" :key="index" class="detailCard">
                <div class="detailInfo">
                  <span >支付</span>
                  <span style="float: right;font-size: large">-{{(k.paymentamount/100).toFixed(2)}}元</span>
                </div>
                <div>
                  <div class="detailDate">日期:{{formatTime(k.ordertime)}}</div>
                </div>
              </div>
            </div>
            <div v-else class="noContext">
                <img :src="icon_noContext">
                <span class="noContext_line1">还没有消费记录</span>
            </div>
          </van-tab>
          <van-tab title="退款记录">
            <div  v-if="launchedLoaded && debitList.length > 0">
              <div v-for="(k,index) in debitList" :key="index" class="detailCard">
                <div class="detailInfo">
                  <span >退款</span>
                  <span style="float: right;font-size: large;color: #ff4444">+{{(k.paymentamount/100).toFixed(2)}}元</span>
                </div>
                <div>
                  <div class="detailDate">日期:{{formatTime(k.ordertime)}}</div>
                </div>
              </div>
            </div>
            <div v-else class="noContext">
              <img :src="icon_noContext">
              <span class="noContext_line1">还没有退款记录</span>
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
        card: {},
        pageNo: 1,
        pagerecord: 100,
        total: -1,
        loading: false,
        finished: false,
        noDate:false,
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
        creditList:[],
        debitList:[]
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      let userDetail = this.$store.state.appconf.userDetail;
      if(userDetail.length > 0) {
        this.user  = JSON.parse(userDetail)
      }
      let  currentOptCard = this.$store.state.appconf.currentOptCard
      if(currentOptCard.length > 0) {
        this.card  = JSON.parse(currentOptCard)
      }
      this.$log(this.user)
      this.$log(this.card)
      this.getData()
    },

    methods: {
      formatTime(timeString) {
        if (timeString == null)
          return ""
        return this.$moment(new Date(parseInt(timeString))).format('YYYY/MM/DD HH:mm:ss')
      },
      getData() {
        this.$log(this.pageNo)
        let todayTime = this.$moment(new Date()).format('YYYYMMDDHHmmss')
        let options = {
          "cardnum": this.card.cardnum,
          "fromtime": this.card.addDate,
          "pagenum": this.pageNo,
          "pagerecord": this.pagerecord,
          "phonenum": this.user.telephone,
          "totime": todayTime
        }
        let that = this
        that.$api.xapi({
          method: 'post',
          baseURL: this.$api.OPTCARDS_URL,
          url: '/woc/cardconsume/getconsumptionlist',
          data: options
        }).then((response) => {
          that.$log(response.data.data)
          let ret = response.data.data
          if(ret.totalcount >= this.pageNo*this.pagerecord) {
            this.$log("继续获取")
            this.pageNo++
            this.getData();
          } else {//获取到所有数据
            this.$log("获取到全部数据")
            if(ret.creditCardConsumptionDetail != null ) {
              ret.creditCardConsumptionDetail.forEach(item =>{
                this.$log("############")
                this.$log(item)
                this.creditList.push(item)
              })
            }
            this.creditList.sort(function(a,b){return b.ordertime > a.ordertime ? 1 : -1 })
            if(ret.debitCardConsumptionDetail != null ) {
              ret.debitCardConsumptionDetail.forEach(item =>{
                this.debitList.push(item)
              })
            }
            this.debitList.sort(function(a,b){return b.ordertime > a.ordertime ? 1 : -1 })
          }
          that.launchedLoaded = true
        }).catch(function (error) {
          that.launchedLoaded = true
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .myOptCardDetail {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .optCardDetailBody {
      .optCardDetailMain {
        width: 100%;
        .detailCard{
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
          .detailDate{
             color: #8c8c8c;
             .fz(font-size,25)
          }
        }
        .noContext {
          width: 100%;
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

          .noContext_line1 {
            font-weight: lighter;
            color: black;
            .fz(font-size, 35);
          }
        }
      }
    }
  }
</style>
