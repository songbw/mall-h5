<template lang="html">
  <section class="invoice">
    <v-header>
      <h1 slot="title">发票信息</h1>
    </v-header>
    <div class="main_layout">
      <span>{{hideClass}}</span>
      <h1 class="section-title">
        发票类型
      </h1>
      <div class="RadioStyle">
        <input type="radio" id="eInvoice" value="eInvoice" v-model="invoiceType">
        <label for="eInvoice">电子普通发票</label>
      </div>
      <h1 class="section-title">
        发票抬头
      </h1>
      <div class="RadioStyle">
        <input type="radio" id="personalInvoice" value="personal" v-model="invoiceTitleType">
        <label for="personalInvoice">个人</label>
        <input type="radio" id="enterpriseInvoice" value="enterprise" v-model="invoiceTitleType">
        <label for="enterpriseInvoice">单位</label>
      </div>
      <div class="enterpriseInfo" v-if="invoiceTitleType==='enterprise'">
        <van-cell-group>
          <van-field
            v-model="enterprise_name"
            required
            placeholder="请填写单位名称"
          />

          <van-field
            v-model="enterprise_number"
            required
            placeholder="请填写纳税人识别号"
          />
        </van-cell-group>
      </div>
      <div class="tip">
        <p>
          温馨提示： 电子发票与纸票具有相同的法律效力，可以做为维权,保修，报销的有效凭据，且不存在损毁丢失的情况，您永远也不必担心发票损失。
          订单签收后可在订单详情下载您的电子普通发票。
        </p>
      </div>
      <div :class="hideClass?'footer_layout_hide':'footer_layout'">
        <van-button type="primary" size="large">确定</van-button>
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
        radio: '1',
        invoiceType: 'eInvoice',
        invoiceTitleType: 'personal',
        enterprise_number: '',
        enterprise_name: '',
        // 默认屏幕高度
        docmHeight: document.documentElement.clientHeight,  //一开始的屏幕高度
        showHeight: document.documentElement.clientHeight,   //一开始的屏幕高度
        hideClass: false,
      }
    },
    watch:{
      showHeight: 'inputType'
    },

    mounted() {
// window.onresize监听页面高度的变化
      window.onresize = () => {
        return (() => {
          window.screenHeight = document.body.clientHeight;
          this.showHeight = window.screenHeight;
        })()
      }
    },

    methods: {
      inputType() {
        if (!this.timer) {
          this.timer = true
          let that = this
          setTimeout(() => {
            if (that.docmHeight > that.showHeight) {
              //显示class
              this.hideClass = true;
            } else if (that.docmHeight <= that.showHeight) {
              //显示隐藏
              this.hideClass = false;
            }
            that.timer = false;
          }, 500)
        }
      },

      onChange() {

      },

      confirm() {

      }


    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .invoice {
    width: 100%;
    text-align: left;
    .main_layout {
      width: 100%;
      text-align: center;
      .enterpriseInfo {
        margin: 1.2em;
      }
      .tip {
        margin: 1.2em;
        .fz(font-size, 25);
      }

      .RadioStyle {
        display: flex;
        margin: 1em;

        input {
          display: none
        }

        label {
          border: 1px solid #00a4ff;
          padding: 2px 10px 2px 5px;
          line-height: 28px;
          min-width: 80px;
          text-align: center;
          float: left;
          margin: 2px;
          border-radius: 4px
        }

        input:checked + label {
          background: url('../../../assets/images/ico_checkon.svg') no-repeat right bottom;
          background-size: 21px 21px;
          color: #00a4ff
        }
      }

      .section-title {
        background-color: #ffffff;
        text-align: left;
        font-weight: bold;
        margin: 1em;
        .fz(font-size, 35);
        color: #000000;
      }

      .footer_layout {
        position:absolute;
        left: 0px;
        right:0px;
        bottom: 0px;
        margin: 1em;
      }

      .footer_layout_hide {
        position:static;
        margin: 1em;
      }
    }


  }
</style>
