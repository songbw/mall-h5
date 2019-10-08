<template lang="html">
  <section class="bankCardList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的惠民优选卡</h1>
    </v-header>
    <div class="bankCardBody">
      <div class="bankCardBind">
        <span class="bindBankTitle">绑定银行卡</span>
        <van-field
          v-model="realName"
          required
          clearable
          label="姓名:"
          maxlength="30"
          label-width="65px"
          placeholder="请输入真实姓名"
        />
        <van-field
          v-model="idCardNo"
          required
          clearable
          label="身份证号:"
          maxlength="30"
          label-width="65px"
          placeholder="请输入身份证号"
        />
        <van-field
          v-model="reserveMobile"
          required
          clearable
          label="电话号码:"
          maxlength="30"
          label-width="65px"
          placeholder="请输入银行预留电话号码"
        />
        <van-field
          v-model="bankCardNo"
          required
          clearable
          label="绑定卡号:"
          maxlength="30"
          label-width="65px"
          placeholder="请输入绑定的银行卡号"
        />
        <van-button size="large" type="danger" style="margin-top: 20px" @click="onBCardBindBtnClick">绑定</van-button>
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
        user: {},
        launchedLoaded: false,
        idCardNo:"",
        bankCardNo:"",
        reserveMobile:"",
        realName:"",
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      let that = this
      let userDetail = this.$store.state.appconf.userDetail;
      if(userDetail.length > 0) {
        this.user  = JSON.parse(userDetail)
        this.mTelphoneNumber = this.user.telephone
      }

    },

    methods: {
      onBCardBindBtnClick(){
        this.$log("onBCardBindBtnClick Enter")
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .bankCardList {
    width: 100%;
    height: 100%;
    top: 0px;

    .bankCardBody {
      .bankCardBind {
        padding: 20px;
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .bindBankTitle{
          .fz(font-size,40);
          align-content: center;
          color: black;
          padding: 10px 0px;
        }
      }
    }
  }
</style>
