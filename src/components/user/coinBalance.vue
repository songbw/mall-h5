<template lang="html">
  <div class="coinBalance" >
    <v-header v-if="showHeader">
      <h1 slot="title">余额账户</h1>
    </v-header>
    <div class="coinBalanceBody">
      <div class="box"></div>
      <div class="balanceAmountBox">
        <div class="infoBox">
          <img :src="icon_coin_amount">
          <span>我的余额</span>
          <div class="amountInfo">
            <p><span>￥</span>{{(amount/100).toFixed(2)}}</p>
          </div>
        </div>
      </div>
      <div class="scrollerWrap">
        <div class="cousumeListTitle">我的消费记录</div>
        <div v-if="c && list.length > 0">
          <scroller  height="100%"
                     :on-refresh="refresh"
                     :on-infinite="infinite"
                     refresh-layer-color="#FF4444"
                     　　　　　 loading-layer-color="#FF4444"
                     ref="myscroller">
            <main class="scrollerContent">
              <div v-for="item in list" style="height: 500px">{{item}}</div>
            </main>
          </scroller>
        </div>
        <div v-else>
          <div class="noContext">
            <img :src="icon_noContext">
            <span class="noContext_line1">亲，没有消费记录!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import  Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        showHeader: true,
        icon_coin_amount: require('@/assets/icons/ico_coin_amount.png'),
        amount: 0,
        loadFinished: false,
        list:[],
        showPage: 1,
        totalSize: 0,
        launchedLoaded: false,
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
      }
    },

    created() {
      this.$log("coin balance created Enter")
      this.showHeader = this.$api.HAS_HEADER;
      this.updateBalanceAmount()
      this.updateConsumeList()
    },

    methods: {
      infinite(done) {   //上拉加载
        this.$log("infinite Enter")
        let that = this;
        if (!that.loadFinished) {
          setTimeout(() => {
            that.showPage++;//下拉一次页数+1
            that.updateConsumeList();
            done()//进行下一次加载操作
          }, 1500)
        } else {
          that.$refs.myscroller.finishInfinite(true);//这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
        }
      },

      refresh:function(){         //下拉刷新
        let self=this;
        console.log('refresh');
        let that = this
        that.showPage = 1//重置页数刷新每次页数都是第一页
        that.loadFinished = false//重置数据判断
        setTimeout(function(){
          that.updateConsumeList();
          self.$refs.myscroller.finishPullToRefresh();//停止下拉刷新动效
        },1500)
      },

      updateConsumeList() {
        let that = this
        let options = {
          "pageNo": 1,
          "pageSize": 10
        }
        that.$api.xapi({
          method: 'post',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/balance/detail/all',
          data: options,
        }).then((response) => {

        }).catch(function (error) {
            that.loadFinished = true

        })
      },
      updateBalanceAmount() {
        let that =this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/balance',
            params: {
              openId:user.openId
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
        position: fixed;
        width: 100%;
        justify-content: center;
        justify-items: center;
        align-items: center;

        .infoBox {
          padding: 10px 0px;
          width: 96%;
          min-height: 150px;
          background-color: white;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;

          img {
            height: 80px;
            width:  80px;
          }

          .amountInfo {
            .fz(font-size, 80);
            color: #333333;
            font-weight: bold;
            span {
              .fz(font-size, 50);
            }
          }

          .van-cell{
            margin-top: -1px;
          }
        }

        .pathBox {
          margin-top: 10px;
          padding: 10px 0px;
          width: 96%;
          min-height: 100px;
          background-color: white;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .van-cell{
            margin-top: -1px;
          }
        }
      }

      .scrollerWrap{
        position:absolute;
        width:100%;
        height:85%;//有header的时候可能会出现滚动条，所以最好高度是除去header的高度
        top:200px;//一般页面有header的时候需要留出header的高度
        bottom:20px;
        border-radius: 10px;
        main{
          height:100%;
        }
        .cousumeListTitle{
          text-align: center;
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
        .van-button{
          margin: 10px;
        }
      }
    }


  }
</style>
