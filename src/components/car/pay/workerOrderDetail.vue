<template lang="html">
  <section class="workerOrderDetail">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">工单详情</h1>
    </v-header>
    <div class="workerOrderDetail-body">
      <div class="noneInfo" v-if="loading">
        <v-loading></v-loading>
      </div>
      <div class="workOrderInfo" v-else>
        <div class="workerOrderDetailBox" v-if="list.length >0">
          <div class="expressNoBox" v-if="status == 3 || status == 5">
            <span style="margin: 10px;font-weight: bold">填写退货物流信息</span>
            <van-field
              v-model="expressCom"
              clearable
              label="物流公司"
              size="large"
              label-width="80px"
              placeholder="请输入物流公司"
            />
            <van-field
              v-model="expressNo"
              clearable
              label="退货单号"
              size="large"
              label-width="80px"
              placeholder="请输入退货物流单号"
            />
            <van-button size="large" round type="danger" @click="onExpressNoSubmit">提交</van-button>
          </div>
          <span style="margin: 10px;font-weight: bold">工单详情</span>
          <van-steps direction="vertical" active-color="#000000" >
            <van-step v-for="(item,k)  in list" :key='k'>
              <h3>{{getComment(item)}}</h3>
              <p>{{formatTime(item.createTime)}}</p>
            </van-step>
          </van-steps>
        </div>
        <div v-else>
          <div class="noContext">
            <img :src="icon_noContext">
            <span class="noContext_line1">亲，没有任何内容!</span>
          </div>
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
        id: -1,
        expressNo:"",
        expressCom:"",
        loading: false,
        list: [],
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
        status: -1,
      }
    },
    computed: {},

    created() {
      let that = this;
      this.showHeader = this.$api.HAS_HEADER;
      that.$log("workerOrder created Enter")
      that.id = this.$route.params.id;
      this.expressNo = this.$route.params.expressNo == null? "":this.$route.params.expressNo
      that.loading = true;
      this.updateWorkerFlow()
    },

    computed: {},

    methods: {
      updateWorkerFlow() {
        let that =this
        that.$api.xapi({
          method: 'get',
          baseURL: this.$api.WORKER_ORDER_BASE_URL,
          url: '/customers/work_flows',
          params: {
            workOrderId: this.id
          }
        }).then((response) => {
          that.list = response.data.data.result;
          that.loading = false;
          if(that.list.length > 0) {
            that.status = that.list[0].status
          }
        }).catch(function (error) {
          that.$log(error)
          that.loading = false;
        })
      },
      onExpressNoSubmit() {
        let logisticsInfo = {com: this.expressCom, order: this.expressNo}
        const comments = { logisticsInfo:logisticsInfo}
        let str = JSON.stringify(comments)
        this.$log(str)
        let options = {
          comments:str,
          status: 5,
          operator: "用户",
          workOrderId: this.id,
          expressNo:this.expressNo,
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.WORKER_ORDER_BASE_URL,
          url: '/customers/work_flows',
          data: options,
        }).then((response) => {
          this.$log(response.status)
          if(response.status == 201) {
             this.$toast("提交成功 !")
          } else {
            this.$toast("提交失败! 您可以联系客服询问")
          }
          this.updateWorkerFlow()
        }).catch(function (error) {
        })
      },
      formatWOrderStatus(statusType) {
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
      getComment(item) {
        let ret = this.formatWOrderStatus(item.status)
        if (item.comments != undefined) {

          try {
            let comments = JSON.parse(item.comments)
            let jsonlogisticsInfo = comments.logisticsInfo
            if(jsonlogisticsInfo != undefined) {
              if (jsonlogisticsInfo.com != undefined && jsonlogisticsInfo.com.length > 0)
                ret += " 物流公司:" + jsonlogisticsInfo.com
                this.expressCom = jsonlogisticsInfo.com
              if (jsonlogisticsInfo.order != undefined && jsonlogisticsInfo.order.length > 0)
                ret += " 退货单号:" + jsonlogisticsInfo.order
                this.expressNo = jsonlogisticsInfo.order
            }
            let jsonRefund = comments.refund
            if (jsonRefund != undefined) {
              ret += " 退款金额:" + jsonRefund
            }
            let jsonReturnLogistics = comments.returnLogistics
            if (jsonReturnLogistics != undefined) {
              ret += " 退货物流单号:" + jsonReturnLogistics
            }
            let jsonReturnAddress = comments.returnAddress
            if (jsonReturnAddress != undefined) {
              if (jsonReturnAddress.receiverName != undefined && jsonReturnAddress.receiverName.length > 0)
                ret += " 收件人:" + jsonReturnAddress.receiverName
              if (jsonReturnAddress.receiverPhone != undefined && jsonReturnAddress.receiverPhone.length > 0)
                ret += " 收件人电话:" + jsonReturnAddress.receiverPhone
              ret += " 退货地址:" + jsonReturnAddress.provinceName +
                jsonReturnAddress.cityName + jsonReturnAddress.countyName +
                jsonReturnAddress.address
            }
            let jsonRemark = comment.remark
            if (jsonRemark != undefined) {
              ret += "备注:" + jsonRemark
            }
          } catch (e) {
          }
        }
        return ret
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

  .workerOrderDetail {

    .workerOrderDetail-body {
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

      .workOrderInfo {
        .expressNoBox{
           font-weight: bold;
           margin: 10px 0px;
        }
        .workerOrderDetailBox {
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
