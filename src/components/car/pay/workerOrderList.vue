<template lang="html">
  <div class="workorder">
    <v-header v-if="showHeader">
      <h1 slot="title">售后工单</h1>
    </v-header>
    <div class="workorderList">
      <van-list v-model="loading"
                :finished="finished"
                @load="onLoad">
        <li v-for="k in list" :key="k.id" style="list-style: none;margin: 5px">
          <div class="goods-detail">
            <van-card
              :price="k.unitPrice"
              :desc=formatWOrderStatus(k)
              :title= "k.name"
              :thumb="k.image"
              :num="k.returnedNum"
              centered>
            </van-card>
            <div>
              <span style="float: right;padding: 10px"  @click="onListClick(k)">查看详情 ></span>
            </div>
          </div>

        </li>
      </van-list>
    </div>
  </div>
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
      }
    },

    mounted() {
    },


    created() {
      this.$log("workorderList created Enter")
      if (this.$api.IS_GAT_APP) {
        this.showHeader = false;
      }
    },

    methods: {
      onListClick(k) {
        this.$log("onListClick Enter")
        this.$log(k)
        this.$router.push({
          name: "工单详情页",
          params: {
             id:k.id
          }
        })
      },
      formatWOrderStatus(k) {
        let statusType = k.status
        let status = ""
        switch (statusType) {
          case 1:
            status = "待审核"
            break;
          case 2:
            status = "正在审核中"
            break;
          case 3:
            status = "审核通过"
            break;
          case 4:
            status = "审核未通过"
            break;
          case 5:
            status = "处理中"
            break;
          case 6:
            status = "处理完成"
            break;
          default:
            break;
        }
        return status;
      },
      onLoad() {
        this.$log("onLoad Enter")
        let userInfo = this.$store.state.appconf.userInfo
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          if (this.total == -1 || this.total > this.list.length) {
            let options = {
              "pageIndex": this.pageNo++,
              "customer" : user.userId
            }
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.WORKER_ORDER_BASE_URL,
              url: '/customers/work_orders',
              data: options,
            }).then((response) => {
              this.result = response.data;
              this.$log(this.result)
              this.total = this.result.total;
              if (this.result.rows.length == 0) {
                this.loading = false;
                this.finished = true;
              } else {
                this.result.rows.forEach(item => {
                  this.list.push(item);
                })
                this.$log(this.list)
                this.loading = false;
                if (this.list.length >= this.total)
                  this.finished = true;
              }
            }).catch(function (error) {
              console.log(error)
              that.finished = true;
            })
          }
        } else {
          this.loading = false;
          this.finished = true;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .workorder {
    .workorderList {
      width: 100%;
      height: 100%;
      top: 0px;
      background-color: #f8f8f8;
      .goods-detail{
        display: flex;
        flex-direction: column;
        .van-card{
          background-color: white;
        }
      }

    }
  }
</style>
