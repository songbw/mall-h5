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
            <div class="logisticsBox">
              <div class="matched-goods">
                <ul>
                  <li v-for="(sku,skuIndex)  in getMatchedGoods(item.nu)" :key='skuIndex'>
                    <van-card
                      :price="sku.unitPrice"
                      :title="sku.name"
                      :num="sku.num"
                      :thumb="sku.image">
                    </van-card>
                  </li>
                </ul>
              </div>
              <van-steps direction="vertical" :active="0" active-color="#f44">
                <van-step v-for="(info,k)  in item.data" :key='k'>
                  <h3>{{info.context}}</h3>
                  <p>{{info.ftime}}</p>
                </van-step>
              </van-steps>
            </div>
          </li>
        </ul>
        <div class="logisticsBox">
          <ul>
            <li v-for="(sku,skuIndex)  in getPreparingGoods()" :key='skuIndex'>
              <van-card
                :price="sku.unitPrice"
                :title="sku.name"
                :num="sku.num"
                :thumb="sku.image">
              </van-card>
            </li>
          </ul>
          <van-steps direction="vertical" :active="0" active-color="#f44">
            <van-step>
              <h3>商家正在准备商品，敬请等待...</h3>
              <p>{{formatTime(this.detail.paymentAt)}}</p>
            </van-step>
          </van-steps>
        </div>
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
        loading: false
      }
    },
    computed: {},

    created() {
      let that = this;
      that.$log("logistics created Enter")
      that.detail = this.$route.params.detail;
      this.$log(that.detail)
      that.$api.xapi({
        method: 'get',
        url: '/order/logistics',
        params: {
          merchantNo: this.detail.merchantNo,
          orderId: this.detail.tradeNo,
        }
      }).then((response) => {
        that.logisticsList = response.data.data.result;
        that.$log("logisticsList:" + JSON.stringify(that.logisticsList));
        that.loading = true;
      }).catch(function (error) {
        that.$log(error)
        that.loading = true;
      })
    },

    computed: {},

    methods: {
      getPreparingGoods() {
        let goods = []
        this.detail.skus.forEach(sku => {
          if(sku.logisticsId == null)
          goods.push(sku)
        })
        return goods
      },
      getMatchedGoods(nu) {
        this.$log(nu)
        let goods = []
        this.detail.skus.forEach(sku => {
          if (sku.logisticsId == nu) {
            goods.push(sku)
          }
        })
        return goods
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },
      formatTime(timeString) {
        //2019-01-27T07:56:27.000+0000
        if (timeString == null)
          return null
        let dateee = new Date(timeString).toJSON();
        return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .logisticsDetail {
    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .logistics-body {
      padding-top: 2.3em;

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
        margin-top: 10px;
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
