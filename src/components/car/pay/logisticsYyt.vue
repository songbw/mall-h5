<template lang="html">
  <section class="logisticsDetail">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">物流信息</h1>
    </v-header>
    <div class="logistics-body" :style="{'padding-top':showHeader? '3em':'0px'}">
      <div class="noneInfo" v-if="loading">
        <v-loading></v-loading>
      </div>
      <div class="logisticsInfo" v-else>
        <div v-for="(item,i)  in logisticsList" :key='i'>
          <div class="matched-goods">
            <ul>
              <li v-for="(sku,skuIndex)  in getMatchedGoods(item.skuList)" :key='skuIndex'>
                <van-card
                  :price="sku.unitPrice"
                  :title="sku.name"
                  :num="sku.num"
                  :thumb="sku.image">
                </van-card>
                <div>
                  <div style="font-size: small">
                    <span style="margin-left: 5px">物流公司:</span>
                    <span style="float: right;margin-right: 5px">{{item.deliveryName}}</span>
                  </div>
                  <div style="font-size: small">
                    <span style="margin-left: 5px">物流信息:</span>
                    <span style="float: right;margin-right: 5px">{{item.deliveryNo}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <van-steps direction="vertical" :active="0" active-color="#f44">
            <van-step v-for="(info,k)  in getOrdedDeliveryList(item.deliveryList)" :key='k'>
              <h3>{{info.context}}</h3>
              <p>{{info.time}}</p>
            </van-step>
          </van-steps>
        </div>
        <div class="logisticsBox" v-if="getPreparingGoods().length > 0">
          <ul>
            <li v-for="(sku,skuIndex)  in getPreparingGoods()" :key='skuIndex'>
              <van-card
                :price="sku.unitPrice"
                :title="sku.name"
                :num="sku.num"
                :thumb="sku.image">
              </van-card>
              <van-steps direction="vertical" :active="0" active-color="#f44">
                <van-step>
                  <h3>快马加鞭揽件中……</h3>
                </van-step>
              </van-steps>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Loading from '@/common/_loading.vue'

  export default {
    components: {
      'v-header': Header,
      'v-loading': Loading
    },
    data() {
      return {
        showHeader: true,
        detail: {},
        status: -1,
        logisticsList: [],
        matchedGoods: [],
        loading: true
      }
    },
    computed: {},

    async created() {
      let that = this;
      this.showHeader = this.$api.HAS_HEADER;
      that.$log("logisticsYyt created Enter")
      that.detail = this.$route.params.detail;
      that.loading = true;
      that.$log(that.detail)
      try {
        let response = await this.getLogisticsInfo()
        this.$log(response)
        if (response.data.code == 200) {
          if(response.data.data != null) {
            this.logisticsList = response.data.data
          }
        }
        that.loading = false;
      } catch (e) {
        that.loading = false;
      }
    },

    computed: {},

    methods: {
      getOrdedDeliveryList(deliveryList) {
        let list = []
        if (deliveryList != null && deliveryList.length > 0) {
          for (let i = (deliveryList.length - 1); i > -1; i--) {
            list.push(deliveryList[i])
          }
        }
        return list
      },
      getLogisticsInfo() {
        this.$log("getLogisticsInfo Enter")
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.AOYIS_CONFIG_URL,
          url: '/star/orders/express',
          params: {
            orderSn: this.detail.aoyiId
          },
        })
      },
      getPreparingGoods() {
        this.$log("getPreparingGoods Enter,this.detail.skus.length:" + this.detail.skus.length)
        let goods = []
        let matchedGoods = [];
        this.$log(this.logisticsList)
        for (let i = 0; i < this.logisticsList.length; i++) {
          this.$log(this.logisticsList)
          let subMatched = this.getMatchedGoods(this.logisticsList[i].skuList)
          subMatched.forEach(sku => {
            matchedGoods.push(sku)
          })
        }
        this.detail.skus.forEach(sku => {
          let found = -1;
          for (let i = 0; i < matchedGoods.length; i++) {
            if (sku.mpu === matchedGoods[i].mpu) {
              found = 1;
              break;
            }
          }
          if (found == -1)
            goods.push(sku)
        })
        return goods
      },
      getMatchedGoods(skuList) {
        this.$log("getMatchedGoods Enter")
        let matchedGoods = []
        this.detail.skus.forEach(sku => {
          this.$log(sku)
          skuList.forEach(yytSku => {
            this.$log(yytSku)
            if (sku.skuId === yytSku.code) {
              matchedGoods.push(sku)
            }
          })
        })
        return matchedGoods
      },

      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .logisticsDetail {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .logistics-body {
      padding-top: 3em;
      padding-bottom: 1em;
      background-color: #f8f8f8;

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
        height: 100%;
        top: 0px;
        background-color: #f8f8f8;
        margin: 10px;

        .logisticsBox {
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
