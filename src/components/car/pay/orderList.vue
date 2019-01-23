<template lang="html">

  <div class="orderlist">
    <v-header>
      <h1 slot="title">我的订单</h1>
    </v-header>
    <van-tabs v-model="active" sticky @click="onClick" :swipe-threshold=swipeThreshold swipeable>
      <van-tab v-for="(item,index) in orderTypes" :title=item.title :key="index">
        <van-list v-model="mLoading"
                  :finished="mFinished"
                  @load="onLoad(active)">
        </van-list>
        <li v-for="k in mOrderList" :key="k.id" style="list-style: none" @click="onListClick(k)">
          {{k.tradeNo}}
        </li>
      </van-tab>
    </van-tabs>
  </div>

</template>

<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        active: 0,
        swipeThreshold: 5,
        mLoading: false,
        mFinished: false,
        mOrderList:[],
        mTotal: -1,
        mPageNo: 1,
        orderTypes: [
          {
            "title": "全部",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": -1,
            loading: false,
            finished: false,
          },
          {
            "title": "待支付",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 0,
            loading: false,
            finished: false,
          },
          {
            "title": "待收货",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 1,
            loading: false,
            finished: false,
          },
          {
            "title": "已完成",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 2,
            loading: false,
            finished: false,
          },
          {
            "title": "已取消",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 3,
            loading: false,
            finished: false,
          },
        ]
      }
    },

    methods: {
      onListClick(listItem) {

      },
      onClick(index, title) {
        this.$log("onClick Enter, index is:" + index + ",title is:" + title)
        this.onLoad(index)
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || JSON.stringify(userInfo) == "{}")
      },
      onLoad( index ) {
        this.$log("index is:"+index);
        let that = this;
        let userInfo = this.$store.state.appconf.userInfo;
        if (that.isUserEmpty(userInfo)) {
          that.mLoading = false;
          that.mFinished = true;
          return;
        }
        if (that.mTotal == -1 || that.mTotal > that.mOrderList.length) {
          that.mLoading = true;
          let user = JSON.parse(userInfo);
          let options = {
            "pageNo": that.mPageNo++,
            "pageSize": 2,
            "openId": user.userId,
            "status":  -1,
          }
          this.$api.xapi({
            method: 'post',
            url: '/order/all',
            data: options,
          }).then((response) => {
            let result = response.data.data.result
            that.mTotal = result.total;
            result.list.forEach(item => {
              that.mOrderList.push(item);
            })
            that.mLoading = false;
            if (that.mOrderList.length >= that.mTotal)
              that.mFinished = true;
            that.$log(that.mOrderList)
          }).catch(function (error) {
            that.$log(error)
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .orderlist {
    width: 100%;
    text-align: left;

    .section-title {
      .bt();
      background-color: #ffffff;
      text-align: left;
      margin: 1em;
      .fz(font-size, 30);
      color: #000000;
    }
  }
</style>
