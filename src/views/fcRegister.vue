<template lang="html">
  <section class="register">
    <div class="registerBody">
      <div class="registerTitle">
        <span class="TitleText">注册</span>
      </div>
      <div class="registerForm">
        <van-field
          v-model="userPhone"
          clearable
          maxlength="30"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="userPwd"
          clearable
          maxlength="30"
          placeholder="请输入登录密码"
        />
        <div class="verifyCodeBox">
          <van-field
            v-model="verifyCode"
            maxlength="10"
            clearable
            placeholder="请输入短信验证码"
          />
          <van-button :disabled="isVerifyCodeBtnDisabled" type="danger"
                      @click="onGetVerifyCodeBtnClick">{{verifyBtnText}}
          </van-button>
        </div>
      </div>



      <div class="registerConfirmBox">
        <van-button size="large" type="primary" @click="">注册并登录
        </van-button>
      </div>

    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        userPhone: "",
        userPwd: "",
        verifyCode: "",
        isVerifyCodeBtnDisabled: false,
        verifyBtnText: '获取验证码',
        verifyCodeCount: 0,
        verifyCodeTimer: 0,
        verifyBtnTextClicked: false,
      }
    },

    created() {
    },

    methods: {
      onGetVerifyCodeBtnClick() {
        this.$log("onGetVerifyCodeBtnClick Enter")
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  .register {
    width: 100%;
    height: 100%;
    top: 0px;

    .registerBody {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-top: 50px;

      .registerTitle {
        width: 100%;
        padding: 20px 0px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .TitleText {
          margin-left: 12px;
          .fz(font-size, 45);
        }
      }

      .registerForm {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 10px 0px;

      }

      .registerConfirmBox {
        width: 95%;
        margin: 10px;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;

        .footer {
          width: 100%;

          > span {
            padding: 10px;
            color: #1989fa;
          }
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
          height: 100%;
          padding: 11px 10px;
        }

        .van-button {
          float: right;
          min-width: 8em;
          margin: 0px 2px;
        }
      }
    }


  }

</style>
