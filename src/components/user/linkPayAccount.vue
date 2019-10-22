<template lang="html">
  <section class="linkPay">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的联机账户</h1>
    </v-header>
    <div class="linkPayBody">
      <div>
        <span class="linkPayTitle">查询联机账户余额</span>
      </div>

      <van-field
        v-model="linkPayAccount"
        required
        clearable
        label="卡号"
        maxlength="30"
        label-width="40px"
        placeholder="请输入卡号"
      />

      <van-field
        v-model="linkPayPwd"
        :type="isLinkPwdVisable?'number':'password'"
        maxlength="30"
        clearable
        label="密码"
        label-width="40px"
        placeholder="请输入密码"
        :right-icon="isLinkPwdVisable?'eye-o':'closed-eye'"
        required
        @click-right-icon="togLinkPayPwdVisable()"
      />
      <div class="linkPayAccountBox">
        <span style="font-weight: bold;font-size: x-large;color: black">我的余额</span>
        <span v-if="linkPayAmount == null " style="margin-top: 10px;color: #ff4444;font-size: medium">请输入账号，查询余额</span>
        <span v-else class="linkPay_Amount">￥{{linkPayAmount}}</span>
      </div>
      <div style="margin-top: 40px;width: 100%">
        <van-button type="danger" size="large" round @click="queryLinkPay">查看余额</van-button>
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
        isLinkPwdVisable: false,
        linkPayAccount:'',
        linkPayPwd:''
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
    },

    methods: {
      togLinkPayPwdVisable() {
        this.isLinkPwdVisable = !this.isLinkPwdVisable
      },
      queryLinkPay() {
        this.$log("queryLinkPay Enter")
        if(this.isLinkPwdVisable.length == 0) {
          this.$toast("请输入卡号")
          return
        }
        if(this.linkPayPwd.length == 0) {
          this.$toast("请输入密码")
          return
        }
        let options = {
          "cardNo":this.linkPayAccount,
          "password":this.linkPayPwd
        }
        this.$log(options)
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.LINKPAY_ACCOUNT_URL,
          url: '/wxpos/balance',
          data: options,
        }).then((response) => {
          this.$log(response)
          if(response.data.code == 200) {
            this.linkPayAmount = (response.data.data/100).toFixed(2)
          } else {
            this.linkPayAmount = null
            if(response.data.message !=null && response.data.message.length > 0)
                this.$toast(response.data.message)
          }
        }).catch(function (error) {
          this.linkPayAmount = null
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .linkPay {
    width: 100%;
    height: 100%;
    top: 0px;

    .linkPayBody {
      padding: 40px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .linkPayTitle{
        .fz(font-size,40);
        font-weight: bold;
        color: black;
      }
      .linkPayAccountBox{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        .linkPay_Amount{
          margin-top: 10px;
          color: #ff4444;
          font-weight: bold;
          .fz(font-size,80)
        }
      }
    }
  }
</style>
