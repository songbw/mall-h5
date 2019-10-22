<template lang="html">
  <section class="workorder">
    <v-header v-if="showHeader">
      <h1 slot="title">售后工单</h1>
    </v-header>
    <div class="workorderList">
      <van-list v-model="loading"
                :finished="finished"
                @load="onLoad">
        <div v-if="launchedLoaded && list.length > 0">
          <div v-for="k in list" :key="k.id" style="background-color: white;margin: 10px" >
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
                <span style="float: left;padding: 10px;margin-top: 2px" >{{formatTime(k.createTime)}}</span>
                <span style="float: right;padding: 10px"  @click="onListClick(k)">查看详情 ></span>
              </div>
            </div>
          </div>
        </div>
       <div v-else-if="launchedLoaded && list.length == 0">
          <div class="noContext">
            <img :src="icon_noContext">
            <span class="noContext_line1">亲，没有任何内容!</span>
          </div>
        </div>
      </van-list>
    </div>
  </section>
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
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
        launchedLoaded: false,
      }
    },

    mounted() {
      setTimeout(() => {
        if (!this.launchedLoaded) {
          this.onLoad()
        }
      }, 1000);
    },


    created() {
      this.$log("workorderList created Enter")
      this.showHeader = this.$api.HAS_HEADER;
    },

    methods: {
      onListClick(k) {
        this.$log("onListClick Enter")
        this.$log(k)
        this.$router.push({
          name: "工单详情页",
          params: {
             id:k.id,
            expressNo: k.expressNo
          }
        })
      },
      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
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
        let that = this
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
              params: options,
            }).then((response) => {
              this.result = response.data;
              this.launchedLoaded = true;
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
              that.loading = false;
              that.finished = true;
              that.launchedLoaded = true;
            })
          }
        } else {
          this.loading = false;
          this.finished = true;
          this.launchedLoaded = true;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .workorder {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .workorderList {
      background-color: #f8f8f8;
      .goods-detail{
        display: flex;
        flex-direction: column;
        .van-card{
          background-color: white;
        }
      }

      .noContext {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;
        height: 500px;

        img {
          height: 130px;
          width: 130px;
        }

        span {
          margin: 2vw;
        }

        .noContext_line1 {
          font-weight: lighter;
          color: black;
          .fz(font-size, 35);
        }
      }
    }
  }
</style>
