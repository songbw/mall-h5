<template lang="html">

  <div class="orderlist">
    <v-header>
      <h1 slot="title">我的订单</h1>
    </v-header>
    <van-tabs v-model="active" sticky @click="onClick" :swipe-threshold=swipeThreshold swipeable>
      <van-tab v-for="(item,index) in orderTypes" :title=item.title :key="index">
        <van-list v-model="item.loading"
                  :finished="item.finished"
                  @load="onLoad(active)">
        </van-list>
        <li v-for="k in item.list" :key="k.id" style="list-style: none" @click="onListClick(k)">
          {{k.tradeNo}}
          <van-button plain round size="small" type="primary" @click="onDelBtnClick(k)">
            删 除
          </van-button>

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
        orderTypes: [
          {
            "title": "全部",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": -1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "待支付",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 0,
            "loading": false,
            "finished": false,
          },
          {
            "title": "待收货",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "已完成",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 2,
            "loading": false,
            "finished": false,
          },
          {
            "title": "已取消",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": 3,
            "loading": false,
            "finished": false,
          },
        ]
      }
    },

    methods: {
      onDelBtnClick(listItem) {
 //       this.selStateInCarList = this.$store.state.appconf.selStateInCarList
 //       this.selStateInCarList.splice(index, 1);
 //       this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
 //       console.log("selStateInCarList:" + JSON.stringify(this.selStateInCarList))

        this.$api.xapi({
          method: 'delete',
          url: '/order',
          params: {
            id: listItem.id,
          }
        }).then((response) => {
          console.log("onDelBtnClick success")
        }).catch(function (error) {
          console.log(error)
        })

      },
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
          return;
        }
        if (that.orderTypes[index].total == -1 || that.orderTypes[index].total > that.orderTypes[index].list.length) {
          that.orderTypes[index].loading = true;
          let user = JSON.parse(userInfo);
          let options = {
            "pageNo": that.orderTypes[index].pageNo++,
            "pageSize": 10,
            "openId": user.userId,
            "status": that.orderTypes[index].status,
          }
          this.$api.xapi({
            method: 'post',
            url: '/order/all',
            data: options,
          }).then((response) => {
            let result = response.data.data.result
            that.orderTypes[index].total = result.total;
            result.list.forEach(item => {
              that.orderTypes[index].list.push(item);
            })
            that.orderTypes[index].loading = false;
            if (that.orderTypes[index].list.length >= that.orderTypes[index].total)
              that.orderTypes[index].finished = true;
            that.$log(that.orderTypes[index])
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
