<template lang="html">
  <section class="userInfo">
    <v-header class="header">
      <h1 slot="title">个人信息</h1>
    </v-header>
    <div class="userMain">
      <van-cell-group>
        <van-cell isLink="true" url="">
          <div slot="title" class="avatarTitle">
            <span>头像</span>
          </div>
          <div slot="right-icon" class="header-icon">
            <span class="icon2-user"></span>
          </div>
        </van-cell>
        <van-cell title="用户ID" isLink="true" url="">
          <div slot="label">
            <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1</span>
          </div>
        </van-cell>
        <van-cell title="昵称" value="周俊" isLink="true" url=""></van-cell>
        <van-cell title="手机号" value="13810964380" isLink="true" url=""></van-cell>
        <van-cellcell title="性别" value="男" isLink="true" url=""></van-cellcell>
        <van-cell title="生日" value="" isLink="true" url=""></van-cell>
      </van-cell-group>
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
      return {}
    },

    methods: {}

  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';

  .userInfo {
    .userMain {
      .avatarTitle{
        height: 4em;
        line-height: 4em;
        align-items: center;
      }
      .header-icon {
        border: .4vw solid #ffffff;
        background-color: @cl;
        margin-left: 4vw;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 14vw;
        height: 14vw;
        line-height: 16vw;
        text-align: center;
        border-radius: 50%;

        span {
          .fz(font-size, 54);

          &::before {
            color: #ffffff;
          }
        }
      }
    }
  }


</style>
