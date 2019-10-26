<template lang="html">
  <section class="myBankCarList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的快捷支付银行卡</h1>
    </v-header>
    <div class="bankCardListBody">
      <div class="bankCardListMain">
        <div class="bankcardList" v-if="bankcardList.length > 0">
          <div v-for="(k,index) in bankcardList" :key="index" class="bankCard">
            <div class="cardMain">
              <div class="cardTitle">
                <img :src="icon_ic_chip">
                <span>{{getBankNameByAccountId(k.accountId)}}</span>
                <van-icon  style="float: right" name="delete" @click="onDeleteCardBtnClick(k,index)"></van-icon>
              </div>
              <div class="cardInfo">
                 <span>{{formatBankNumber(k.accountId)}}</span>
              </div>
            </div>
            <div class="cardFooter">
              <div class="cardOwner">
                <span>持卡人: {{k.accountName}}</span>
              </div>
              <div class="cardDetail" v-if="k.expiredDate != null">
                <span>有效期: {{k.expiredDate}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="launchedLoaded && bankcardList.length == 0" class="noCards">
          <img :src="icon_noCards">
          <span style="font-size: large;color: black">亲，还没有添加卡</span>
        </div>
      </div>
    </div>
    <div class="bankcardListBottomFunc">
      <div class="queryBanckSupportList">
        <span @click="onQuerySupportBListClick()">查看支持的银行卡</span>
      </div>
      <div @click="onAddBankCardBtnClick()" class="addBankCardButton">
        <span>添加银行卡</span>
      </div>
    </div>
    <van-dialog
      v-model="showSupportList"
      title="快捷支付银行卡列表"
    >
      <div class="supportBankList">
        <img :src="icon_support_bank_list">
      </div>
    </van-dialog>
    <van-dialog
      v-model="addNewBankCardDlgShow"
      title="添加银行卡"
      show-cancel-button="true"
      confirm-button-text="添加"
      :beforeClose="beforeCloseAddNewCardDlg"
    >
      <div class="cardTypeBox">
        <van-radio-group v-model="radio" style="display: flex">
          <van-cell title="储蓄卡" :icon="icon_linkpay" clickable @click="radio = '1'">
            <van-radio slot="right-icon" name="1"/>
          </van-cell>
          <van-cell title="信用卡" :icon="icon_quicklypay" @click="radio = '2'">
            <van-radio slot="right-icon" name="2"/>
          </van-cell>
        </van-radio-group>
      </div>
      <div v-if="radio == '1'">
        <van-field
          v-model="newCardNumber"
          label="银行卡号:"
          maxlength="32"
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
          v-model="mExpiredDate"
          label="有效日期:"
          maxlength="4"
          label-width="65px"
          rows="1"
          placeholder="请输入信用卡有效期(MMYY)"
          clearable
        />
        <van-field
          v-model="mCvv2"
          label="验证码:"
          maxlength="3"
          label-width="65px"
          rows="1"
          placeholder="请输入信用卡3位验证码"
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
  import BANKUtil from '@/util/bank'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      'v-footer': Footer
    },

    data() {
      return {
        user: {},
        showSupportList: false,
        launchedLoaded: false,
        bankcardList: [],
        icon_noCards: require('@/assets/icons/ico_empty_card.png'),
        icon_ic_chip: require('@/assets/icons/ico_ic_chip.png'),
        icon_support_bank_list: require('@/assets/icons/ico_bank_support.png'),
        addNewBankCardDlgShow: false,
        newCardNumber: "",
        newCustomName: "",
        mTelphoneNumber: "",
        mIdNo: "",
        radio: '1',
        mExpiredDate: '',
        mCvv2: ''
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
      this.updatebankcardList()
    },

    methods: {
      onQuerySupportBListClick() {
        this.$log("onQuerySupportBListClick Enter")
        this.showSupportList = true
      },
      getBankNameByAccountId(accoundId) {
         return BANKUtil.getBankInfoByCardNo(accoundId)
      },
      formatBankNumber(bankNumber){
        return bankNumber.substr(0,4)+" **** **** "+bankNumber.substr(-4);
      },
      onDeleteCardBtnClick(k,index) {
        this.$log("onDeleteCardBtnClick Enter")
        let that = this
        that.$api.xapi({
          method: 'delete',
          baseURL: this.$api.QUICKLY_PAY_URL,
          url: '/accounts/account/'+k.id,
        }).then((response) => {
          that.$log("onDelBtnClick coupon success, response is:" + JSON.stringify(response.data))
          if (response.data.code == 200) {
            this.bankcardList.splice(index, 1);
          }
        }).catch(function (error) {
          that.$log(error)
        })
      },
      updateUserDetail(userDetail) {
        this.$store.commit('SET_USER_DETAIL', JSON.stringify(userDetail));
      },
      updatebankcardList() {
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let customUser = JSON.parse(userInfo)
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.QUICKLY_PAY_URL,
            url: '/accounts/list',
            params: {
              "openId": customUser.userId,
            }
          }).then((response) => {
            if (response.data.code == 200) {
              this.bankcardList = response.data.data
              this.$log(this.bankcardList)
            }
            if (!that.launchedLoaded)
              that.launchedLoaded = true
          }).catch(function (error) {
            that.$log(error)
            if (!that.launchedLoaded)
              that.launchedLoaded = true
          })
        }
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
      onAddBankCardBtnClick() {
        this.$log("onAddBankCardBtnClick Enter")
        this.addNewBankCardDlgShow = true
      },

      async beforeCloseAddNewCardDlg(action, done) {
        this.$log("beforeCloseAddNewCardDlg Enter");
        if (action === 'confirm') {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
            let customUser = JSON.parse(userInfo)
            if (this.newCardNumber.length == 0) {
              this.$toast("请输入正确的卡号")
              done(false) //不关闭弹框
              return
            }
            if (this.newCustomName.length == 0) {
              this.$toast("请输入真实姓名")
              done(false) //不关闭弹框
              return
            }
            if (this.user.telephone == null || this.user.telephone.length == 0) {
              if (this.mTelphoneNumber == null || !this.mTelphoneNumber.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
                this.$toast("请输入正确的电话号码")
                done(false) //不关闭弹框
                return
              } else {
                this.user.telephone = this.mTelphoneNumber
                let ret = await this.saveUserInfo();
                this.updateUserDetail(this.user);
              }
            }
            if (this.mIdNo.length == 0 ||
              !this.mIdNo.match("^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$")) {
              this.$toast("请输入正确的身份证号码")
              done(false) //不关闭弹框
              return
            }
            if(this.radio=='2') {
              if(this.mExpiredDate.length == 0 ||
                !this.mExpiredDate.match("0\\d{3}|1[012]\\d{2}")) {
                this.$toast("请输入正确的有效日期")
                done(false) //不关闭弹框
                return
              }
              if(this.mCvv2.length < 3) {
                this.$toast("请输入正确的验证码")
                done(false) //不关闭弹框
                return
              }
            }
            let that = this
            let expiredDate = this.mExpiredDate
            let cvv2 = this.mCvv2
            let accountType = 1
            if (this.radio == '1') {
              expiredDate = ""
              cvv2 = ""
              accountType = 2
            }
            let options = {
              "openId": customUser.userId,
              "accountType": accountType,
              "accountId": this.newCardNumber,
              "accountName": this.newCustomName,
              "mobileNo": this.mTelphoneNumber,
              "certNo": this.mIdNo,
              "expiredDate": expiredDate,
              "cvv2": cvv2
            }
            that.$api.xapi({
              method: 'post',
              baseURL: this.$api.QUICKLY_PAY_URL,
              url: '/ztkx/cardPayment/card',
              data: options
            }).then((response) => {
              that.$log(response)
              if (response.data.code == 200) {
                that.$toast("添加成功")
                this.updatebankcardList()
              } else {
                that.$toast("添加失败，"+response.data.msg)
              }
              done()
            }).catch(function (error) {
              that.$toast("绑卡失败")
              done()
            })
          } else {
            this.$log("没有用户信息，无法添加银行卡，请先登录")
            done()
          }
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

  .myBankCarList {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .bankCardListBody {
      .bankCardListMain {
        width: 100%;
        padding-bottom: 5em;

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
        }

        .bankcardList {
          display: flex;
          flex-direction: column;
          background-color: #f8f8f8;
          justify-items: center;

          .bankCard {
            background:-webkit-linear-gradient(to right, #0d6cda, #3bc1fc);
            background:linear-gradient(to right,#0d6cda, #3bc1fc);
            display: flex;
            flex-direction: column;
            color: black;
            position: relative;
            padding-left: .5rem;
            padding-right: .5rem;
            margin: .5rem;
            /** 这里不能用百分号，因为百分号是分别相对宽和高计算的，会导致弧度不同  */
            border-radius: .3rem;
            overflow: hidden;

            .cardMain {
              .cardTitle{
                padding: 10px;
                color: white;
                img {
                  width: 40px;
                  height: 40px;
                }
                span{
                  margin-left: 10px;
                }
              }
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
                padding: 1px 8px;
                color: white;
              }

            }

            .cardFooter {
              display: flex;
              padding: 10px;
              width: 100%;

              .cardOwner {
                width: 50%;
                text-align: left;
                color: white;
              }

              .cardDetail {
                margin-right: 20px;
                width: 50%;
                color: white;
                text-align: right;
              }
            }
          }
        }
      }
    }

    .bankcardListBottomFunc {
      background-color: white;
      width: 100%;
      height: 5em;
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #ffffff;
      z-index: 5;

      .queryBanckSupportList{
        width: 100%;
        background-color: #f8f8f8;
        text-align: center;
        color: #1989fa;
        padding: 0.5em;
        span{
          text-decoration:underline
        }

      }

      .addBankCardButton {
        width: 100%;
        height: 100%;
        background-color: #FF4444;
        text-align: center;
        line-height: 3em;
        color: white;
      }
    }

    .supportBankList{
      width: 100%;
      height: 400px;
      overflow: scroll;

      img {
        padding: 2px;
        width: 100%;
        display: inline-block;
      }
    }
  }
</style>
