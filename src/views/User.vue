<template lang="html">
  <div class="car">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">我的</h1>
    </v-header>

    <div class="userBody">
      <div class='box'>
        <header class="userHeader" @click="onUserInfoClick()">
          <div class="headerTitle">
            <div class="header-icon">
              <img :src="avatarDefaultImg">
            </div>
            <span v-if="user.nickname !=undefined && user.nickname.length > 0">{{user.nickname}}</span>
          </div>
          <div class="header-right">
            <van-icon name="arrow"/>
          </div>
        </header>
      </div>
      <div class="coupon-box" v-if="this.$api.IS_GAT_APP">
        <div class="coupon-info">
          <div class="my-coupon" @click="onMyCouponClick">
            <img :src="myCouponIcon"/>
            <span>我的优惠券</span>
          </div>
          <div class="coupon-change" @click="onChangeCouponClick">
            <img :src="chCouponIcon"/>
            <span>兑换优惠券</span>
          </div>
        </div>
      </div>
      <div class="wealth-box" v-else-if="this.$api.APP_ID == '11'">
        <div class="coupon-info">
          <div class="my-coupon" @click="onMyCoinAccountClick">
            <img :src="myCoinAccountIcon"/>
            <span>我的余额</span>
          </div>
          <div class="my-coupon" @click="onMyCouponClick">
            <img :src="myCouponIcon"/>
            <span>我的优惠券</span>
          </div>
          <div class="coupon-change" @click="onChangeCouponClick">
            <img :src="chCouponIcon"/>
            <span>兑换优惠券</span>
          </div>
        </div>
      </div>

      <div class="orderListBox">
        <div>
          <van-cell value="查看全部 " is-link @click=onOrderListBarClick(0)>
            <template slot="title">
              <span class="orderListTitle">我的订单</span>
            </template>
          </van-cell>
        </div>
        <div class="orderCategory">
          <van-row type="flex" justify="space-between">
            <van-col
              v-for="(item,index) in orderbars"
              :key="index"
            >
              <div class="orderCategoryBar" @click=onOrderListBarClick(item.key)>
                <img :src=" item.img">
                <span>{{item.title}}</span>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <div class="settingsBox">
        <van-cell title="惠民优选卡" is-link @click="onOptCardBtnClick">
          <img slot="icon" :src="icon_optCard"/>
        </van-cell>
        <van-cell title="市名卡联机账户余额" is-link @click="onQueryLinkPayBtnClick">
          <img slot="icon" :src="icon_linkPayCard"/>
        </van-cell>
        <van-cell title="我的快捷支付卡" is-link @click="onQuickPayCardBtnClick">
          <img slot="icon" :src="icon_quickPayCard"/>
        </van-cell>
        <van-cell title="上海银行钱包" is-link @click="onShangHaiBankBtnClick">
          <img slot="icon" :src="icon_bankCard"/>
        </van-cell>
        <van-cell title="收货地址" is-link :to="{ name: '地址列表页'}">
          <img slot="icon" :src="receriverAddressIcon"/>
        </van-cell>
        <van-cell title="我的客服" :value="this.$api.SERVR_PHONE_NUM">
          <img slot="icon" :src="customServiceIcon"/>
        </van-cell>
        <van-cell title="关于凤巢" value="版本号 V1.0">
          <img slot="icon" :src="aboutIcon"/>
        </van-cell>
      </div>

      <van-actionsheet v-model="showLinkPayDialog"  title="联机账户支付">
        <div  class="linkPayDialog">
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
          <div class="linkPayAccountBox">
            <span style="font-weight: bold;font-size: x-large;color: black">我的余额</span>
            <span v-if="linkPayAmount == null " style="margin-top: 10px;color: #ff4444;font-size: medium">请输入账号，查询余额</span>
            <span v-else class="linkPay_Amount">￥{{linkPayAmount}}</span>
          </div>


          <div style=" width: 100%;position: fixed;bottom: 10px;">
            <van-button type="danger" size="large" round @click="queryLinkPay">查看余额</van-button>
          </div>
        </div>
      </van-actionsheet>
    </div>

    <v-footer></v-footer>
  </div>
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
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 3);
      })
    },
    computed: {
      userToken() {
        return  this.$store.state.appconf.token;
      },
    },
    watch:{
      userToken(newValue, oldVal) {
        if (newValue && newValue.length > 0) {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
            let that = this
            let user = JSON.parse(userInfo);
            this.$api.xapi({
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
                this.user = user;
                this.updateUserDatail(this.user);
              }
            }).catch(function (error) {
              that.$log(error)
            })
          }
        }
      },
    },

    created() {
      let userInfo = this.$store.state.appconf.userInfo;
      let that = this
      this.showHeader = this.$api.HAS_HEADER;
      if (!Util.isUserEmpty(userInfo)) {
        let user = JSON.parse(userInfo);
        this.$api.xapi({
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
            this.user = user;
            this.updateUserDatail(this.user);
            this.$log(this.user)
            this.$log(this.user.nickname);
          }
        }).catch(function (error) {
          //alert(error)
          that.$log(error)
          that.pageloading = false;
        })
      } else {
        //goto register UI
      }

    },
    data() {
      return {
        showHeader: true,
        orderbars: [
          {
            title: "待支付",
            key: 1,
            img: require('@/assets/icons/ico_to_be_paid.png'),
          },
          {
            title: "待收货",
            key: 2,
            img: require('@/assets/icons/ico_goods_to_be_receive.png'),
          },
          {
            title: "已完成",
            key: 3,
            img: require('@/assets/icons/ico_complete_order.png'),
          },
          {
            title: "售后/退货",
            key: 4,
            img: require('@/assets/icons/ico_order_cancel.png')
          }
        ],
        couponCenterImg: require('@/assets/icons/ico_couponCenter.png'),
        avatarDefaultImg: require('@/assets/icons/ico_avatar.png'),
        myCouponIcon: require('@/assets/icons/ico_mycoupon.png'),
        myCoinAccountIcon: require('@/assets/icons/ico_coin_account.png'),
        chCouponIcon: require('@/assets/icons/ico_changecoupon.png'),

        receriverAddressIcon: require('@/assets/icons/ico_receiveraddress.png'),
        aboutIcon: require('@/assets/icons/ico_info.png'),
        customServiceIcon: require('@/assets/icons/ico_customService.png'),
        icon_linkPayCard:  require('@/assets/icons/ico_linkPayCard.png'),
        icon_optCard: require('@/assets/icons/ico_optCard.png'),
        icon_bankCard: require('@/assets/icons/ico_bankCard.png'),
        icon_quickPayCard: require('@/assets/icons/ico_quickpay_cards.png'),
        user: {},
        showLinkPayDialog: false,
        linkPayAccount:"",
        linkPayPwd:"",
        linkPayAmount: null,
        isLinkPwdVisable:false,
      }
    },
    methods: {
      updateUserDatail(userDetail) {
        this.$store.commit('SET_USER_DETAIL', JSON.stringify(userDetail));
      },
      onShangHaiBankBtnClick() {
        this.$log("on shanghai bank clicked")
        this.$router.push({
          name:'上海银行卡列表页',
          params: {
            user: this.user
          }})
      },

      onOptCardBtnClick() {
        this.$log("opt Card clicked")
        this.$router.push({
          name:'惠民优选卡列表页',
          params: {
            user: this.user
          }})
      },
      onQuickPayCardBtnClick() {
        this.$log("onQuickPayCardBtnClick Enter")
        this.$router.push({
          name:'快捷支付银行卡列表页',
          params: {
            user: this.user
          }})

      },
      onQueryLinkPayBtnClick() {
        this.$log("link pay account btn clicked")
      //  this.showLinkPayDialog = true;
        this.$router.push({name:'联机账户页'})
      },

      togLinkPayPwdVisable() {
        this.isLinkPwdVisable = !this.isLinkPwdVisable
      },

      queryLinkPay() {
        this.$log("queryLinkPay Enter")
        let options = {
          "cardNo":this.linkPayAccount,
          "password":this.linkPayPwd
        }
        this.$log(options)
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.LINKPAY_ACCOUNT_URL,
          url: '/wxpos/balance',
          data: options,
        }).then((response) => {
          this.$log(response)
          if(response.data.code == 200) {
            this.linkPayAmount = (response.data.data/100).toFixed(2)
          } else {
            this.linkPayAmount = null
            this.$toast(response.data.message)
          }
        }).catch(function (error) {
          this.linkPayAmount = null
        })
      },

      onChangeCouponClick() {
        this.$router.push("/user/couponChange")
/*        this.$router.push({
          name: "二维码页",
          params: {
            text: "Jon"
          }
        })*/
      },
      onMyCouponClick() {
        this.$router.push({path: '/user/couponList'})
      },

      onMyCoinAccountClick() {
        this.$log("onMyCoinAccountClick Enter")
        this.$router.push({name: "余额账户"})
      },

      onOrderListBarClick(type) {
        //订单类型
        this.$log("onOrderListBarClick:" + type);
        if (type < 4) {
          this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', type);
          this.$router.push({name: '订单列表页'})
        } else {
          this.$router.push({name: '售后工单页'})
        }

      },
      onCouponCenterClick() {
        this.$log("onCouponCenterClick Enter")
        this.$router.push("/user/couponCenter")
      },
      onUserInfoClick() {
        this.$log("onUserInfoClick Enter")
        this.$router.push({
          name: "我的信息",
          params: {
            user: this.user
          }
        })
      }

    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/fz.less";

  .car {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .box {
      position: relative;
      width: 100%;
      line-height: 12vw;
      background-color: #ff4444;

      .userHeader {
        width: 100%;
        line-height: 12vw;
        background-size: auto 100%;
        padding: 3.2vw 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        .headerTitle {
          display: flex;
          flex-direction: row;
          width: 90%;

          .header-icon {
            margin-left: 5vw;

            img {
              display: inline-block;
              border-radius: 50%;
              height: 50px;
              width: 50px;
            }
          }

          > span {
            margin-top: 1vw;
            margin-left: 3.2vw;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            word-break: break-all;
            .fz(font-size, 30);
            color: #ffffff;
            letter-spacing: .3vw;
          }
        }

        .header-right {
          width: 10%;
          display: flex;
          flex-direction: row;

          .van-icon {
            width: 100%;
            float: right;
            color: white;
          }
        }
      }

      .linkPayDialog{
        width: 100%;
        align-items: center;
      }
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

    .header {
      width: 100%;
      z-index: 5;
      top: 0;
    }

    .userBody {
      margin-bottom: 5em;

      .coupon-box {
        display: flex;
        width: 100%;
        justify-content: center;
        justify-items: center;
        height: 50px;

        .coupon-info {
          z-index: 1;
          width: 100%;
          margin: 10px;
          background-color: white;
          border-radius: 5px;
          height: 100%;
          display: flex;
          align-items: Center;
          color: black;

          .my-coupon {
            width: 50%;
            display: flex;
            justify-content: center;

            img {
              height: 22px;
              width: 22px;
            }

            span {
              margin: 4px;
              .fz(font-size, 22);
            }
          }

          .coupon-change {
            width: 50%;
            display: flex;
            justify-content: center;

            img {
              height: 22px;
              width: 22px;
            }

            span {
              margin: 4px;
              .fz(font-size, 22);
            }
          }
        }
      }

      .wealth-box {
        display: flex;
        width: 100%;
        justify-content: center;
        justify-items: center;
        height: 50px;

        .coupon-info {
          z-index: 1;
          width: 100%;
          margin: 10px;
          background-color: white;
          border-radius: 5px;
          height: 100%;
          display: flex;
          align-items: Center;
          color: black;

          .my-coupon {
            width: 50%;
            display: flex;
            justify-content: center;

            img {
              height: 22px;
              width: 22px;
            }

            span {
              margin: 4px;
              .fz(font-size, 22);
            }
          }

          .coupon-change {
            width: 50%;
            display: flex;
            justify-content: center;

            img {
              height: 22px;
              width: 22px;
            }

            span {
              margin: 4px;
              .fz(font-size, 22);
            }
          }

        }
      }

      .orderListBox {
        margin: 20px 10px 10px 10px;
        background-color: white;
        border: 4px solid white;
        border-radius: 10px;

        .orderListTitle {
          .fz(font-size, 30);
          color: black;
        }


        .orderCategory {
          align-items: center;
          text-align: center;
          margin: 10px;

          .van-col {
            .orderCategoryBar {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: Center;

              img {
                margin: 1px;
                height: 25px;
                width: 25px;
              }

              span {
                margin: 5px;
                .fz(font-size, 25);
              }
            }

          }
        }

      }

      .couponBox {
        margin: 10px;
        padding: 10px;
        background-color: white;
        border: 4px solid white;
        border-radius: 10px;

        .couponTitle {
          .fz(font-size, 30);
          font-weight: bold;
        }

        .couponCategory {
          align-items: center;
          text-align: center;
          margin-top: 10px;

          img {
            width: 100%;
            display: inline-block;
          }
        }

      }

      .settingsBox {
        margin: 10px;
        padding: 10px;
        border-radius: 10px;
        background-color: white;

        .van-cell {
          img {
            height: 16px;
            width: 16px;
            margin: 3px;
          }

        }
      }
    }

    .van-actionsheet {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      min-height: 400px;
    }

    .linkPayAccountBox{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      .linkPay_Amount{
        margin-top: 10px;
        color: #ff4444;
        font-weight: bold;
        .fz(font-size,80)
      }
    }
  }
</style>
