<template lang="html">
  <section class="logisticsDetail">
    <v-header class="header">
      <h1 slot="title">物流信息</h1>
    </v-header>
    <div class="logistics-body">
      <div class="noneInfo" v-if="loading">
        <v-loading></v-loading>
      </div>
      <div class="logisticsInfo" v-else>
        <ul>
          <li v-for="(item,i)  in logisticsList" :key='i'>
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
        <div class="logisticsBox" v-if="getPreparingGoods().length > 0">
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
  import Loading from '@/common/_loading.vue'
  export default {
    components: {
      'v-header': Header,
      'v-loading': Loading
    },
    data() {
      return {
        detail: {},
        status: -1,
        no_logistics_bg: require('@/assets/images/truck.png'),
        logisticsList: [],
        matchedGoods:[],
        loading: true
      }
    },
    computed: {},

    created() {
      let that = this;
      that.$log("logistics created Enter")
      that.detail = this.$route.params.detail;
      that.loading = true;
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
              if(sku.skuId === matchedGoods[i].skuId) {
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
      padding-top: 3em;

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
