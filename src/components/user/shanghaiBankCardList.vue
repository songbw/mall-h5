<template lang="html">
  <section class="bankCardList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的钱包</h1>
    </v-header>
    <div class="bankCardBody">
      <div v-if="launchedLoaded">
        <div class="bankCardBind"  v-if="!hasBindedCard">
          <div class="bindBankTitle">
            <img :src="icon_color_card" alt="">
            <span class="bindBankText">请输入银行卡信息</span>
          </div>
          <van-field
            v-model="realName"
            clearable
            label="持卡人"
            maxlength="30"
            label-width="65px"
            placeholder="请输入持卡人姓名"
          />
          <van-field
            v-model="idCardNo"
            clearable
            label="身份证号"
            maxlength="30"
            label-width="65px"
            placeholder="请输入持卡人身份证号"
          />
          <van-field
            v-model="reserveMobile"
            clearable
            label="电话号码"
            maxlength="30"
            label-width="65px"
            placeholder="请输入银行预留电话号码"
          />
          <van-field
            v-model="bankCardNo"
            clearable
            label="绑定卡号"
            maxlength="30"
            label-width="65px"
            placeholder="请输入绑定的银行卡号"
          />
          <div style="width:95%;margin: 10px;display: flex; flex-direction:column;text-align: center;align-items: center">
            <van-button size="large" type="danger" round @click="onBCardBindBtnClick">添加</van-button>
            <div style="margin: 10px 2px;display: flex;justify-items: center;text-align: center;">
              <p style="font-size: 10pt">
                <van-checkbox v-model="checked" shape="round"  checked-color="#FF4444" >
                  <span>我已经阅读并同意</span>
                </van-checkbox>
                <span style=" color: #1989fa;" @click="onProtocolBtnClick">《上海银行电商资金管理业务电子协议》</span>
              </p>
            </div>
          </div>

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
        bindCardInfo:{},
        icon_color_card: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_color_card.png',
        checked: false
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
          url: '/commission/query/salesman',
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
      onProtocolBtnClick() {
         this.$log("onProtocolBtnClick Enter")
        this.$router.push({
          name:"上海银行电商资金管理业务电子协议页"}
        )
      },
      updateCardInfo(){
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let customUser = JSON.parse(userInfo)
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.SHANGHAI_BANK_URL,
            url: '/commission/query/salesman',
            params: {
              platformUserNo: customUser.userId,
            }
          }).then((response) => {
            this.$log(response)
            let ret = response.data
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
          })
        } else {
        }
      },
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
        if(!this.checked) {
          this.$toast("请先阅读并同意协议")
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
              this.updateCardInfo()
            } else {
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
    background-color: #f8f8f8;

    .bankCardBody {
      .bankCardBind {

        display: flex;
        flex-direction: column;
        align-items: center;
        .bindBankTitle {
          width: 100%;
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

          .bindBankText {
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
        .van-field{
          padding: 10pt 10pt;
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
