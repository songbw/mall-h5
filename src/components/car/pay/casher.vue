<template lang="html">
  <div class="casher">
    <v-header v-if="showHeader">
      <h1 slot="title">订单支付</h1>
    </v-header>
    <div class="payBody">
      <div class="box"></div>
      <div class="payBox">
        <div class="infoBox" style="z-index: 1">
          <div class="payAmount">
            <p><span>￥</span>{{amount}}</p>
          </div>
          <div style="width: 100%;display: flex">
            <span class="orderNo_title">支付订单:</span>
            <span class="orderNo">{{this.orderInfo.orderNo}}</span>
          </div>
          <div style="  width: 100%;
          display: flex;
          flex-direction: row;">
            <div style="width: 70%">
              <span style="margin:10px;font-size: small;float: left">订单详情:</span>
            </div>
            <div style="width: 30%">
              <span style="margin:10px;font-size: small;float: right">订单支付</span>
            </div>
          </div>
        </div>
        <div v-if="this.$api.APP_ID == '11'" class="wuxipayBox">
          <div class="coinBalanceBox">
            <van-cell :title="mCoinBalance.title" :icon="mCoinBalance.icon" clickable @click="onCoinBalanceSelector()">
              <van-checkbox slot="right-icon" v-model="coinBalanceValue" checked-color="#FF4444"></van-checkbox>
              <span slot="label" style="color:black">可用余额: ￥{{(mCoinBalance.amount/100).toFixed(2)}}</span>
            </van-cell>
          </div>
          <div class="optCardBox">
            <van-cell :title="mOptCards.title" :icon="mOptCards.icon"
                      :value="this.mOptCards.show?'点击隐藏优选卡':'点击查看优选卡'"
                      clickable
                      @click="onOptCardCellClick()">
            </van-cell>
            <div v-if="this.mOptCards.show == true">
              <van-checkbox-group v-model="mOptCardsResult" @change="onOptCardsStatusChanged()">
                <van-cell-group>
                  <van-cell
                    v-for="(item, index) in mOptCards.list"
                    clickable
                    :key="index"
                    @click="optCardsToggle(index)"
                  >
                    <div slot="default" class="optCard">
                      <span>{{item.balance/100}}元</span>
                      <span>惠民优选卡支付</span>
                    </div>
                    <div slot="right-icon" class="optCardCheckBox">
                      <van-checkbox
                        :name="item.cardnum"
                        checked-color="#3dd5c8"
                        ref="optCardsCheckboxes"
                      />
                    </div>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
              <div class="addNewOptCard" @click="onAddNewOptCardClick">
                <van-icon name="plus" color="#FF4444"></van-icon>
                <span>绑定惠民优选卡</span>
              </div>
            </div>
            <van-dialog
              v-model="addNewOptCardDlgShow"
              title="绑定惠民优选卡"
              show-cancel-button="true"
              confirm-button-text="绑定"
              :beforeClose="beforeCloseAddNewOptCardDlg"
            >
              <van-field
                v-model="mTelphoneNumber"
                type="tel"
                rows="1"
                maxlength="20"
                placeholder="绑定用户电话号码"
                clearable
                v-if="this.userDetail.telephone == null || this.userDetail.telephone.length == 0"
              />
              <van-field
                v-model="newOptCardNumber"
                type="number"
                rows="1"
                maxlength="20"
                placeholder="请输入卡号"
                clearable
              />
              <van-field
                v-model="newOptCardPwd"
                rows="1"
                maxlength="20"
                placeholder="请输入密码"
                clearable
              />
            </van-dialog>
          </div>
          <div class="composePayBox">
            <van-cell :title="mComposePay.title" :icon="mComposePay.icon">
              <span slot="default" style="font-size: large;color: #ff4444">￥{{remainPayAmount}}</span>
            </van-cell>
            <div v-for="(item, index) in mPaylist" :key="index">
              <van-cell v-if="item.payType == 'optCard'">
                <span slot="title">优选卡支付:</span>
                <span slot="default"
                      style="font-size: medium;color: #ff4444">-￥{{(item.payAmount/100).toFixed(2)}}</span>
              </van-cell>
              <van-cell v-if="item.payType == 'coinBalance'">
                <span slot="title">余额支付:</span>
                <span slot="default"
                      style="font-size: medium;color: #ff4444">-￥{{(item.payAmount/100).toFixed(2)}}</span>
              </van-cell>
            </div>
          </div>
        </div>
        <div class="pathBox">
          <van-radio-group v-model="radio">
            <div v-if="this.$api.APP_ID == '11'">
              <van-cell title="联机账户" :icon="icon_linkpay" clickable @click="radio = '1'">
                <van-radio slot="right-icon" name="1" checked-color="#FF4444"/>
              </van-cell>
              <div class="linkPayDialog" v-if="radio == '1'">
                <!--              <span class="tip">温馨提示:联机账户支付不能低于1角</span>-->
                <van-field
                  v-model="linkPayAccount"
                  type="number"
                  required
                  clearable
                  label="卡号"
                  maxlength="30"
                  label-width="40px"
                  placeholder="请输入卡号"
                />

                <van-field
                  v-model="linkPayPwd"
                  :type="isLinkPwdVisable?'number':'password'"
                  maxlength="30"
                  clearable
                  label="密码"
                  label-width="40px"
                  placeholder="请输入密码"
                  :right-icon="isLinkPwdVisable?'eye-o':'closed-eye'"
                  required
                  @click-right-icon="togLinkPayPwdVisable()"
                />
              </div>
              <van-cell title="统一支付" :icon="icon_unionpay" clickable @click="radio = '3'" v-if="isSupportUnionPay">
                <van-radio slot="right-icon" name="3" checked-color="#FF4444"/>
              </van-cell>
            </div>
            <van-cell title="快捷支付" :icon="icon_quicklypay" clickable @click="radio = '2'">
              <van-radio slot="right-icon" name="2" checked-color="#FF4444"/>
            </van-cell>
            <div class="quickPayDialog" v-if="radio == '2'">
              <div v-if="this.$api.IS_QUICKPAY_CAN_SAVE">
                <div class="bankListCheckBox">
                  <div v-if="mBankcardList.length > 0">
                    <van-radio-group v-model="bankRadio">
                      <van-cell-group>
                        <div v-for="(item, index) in mBankcardList">
                          <van-swipe-cell :right-width="60">
                            <van-cell
                              clickable
                              :key="index"
                              @click="BanckCardsClick(item)"
                            >
                              <div slot="default" class="bankCard">
                                <span>{{getBankNameByAccountId(item.accountId)}}</span>
                                <span>卡号: {{formatBankNumber(item.accountId)}}</span>
                                <span>银行卡支付</span>
                              </div>
                              <div slot="right-icon" class="bankCardCheckBox">
                                <van-radio
                                  :name="item.accountId"
                                  checked-color="#3dd5c8"
                                  ref="bankCardsCheckboxes"
                                />
                              </div>
                            </van-cell>
                            <div slot="right" @click="onDeleteCardBtnClick(item,index)" class="rightSlot">
                              <span style="margin-left: 1em">删除</span>
                            </div>
                          </van-swipe-cell>
                        </div>
                      </van-cell-group>
                    </van-radio-group>
                  </div>
                  <div class="queryBanckSupportList">
                    <span @click="onQuerySupportBListClick()">查看支持的银行卡</span>
                  </div>
                  <div class="addNewBankCard" @click="onAddNewBankCardClick">
                    <van-icon name="plus" color="#FF4444"></van-icon>
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
                    <van-radio-group v-model="newCardRadio" style="display: flex">
                      <van-cell title="储蓄卡" clickable @click="newCardRadio = '1'">
                        <van-radio slot="right-icon" name="1"/>
                      </van-cell>
                      <van-cell title="信用卡" @click="newCardRadio = '2'">
                        <van-radio slot="right-icon" name="2"/>
                      </van-cell>
                    </van-radio-group>
                  </div>
                  <div v-if="newCardRadio == '1'">
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
                  <div v-if="newCardRadio == '2'">
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
              </div>
              <div v-else>
                <div class="bankListCheckBox">
                  <div>
                    <div class="cardTypeBox">
                      <van-radio-group v-model="newCardRadioNotSaved" style="display: flex">
                        <van-cell title="储蓄卡" clickable @click="newCardRadioNotSaved = '1'">
                          <van-radio slot="right-icon" name="1"/>
                        </van-cell>
                        <van-cell title="信用卡" @click="newCardRadioNotSaved = '2'">
                          <van-radio slot="right-icon" name="2"/>
                        </van-cell>
                      </van-radio-group>
                    </div>
                    <div v-if="newCardRadioNotSaved == '1'">
                      <van-field
                        v-model="newCardNumberNotSaved"
                        label="银行卡号:"
                        maxlength="32"
                        label-width="65px"
                        type="number"
                        rows="1"
                        placeholder="请输入银行卡号"
                        clearable
                      />
                      <van-field
                        v-model="newCustomNameNotSaved"
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
                        v-model="mIdNoNotSaved"
                        label="身份证号:"
                        maxlength="30"
                        label-width="65px"
                        rows="1"
                        placeholder="请输入用户身份证号码"
                        clearable
                      />
                    </div>
                    <div v-if="newCardRadioNotSaved == '2'">
                      <van-field
                        v-model="newCardNumberNotSaved"
                        label="银行卡号:"
                        maxlength="30"
                        label-width="65px"
                        type="number"
                        rows="1"
                        placeholder="请输入银行卡号"
                        clearable
                      />
                      <van-field
                        v-model="newCustomNameNotSaved"
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
                        v-model="mIdNoNotSaved"
                        label="身份证号:"
                        maxlength="30"
                        label-width="65px"
                        rows="1"
                        placeholder="请输入用户身份证号码"
                        clearable
                      />
                      <van-field
                        v-model="mExpiredDateNotSaved"
                        label="有效日期:"
                        maxlength="4"
                        label-width="65px"
                        rows="1"
                        placeholder="请输入信用卡有效期(MMYY)"
                        clearable
                      />
                      <van-field
                        v-model="mCvv2NotSaved"
                        label="验证码:"
                        maxlength="3"
                        label-width="65px"
                        rows="1"
                        placeholder="请输入信用卡3位验证码"
                        clearable
                      />
                    </div>
                  </div>
                  <div class="queryBanckSupportList">
                    <span @click="onQuerySupportBListClick()">查看支持的银行卡</span>
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
              </div>
            </div>
            <div v-if="this.$api.APP_ID == '01'">
              <van-cell title="微信支付" :icon="icon_wechatpay" clickable @click="radio = '4'">
                <van-radio slot="right-icon" name="4" checked-color="#FF4444"/>
              </van-cell>
            </div>
          </van-radio-group>
        </div>
        <van-dialog
          v-model="quickPayDlgShow"
          title="快捷支付银行卡验证"
          show-cancel-button="true"
          confirm-button-text="去支付"
          :beforeClose="beforeCloseQuickPayDlg"
        >
          <div class="verifyCodeBox">
            <van-field
              v-model="quickPayVerifyCode"
              maxlength="10"
              clearable
              placeholder="请输入短信验证码"
            />
            <van-button :disabled="isVerifyCodeBtnDisabled" type="danger"
                        @click="onGetVerifyCodeBtnClick">{{verifyBtnText}}
            </van-button>
          </div>
        </van-dialog>

        <div class="footer_layout">
          <van-button type="danger" round size="large" :loading="payBtnSubmitLoading" @click="onPayBtnClick">
            确认支付￥{{remainPayAmount}}
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Util from '@/util/common'
  import BANKUtil from '@/util/bank'
  import {configWechat} from '@/util/wechat'
  import wx from 'weixin-js-sdk'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        showHeader: true,
        orderInfo: {},
        icon_quicklypay: require('@/assets/icons/ico_quicklypay.png'),
        icon_linkpay: require('@/assets/icons/ico_linkpay.png'),
        icon_coin_balance: require('@/assets/icons/ico_coin_balance.png'),
        icon_unionpay: require('@/assets/icons/ico_unionpay.png'),
        icon_wechatpay: require('@/assets/icons/ico_wechatpay.png'),
        radio: -1,
        linkPayAccount: "",
        linkPayPwd: "",
        isLinkPwdVisable: false,
        userDetail: {},
        mCoinBalance: {
          title: "余额支付",
          icon: require('@/assets/icons/ico_coin_balance.png'),
          amount: 0,
          checked: false,
          payAmount: 0,
        },
        mOptCards: {
          title: "惠民优选卡支付",
          icon: require('@/assets/icons/ico_optCard.png'),
          list: [],
          result: [],
          show: false,
          payAmount: 0,
        },
        mComposePay: {
          title: "还需支付",
          icon: require('@/assets/icons/ico_menu.png'),
        },
        mBankcardList: [],
        mPaylist: [],
        addNewOptCardDlgShow: false,
        newOptCardNumber: "",
        newOptCardPwd: "",
        bankRadio: "-1",
        quickPayVerifyCode: "",
        isVerifyCodeBtnDisabled: false,
        verifyBtnText: '获取验证码',
        quickPayVerifyCodeCount: 0,
        quickPayVerifyCodeTimer: 0,
        verifyBtnTextClicked: false,
        quickPayDlgShow: false,
        payOptions: null,
        addNewBankCardDlgShow: false,
        newCardRadio: "1",
        newCardNumber: "",
        newCustomName: "",
        mIdNo: "",
        mExpiredDate: "",
        mCvv2: "",
        showSupportList: false,
        icon_support_bank_list: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_bank_support.png',
        payBtnSubmitLoading: false,
        mTelphoneNumber: "",

        newCardRadioNotSaved: "1",
        newCardNumberNotSaved: "",
        newCustomNameNotSaved: "",
        mIdNoNotSaved: "",
        mExpiredDateNotSaved: "",
        mCvv2NotSaved: "",
        isSupportUnionPay: false
      }
    },
    computed: {
      amount() {
        return (this.orderInfo.orderAmount / 100).toFixed(2)
      },

      remainPayAmount() {
        return ((this.orderInfo.orderAmount - this.mCoinBalance.payAmount - this.mOptCards.payAmount) / 100).toFixed(2)
      },

      coinBalanceValue: {
        get() {
          return this.mCoinBalance.checked
        },
        set(value) {
          if (this.mCoinBalance.amount == 0 && !this.mCoinBalance.checked ||
            this.remainPayAmount == 0 && !this.mCoinBalance.checked) {
          } else {
            this.mCoinBalance.checked = value
          }
        }
      },

      mOptCardsResult: {
        get() {
          return this.mOptCards.result
        },
        set(value) {
          if (value.length > this.mOptCards.result.length) {//添加
            if (this.remainPayAmount > 0) {
              this.mOptCards.result = value
            }
          } else {
            this.mOptCards.result = value
          }
        }
      }
    },

    created() {
      this.$log("cashser created Enter")
      this.showHeader = this.$api.HAS_HEADER;
      this.orderInfo = this.$route.params.orderInfo;
      this.$log(this.orderInfo);
      this.updateOptCardInfo();
      this.udateBankcardList();
      this.updateBalanceAmount();
      this.updateLinkPayAccount();
      if(this.$api.APP_ID == '11') {
        this.$log("######################")
        let version = sc.getAppVersion()
        this.$log("version:"+version)
        let ret = this.versionStringCompare(version,'3.0.1')
        if(ret < 0) {
           this.$log("不支持统一支付")
           this.isSupportUnionPay = false
        } else {
           this.$log("支持统一支付")
           this.isSupportUnionPay = true
        }
        /*sc.isExistApi({
          path:'pay'
        },
        function (res) {
          if(res.code == 0) {
            console.log("支持统一支付:"+res)
          } else {
            console.log("不支持统一支付:"+res)
          }
        })*/
      }
    },

    beforeDestroy() {
      if (this.quickPayVerifyCodeTimer) {
        clearInterval(this.quickPayVerifyCodeTimer)
        this.verifyBtnTextClicked = false
        this.quickPayVerifyCodeTimer = 0
        this.quickPayVerifyCode = ''
        this.isVerifyCodeBtnDisabled = false;
        this.verifyBtnText = "获取验证码"
      }
    },

    methods: {
      versionStringCompare (preVersion='', lastVersion='')  {
        let sources = preVersion.split('.');
        let dests = lastVersion.split('.');
        let maxL = Math.max(sources.length, dests.length);
        let result = 0;
        for (let i = 0; i < maxL; i++) {
          let preValue = sources.length > i ? sources[i] : 0;
          let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
          let lastValue = dests.length > i ? dests[i] : 0;
          let lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
          if (preNum < lastNum) {
            result = -1;
            break;
          } else if (preNum > lastNum) {
            result = 1;
            break;
          }
        }
        return result;
      },
      updateLinkPayAccount() {
        let linkPayAccount = Util.getLocal("linkPayAccount")
        if (linkPayAccount != null) {
          this.linkPayAccount = linkPayAccount;
        }
      },
      onQuerySupportBListClick() {
        this.$log("onQuerySupportBListClick Enter")
        this.showSupportList = true
      },
      getBankNameByAccountId(accoundId) {
        return BANKUtil.getBankInfoByCardNo(accoundId)
      },
      formatBankNumber(bankNumber) {
        return bankNumber.substr(0, 4) + " **** **** " + bankNumber.substr(-4);
      },
      QPayBtnCountDown() {
        this.quickPayVerifyCodeCount--;
        if (this.quickPayVerifyCodeCount <= 0) {
          clearInterval(this.quickPayVerifyCodeTimer)
          this.verifyBtnTextClicked = false;
          this.quickPayVerifyCodeTimer = 0;
          this.quickPayVerifyCodeCount = 0
          this.verifyBtnText = '获取验证码'
          this.isVerifyCodeBtnDisabled = false;
        } else {
          this.verifyBtnText = this.quickPayVerifyCodeCount + ' s'
        }
      },
      onGetVerifyCodeBtnClick() {
        this.$log("onGetVerifyCodeBtnClick Enter")
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          if (!this.isVerifyCodeBtnDisabled) {
            this.isVerifyCodeBtnDisabled = true;
            this.quickPayVerifyCodeCount = 60
            this.quickPayVerifyCodeTimer = setInterval(this.QPayBtnCountDown, 1000);
            this.verifyBtnTextClicked = true;
            this.$log(this.payOptions.bankPay)
            let payAmount = parseInt((this.remainPayAmount * 100).toFixed(0))
            let options = {
              "accountId": this.payOptions.bankPay.accountId,
              "accountName": this.payOptions.bankPay.accountName,
              "accountType": this.payOptions.bankPay.accountType,
              "certNo": this.payOptions.bankPay.certNo,
              "cvv2": this.payOptions.bankPay.cvv2,
              "doSaveIt": 0,
              "expiredDate": this.payOptions.bankPay.expiredDate,
              "mobileNo": this.payOptions.bankPay.mobileNo,
              "openId": user.userId,
              "orderNo": this.orderInfo.orderNo,
              "tranAmt": payAmount
            }
            this.$log(options)
            this.$api.xapi({
              method: 'post',
              baseURL: this.$api.AGGREGATE_PAY_URL,
              url: '/wspay/fast/bank/auth',
              data: options,
            }).then((response) => {
              this.$log(response)
              if (response.data.code == 200) {

              } else {
                this.$toast(response.data.message)
                if (this.quickPayVerifyCodeTimer) {
                  clearInterval(this.quickPayVerifyCodeTimer)
                  this.quickPayVerifyCodeTimer = 0
                  this.verifyBtnTextClicked = false
                  this.quickPayVerifyCode = ''
                  this.isVerifyCodeBtnDisabled = false;
                  this.verifyBtnText = "获取验证码"
                }
              }
            }).catch(function (error) {
              that.$log(error)
            })
            /*            if(this.$api.IS_QUICKPAY_CAN_SAVE) {
                          this.$log(this.bankRadio)
                          let found = -1;
                          for (let i = 0; i < this.mBankcardList.length; i++) {
                            if (this.mBankcardList[i].accountId == this.bankRadio) {
                              found = i;
                              break;
                            }
                          }
                          if (found != -1) {
                            this.isVerifyCodeBtnDisabled = true;
                            this.quickPayVerifyCodeCount = 60
                            this.quickPayVerifyCodeTimer = setInterval(this.QPayBtnCountDown, 1000);
                            this.verifyBtnTextClicked = true;
                            this.$log(this.mBankcardList[found])
                            let payAmount = parseInt((this.remainPayAmount * 100).toFixed(0))
                            let options = {
                              "accountId": this.mBankcardList[found].accountId,
                              "accountName": this.mBankcardList[found].accountName,
                              "accountType": this.mBankcardList[found].accountType,
                              "certNo": this.mBankcardList[found].certNo,
                              "cvv2": this.mBankcardList[found].cvv2,
                              "doSaveIt": 0,
                              "expiredDate": this.mBankcardList[found].expiredDate,
                              "mobileNo": this.mBankcardList[found].mobileNo,
                              "openId": user.userId,
                              "orderNo": this.orderInfo.orderNo,
                              "tranAmt": payAmount
                            }
                            this.$log(options)
                            this.$api.xapi({
                              method: 'post',
                              baseURL: this.$api.AGGREGATE_PAY_URL,
                              url: '/wspay/fast/bank/auth',
                              data: options,
                            }).then((response) => {
                              this.$log(response)
                              if (response.data.code == 200) {

                              } else {
                                this.$toast(response.data.message)
                                if (this.quickPayVerifyCodeTimer) {
                                  clearInterval(this.quickPayVerifyCodeTimer)
                                  this.quickPayVerifyCodeTimer = 0
                                  this.verifyBtnTextClicked = false
                                  this.quickPayVerifyCode = ''
                                  this.isVerifyCodeBtnDisabled = false;
                                  this.verifyBtnText = "获取验证码"
                                }
                              }
                            }).catch(function (error) {
                              that.$log(error)
                            })
                          } else {
                            this.$toast("没有找到银行卡信息")
                          }
                        } else {
                        }*/
          }
        } else {
          this.$log("没有用户信息，请登录")
        }
      },
      onAddNewBankCardClick() {
        this.$log("onAddNewBankCardClick Enter")
        this.addNewBankCardDlgShow = true;
      },
      onDeleteCardBtnClick(k, index) {
        this.$log("onDeleteCardBtnClick Enter")
        let that = this
        that.$api.xapi({
          method: 'delete',
          baseURL: this.$api.QUICKLY_PAY_URL,
          url: '/accounts/account/' + k.id,
        }).then((response) => {
          that.$log("onDelBtnClick coupon success, response is:" + JSON.stringify(response.data))
          if (response.data.code == 200) {
            this.mBankcardList.splice(index, 1);
          }
        }).catch(function (error) {
          that.$log(error)
        })
      },
      BanckCardsClick(item) {
        this.$log("BanckCardsClick Enter")
        this.bankRadio = item.accountId
      },
      updateUserDetail(userDetail) {
        this.$store.commit('SET_USER_DETAIL', JSON.stringify(userDetail));
      },

      udateBankcardList() {
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.QUICKLY_PAY_URL,
            url: '/accounts/list',
            params: {
              "openId": user.userId,
            }
          }).then((response) => {
            if (response.data.code == 200) {
              this.mBankcardList = response.data.data
              this.$log(this.mBankcardList)
            }
          }).catch(function (error) {
            that.$log(error)
          })
        }
      },

      getOptCardList(userDetail) {
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
          let optCardList = response.data.data
          //this.mOptCards.list = optCardList
          optCardList.forEach(item => {
            item['payAmount'] = 0
            for (let i = 0; i < this.mOptCards.list.length; i++) {
              if (this.mOptCards.list[i].cardnum == item.cardnum) {
                item['payAmount'] = this.mOptCards.list[i].payAmount
                break;
              }
            }
          })
          this.mOptCards.list = optCardList;
        }).catch(function (error) {

        })
      },
      updateOptCardInfo() {
        let userInfo = this.$store.state.appconf.userInfo;
        let that = this
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          return this.$api.xapi({
            method: 'get',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/user',
            params: {
              iAppId: this.$api.APP_ID,
              openId: user.openId,
            }
          }).then((response) => {
            let user = response.data.data.user;
            if (user != null) {
              this.userDetail = user;
              this.mTelphoneNumber = this.userDetail.telephone;
              this.updateUserDetail(this.userDetail);
              this.getOptCardList(this.userDetail);
            }
          }).catch(function (error) {
            that.$log(error)
          })
        } else {
          return null
        }
      },

      /*      saveUserInfo() {
              return this.$api.xapi({
                method: 'put',
                baseURL: this.$api.SSO_BASE_URL,
                //url: '/user/updateProfile',
                url: '/user',
                data: this.user
              })
            },*/
      beforeCloseAddNewCardDlg(action, done) {
        this.$log("beforeCloseAddNewCardDlg Enter")
        if (action === 'confirm') {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
            let customUser = JSON.parse(userInfo)
            if (this.newCardNumber.length < 16 || this.newCardNumber.length > 19) {
              this.$toast("请输入正确的卡号")
              done(false) //不关闭弹框
              return
            }
            if (this.newCustomName.length == 0) {
              this.$toast("请输入真实姓名")
              done(false) //不关闭弹框
              return
            }
            if (this.mTelphoneNumber == null || !this.mTelphoneNumber.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
              this.$toast("请输入正确的电话号码")
              done(false) //不关闭弹框
              return
            }
            if (this.mIdNo.length == 0 ||
              !this.mIdNo.match("^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$")) {
              this.$toast("请输入正确的身份证号码")
              done(false) //不关闭弹框
              return
            }
            if (this.newCardRadio == '2') {
              if (this.mExpiredDate.length == 0 ||
                !this.mExpiredDate.match("0\\d{3}|1[012]\\d{2}")) {
                this.$toast("请输入正确的有效日期")
                done(false) //不关闭弹框
                return
              }
              if (this.mCvv2.length < 3) {
                this.$toast("请输入正确的验证码")
                done(false) //不关闭弹框
                return
              }
            }
            let that = this
            let expiredDate = this.mExpiredDate
            let cvv2 = this.mCvv2
            let accountType = 1
            if (this.newCardRadio == '1') {
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
                this.udateBankcardList();
              } else {
                that.$toast("添加失败，" + response.data.msg)
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
      beforeCloseQuickPayDlg(action, done) {
        this.$log("beforeCloseQuickPayDlg Enter");
        if (action === 'confirm') {
          if (!this.verifyBtnTextClicked) {
            this.$toast("请点击获取验证码")
            done(false)
            return
          }
          if (this.quickPayVerifyCode.length == 0) {
            this.$toast("请输入短信验证码")
            done(false)
          } else {
            let that = this
            this.payOptions.bankPay.verifyCode = this.quickPayVerifyCode
            this.$log(this.payOptions)
            this.payBtnSubmitLoading = true;
            this.$api.xapi({
              method: 'post',
              baseURL: this.$api.AGGREGATE_PAY_URL,
              url: '/wspay/pay',
              data: this.payOptions,
            }).then((response) => {
              this.$log(response)
              if (this.quickPayVerifyCodeTimer) {
                clearInterval(this.quickPayVerifyCodeTimer)
                this.quickPayVerifyCodeTimer = 0
                this.verifyBtnTextClicked = false
                this.quickPayVerifyCode = ''
                this.isVerifyCodeBtnDisabled = false;
                this.verifyBtnText = "获取验证码"
              }
              if (response.data.code == 200) {
                this.$router.replace({
                  path: '/pay/cashering',
                  query: {
                    outer_trade_no: this.orderInfo.orderNo
                  }
                })
              } else {
                this.$toast(response.data.message)
              }
              this.payBtnSubmitLoading = false;
              done()
            }).catch(function (error) {
              that.$toast("请求支付失败")
              this.payBtnSubmitLoading = false;
              done()
            })
          }

        } else if (action === 'cancel') {
          if (this.quickPayVerifyCodeTimer) {
            clearInterval(this.quickPayVerifyCodeTimer)
            this.quickPayVerifyCodeTimer = 0
            this.verifyBtnTextClicked = false
            this.quickPayVerifyCode = ''
            this.isVerifyCodeBtnDisabled = false;
            this.verifyBtnText = "获取验证码"
          }
          done() //关闭
        }
      },

      async beforeCloseAddNewOptCardDlg(action, done) {
        this.$log("beforeCloseAddNewOptCardDlg Enter");
        if (action === 'confirm') {
          if (this.userDetail.telephone == null || this.userDetail.telephone.length == 0) {
            if (!this.mTelphoneNumber.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
              this.$toast("请输入正确的电话号码")
              done(false) //不关闭弹框
              return
            } else {
              /*              this.userDetail.telephone = this.mTelphoneNumber
                            let ret = await this.saveUserInfo();
                            this.updateUserDetail(this.user);*/
            }
          }
          if (this.newOptCardNumber.length == 0) {
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
          this.$log(this.newOptCardNumber)
          this.$log(this.newOptCardPwd)
          let that = this
          let options = {
            "cardnum": this.newOptCardNumber,
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
            that.getOptCardList(this.userDetail);
            done()
          }).catch(function (error) {
            that.$toast("绑卡失败")
            done()
          })
        } else if (action === 'cancel') {
          done() //关闭
        }
      },

      onAddNewOptCardClick() {
        this.$log("onAddNewOptCardClick Enter")
        this.addNewOptCardDlgShow = true
      },
      optCardsToggle(index) {
        if (this.remainPayAmount == 0 && !this.$refs.optCardsCheckboxes[index].checked) {
          //do nothing
        } else {
          this.$refs.optCardsCheckboxes[index].toggle();
        }

      },
      onOptCardsStatusChanged(index) {
        this.$log("onOptCardsStatusChanged Enter")
        this.$log(this.mOptCards.result)
        this.$log(this.mOptCards.list)
        for (let i = this.mPaylist.length - 1; i >= 0; i--) {
          if (this.mPaylist[i].payType == 'optCard')
            this.mPaylist.splice(i, 1);
        }
        this.mOptCards.payAmount = 0;
        this.mOptCards.result.forEach(selectItem => {
          let found = -1;
          for (let i = 0; i < this.mOptCards.list.length; i++) {
            if (this.mOptCards.list[i].cardnum == selectItem) {
              found = i;
              break;
            }
          }
          if (found != -1) {
            this.$log(this.mOptCards.list[found])
            this.$log(this.remainPayAmount)
            let payAmount = 0;
            if (this.remainPayAmount * 100 >= this.mOptCards.list[found].balance) {
              payAmount = this.mOptCards.list[found].balance * 1
            } else {
              payAmount = parseInt((this.remainPayAmount * 100).toFixed(0))
            }
            this.mOptCards.payAmount = this.mOptCards.payAmount + payAmount;
            this.$log("this.mOptCards.payAmount:" + this.mOptCards.payAmount)
            this.mPaylist.push({
              payType: 'optCard',
              payAmount: payAmount,
              cardnum: this.mOptCards.list[found].cardnum
            })
          }
        })
        this.$log(this.mPaylist)
      },

      onOptCardCellClick() {
        this.$log("onOptCardCellClick Enter")
        this.mOptCards.show = !this.mOptCards.show

      },
      onCoinBalanceSelector() {
        this.$log("onCoinBalanceSelector Enter")
        if (this.mCoinBalance.amount == 0 && !this.mCoinBalance.checked ||
          this.remainPayAmount == 0 && !this.mCoinBalance.checked) {
        } else {
          this.mCoinBalance.checked = !this.mCoinBalance.checked
          for (let i = this.mPaylist.length - 1; i >= 0; i--) {
            if (this.mPaylist[i].payType == 'coinBalance')
              this.mPaylist.splice(i, 1);
          }
          this.mCoinBalance.payAmount = 0;
          if (this.mCoinBalance.checked) {
            let remainPayAmount = this.remainPayAmount;
            if (this.mCoinBalance.amount >= parseInt((remainPayAmount * 100).toFixed(0))) {
              this.mCoinBalance.payAmount = parseInt((remainPayAmount * 100).toFixed(0));
            } else {
              this.mCoinBalance.payAmount = this.mCoinBalance.amount
            }
            this.mPaylist.push({
              payType: 'coinBalance',
              payAmount: this.mCoinBalance.payAmount,
            })
          }
        }

      },
      updateBalanceAmount() {
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/balance',
            params: {
              openId: user.openId
            }
          }).then((response) => {
            if (response.data.data != null) {
              this.mCoinBalance.amount = response.data.data.amount /*分*/
            }
          }).catch(function (error) {
            that.$log(error)
          })
        }
      },
      gotoLinkPay() {
        this.$log("gotoLinkPay Enter")
        this.$log(this.linkPayAccount)
        this.$log(this.linkPayPwd)
        if (this.linkPayAccount.length == 0) {
          this.$toast("请输入卡号")
          return
        }
        if (this.linkPayPwd.length == 0 && !this.linkPayPwd.match("^[0-9]*$")) {
          this.$toast("请输入正确的卡密码")
          return
        }
        let options = {
          "payType": "pos",
          "orderNo": this.orderInfo.orderNo,
          "actPayFree": this.orderInfo.orderAmount,
          "cardNo": this.linkPayAccount,
          "cardPwd": this.linkPayPwd
        }
        this.$log(options)
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.AGGREGATE_PAY_URL,
          url: '/wspay/pay',
          data: options,
        }).then((response) => {
          this.$log(response)
          if (response.data.code == 200) {
            this.$router.replace({
              path: '/pay/cashering',
              query: {
                outer_trade_no: this.orderInfo.orderNo
              }
            })
          } else {
            this.$toast(response.data.message)
          }
        }).catch(function (error) {

        })
      },
      togLinkPayPwdVisable() {
        this.isLinkPwdVisable = !this.isLinkPwdVisable
      },
      onPayResult() {
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
        this.$router.replace({path: '/car/orderList'})
      },
      onPayBtnClick() {
        this.$log("onPayBtnClick Enter")
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          let balancePay = null
          let wocPays = []
          let woaPay = null
          let bankPay = null
          let pingAnPay = null
          let fcWxPay = null
          this.payOptions = {
            appId: this.$api.APP_ID,
            orderNo: this.orderInfo.orderNo
          }
          this.mPaylist.forEach(item => {
            switch (item.payType) {
              case  'coinBalance':
                balancePay = {
                  actPayFee: "" + item.payAmount,
                  openId: user.openId,
                  orderNo: this.orderInfo.orderNo,
                  payType: "balance"
                }
                break;
              case 'optCard':
                wocPays.push({
                  actPayFee: "" + item.payAmount,
                  cardNo: item.cardnum,
                  cardPwd: "",
                  mobile: this.mTelphoneNumber,
                  orderNo: this.orderInfo.orderNo,
                  payType: 'card'
                })
              case 'pos':
                break;
              case 'bank':

                break;
              default:
                break;
            }
          })
          if (this.remainPayAmount > 0) {
            if (this.radio == '1') {
              this.$log("link pay clicked")
              if (parseInt((this.remainPayAmount * 100).toFixed(0)) >= 10 &&
                parseInt((this.remainPayAmount * 100).toFixed(0)) <= 500000) {
                if (this.linkPayAccount.length == 0) {
                  this.$toast("请输入卡号")
                  return
                }
                if (this.linkPayPwd.length == 0) {
                  this.$toast("请输入卡密码")
                  return
                }
                woaPay = {
                  "actPayFee": parseInt((this.remainPayAmount * 100).toFixed(0)) + "",
                  "cardNo": this.linkPayAccount,
                  "cardPwd": this.linkPayPwd,
                  "orderNo": this.orderInfo.orderNo,
                  "payType": "woa"
                }
                Util.setLocal(this.linkPayAccount, 'linkPayAccount', false);
              } else {
                this.$toast("抱歉，无法使用该支付方式，联机账户支付不能低于1角或大于5000元")
                return
              }
            } else if (this.radio == '2') { //bank pay
              this.$log(this.bankRadio)
              if (parseInt((this.remainPayAmount * 100).toFixed(0)) >= 100) {
                if (this.$api.IS_QUICKPAY_CAN_SAVE) {
                  let found = -1;
                  for (let i = 0; i < this.mBankcardList.length; i++) {
                    this.$log(this.mBankcardList[i].accountId)
                    if (this.mBankcardList[i].accountId == this.bankRadio) {
                      found = i;
                      break;
                    }
                  }
                  if (found != -1) {
                    bankPay = {
                      "accountId": this.mBankcardList[found].accountId,
                      "accountName": this.mBankcardList[found].accountName,
                      "accountType": this.mBankcardList[found].accountType,
                      "actPayFee": parseInt((this.remainPayAmount * 100).toFixed(0)) + "",
                      "certNo": this.mBankcardList[found].certNo,
                      "cvv2": this.mBankcardList[found].cvv2,
                      "expiredDate": this.mBankcardList[found].expiredDate,
                      "mobileNo": this.mBankcardList[found].mobileNo,
                      "orderNo": this.orderInfo.orderNo,
                      "payType": "bank",
                      "verifyCode": ""
                    }
                  } else {
                    this.$toast("请选择的快捷支付银行卡")
                    return
                  }
                } else {
                  if (this.newCardNumberNotSaved.length < 16 || this.newCardNumberNotSaved.length > 19) {
                    this.$toast("请输入正确的卡号")
                    return
                  }
                  if (this.newCustomNameNotSaved.length == 0) {
                    this.$toast("请输入真实姓名")
                    return
                  }
                  if (this.mTelphoneNumber == null || !this.mTelphoneNumber.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
                    this.$toast("请输入正确的电话号码")
                    return
                  }
                  if (this.mIdNoNotSaved.length == 0 ||
                    !this.mIdNoNotSaved.match("^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$")) {
                    this.$toast("请输入正确的身份证号码")
                    return
                  }
                  if (this.newCardRadioNotSaved == '2') {
                    if (this.mExpiredDateNotSaved.length == 0 ||
                      !this.mExpiredDateNotSaved.match("0\\d{3}|1[012]\\d{2}")) {
                      this.$toast("请输入正确的有效日期")
                      return
                    }
                    if (this.mCvv2NotSaved.length < 3) {
                      this.$toast("请输入正确的验证码")
                      return
                    }
                  }
                  let expiredDate = this.mExpiredDateNotSaved
                  let cvv2 = this.mCvv2NotSaved
                  let accountType = 1
                  if (this.newCardRadioNotSaved == '1') {
                    expiredDate = ""
                    cvv2 = ""
                    accountType = 2
                  }
                  bankPay = {
                    "accountId": this.newCardNumberNotSaved,
                    "accountName": this.newCustomNameNotSaved,
                    "accountType": accountType,
                    "actPayFee": parseInt((this.remainPayAmount * 100).toFixed(0)) + "",
                    "certNo": this.mIdNoNotSaved,
                    "cvv2": cvv2,
                    "expiredDate": expiredDate,
                    "mobileNo": this.mTelphoneNumber,
                    "orderNo": this.orderInfo.orderNo,
                    "payType": "bank",
                    "verifyCode": ""
                  }
                }

              } else {
                this.$toast("抱歉，无法使用该支付方式，快捷支付不能低于1元，")
                return
              }

            } else if (this.radio == '3') {
              pingAnPay = {
                "actPayFee": parseInt((this.remainPayAmount * 100).toFixed(0)) + "",
                "memberNo": user.payId,
                "orderNo": this.orderInfo.orderNo,
                "payType": "pingan"
              }
            } else if (this.radio == '4') {
              fcWxPay = {
                "actPayFee": parseInt((this.remainPayAmount * 100).toFixed(0)) + "",
                "body": "凤巢商品",
                "openId": user.openId,//微信openId
                "orderNo": this.orderInfo.orderNo,
                "payType": "fcwx"
              }
            } else {
              this.$toast("金额不够支付，请选择支付方式")
              return;
            }
          } else {
            this.$log("0元支付，无需其他支付方式补充")
          }
          if (balancePay != null)
            this.payOptions['balancePay'] = balancePay
          if (wocPays.length > 0)
            this.payOptions['wocPays'] = wocPays
          if (woaPay != null)
            this.payOptions['woaPay'] = woaPay
          if (pingAnPay != null)
            this.payOptions['pingAnPay'] = pingAnPay
          if (fcWxPay != null)
            this.payOptions['fcWxPay'] = fcWxPay
          if (bankPay != null) {
            this.payOptions['bankPay'] = bankPay
            this.quickPayDlgShow = true
          } else {
            this.$log("pay options:");
            this.payBtnSubmitLoading = true;
            this.$log(this.payOptions)
            if (pingAnPay != null) {
              this.$api.xapi({
                method: 'post',
                baseURL: this.$api.AGGREGATE_PAY_URL,
                url: '/wspay/pay',
                data: this.payOptions,
              }).then((response) => {
                this.$log(response)
                if (response.data.code == 200) {
                  let ret = JSON.parse(response.data.data);
                  this.$log("统一支付")
                  this.$log(ret)
                  if (ret != null) {//统一支付
                    sc.pay({
                      mchOrderNo: ret.mchOrderNo,
                      payId: ret.payId,
                      merchantNo: ret.merchantNo
                    }, function (res) {
                      if (res.code == 0) {
                        that.$log("统一支付成功")
                        that.$router.replace({
                          path: '/pay/cashering',
                          query: {
                            outer_trade_no: that.orderInfo.orderNo
                          }
                        })
                      } else {
                        that.$log("统一支付失败")
                        that.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
                        that.$router.replace({path: '/car/orderList'})
                      }
                    })
                  } else {
                    this.$router.replace({
                      path: '/pay/cashering',
                      query: {
                        outer_trade_no: that.orderInfo.orderNo
                      }
                    })
                  }
                  this.payBtnSubmitLoading = false;
                } else {
                  this.$toast(response.data.message)
                  this.payBtnSubmitLoading = false;
                }
              }).catch(function (error) {
                that.$toast("请求支付失败")
                this.payBtnSubmitLoading = false;
              })
            } else if (fcWxPay != null) {
              this.$log("fcWxPay Enter")
              configWechat(this,() =>{
                  that.$log("##############@@@@@@@@@@@@@@@@@@@@@@")
                this.$api.xapi({
                  method: 'post',
                  baseURL: this.$api.AGGREGATE_PAY_URL,
                  url: '/wspay/pay',
                  data: this.payOptions,
                }).then((response) => {
                  this.$log(response)
                  if (response.data.code == 200) {
                    let ret = JSON.parse(response.data.data);
                    this.$log("公众号支付")
                    this.$log(ret)
                    this.$log(ret.timeStamp)
                    this.$log(ret.nonceStr)
                    this.$log(ret.packageStr)
                    this.$log(ret.signType)
                    this.$log(ret.paySign)
                    if (ret != null) {//公众号支付
                      wx.chooseWXPay({
                        // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。
                        // 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        timestamp: ret.timeStamp,
                        // 支付签名随机串，不长于 32 位
                        nonceStr: ret.nonceStr,
                        package: ret.packageStr, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType: ret.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: ret.paySign, // 支付签名
                        success: function(res) {
                          // 支付成功后的回调函数
                          console.log("公众号支付成功")
                          that.$router.replace({
                            path: '/pay/cashering',
                            query: {
                              outer_trade_no: that.orderInfo.orderNo
                            }
                          })
                        },
                        fail: function(res) {
                          console.log('公众号支付失败')
                          that.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
                          that.$router.replace({path: '/car/orderList'})
                        },
                        complete: function(res) {
                          console.log(res, '公众号支付 complete')
                          if(res.errMsg == 'chooseWXPay:cancel') {
                            that.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
                            that.$router.replace({path: '/car/orderList'})
                          }
                        }
                      })
                    } else {
                      this.$router.replace({
                        path: '/pay/cashering',
                        query: {
                          outer_trade_no: that.orderInfo.orderNo
                        }
                      })
                    }
                    this.payBtnSubmitLoading = false;
                  } else {
                    this.$toast(response.data.message)
                    this.payBtnSubmitLoading = false;
                  }
                }).catch(function (error) {
                  that.$toast("请求支付失败")
                  this.payBtnSubmitLoading = false;
                })
              })
            } else {
              this.$api.xapi({
                method: 'post',
                baseURL: this.$api.AGGREGATE_PAY_URL,
                url: '/wspay/pay',
                data: this.payOptions,
              }).then((response) => {
                this.$log(response)
                if (response.data.code == 200) {
                  this.$router.replace({
                    path: '/pay/cashering',
                    query: {
                      outer_trade_no: this.orderInfo.orderNo
                    }
                  })
                  this.payBtnSubmitLoading = false;
                } else {
                  this.$toast(response.data.message)
                  this.payBtnSubmitLoading = false;
                }
              }).catch(function (error) {
                that.$toast("请求支付失败")
                this.payBtnSubmitLoading = false;
              })
            }

          }
        } else {
          //no userInfo
        }


      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  @import "../../../assets/index/style.css";

  .casher {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .payBody {
      .quickPayDialog {
        width: 100%;
        align-items: center;
      }

      .linkPayDialog {
        width: 100%;
        align-items: center;
      }

      .van-actionsheet {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        min-height: 400px;
      }

      .box {
        padding-top: 1em;
        position: relative;
        width: 100%;
        background-color: #ff4444;
      }

      .box:after {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -30px;
        content: ' ';
        height: 30px;
        width: 100%;
        border-radius: 0 0 30% 30%;
        background-color: #ff4444;
        overflow: hidden;
      }

      .payBox {
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: center;
        justify-items: center;
        align-items: center;

        .infoBox {
          padding: 10px 0px;
          width: 96%;
          min-height: 120px;
          background-color: white;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;

          .payAmount {
            line-height: 80px;
            .fz(font-size, 80);
            color: #FF4444;
            font-weight: bold;
            min-height: 80px;

            span {
              .fz(font-size, 50);
            }
          }

          .van-cell {
            margin-top: -1px;
          }

          .orderNo_title {
            margin: 10px;
            font-size: small;
            text-align: left;
            width: 30%;
          }

          .orderNo {
            margin-top: 13px;
            margin-right: 5px;
            width: 70%;
            text-align: right;
            .fz(font-size, 24);
          }
        }


        .wuxipayBox {
          width: 96%;

          .coinBalanceBox {
            margin-top: 10px;
            padding: 10px 0px;
            background-color: white;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .van-cell {
              margin-top: -1px;
            }
          }

          .composePayBox {
            margin-top: 10px;
            padding: 10px 0px;
            background-color: white;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .van-cell {
              margin-top: -1px;
            }
          }

          .optCardBox {
            margin-top: 10px;
            padding: 10px 0px;
            background-color: white;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .van-cell {
              margin-top: -1px;
            }

            .optCard {
              border: 1px solid #3dd5c8;
              border-radius: 5px;
              height: 60px;
              margin: 2px 25px;
              display: flex;
              flex-direction: column;
              align-items: center;
              line-height: 30px;
              color: #3dd5c8;
              font-size: large;
            }

            .optCardCheckBox {
              height: 64px;
              align-items: center;
              display: flex;
            }

            .addNewOptCard {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: Center;
              color: #ff4444;
              padding-top: 10px;

              span {
                margin: 5px;
              }
            }
          }
        }

        .pathBox {
          margin-top: 10px;
          padding: 10px 0px;
          width: 96%;
          min-height: 100px;
          background-color: white;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .van-swipe-cell {
            .rightSlot {
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: 60px;
              height: 100%;
              background-color: #ff4444;
              color: #ffffff
            }
          }

          .van-cell {
            margin-top: -1px;
          }

          .bankCard {
            border: 1px solid #3dd5c8;
            border-radius: 5px;
            height: 90px;
            margin: 2px 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 30px;
            color: #3dd5c8;
            font-size: large;
          }

          .bankCardCheckBox {
            height: 90px;
            align-items: center;
            display: flex;
          }

          .queryBanckSupportList {
            width: 100%;
            text-align: center;
            color: #1989fa;
            padding-top: 10px;

            span {
              text-decoration: underline
            }

          }

          .addNewBankCard {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: Center;
            color: #ff4444;
            padding-top: 10px;

            span {
              margin: 5px;
            }
          }
        }

        .footer_layout {
          margin-top: 10px;
          padding: 10px 0px;
          width: 96%;
          min-height: 100px;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }

      .pay-order {
        background-color: white;
        margin-top: 10px;
      }

      .pay-amount {
        background-color: white;
        margin-top: 10px;
        display: flex;
        text-align: center;
        justify-content: center;
        height: 200px;
        line-height: 200px;
        color: #ff4444;
        font-size: xx-large;
        font-weight: bold;
      }

      .verifyCodeBox {
        display: flex;
        padding: 10px;

        .van-field {
          width: 60%;
        }

        .van-button {
          width: 40%;
          margin-left: 10px;
        }
      }

      .tip {
        .fz(font-size, 25px);
        color: #ff4444;
        padding: 10px;
      }

      .supportBankList {
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
  }
</style>
