<template lang="html">
  <section class="orderDetail">
    <v-header>
      <h1 slot="title">订单详情</h1>
    </v-header>
    <div class="oder-body">
      <div class="user-info">
        <div class="custom-text">
          <van-icon name="location"/>
          <span>{{detail.receiverName}}  {{detail.mobile}}</span>
        </div>
        <div class="custom-text">
          <span>{{detail.provinceName}}{{detail.cityName}}{{detail.countyName}}{{detail.address}}</span>
        </div>
      </div>
      <div class="order-list">
        <van-cell :title=getMerchantName(detail.merchantNo) icon="shop"/>
        <ul>
          <li v-for="(sku,i)  in detail.skus" :key='i' style="list-style: none">
            <van-card
              :price="sku.unitPrice"
              :title="sku.name"
              :num="sku.num"
              :thumb="sku.image">
            </van-card>
          </li>
        </ul>
        <div class="orderSummery">
          <span>合计: ￥{{detail.amount.toFixed(2)}}元 (含运费￥{{detail.servFee.toFixed(2)}}元) </span>
        </div>
      </div>
      <div class="order-detail">
        <van-cell title="订单信息" icon="info-o" />
        <span>订单编号:</span>
        <p>{{getDisplayOderNo(detail.tradeNo)}}</p>
        <span>交易单号:</span>
        <p>xxxx</p>
        <span>创建时间:</span>
        <p>{{formatTime(detail.createdAt)}}</p>
        <span>成交时间:</span>
        <p>xxxx</p>
        <span>配送方式: {{getDisplayLogisticsInfo()}}</span>
        <p></p>
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
        detail: {}
      }
    },


    created() {
      this.$log("oderDetail created Enter")
      this.detail = this.$route.params.detail;
      this.$log(this.detail)

    },

    computed: {},

    methods: {
      getDisplayLogisticsInfo() {
        this.$log("getDisplayLogisticsInfo:"+this.detail.status)
        if(this.detail.status != 1)
          return "普通快递"
        else
          return 0;
      },
      formatTime(timeString) {
        //2019-01-27T07:56:27.000+0000
        let dateee = new Date(timeString).toJSON();
        return new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
      },

      getDisplayOderNo(orderNo) {
        if(orderNo.length > 8)
          return orderNo.substr(orderNo.length  - 8).replace(/\"/g, "")
        else
          return orderNo;
      },


      getMerchantName(merchantNo) {
        if (merchantNo == 20) {
          return "苏宁易购"
        } else if (merchantNo == 30) {
          return "唯品会"
        } else if (merchantNo == 50) {
          return "天猫精选"
        } else if (merchantNo == 60) {
          return "京东"
        } else {
          return "商城自营"
        }
      },

    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .orderDetail {
    width: 100%;
    text-align: left;
    .oder-body {
      background-color: #f0f0f0;

      .user-info {
        background-color: white;
        padding: 1em;
        .van-icon {
          margin-right: 0.5em;
        }
        .custom-text {
          .fz(font-size, 30);
          font-weight: bold;
          margin-top: 0.25em
        }
      }

      .order-list {
        background-color: white;
        margin-top: 1em;
        padding-bottom: 0.5em;
        .orderSummery {
          background-color: #ffffff;
          text-align: right;
          margin-right: 1em;
          .fz(font-size, 30);
          color: #000000;
          padding-top: 0.5em;
        }
      }
      .order-logistics {
        background-color: white;
        margin-top: 1em;
        >span{
          .fz(font-size, 30);
          margin: 1em;
          color: #000000;
        }
      }
      .order-detail {
        background-color: white;
        margin-top: 1em;
        .van-cell{
          background-color: white;
          margin-top: -1px;
          color: #000000;
        }
        >span{
          .fz(font-size, 25);
          margin: 1em;
          color: #000000;
        }
        >p{
          .fz(font-size, 20);
          margin: 1em 1em 1em 2em;
          color: #000000;
        }
      }
    }
  }
</style>
