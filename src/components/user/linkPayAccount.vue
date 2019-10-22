<template lang="html">
  <section class="bankCardList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的惠民优选卡</h1>
    </v-header>
    <div class="bankCardBody">
      <div v-if="launchedLoaded">
        <div class="bankCardBind"  v-if="!hasBindedCard">
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
        <div v-else class="bindedCardBox">
          <div class="bankCard">
            <div>
              <span>姓名:</span>
              <span style="float: right">{{bindCardInfo.realName}}</span>
            </div>
            <div>
              <span>绑卡状态:</span>
              <span style="float: right">{{bindCardInfo.accountStatusDesc}}</span>
            </div>
            <div>
              <span>绑定银行卡:</span>
              <span style="float: right">{{bindCardInfo.bankCard}}</span>
            </div>
            <div>
              <span>虚拟账号:</span>
              <span style="float: right">{{bindCardInfo.virtualAccount}}</span>
            </div>
          </div>
        </div>
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
        hasBindedCard: false,
        idCardNo: "",
        bankCardNo: "",
        reserveMobile: "",
        realName: "",
        bindCardInfo:{}
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      let that = this
      let userDetail = this.$store.state.appconf.userDetail;
      if (userDetail != undefined && userDetail.length > 0) {
        this.user = JSON.parse(userDetail)
        this.reserveMobile = this.user.telephone
      }
      let userInfo = this.$store.state.appconf.userInfo;
      if (!Util.isUserEmpty(userInfo)) {
        let customUser = JSON.parse(userInfo)
        that.$api.xapi({
          method: 'get',
          baseURL: this.$api.SHANGHAI_BANK_URL,
          url: 'commission/query/salesman',
          params: {
            platformUserNo: customUser.userId,
          }
        }).then((response) => {
          this.$log(response)
          let ret = response.data
          this.launchedLoaded = true
          if(ret.code == 200) {
            this.hasBindedCard = true;
            this.bindCardInfo = ret.data;
            this.$log(this.bindCardInfo)
          } else {
            if(ret.code == 10001) {
              this.hasBindedCard = false;
            }
          }
        }).catch(function (error) {
          that.launchedLoaded = true
        })
      } else {
        that.launchedLoaded = true
      }

    },

    methods: {
      onBCardBindBtnClick() {
        this.$log("onBCardBindBtnClick Enter")
        if (this.realName.length == 0) {
          this.$toast("请输入姓名")
          return
        }
        if (this.idCardNo.length == 0) {
          this.$toast("请输入身份证号码")
          return
        }
        if (this.reserveMobile.length == 0 || !this.reserveMobile.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
          this.$toast("请输入正确的电话号码")
          return
        }
        if (this.bankCardNo.length == 0) {
          this.$toast("请输入银行卡号")
          return
        }
        let that =this
        this.$log("姓名:" + this.realName)
        this.$log("身份证:" + this.idCardNo)
        this.$log("电话:" + this.reserveMobile)
        this.$log("卡号:" + this.bankCardNo)
        this.$log(this.user)
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let customUser = JSON.parse(userInfo)
          let options = {
            platformUserNo: customUser.userId,
            realName: this.realName,
            idCardNo: this.idCardNo,
            reserveMobile: this.reserveMobile,
            bankCardNo: this.bankCardNo,
            personalType: 3,
          }
          this.$log(options)
          that.$api.xapi({
            method: 'post',
            baseURL: this.$api.SHANGHAI_BANK_URL,
            url: '/commission/user/direct/bindcard',
            data: options
          }).then((response) => {
            this.$log(response)
            let ret = response.data;
            if(ret.code == 200) {
              this.$toast("绑卡成功!")
            } else {
              this.$log("CCCCCCCCCCCCCCCCCCCc")
              this.$log(ret.msg)
              this.$toast(ret.msg)
            }
          }).catch(function (error) {
            that.$toast("绑卡失败")
          })
        } else {
          this.$toast("没有用户信息，请先登录")
        }
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
        .bindBankTitle {
          .fz(font-size, 40);
          align-content: center;
          color: black;
          padding: 10px 0px;
        }
      }
      .bindedCardBox{
        display: flex;
        justify-items: center;
        .bankCard{
          width: 100%;
          border-radius: 10px;
          margin: 10px;
          background-color: #FFAA00;
          color: white;
          padding: 10px;
        }
      }
    }
  }
</style>
