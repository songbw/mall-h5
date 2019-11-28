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
          <div style="width:95%;margin: 10px;display: flex; flex-direction:column;text-align: center;align-items: center">
            <van-button size="large" type="danger" round @click="onBCardBindBtnClick">绑定</van-button>
            <div style="margin: 10px 2px;display: flex;justify-items: center;text-align: center;">
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
      }
    },
    methods: {
      getBindInfo(){
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
      }
    }
  }
</style>
