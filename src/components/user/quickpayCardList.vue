<template lang="html">
  <section class="myOptCarList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的快捷支付银行卡</h1>
    </v-header>
    <div class="optCardListBody">
      <div class="optCardListMain">
        <div class="optcardList" v-if="optCardList.length > 0">
          <div v-for="(k,index) in optCardList" :key="index" class="optCard">
            <div class="cardMain">
              <van-col span="8" class="cardImg">
                <img :src="icon_optCardsReal">
              </van-col>
              <van-col span="16" class="cardInfo">
                <span>卡号: {{k.cardnum}}</span>
                <p style="margin-top: 3px">面值: <span>{{(k.amount/100).toFixed(2)}}元</span></p>
                <span style="font-size: small;color: #515151;margin-top: 3px">有效期: {{formatTime(k.expiryDate)}}</span>
              </van-col>
            </div>
            <div class="cardFooter">
              <span class="cardBalance">余额: {{(k.balance/100).toFixed(2)}}元</span>
              <span class="cardDetail" @click="onCardDetailBtnClick(k)">交易明细 ></span>
            </div>

          </div>
        </div>
        <div v-else-if="launchedLoaded && optCardList.length == 0" class="noCards">
          <img :src="icon_noCards">
          <span style="font-size: large;color: black">亲，卡包已空啦</span>
        </div>
      </div>
    </div>
    <div class="optcardListBottomFunc">
      <div @click="onAddOptCardBtnClick()" class="addOptCardButton">
        <span>添加银行卡</span>
      </div>
    </div>
    <van-dialog
      v-model="addNewOptCardDlgShow"
      title="添加银行卡"
      show-cancel-button="true"
      confirm-button-text="添加"
      :beforeClose="beforeCloseAddNewOptCardDlg"
    >
      <div class="cardTypeBox">
        <van-radio-group v-model="radio" style="display: flex">
          <van-cell title="储蓄卡" :icon="icon_linkpay" clickable @click="radio = '1'">
            <van-radio slot="right-icon" name="1"/>
          </van-cell>
          <van-cell title="信用卡" :icon="icon_quicklypay" @click="radio = '2'">
            <van-radio slot="right-icon"  name="2"/>
          </van-cell>
        </van-radio-group>
      </div>
      <div v-if="radio == '1'">
        <van-field
          v-model="newCardNumber"
          label="银行卡号:"
          maxlength="30"
          label-width="65px"
          type="number"
          rows="1"
          placeholder="请输入银行卡号"
          clearable
        />
        <van-field
          v-model="newCustomName"
          label="真实姓名:"
          maxlength="30"
          label-width="65px"
          rows="1"
          placeholder="请输入银行卡用户姓名"
          clearable
        />
        <van-field
          v-model="mTelphoneNumber"
          label="电话号码:"
          maxlength="30"
          label-width="65px"
          type="tel"
          rows="1"
          placeholder="请输入银行预留电话号码"
          clearable
        />
        <van-field
          v-model="mIdNo"
          label="身份证号:"
          maxlength="30"
          label-width="65px"
          rows="1"
          placeholder="请输入用户身份证号码"
          clearable
        />
      </div>
      <div v-if="radio == '2'">
        <van-field
          v-model="newCardNumber"
          label="银行卡号:"
          maxlength="30"
          label-width="65px"
          type="number"
          rows="1"
          placeholder="请输入银行卡号"
          clearable
        />
        <van-field
          v-model="newCustomName"
          label="真实姓名:"
          maxlength="30"
          label-width="65px"
          rows="1"
          placeholder="请输入银行卡用户姓名"
          clearable
        />
        <van-field
          v-model="mTelphoneNumber"
          label="电话号码:"
          maxlength="30"
          label-width="65px"
          type="tel"
          rows="1"
          placeholder="请输入银行预留电话号码"
          clearable
        />
        <van-field
          v-model="mIdNo"
          label="身份证号:"
          maxlength="30"
          label-width="65px"
          rows="1"
          placeholder="请输入用户身份证号码"
          clearable
        />
        <van-field
          v-model="mValidDate"
          label="有效日期:"
          maxlength="30"
          label-width="65px"
          rows="1"
          placeholder="请输入信用卡有效期"
          clearable
        />
        <van-field
          v-model="mVerifyData"
          label="验证码:"
          maxlength="30"
          label-width="65px"
          rows="1"
          placeholder="请输入信用卡验证码"
          clearable
        />
      </div>

    </van-dialog>
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
        optCardList: [],
        icon_noCards: require('@/assets/icons/ico_empty_card.png'),
        icon_optCardsReal: require('@/assets/icons/ico_optCards_real.png'),
        addNewOptCardDlgShow: false,
        newCardNumber: "",
        newCustomName: "",
        mTelphoneNumber: "",
        mIdNo: "",
        radio: '1',
        mValidDate:'',
        mVerifyData:''
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      let that = this
      let userDetail = this.$store.state.appconf.userDetail;
      if (userDetail.length > 0) {
        this.user = JSON.parse(userDetail)
        this.mTelphoneNumber = this.user.telephone
      }
      let options = {
        "isvalid": true,
        "phonenum": this.mTelphoneNumber
      }
      that.$api.xapi({
        method: 'post',
        baseURL: this.$api.OPTCARDS_URL,
        url: '/woc/cardinfo/getcardlist',
        data: options
      }).then((response) => {
        that.$log(response.data.data)
        that.optCardList = response.data.data
        that.launchedLoaded = true
      }).catch(function (error) {

      })
    },

    methods: {
      updateUserDetail(userDetail) {
        this.$store.commit('SET_USER_DETAIL', JSON.stringify(userDetail));
      },
      updateCurrentOptCard(currentCard) {
        this.$store.commit('SET_CURRENT_OPT_CARDS', JSON.stringify(currentCard));
      },
      updateOptCardList() {
        let that = this
        let options = {
          "isvalid": true,
          "phonenum": this.mTelphoneNumber
        }
        that.$api.xapi({
          method: 'post',
          baseURL: this.$api.OPTCARDS_URL,
          url: '/woc/cardinfo/getcardlist',
          data: options
        }).then((response) => {
          that.$log(response.data.data)
          that.optCardList = response.data.data
        }).catch(function (error) {

        })
      },
      saveUserInfo() {
        return this.$api.xapi({
          method: 'put',
          baseURL: this.$api.SSO_BASE_URL,
          //url: '/user/updateProfile',
          url: '/user',
          data: this.user
        })
      },
      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString, "YYYYMMDDHHmmss").format('YYYY/MM/DD')
      },
      onCardDetailBtnClick(k) {
        this.$log("onCardDetailBtnClick Enter")
        this.$log(k)
        this.updateCurrentOptCard(k);
        this.$router.push({
          name: "惠民优选卡详情页",
          params: {
            user: this.user,
            card: k,
          }
        })
      },
      onAddOptCardBtnClick() {
        this.$log("onAddOptCardBtnClick Enter")
        this.addNewOptCardDlgShow = true
      },

      async beforeCloseAddNewOptCardDlg(action, done) {
        this.$log("beforeCloseAddNewOptCardDlg Enter");
        if (action === 'confirm') {
          // this.user.nickname = this.inputNickName
          // this.saveUserInfo();
          if (this.user.telephone == null || this.user.telephone.length == 0) {
            if (!this.mTelphoneNumber.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
              this.$toast("请输入正确的电话号码")
              done(false) //不关闭弹框
              return
            } else {
              this.user.telephone = this.mTelphoneNumber
              let ret = await this.saveUserInfo();
              this.updateUserDetail(this.user);
            }
          }
          if (this.newCardNumber.length == 0) {
            this.$toast("请输入正确的卡号")
            done(false) //不关闭弹框
            return
          }
          if (this.newOptCardPwd.length == 0) {
            this.$toast("请输入正确的卡密码")
            done(false) //不关闭弹框
            return
          }
          this.$log(this.mTelphoneNumber)
          this.$log(this.newCardNumber)
          this.$log(this.newOptCardPwd)
          let that = this
          let options = {
            "cardnum": this.newCardNumber,
            "password": this.newOptCardPwd,
            "phonenum": this.mTelphoneNumber
          }
          that.$api.xapi({
            method: 'post',
            baseURL: this.$api.OPTCARDS_URL,
            url: '/woc/cardbind/dobind',
            data: options
          }).then((response) => {
            that.$log(response.data.data)
            that.$toast(response.data.message)
            that.updateOptCardList()
            done()
          }).catch(function (error) {
            that.$toast("绑卡失败")
            done()
          })
        } else if (action === 'cancel') {
          done() //关闭
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .myOptCarList {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .optCardListBody {
      .optCardListMain {
        width: 100%;
        padding-bottom: 3em;

        .noCards {
          width: 100%;
          background-color: #f8f8f8;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;
          height: 500px;

          img {
            height: 130px;
            width: 130px;
          }

          span {
            margin: 2vw;
          }

          .noCoupon_line1 {
            font-weight: lighter;
            color: black;
            .fz(font-size, 35);
          }

          .noCoupon_line2 {
            font-weight: lighter;
            color: #8c8c8c;
            .fz(font-size, 28);
          }

        }

        .optcardList {
          display: flex;
          flex-direction: column;
          background-color: #f8f8f8;
          justify-items: center;

          .optCard {
            background-color: white;
            display: flex;
            flex-direction: column;
            color: black;
            position: relative;
            padding-left: .5rem;
            padding-right: .5rem;
            margin: .5rem;
            /** 这里不能用百分号，因为百分号是分别相对宽和高计算的，会导致弧度不同  */
            border-top-right-radius: .3rem;
            border-bottom-right-radius: .3rem;
            overflow: hidden;

            .cardMain {
              .cardImg {
                padding: 5px;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .cardInfo {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 5px;

                span {
                }
              }

            }

            .cardFooter {
              display: flex;
              padding: 10px;
              width: 100%;
              border-top: 1px dashed #cccccc;

              .cardBalance {
                width: 70%;
                text-align: left;
              }

              .cardDetail {
                width: 30%;
                text-align: center;
                color: #ff4444;
              }
            }
          }
        }
      }
    }

    .optcardListBottomFunc {
      background-color: white;
      width: 100%;
      height: 3em;
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #ffffff;
      z-index: 5;


      .addOptCardButton {
        width: 100%;
        height: 100%;
        background-color: #FF4444;
        text-align: center;
        line-height: 3em;
        color: white;
      }
    }
  }
</style>
