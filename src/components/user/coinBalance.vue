<template lang="html">
  <div class="coinBalance">
    <v-header v-if="showHeader">
      <h1 slot="title">余额账户</h1>
    </v-header>
    <div class="coinBalanceBody">
      <div class="box"></div>
      <div class="balanceAmountBox" >
        <div class="infoBox" style="z-index: 1">
          <img :src="icon_coin_amount">
          <span>我的余额</span>
          <div class="amountInfo">
            <p><span>￥</span>{{(amount/100).toFixed(2)}}</p>
          </div>
        </div>
        <div class="scrollerWrap">
          <div class="cousumeListTitle">我的消费记录</div>
          <van-list v-model="loading"
                    :finished="finished"
                    @load="onLoad">
            <div v-if="list.length > 0 && finished">
              <div v-for="(k,index) in list" :key="index" style="background-color: white;margin: 10px">
                <div class="consume-detail">
                  <div>
                    <span>支付:</span>
                    <span style="float: right;color: #ff4444">{{(k.saleAmount/100).toFixed(2)}}</span>
                  </div>
                  <div>
                    <span>日期:{{formatTime(k.createdAt)}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="finished">
              <div class="noContext">
                <img :src="icon_noContext">
                <span class="noContext_line1">亲，还没有消费记录!</span>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        showHeader: true,
        icon_coin_amount: require('@/assets/icons/ico_coin_amount.png'),
        amount: 0,
        pageNo: 1,
        total: -1,
        list: [1, 2, 3, 4,5,6,7,8],
        loading: false,
        finished: false,
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
        launchedLoading: false,
      }
    },

    created() {
      this.$log("coin balance created Enter")
      this.showHeader = this.$api.HAS_HEADER;
      this.updateBalanceAmount()
      //  this.updateConsumeList()
      setTimeout(() => {
        if (!this.launchedLoading) {
          this.onLoad(this.active)
        }
      }, 1000);
    },

    methods: {
      formatTime(timeString) {
        if (timeString == null)
          return ""
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
      },
      onLoad() {
        this.$log("onLoad Enter")
        let that = this
        this.launchedLoading = true;
        let userInfo = this.$store.state.appconf.userInfo
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          if (this.total == -1 || this.total > this.list.length) {
            let options = {
              "pageNo": 1,
              "pageSize": 10,
              "openId": user.openId
            }
            that.$api.xapi({
              method: 'post',
              baseURL: this.$api.SSO_BASE_URL,
              url: '/balance/detail/all',
              data: options,
            }).then((response) => {
              this.$log(response)
              if(response.data.code == 200) {
                this.list = response.data.data.list
                this.$log(this.list)
              }
              that.loading = false;
              that.finished = true;
            }).catch(function (error) {
              that.loading = false;
              that.finished = true;
            })
            /* this.$api.xapi({
               method: 'get',
               baseURL: this.$api.WORKER_ORDER_BASE_URL,
               url: '/customers/work_orders',
               data: options,
             }).then((response) => {
               this.result = response.data;
               this.$log(this.result)
               this.total = this.result.total;
               if (this.result.rows.length == 0) {
                 this.loading = false;
                 this.finished = true;
               } else {
                 this.result.rows.forEach(item => {
                   this.list.push(item);
                 })
                 this.$log(this.list)
                 this.loading = false;
                 if (this.list.length >= this.total)
                   this.finished = true;
               }
             }).catch(function (error) {
               console.log(error)
               that.loading = false;
               that.finished = true;
             })*/
          }
        } else {
          this.loading = false;
          this.finished = true;
        }
      },

      updateConsumeList() {
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)

        } else {
          this.$toast("没有用户信息，请先登录")
          that.launchedLoaded = true
        }

      },
      updateBalanceAmount() {
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/balance',
            params: {
              openId: user.openId
            }
          }).then((response) => {
            this.amount = response.data.data.amount
          }).catch(function (error) {
            that.$log(error)
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .coinBalance {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .coinBalanceBody {
      .box {
        padding-top: 1em;
        position: relative;
        width: 100%;
        background-color: #ff4444;
      }

      .box:after {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -30px;
        content: ' ';
        height: 30px;
        width: 100%;
        border-radius: 0 0 30% 30%;
        background-color: #ff4444;
        overflow: hidden;
      }

      .balanceAmountBox {
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: center;
        justify-items: center;
        align-items: center;

        .infoBox {
          padding: 10px 0px;
          width: 96%;
          min-height: 120px;
          background-color: white;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;

          img {
            height: 80px;
            width: 80px;
          }

          .amountInfo {
            .fz(font-size, 80);
            color: #333333;
            font-weight: bold;

            span {
              .fz(font-size, 50);
            }
          }

          .van-cell {
            margin-top: -1px;
          }
        }
      }

      .scrollerWrap {
        width: 100%;
        height: 100%;
        top: 0px;
        background-color: #f8f8f8;

        .consume-detail{
           padding: 10px;
           color: black;
           .fz(font-size,35px)
        }

        .cousumeListTitle {
          text-align: center;
          .fz(font-size, 40);
          font-weight: bold;
          color: black;
          margin-top: 10px;
        }

        .noContext {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;
          height: 400px;

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

      .pay-order {
        background-color: white;
        margin-top: 10px;
      }

      .pay-amount {
        background-color: white;
        margin-top: 10px;
        display: flex;
        text-align: center;
        justify-content: center;
        height: 200px;
        line-height: 200px;
        color: #ff4444;
        font-size: xx-large;
        font-weight: bold;
      }

      .footer_layout {
        width: 100%;
        height: 16vw;
        display: -webkit-flex;
        display: -ms-flex;
        display: flex;
        align-items: center;
        position: fixed;
        bottom: 10px;
        left: 0;

        .van-button {
          margin: 10px;
        }
      }
    }


  }
</style>
