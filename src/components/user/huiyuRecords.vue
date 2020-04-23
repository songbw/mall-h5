<template lang="html">
  <div class="huiyu">
    <div class="cousumeListTitle">我的交易记录</div>
    <div class="huyuOrderList">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-if="launchedLoaded && list.length > 0">
          <div v-for="k in list" :key="k.id" style="background-color: white;margin: 10px">
            <div class="consume-detail">
              <div>
                <span>{{k.transactionTypeDesc}}</span>
                <p style="float: right;color: #ff4444">
                  <span v-if="k.transactionType==1">-</span>
                  <span v-else>+</span>
                  <span>{{parseFloat(k.amount).toFixed(2)}}元</span>
                </p>
              </div>
              <div>
                <span>日期:{{formatTime(k.transferTime)}}</span>
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
  </div>
</template>

<script>
  import Util from '@/util/common'

  export default {
    data() {
      return {
        pageNo: 1,
        total: -1,
        list: [],
        loading: false,
        finished: false,
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
        launchedLoaded: false,
        accoutNo: ""
      }
    },

    created() {
      this.$log("huiyu created Enter")
      this.accountNo = this.$route.query.accountNo;
      this.$log("accountNo:", this.accountNo)
    },

    methods: {
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
        if (this.accountNo.length > 0) {
          if (this.total == -1 || this.total > this.list.length) {
            let options = {
              "currentPageNo": this.pageNo++,
              "pageSize": 10,
              "accountNo": this.accoutNo
            }
            this.$api.xapi({
              method: 'get',
              baseURL: this.$api.COMMISSION_CONFIG_URL,
              url: '/fl/query/transactions',
              params: options,
            }).then((response) => {
              this.result = response.data;
              this.launchedLoaded = true;
              this.$log(this.result)
              this.total = this.result.data.pageInfo.totalCount;
              if (this.result.data.list.length == 0) {
                this.loading = false;
                this.finished = true;
              } else {
                this.result.data.list.forEach(item => {
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
    },
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .huiyu {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .cousumeListTitle {
      text-align: center;
      .fz(font-size, 40);
      font-weight: bold;
      color: black;
      margin-top: 10px;
    }

    .huyuOrderList {
      background-color: #f8f8f8;

      .consume-detail {
        padding: 10px;
        color: black;
        .fz(font-size, 35px)
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
