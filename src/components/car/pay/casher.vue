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

        <div class="coinBalanceBox">
          <van-cell :title="mCoinBalance.title" :icon="mCoinBalance.icon" clickable @click="onCoinBalanceSelector()">
            <van-checkbox slot="right-icon" v-model="mCoinBalance.checked" checked-color="#FF4444"></van-checkbox>
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
            <van-checkbox-group v-model="mOptCards.result" @change="onOptCardsStatusChanged()">
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
              <span slot="default" style="font-size: medium;color: #ff4444">-￥{{(item.payAmount/100).toFixed(2)}}</span>
            </van-cell>
            <van-cell v-if="item.payType == 'coinBalance'">
              <span slot="title">余额支付:</span>
              <span slot="default" style="font-size: medium;color: #ff4444">-￥{{(item.payAmount/100).toFixed(2)}}</span>
            </van-cell>
          </div>
        </div>

        <div class="pathBox">
          <van-radio-group v-model="radio">
            <van-cell title="联机账户" :icon="icon_linkpay" clickable @click="radio = '1'">
              <van-radio slot="right-icon" name="1"/>
            </van-cell>
            <div class="linkPayDialog" v-if="radio == '1'">
              <van-field
                v-model="linkPayAccount"
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
            <van-cell title="快捷支付" :icon="icon_quicklypay">
              <van-radio slot="right-icon" disabled name="2"/>
            </van-cell>
          </van-radio-group>
        </div>

        <div class="footer_layout">
          <van-button type="danger" round size="large" @click="onPayBtnClick">
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
          icon: require('@/assets/icons/ico_linkPayCard.png'),
          list: [],
          result: [],
          show: false,
          payAmount: 0,
        },
        mComposePay: {
          title: "还需支付",
          icon: require('@/assets/icons/ico_menu.png'),
        },
        mPaylist: [],
        addNewOptCardDlgShow: false,
        newOptCardNumber: "",
        newOptCardPwd: ""
      }
    },
    computed: {
      amount() {
        return (this.orderInfo.orderAmount / 100).toFixed(2)
      },

      remainPayAmount() {
        return ((this.orderInfo.orderAmount - this.mCoinBalance.payAmount - this.mOptCards.payAmount) / 100).toFixed(2)
      }
    },

    created() {
      this.$log("cashser created Enter")
      this.showHeader = this.$api.HAS_HEADER;
      this.orderInfo = this.$route.params.orderInfo;
      this.$log(this.orderInfo);
      this.updateOptCardInfo();
      this.updateBalanceAmount();
    },

    methods: {
      updateUserDetail(userDetail) {
        this.$store.commit('SET_USER_DETAIL', JSON.stringify(userDetail));
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

      /*      updateOptCardList () {
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
            },*/

      saveUserInfo() {
        return this.$api.xapi({
          method: 'put',
          baseURL: this.$api.SSO_BASE_URL,
          //url: '/user/updateProfile',
          url: '/user',
          data: this.user
        })
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
              this.userDetail.telephone = this.mTelphoneNumber
              let ret = await this.saveUserInfo();
              this.updateUserDetail(this.user);
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
              payAmount = this.remainPayAmount * 100
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
        if (this.remainPayAmount == 0 && !this.mCoinBalance.checked) {

        } else {
          this.mCoinBalance.checked = !this.mCoinBalance.checked
          for (let i = this.mPaylist.length - 1; i >= 0; i--) {
            if (this.mPaylist[i].payType == 'coinBalance')
              this.mPaylist.splice(i, 1);
          }
          this.mCoinBalance.payAmount = 0;
          if (this.mCoinBalance.checked) {
            let remainPayAmount = this.remainPayAmount;
            if (this.mCoinBalance.amount >= remainPayAmount * 100) {
              this.mCoinBalance.payAmount = remainPayAmount * 100;
              this.$log(this.mCoinBalance.payAmount)
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
        if (this.linkPayPwd.length == 0) {
          this.$toast("请输入卡密码")
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
          let options={
             orderNo:  this.orderInfo.orderNo
          }
          this.mPaylist.forEach(item => {
            switch (item.payType) {
              case  'coinBalance':
                balancePay = {
                  actPayFee: item.payAmount,
                  openId: user.openId,
                  orderNo: this.orderInfo.orderNo,
                  payType: "balance"
                }
                break;
              case 'optCard':
                wocPays.push({
                  actPayFee: item.payAmount,
                  cardNo: item.cardnum,
                  mobile:  this.mTelphoneNumber,
                  orderNo: this.orderInfo.orderNo,
                  payType: 'card'
                })
              case 'pos':
                break;
              default:
                break;
            }
          })
          if(balancePay != null)
            options['balancePay'] = balancePay
          if(wocPays.length > 0)
            options['wocPays'] = wocPays
          if(woaPay != null)
            options['woaPay'] = woaPay
          this.$log("pay options:");
          this.$log(options)
          if (this.remainPayAmount > 0) {
            if (this.radio == '1') {
              this.$log("link pay clicked")
              this.gotoLinkPay()
            } else if (this.radio == '2') {
              this.$api.xapi({
                method: 'post',
                baseURL: this.$api.TESTSTUB_PAYMENT_BASE_URL,
                url: '/payment',
                data: this.orderInfo,
              }).then((response) => {
                this.$log(response)
                this.onPayResult()
              }).catch(function (error) {

              })
            } else {
              this.$toast("请选择支付方式")
            }
          } else {
            this.$log("0元支付，无需其他支付方式补充")
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
            })
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
            margin-top: 15px;
            margin-right: 5px;
            width: 70%;
            text-align: right;
            .fz(font-size, 12)
          }
        }

        .coinBalanceBox {
          margin-top: 10px;
          padding: 10px 0px;
          width: 96%;
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
          width: 96%;
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
          width: 96%;
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
            display: flex;
            align-items: center;
            padding-left: 40px;
            padding-top: 10px;
            color: #ff4444;
            font-size: x-large;

            span {
              margin: 5px;
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

          .van-cell {
            margin-top: -1px;
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
    }
  }
</style>
