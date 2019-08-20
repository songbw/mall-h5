<template lang="html">
  <section class="afterSaleService">
    <v-header v-if="showHeader">
      <h1 slot="title">售后服务</h1>
    </v-header>
    <div class="serviceBody">
      <div class="goodsBox">
        <van-card
          :price="goods.unitPrice"
          :title="goods.name"
          :num="goods.num"
          :thumb="goods.image">
          <div slot="tags" v-if="goods.salePrice != goods.unitPrice" class="cardtags">
            <img :src="tag_promotion" v-if="goods.promotionDiscount > 0"/>
            <img :src="tag_coupon" v-if="goods.unitPrice - goods.salePrice - goods.promotionDiscount > 0"/>
          </div>
        </van-card>
        <van-cell title="实际销售单价" title-class="CellTitle" v-if="goods.unitPrice != goods.salePrice">
          ￥{{goods.salePrice.toFixed(2)}}元
        </van-cell>
        <van-cell title="状态" title-class="CellTitle" :value="requestStateValue"></van-cell>
        <div slot="footer">
          <van-cell title="申请数量" title-class="CellTitle">
            <van-stepper
              v-model="count"
              :max="goods.num"
              @change="onCountChange"/>
          </van-cell>
          <van-cell title="历史工单" :value=this.history_list.length title-class="CellTitle" isLink="true"
                    @click="onHistListClick">
          </van-cell>
          <van-actionsheet v-model="historyListShow" title="历史工单" class="invoice_layout">
            <div>
              <div class="workerOrderCard"
                   v-for="(k,i) in this.history_list"
                   :key="i">
                <div class="title">
                  <span>{{formateWOrderType(k.typeId)}}</span>
                </div>
                <div class="info">
                  <div class="createTimeAndNumber">
                    <span >{{formatWOrderCreateDateTime(k.createTime)}}</span>
                    <span  style="margin-left: 15px">数量:{{k.returnedNum}}</span>
                  </div>
                  <div class="reasonBox">
                    <span >￥{{k.refundAmount.toFixed(2)}}  {{k.title}}</span>
                  </div>
                  <div class="statusBox">
                    <span >状态: {{formatWOrderStatus(k.status)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </van-actionsheet>
        </div>
      </div>
      <div class="requireTypeBox">
        <van-cell title="申请类型" title-class="CellTitle"></van-cell>
        <van-radio-group v-model="typeRadio">
          <van-cell-group>
            <van-cell title="退货/退款" clickable @click="typeRadio = 'type1'">
              <van-radio name="type1"/>
            </van-cell>
            <van-cell title="换货" clickable @click="typeRadio = 'type2'">
              <van-radio name="type2"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="requireReasonBox">
        <van-cell title="申请原因" title-class="CellTitle" :value="getRequestReason()">
          <van-icon style="margin: 5px;" slot="right-icon" name="weapp-nav" class="custom-icon"
                    @click="showReasonSelector()"/>
        </van-cell>
        <van-actionsheet v-model="showReason" title="申请原因">
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell title="质量问题" clickable @click="radio = '1'">
                <van-radio name="1"/>
              </van-cell>
              <van-cell title="卖家发错货" clickable @click="radio = '2'">
                <van-radio name="2"/>
              </van-cell>
              <van-cell title="发票问题" clickable @click="radio = '3'">
                <van-radio name="3"/>
              </van-cell>
              <van-cell title="七天无理由" clickable @click="radio = '4'">
                <van-radio name="4"/>
              </van-cell>
              <van-cell title="商品与描述不符" clickable @click="radio = '5'">
                <van-radio name="5"/>
              </van-cell>
              <van-cell title="其他" clickable @click="radio = '6'">
                <van-radio name="6"/>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
          <van-button type="danger" size="large" @click="confirmedReason()">确定</van-button>
        </van-actionsheet>
      </div>
      <div class="descibleQuestion">
        <van-cell title="问题描述" title-class="CellTitle">
        </van-cell>
        <van-field style="background-color: #f8f8f8"
                   v-model="requestDescible"
                   type="textarea"
                   placeholder="请描述申请售后服务的具体原因"
                   rows="5"
                   maxlength=500
        />
      </div>
      <div class="contactBox">
        <van-cell title="联系人" title-class="CellTitle" :value="contact.name"></van-cell>
        <van-cell title="联系电话" title-class="CellTitle" :value="contact.mobile"></van-cell>
      </div>
      <div class="tip">
        <span>提交服务后，售后专员可能与您电话沟通，请保持手机通畅</span>
      </div>
    </div>
    <div class="footer">
      <van-button type="warning" size="large" :disabled="commitDisabled" @click="onCommitClick()">提交</van-button>
    </div>
  </section>
</template>


<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },
    watch: {
      count: function (newVal, oldVal) {
        if (newVal == 0) {
          this.commitDisabled = true;
        } else {
          this.commitDisabled = false;
        }
      },
    },
    data() {
      return {
        showHeader: true,
        goods: {},
        contact: {},
        tradeNo: '',
        openId: '',
        count: 0,
        showReason: false,
        radio: '6',
        typeRadio: 'type1',
        requestState: -1,// 1:编辑中 2.正在审核中 3.审核通过 4.审核有问题 5.处理中 6.处理完成
        requestStateValue: "编辑中",
        commitDisabled: false,
        requestDescible: '',
        tag_coupon: require('@/assets/icons/ico_lab_coupon.png'),
        tag_promotion: require('@/assets/icons/ico_lab_promotion.png'),
        history_list: [],
        historyListShow: false
      }
    },

    created() {
      let that = this
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
      this.goods = this.$route.params.goods;
      this.contact = this.$route.params.contact;
      this.openId = this.$route.params.openId;
      this.tradeNo = this.$route.params.tradeNo;
      this.count = 0;
      this.requestState = -1;

      this.$log(this.goods)

      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.WORKER_ORDER_BASE_URL,
        url: '/customers/orders/validNum',
        params: {
          merchantId: this.goods.merchantId,
          customer: this.openId,
          orderId: this.goods.subOrderId,
        }
      }).then((response) => {
        if (response.status == 200) {
          this.goods.num = response.data.validNum;
          this.count = this.goods.num
        }
      }).catch(function (error) {
        that.$log(error)
      })

      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.WORKER_ORDER_BASE_URL,
        url: '/customers/work_orders',
        params: {
          customer: this.openId,
          orderId: this.goods.subOrderId,
          pageIndex: 1,
          pageSize: 20
        }
      }).then((response) => {
        this.$log(response)
        if (response.status == 200) {
          let result = response.data;
          this.history_list = result.rows;
        }
      }).catch(function (error) {
        that.$log(error)
        that.requestState = -1;
      })
    },

    methods: {
      formatWOrderCreateDateTime(createDate) {
        return this.$moment(createDate).format('YYYY.MM.DD')
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
            status = "审核有问题"
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

      formateWOrderType(type) {
        switch (type) {
          case 1:
            return "退货/退款";
          case 2:
            return "换货";
          case 3:
            return "退款";
          default:
            return ""
        }
      },

      onHistListClick() {
        this.$log("onHistListClick Enter")
        if (this.history_list.length > 0) {
          this.historyListShow = true
        }
      },
      getRequestType() {
        if (this.typeRadio === 'type1')
          return 1
        else
          return 2
      },

      getRequestReason() {
        let reason = "其他"
        switch (this.radio) {
          case '1':
            reason = "质量问题"
            break;
          case '2':
            reason = "卖家发错货"
            break;
          case '3':
            reason = "发票问题"
            break;
          case '4':
            reason = "七天无理由"
            break;
          case '5':
            reason = "商品与描述不符"
            break;
          default:
            break;
        }
        return reason;
      },
      onCommitClick() {
        this.$log("onCommitClick Enter")
        let that = this
        this.$log(this.goods)
        let options = {
          customer: this.openId,
          merchantId: this.goods.merchantId,
          description: this.requestDescible,
          orderId: this.goods.subOrderId,
          title: this.getRequestReason(),
          typeId: this.getRequestType(),
          num: this.count,
          iAppId: this.$api.APP_ID,
          tAppId: this.$api.T_APP_ID,
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.WORKER_ORDER_BASE_URL,
          url: '/customers/work_orders',
          data: options,
        }).then((response) => {
          this.$log(response)
          if (response.status == 201) {
            this.$toast("申请已经成功提交，请等待客服人员联系")
            this.requestState = 0;
          } else {
            this.$toast("申请提交失败，请联系客服人员")
          }
        }).catch(function (error) {
          that.$log(error)
          that.$toast("申请提交失败，请联系客服人员")
        })
      },
      showReasonSelector() {
        this.showReason = true
      },
      confirmedReason() {
        this.$log(this.radio);
        this.showReason = false
      },
      onCountChange() {
        this.$log("count is:" + this.count)
        if (this.count > this.goods.num)
          this.count = this.goods.num;
        else if (this.count < 0)
          this.count = 0;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .afterSaleService {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .serviceBody {
      margin-bottom: 3em;

      .van-cell {
        background-color: white;
        margin-top: -1px;
      }

      .goodsBox {
        .van-card {
          background-color: #ffffff;

          .cardtags {
            margin-top: 10px;

            > img {
              width: 30px;
              height: 30px;
            }
          }
        }
      }

      .requireTypeBox {
        background-color: #ffffff;
        margin-top: 10px;
      }

      .requireReasonBox {
        background-color: #ffffff;
        margin-top: 10px;
      }

      .descibleQuestion {
        background-color: #ffffff;
      }

      .contactBox {
        background-color: #ffffff;
        margin-top: 10px;
      }

      .tip {
        margin: 10px;
        padding-bottom: 10px;
      }
    }

    .CellTitle {
      .fz(font-size, 32);
      font-weight: bold;
    }

    .footer {
      width: 100%;
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;

    }

    .van-actionsheet {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      min-height: 500px;
      background-color: #f8f8f8;
    }

    .workerOrderCard {
      background-color: white;
      display: flex;
      color: black;
      position: relative;
      padding-left: .5rem;
      padding-right: .5rem;
      margin: .5rem;
      overflow: hidden;
      border-radius: 10px;

      .title {
        width: 30%;
        background-color: #FF4444;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        text-align: center;
        justify-items: center;
        line-height: 100px;
        color: white;
        .fz(font-size, 40)

      }

      .info {
        display: flex;
        flex-direction: column;
        padding: 5px;
        margin-left: 5px;
        width: 70%;

        .createTimeAndNumber{
          color: #8c8c8c;
          margin-top: 8px;
        }

        .reasonBox{
          margin-top: 3px;
          color: #FF4444;
          margin-left: -5px;
           .fz(font-size, 40)
        }

        .statusBox{
          margin-top: 3px;
          color: #8c8c8c;
        }
      }
    }
  }

</style>
