<template lang="html">
  <section class="logisticsDetail">
    <v-header class="header">
      <h1 slot="title">物流信息</h1>
    </v-header>
    <div class="logistics-body">
      <div class="noneInfo" v-if="loading && (logisticsList == null || logisticsList.length == 0)">
        <img :src="no_logistics_bg"/>
        <span>没有查询到物流信息</span>
      </div>
      <div class="logisticsInfo" v-else>
        <ul>
          <li v-for="(item,i)  in logisticsList" :key='i'>
            <div class="logisticsBox" v-if="orderSku(item.skuId) != null">
              <van-card
                :price="orderSku(item.skuId).unitPrice"
                :title="orderSku(item.skuId).name"
                :num="orderSku(item.skuId).num"
                :thumb="orderSku(item.skuId).image">
              </van-card>
              <van-steps direction="vertical" :active="0" active-color="#f44">
                <van-step v-for="(info,k)  in getTimerFlowInfo(item.orderLogistics)" :key='k'>
                  <h3>{{info.operateState}}</h3>
                  <p>{{formatedTime(info.operateTime)}}</p>
                </van-step>
              </van-steps>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        detail: {},
        status: -1,
        no_logistics_bg: require('@/assets/images/truck.png'),
        logisticsList: [],
        loading:false
      }
    },
    computed: {},

    created() {
      let that = this;
      that.$log("logistics created Enter")
      that.detail = this.$route.params.detail;
      that.$api.xapi({
        method: 'get',
        url: '/order/logistics',
        params: {
          merchantNo: this.detail.merchantNo,
          orderId: this.detail.tradeNo,
        }
      }).then((response) => {
        that.logisticsList = response.data.data.result;
        that.$log("logisticsList:"+JSON.stringify(that.logisticsList));
        that.loading = true;
      }).catch(function (error) {
        that.$log(error)
        that.loading = true;
      })
    },

    computed: {},

    methods: {
      orderSku(skuId) {
        for (let i = 0; i < this.detail.skus.length; i++) {
          this.$log(this.detail.skus[i].skuId)
          if (skuId == this.detail.skus[i].skuId)
            return this.detail.skus[i];
        }
        return null;
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },
      formatedTime(timeStr) {
        let year = timeStr.substr(0,4);
        let month = timeStr.substr(4,2);
        let day = timeStr.substr(6,2);
        let h = timeStr.substr(8,2);
        let m = timeStr.substr(10,2);
        let s = timeStr.substr(12);
        let timeFormated = year+"/"+month+"/"+day+" "+h+":"+m+":"+s
        return timeFormated;
      },

      getTimerFlowInfo(orderLogistics) {
        return orderLogistics.reverse();
      }

    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .logisticsDetail {
    .header{
      width:100%;
      line-height:10vw;
      position:fixed;
      z-index:1;
      top:0;
      text-align:center;
    }
    .logistics-body{
      padding-top: 11vw;
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
      .logisticsInfo {
        .logisticsBox {
          border: #f0f0f0 solid 10px;
          > li {
            list-style: none;
          }
        }

      }
      .van-card {
        background-color: #ffffff;

        &__price {
          margin-top: 0.5em;
          .fz(font-size, 40);
        }
      }
    }
  }
</style>
