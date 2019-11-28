<template lang="html">
  <div class="login">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">商品详情</h1>
    </v-header>
    <div class="loginBody">
      <div class="loginBind">
        <div class="bindTitle">
          <img :src="icon_user_bind">
          <span class="bindText">输入电话号码绑定用户</span>
        </div>
        <van-field
          v-model="mobilePhone"
          clearable
          label="手机号码"
          maxlength="30"
          label-width="65px"
          placeholder="请输入手机号"
        />
        <div class="verifyCodeBox">
          <van-field
            v-model="quickPayVerifyCode"
            maxlength="10"
            clearable
            placeholder="请输入短信验证码"
          />
          <van-button :disabled="isVerifyCodeBtnDisabled" type="danger"
                      @click="onGetVerifyCodeBtnClick">{{verifyBtnText}}
          </van-button>
        </div>
        <div style="width:95%;margin: 10px;display: flex; flex-direction:column;text-align: center;align-items: center">
          <van-button size="large" type="danger" round @click="onBCardBindBtnClick">绑定</van-button>
          <div style="margin: 10px 2px">
            <p style="font-size: 10pt">
              <span style=" color: #1989fa;">{{getBindInfo()}}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
    },

    data() {
      return {
        showHeader: true,
        mobilePhone: "",
        icon_user_bind: require('@/assets/icons/ico_user_bind.png'),
        verifyCode: "",
        isVerifyCodeBtnDisabled: false,
        verifyBtnText: '获取验证码',
        verifyCodeCount: 0,
        verifyCodeTimer: 0,
        verifyBtnTextClicked: false,
      }
    },
    methods: {
      countDown() {
        this.verifyCodeCount--;
        if (this.verifyCodeCount <= 0) {
          clearInterval(this.verifyCodeTimer)
          this.verifyBtnTextClicked = false;
          this.verifyCodeTimer = 0;
          this.verifyCodeCount = 0
          this.verifyBtnText = '获取验证码'
          this.isVerifyCodeBtnDisabled = false;
        } else {
          this.verifyBtnText = this.verifyCodeCount + ' s'
        }
      },

      onGetVerifyCodeBtnClick() {
        this.$log("onGetVerifyCodeBtnClick Enter")
        if (!this.isVerifyCodeBtnDisabled) {
          this.isVerifyCodeBtnDisabled = true;
          this.verifyCodeCount = 60
          this.verifyCodeTimer = setInterval(this.countDown, 1000);
          this.verifyBtnTextClicked = true;
        }
      },
      getBindInfo() {
        switch (this.$api.APP_ID) {
          case '11': {
            return "绑定无锡市民卡App用户"
          }
          default:
            return ""
        }
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../assets/fz.less";

  .login {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .loginBody {
      .loginBind {
        display: flex;
        flex-direction: column;
        align-items: center;

        .bindTitle {
          width: 100%;
          padding: 10px 0px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;

          img {
            height: 100px;
            width: 100px;
          }

          span {
            margin: 2vw;
          }

          .bindText {
            font-weight: lighter;
            .fz(font-size, 35);
          }
        }

        .van-button {
          &--large {
            width: 100%;
            height: 40px;
            line-height: 40px;
          }
        }

        .van-field {
          padding: 10pt 10pt;
        }

        .verifyCodeBox {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-top: 2px;
          .van-field {
            margin-right: 10px;
          }

          .van-button {
            float: right;
            height: 100%;
            min-width: 8em;
            padding: 3px 0px;
            margin: 2px;
          }
        }
      }
    }
  }
</style>
