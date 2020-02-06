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
        <van-button size="large" type="primary" @click="onLoginBtnClick">登录
        </van-button>
        <div class="footer">
          <span style="float: left" @click="onRegisterBtnClick">新用户注册</span>
          <span style="float: right" @click="onForgotPwdBtnClick">忘记密码</span>
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

    methods: {
      userLogin() {
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/login',
          data: {
            username: this.userPhone,
            password: this.userPwd,
            appId: this.$api.APP_ID
          }
        })
      },
     async onLoginBtnClick() {
        this.$log("onLoginBtnClick Enter")
        if (this.userPhone.length == 0 || !this.userPhone.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
          this.$toast("请输入正确的电话号码")
          return
        }
        if (this.userPwd.length === 0) {
          this.$toast("请输入用户密码")
          return;
        }
        try {
          let response = await  this.userLogin();
          if(response.data.code === 200) {
            let ret = response.data.data.result;
            let openId = ret.openId;
            let userId = this.$api.APP_ID + openId;
            let token = ret.token;
            let thirdToken = ret.thirdToken;
            let userInfo = {
              openId: openId,
              accessToken: thirdToken,
              userId: userId,
              payId: ""
            }
            this.$store.commit('SET_USER', JSON.stringify(userInfo));
            this.$store.commit('SET_TOKEN', token);
            let data = this.$md5(token)
            if (ret.newUser) {
              data = "1" + data
            } else {
              data = "0" + data
            }
            this.$store.commit('SET_GUYS_INFO', data);
            this.$router.replace({
              path: '/',
            })
          } else {
            this.$toast(response.data.msg)
          }
        } catch (e) {
          //do nothing
        }

      },
      onRegisterBtnClick() {
        this.$log("onRegisterBtnClick Enter")
        this.$router.push({
          path: 'fcRegister'
        })
      },
      onForgotPwdBtnClick() {
        this.$log("onForgotPwdBtnClick Enter")
        this.$router.push({
          path: 'fcResetPwd'
        })
      }
    }
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

      .loginConfirmBox {
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
