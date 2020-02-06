<template lang="html">
  <section class="register">
    <div class="registerBody">
      <div class="registerTitle">
        <span class="TitleText">重置密码</span>
      </div>
      <div class="registerForm">
        <van-field
          v-model="userPhone"
          clearable
          maxlength="30"
          placeholder="请输入手机号"
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
        <van-field
          v-model="userPwd"
          clearable
          maxlength="30"
          placeholder="请输入新密码"
        />

      </div>


      <div class="registerConfirmBox">
        <van-button size="large" type="primary" @click="onResetPwdBtnClick" :disabled="!isBindBtnEnable">重置密码
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

    computed: {
      isBindBtnEnable() {
        return (this.userPhone.length > 0 && this.userPwd.length > 0 && this.verifyCode.length > 0)
      },
    },
    methods: {
      async onResetPwdBtnClick() {
        this.$log("onResetPwdBtnClick Enter")
        try {
          let response = await this.resetUserPwd()
          this.$log(response)
          if (response.data.code == 200) {
            this.$toast("密码已重置")
          } else {
            //注册失败
            this.$toast(response.data.msg)
          }
        } catch (e) {
          //do nothing
        }
      },
      getVerifyCode(telephone) {
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/code',
          params: {
            telephone: telephone,
            type: "fp"
          }
        })
      },
      resetUserPwd() {
        return this.$api.xapi({
          method: 'put',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/password/forget',
          data: {
            username: this.userPhone,
            password: this.userPwd,
            code: this.verifyCode,
            appId: this.$api.APP_ID
          }
        })
      },
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
          if (this.userPhone.length == 0 || !this.userPhone.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
            this.$toast("请输入正确的电话号码")
            return
          }
          this.isVerifyCodeBtnDisabled = true;
          this.verifyCodeCount = 60
          this.verifyCodeTimer = setInterval(this.countDown, 1000);
          this.verifyBtnTextClicked = true;
          this.getVerifyCode(this.userPhone);
        }
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
          font-weight: bold;
          margin-left: 12px;
          .fz(font-size, 45);
          color:#333333;
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
        background: linear-gradient(to right,#FFC000, #FF5D01);
        border: none;
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
          background: linear-gradient(to right,#FFC000, #FF5D01);
          border: none;
          float: right;
          min-width: 8em;
          margin: 0px 2px;
        }
      }
    }


  }

</style>
