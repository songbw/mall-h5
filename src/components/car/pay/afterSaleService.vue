<template lang="html">
  <section class="afterSaleService">
    <v-header>
      <h1 slot="title">售后服务</h1>
    </v-header>
    <div class="serviceBody">
      <div class="goodsBox">
        <van-card
          :num="goods.num"
          :price="goods.unitPrice"
          :title="goods.name"
          :thumb="goods.image">
        </van-card>
        <van-cell title="状态" title-class="CellTitle" :value="requestState"></van-cell>
        <div slot="footer">
          <van-cell title="申请数量" title-class="CellTitle">
            <van-stepper
              v-model="count"
              :max="goods.num"/>
          </van-cell>
        </div>
      </div>
      <div class="requireTypeBox">
        <van-cell title="申请类型" title-class="CellTitle"></van-cell>
        <van-radio-group v-model="typeRadio">
          <van-cell-group>
            <van-cell title="退货" clickable @click="radio = 'type1'">
              <van-radio name="type1" />
            </van-cell>
            <van-cell title="其他" clickable @click="radio = 'type2'">
              <van-radio name="type2" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="requireReasonBox">
        <van-cell title="申请原因" title-class="CellTitle" value="请选择申请原因">
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
        <van-field style="background-color: #f0f0f0"
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
      <van-button type="warning" size="large" :disabled="commitDisabled"  @click="onCommitClick()">提交</van-button>
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
      requestDescible: function (newVal,oldVal) {
        if(this.requestState == "售后申请" && newVal.length > 0) {
          this.commitDisabled = false;
        } else {
          this.commitDisabled = true;
        }
      }
    },
    data() {
      return {
        goods: {},
        contact: {},
        tradeNo: '',
        openId: '',
        count: 0,
        showReason: false,
        radio: '6',
        typeRadio: 'type1',
        requestState:"售后申请",
        commitDisabled: true,
        requestDescible:''
      }
    },


    created() {
      this.goods = this.$route.params.goods;
      this.contact = this.$route.params.contact;
      this.openId = this.$route.params.openId;
      this.tradeNo = this.$route.params.tradeNo;
      this.count = this.goods.num;

      this.$log(this.goods)
      this.$log(this.contact)
      this.$log(this.openId)
      this.$log(this.tradeNo)
    },

    computed: {},

    methods: {
      getRequestType() {
        if(this.typeRadio === 'type1')
          return 1
        else
          return 2
      },
      getRequestReason() {
          return this.radio;
      },
      onCommitClick() {
     //   this.$log(this.goods)
        this.$log("onCommitClick Enter")
         let options = {
           orderId: this.tradeNo,
           subOrderId: this.goods.subOrderId,
           skuId:this.goods.skuId,
           number: this.count,
           type: this.getRequestType(),
           reason:this.getRequestReason(),
           description:this.requestDescible,
           contactName: this.contact.name,
           contactTel: this.contact.mobile
         }
         this.$log(JSON.stringify(options))
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
        else if (this.count < 1)
          this.count = 1;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .afterSaleService {
    .serviceBody {
      background-color: #f8f8f8;
      margin-bottom: 3em;

      .goodsBox {
        .van-card {
          background-color: #ffffff;
          margin-top: 5px;

          &__price {
            margin-top: 2em;
            .fz(font-size, 30);
          }
        }
      }
      .requireTypeBox{
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
  }

</style>
