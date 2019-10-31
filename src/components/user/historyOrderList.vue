<template lang="html">
  <section class="historyOrder">
    <v-header v-if="showHeader">
      <h1 slot="title">历史订单</h1>
    </v-header>
    <div class="historyOrderList">
      <van-list v-model="loading"
                :finished="finished"
                @load="onLoad">
        <div v-if="launchedLoaded && list.length > 0">
          <div v-for="k in list" :key="k.id" style="background-color: white;margin: 10px" >
            <div class="goods-detail">
              <div>
                <van-cell :value="formatHOrderStatus(k)">
                  <div slot="title">
                    <span style="color: black;font-weight: bold">订单:{{k.ordersn}}</span>
                  </div>
                </van-cell>
              </div>
              <ul>
              <li v-for="(sku,i)  in k.itemList" :key='i' style="list-style: none">
                <van-card
                  :price="sku.price"
                  :title="sku.title"
                  :num="sku.total"
                  :thumb="sku.cover">
                </van-card>
              </li>
            </ul>
              <div class="orderDetailSummery">
                <span style="color: black;font-weight: bold">合计: ￥{{parseFloat(k.price).toFixed(2)}}元</span>
                <span style="float: right;color: #1989fa" @click="onHistoryOrderItemClick(k)">查看详情</span>
              </div>
            </div>
          </div>
        </div>
       <div v-else-if="launchedLoaded && list.length == 0">
          <div class="noContext">
            <img :src="icon_noContext">
            <span class="noContext_line1">亲，没有任何内容!</span>
          </div>
        </div>
      </van-list>
    </div>
  </section>
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
        pageNo: 1,
        total: -1,
        list: [],
        loading: false,
        finished: false,
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
        launchedLoaded: false,
        activeNames: ['1'],
        userDetail: null
      }
    },

    mounted() {
      setTimeout(() => {
        if (!this.launchedLoaded) {
          this.onLoad()
        }
      }, 1000);
    },


    created() {
      this.$log("historyOrderList created Enter")
      this.showHeader = this.$api.HAS_HEADER;
      if(this.$store.state.appconf.userDetail.length > 0) {
        this.userDetail =  JSON.parse(this.$store.state.appconf.userDetail)
      }
      this.$log(this.userDetail)
    },

    methods: {
      onHistoryOrderItemClick(k) {
        this.$log("onHistoryOrderItemClick Enter")
        this.$router.push({
          name: "历史订单详情页",
          params: {
            info:k,
          }
        })
      },
      formatHOrderStatus(k) {
//-4:已退货,-3:已关闭,-2:已删除,-1:已取消,0:待支付,1:已支付待发货,2:已发货,3:已收货,4:已完成,-5:已退款，6：部分退款
        let statusType = k.status
        let status = ""
        switch (statusType) {
          case -4:
            status = "已退货"
            break;
          case -3:
            status = "已关闭"
            break;
          case -2:
            status = "已删除"
            break;
          case -1:
            status = "已取消"
            break;
          case 0:
            status = "待支付"
            break;
          case 1:
            status = "已支付待发货"
            break;
          case 2:
            status = "已发货"
            break;
          case 3:
            status = "已收货"
            break;
          case 4:
            status = "已完成"
            break;
          case 5:
            status = "已退款"
            break;
          case 6:
            status = "部分退款"
            break;
          default:
            break;
        }
        return status;
      },
      onLoad() {
        this.$log("onLoad Enter")
        let that = this
        let userInfo = this.$store.state.appconf.userInfo
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          if(this.userDetail == null) {
            this.loading = false;
            this.finished = true;
            this.launchedLoaded = true;
            return
          }
          if (this.total == -1 || this.total > this.list.length) {
            let options = {
              "pageNo": this.pageNo++,
              "mobile": this.userDetail.telephone
            }
            this.$api.xapi({
              method: 'post',
              baseURL: this.$api.ORDER_BASE_URL,
              url: '/old/order/all',
              data: options,
            }).then((response) => {
              this.result = response.data.data;
              this.launchedLoaded = true;
              this.$log(this.result)
              this.total = this.result.total;
              if (this.result.list.length == 0) {
                this.loading = false;
                this.finished = true;
              } else {
                this.list = this.result.list
                this.$log(this.list)
                this.loading = false;
                if (this.list.length >= this.total)
                  this.finished = true;
              }
            }).catch(function (error) {
              console.log(error)
              that.loading = false;
              that.finished = true;
              that.launchedLoaded = true;
            })
          }
        } else {
          this.loading = false;
          this.finished = true;
          this.launchedLoaded = true;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .historyOrder {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .historyOrderList {
      background-color: #f8f8f8;
      .goods-detail{
        display: flex;
        flex-direction: column;
        .van-card{
          background-color: white;
        }
        .orderDetailSummery {
          padding: 10px;
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
</style>
