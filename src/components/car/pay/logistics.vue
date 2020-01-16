<template lang="html">
  <section class="logisticsDetail">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">物流信息</h1>
    </v-header>
    <div class="logistics-body"  :style="{'padding-top':showHeader? '3em':'0px'}">
      <div class="noneInfo" v-if="loading">
        <v-loading></v-loading>
      </div>
      <div class="logisticsInfo" v-else>
        <div>
          <div v-for="(item,i)  in logisticsList" :key='i'>
            <div class="logisticsBox" v-if="getMatchedGoods(item.nu).length > 0">
              <div class="matched-goods">
                <ul>
                  <li v-for="(sku,skuIndex)  in getMatchedGoods(item.nu)" :key='skuIndex'>
                    <van-card
                      :price="sku.unitPrice"
                      :title="sku.name"
                      :num="sku.num"
                      :thumb="sku.image">
                    </van-card>
                    <div>
                      <div style="font-size: small">
                        <span style="margin-left: 5px">物流公司:</span>
                        <span style="float: right;margin-right: 5px">{{sku.logisticsContent}}</span>
                      </div>
                      <div style="font-size: small">
                        <span style="margin-left: 5px">物流信息:</span>
                        <span style="float: right;margin-right: 5px">{{sku.logisticsId}}</span>
                      </div>
                    </div>
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
          </div>
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
              <div  v-if="sku.logisticsContent != null && sku.logisticsId != null">
                <div style="font-size: small">
                  <span style="margin-left: 5px">物流公司:</span>
                  <span style="float: right;margin-right: 5px">{{sku.logisticsContent}}</span>
                </div>
                <div style="font-size: small">
                  <span style="margin-left: 5px">物流信息:</span>
                  <span style="float: right;margin-right: 5px">{{sku.logisticsId}}</span>
                </div>
              </div>
              <div v-else>
                <van-steps direction="vertical" :active="0" active-color="#f44">
                  <van-step>
                    <h3>快马加鞭揽件中……</h3>
                  </van-step>
                </van-steps>
              </div>
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
        matchedGoods:[],
        loading: true
      }
    },
    computed: {},

    created() {
      let that = this;
      this.showHeader = this.$api.HAS_HEADER;
      that.$log("logistics created Enter")
      that.detail = this.$route.params.detail;
      that.loading = true;
      that.$log(that.detail)
      that.$api.xapi({
        method: 'get',
        baseURL: this.$api.ORDER_BASE_URL,
        url: '/order/logistics',
        params: {
          merchantNo: this.detail.merchantNo,
          orderId: this.detail.tradeNo,
        }
      }).then((response) => {
        that.logisticsList = response.data.data.result;
        that.$log("logisticsList:" + JSON.stringify(that.logisticsList));
        that.loading = false;
      }).catch(function (error) {
        that.$log(error)
        that.loading = false;
      })
    },

    computed: {},

    methods: {
      getPreparingGoods() {
        this.$log("getPreparingGoods Enter,this.detail.skus.length:"+this.detail.skus.length)
        let goods = []
        let matchedGoods = [];
        for(let i =0 ; i < this.logisticsList.length; i++) {
          let subMatched = this.getMatchedGoods(this.logisticsList[i].nu)
          subMatched.forEach(sku => {
            matchedGoods.push(sku)
          })
        }
        this.detail.skus.forEach(sku => {
           let found = -1;
           for(let i=0; i < matchedGoods.length ; i++)
           {
              if(sku.mpu === matchedGoods[i].mpu) {
                found = 1;
                break;
              }
           }
           if(found == -1)
             goods.push(sku)
        })
        return goods
      },
      getMatchedGoods(nu) {
        this.$log(nu)
        let matchedGoods = []
        this.detail.skus.forEach(sku => {
          if (sku.logisticsId == nu) {
            matchedGoods.push(sku)
          }
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
