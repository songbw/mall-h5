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
            v-model="verifyCode"
            maxlength="10"
            clearable
            placeholder="请输入短信验证码"
          />
          <van-button :disabled="isVerifyCodeBtnDisabled" type="danger"
                      @click="onGetVerifyCodeBtnClick">{{verifyBtnText}}
          </van-button>
        </div>
        <div style="width:95%;margin: 10px;display: flex; flex-direction:column;text-align: center;align-items: center">
          <van-button size="large" type="danger" round @click="onBindBtnClick" :disabled="!isBindBtnEnable">绑定</van-button>
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

    computed: {
      isBindBtnEnable() {
        return (this.mobilePhone.length > 0 && this.verifyCode.length > 0)
      },
    },

    methods: {
      toastNoAppUser(){
         switch (this.$api.APP_ID) {
           case '11': {
             this.$toast("无法找到App用户，绑定失败! 请先登录无锡市民卡APP后再绑定。")
             break;
           }
           default:{
             this.$toast("无法找到App用户，绑定失败!")
             break;
           }
         }
      },
      onBindBtnClick() {
        this.$log("onBindBtnClick Enter")
        let wxOpenId = this.$store.state.appconf.wxOpenId
        if(wxOpenId == undefined ||wxOpenId.length == 0) {
          this.$toast("没有获取的微信用户的授权信息,无法绑定")
          return;
        }
        let options = {
          telephone: this.mobilePhone,
          openId: wxOpenId,
          code: this.verifyCode,
          appId: this.$api.APP_ID
        }
        this.$api.xapi({
          method: 'put',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/wx/bind',
          data: options,
        }).then((response) => {
          if(response.data.code == 200) {
              this.$toast("绑定成功！")
          } else {
            if(response.data.code == 900100) {
              this.toastNoAppUser()
            } else {
              this.$toast(response.data.msg)
            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getVerifyCode(telephone) {
        return  this.$api.xapi({
          method: 'get',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/code',
          params: {
            telephone: telephone,
            type: "wx"
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
          if (this.mobilePhone.length == 0 || !this.mobilePhone.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
            this.$toast("请输入正确的电话号码")
            return
          }
          this.isVerifyCodeBtnDisabled = true;
          this.verifyCodeCount = 60
          this.verifyCodeTimer = setInterval(this.countDown, 1000);
          this.verifyBtnTextClicked = true;
          this.getVerifyCode(this.mobilePhone);
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
            height: 100%;
            padding: 11px  10px;
          }

          .van-button {
            float: right;
            min-width: 8em;
            margin: 0px 2px;
          }
        }
      }
    }
  }
</style>
