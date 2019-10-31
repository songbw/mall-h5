<template lang="html">
  <section class="historyOrderDetail">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">订单详情</h1>
    </v-header>
    <div class="DetailBody">
      <div class="orderSN">
        <div>
          <span class="orderNo">编号:{{orderInfo.ordersn}}</span>
          <span class="orderStatus">{{formatHOrderStatus(orderInfo)}}</span>
        </div>
      </div>
      <div class="user-info">
        <div class="custom-text">
          <van-icon name="location"/>
          <span>{{orderInfo.username}}  {{orderInfo.mobile}}</span>
        </div>
        <div class="custom-address">
          <span>地址: {{orderInfo.address}}</span>
        </div>
      </div>
      <div class="prod-info">
        <van-cell title="惠民优选" icon="shop"/>
        <div v-for="(sku,i)  in orderInfo.itemList" :key='i' style="list-style: none">
          <van-card
            :price="sku.price"
            :title="sku.title"
            :num="sku.total"
            :thumb="sku.cover"
            style="background-color: white">
          </van-card>
        </div>
      </div>
      <div class="detail-info">
        <div class="infoBox">
          <span class="title">订单金额:</span>
          <span class="value">￥{{orderInfo.price.toFixed(2)}}元</span>
        </div>
        <div class="infoBox">
          <span class="title">下单时间:</span>
          <span class="value">{{formatTime(orderInfo.createtime)}}</span>
        </div>
        <div class="infoBox" v-if="orderInfo.payTime != null || orderInfo.payTime.length > 0">
          <span class="title">支付时间:</span>
          <span class="value">{{formatTime(orderInfo.payTime)}}</span>
        </div>
        <div class="infoBox" v-if="orderInfo.dispatch_type != 0">
          <span class="title">配送方式:</span>
          <span class="value">{{formateExpressType(orderInfo.dispatchType)}}</span>
        </div>
        <div class="infoBox" v-if="orderInfo.expressTitle != null || orderInfo.expressTitle.length > 0">
          <span class="title">物流公司:</span>
          <span class="value">{{orderInfo.expressTitle}}</span>
        </div>
        <div class="infoBox" v-if="orderInfo.expressNo != null || orderInfo.expressNo.length > 0">
          <span class="title">物流单号:</span>
          <span class="value">{{orderInfo.expressNo}}</span>
        </div>
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
        showHeader: false,
        orderInfo: null
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      this.orderInfo = this.$route.params.info;
      this.$log(this.orderInfo)
    },

    methods: {
      formateExpressType(dispatch_type) {
        if (dispatch_type == 1) {
          return "快递"
        } else if (dispatch_type == 2) {
          return "自取"
        }
      },
      formatTime(timeString) {
        this.$log(timeString)
        if (timeString == null)
          return ""
        return this.$moment(new Date(timeString * 1000)).format('YYYY/MM/DD HH:mm:ss')
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
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .historyOrderDetail {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;
    .DetailBody {
      background-color: #f8f8f8;
      padding: 5px 0px;
      .infoBox {
        margin: 5px 0px;

        .title {
          .fz(font-size, 30);
          font-weight: bold;
        }

        .value {
          .fz(font-size, 25);
          font-weight: bold;
          float: right;
          margin-top: 0.4em
        }
      }

      .orderSN {
        background-color: white;
        margin: 10px;
        padding: 1em;

        .orderNo {
          .fz(font-size, 35);
          font-weight: bold;
        }

        .orderStatus {
          .fz(font-size, 35);
          font-weight: bold;
          float: right;
          color: #ff4444;
        }
      }

      .user-info {
        background-color: white;
        margin: 10px;
        padding: 1em;

        .van-icon {
          margin-right: 0.5em;
        }

        .custom-text {
          .fz(font-size, 35);
          font-weight: bold;
          margin-top: 0.25em
        }
      }

      .detail-info {
        background-color: white;
        margin: 10px;
        padding: 1em;
        .fz(font-size, 35);
        font-weight: bold;
      }

      .prod-info {
        background-color: white;
        margin: 10px;
        padding: 1em;
      }
    }
  }
</style>
