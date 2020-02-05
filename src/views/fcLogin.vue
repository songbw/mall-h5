<template lang="html">
  <section class="login">
    <div class="loginBody">
      <div class="loginTitle">
        <span class="TitleText">登录</span>
      </div>
      <div class="loginForm">
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
      </div>

      <!--      <div class="verifyCodeBox">
              <van-field
                v-model="verifyCode"
                maxlength="10"
                clearable
                placeholder="请输入短信验证码"
              />
              <van-button :disabled="isVerifyCodeBtnDisabled" type="danger"
                          @click="onGetVerifyCodeBtnClick">{{verifyBtnText}}
              </van-button>
            </div>-->
      <!--      <div style="width:95%;margin: 10px;display: flex; flex-direction:column;text-align: center;align-items: center">-->
      <div class="loginConfirmBox">
        <van-button size="large" type="primary"  @click="">登录
        </van-button>
        <div class="footer">
          <span style="float: left">新用户注册</span>
          <span style="float: right">忘记密码</span>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        userPhone: '',
        userPwd: ''
      }
    },

    created() {
    },

    methods: {}
  }
</script>

<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  .login {
    width: 100%;
    height: 100%;
    top: 0px;

    .loginBody {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-top: 50px;

      .loginTitle {
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

      .loginForm {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 10px 0px;

      }

      .loginConfirmBox{
        width:95%;
        margin: 10px;
        display: flex;
        flex-direction:column;
        text-align: center;
        align-items: center;
        .footer{
          width: 100%;
          >span{
            padding: 10px ;
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
