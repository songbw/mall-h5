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
              <img :src="(user.headImg !=null && user.headImg.length > 0) ? user.headImg : avatarDefaultImg">
            </div>
            <span v-if="user.nickname !=undefined && user.nickname.length > 0">{{user.nickname}}</span>
            <span v-else-if="this.$api.IS_WX_GZH && pageloading == false">登录</span>
          </div>
          <div class="header-right">
            <van-icon name="arrow"/>
          </div>
        </header>
      </div>
      <div class="wealth-box">
        <div class="coupon-info">
          <div class="my-coupon" @click="onMyCoinAccountClick" v-if="this.$api.APP_ID == '11'">
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
        <div v-if="this.$api.APP_ID == '11'">
          <van-cell title="惠民优选卡" is-link @click="onOptCardBtnClick">
            <img slot="icon" :src="icon_optCard"/>
          </van-cell>
          <van-cell title="市民卡联机账户余额" is-link @click="onQueryLinkPayBtnClick">
            <img slot="icon" :src="icon_linkPayCard"/>
          </van-cell>
          <!--        <van-cell title="我的快捷支付卡" is-link @click="onQuickPayCardBtnClick">
                    <img slot="icon" :src="icon_quickPayCard"/>
                  </van-cell>-->
          <van-cell title="我的钱包" is-link @click="onShangHaiBankBtnClick">
            <img slot="icon" :src="icon_bankCard"/>
          </van-cell>
        </div>
        <van-cell title="收货地址" is-link :to="{ name: '地址列表页'}">
          <img slot="icon" :src="receriverAddressIcon"/>
        </van-cell>
        <van-cell title="在线客服" is-link @click="showMeqiaPanel">
          <img slot="icon" :src="customServiceIcon"/>
        </van-cell>
        <van-cell title="客服电话" :value="this.$api.SERVR_PHONE_NUM">
          <img slot="icon" :src="servicePhoneIcon"/>
        </van-cell>
        <van-cell title="关于我们" value="版本号 V3.0">
          <img slot="icon" :src="aboutIcon"/>
        </van-cell>
      </div>
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
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 20);
      })
    },
    computed: {
      userToken() {
        return this.$store.state.appconf.token;
      },
    },
    watch: {
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
      if(this.$store.state.appconf.userDetail.length > 0) {
        this.user  =  JSON.parse(this.$store.state.appconf.userDetail)
        this.pageloading = false;
      } else {
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
            that.pageloading = false;
          }).catch(function (error) {
            //alert(error)
            that.$log(error)
            that.pageloading = false;
          })
        } else {
          //goto register UI
          that.pageloading = false;
        }
      }


    },

    beforeDestroy (){
      this.hideMeqiaPanel()
    },

    data() {
      return {
        showHeader: true,
        pageloading: true,
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
          },
          {
            title: "历史订单",
            key: 5,
            img: require('@/assets/icons/ico_history_order.png')
          }
        ],

        avatarDefaultImg: require('@/assets/icons/ico_avatar.png'),
        myCouponIcon: require('@/assets/icons/ico_mycoupon.png'),
        myCoinAccountIcon: require('@/assets/icons/ico_coin_account.png'),
        chCouponIcon: require('@/assets/icons/ico_changecoupon.png'),

        receriverAddressIcon: require('@/assets/icons/ico_receiveraddress.png'),
        aboutIcon: require('@/assets/icons/ico_info.png'),
        customServiceIcon: require('@/assets/icons/ico_customService.png'),
        servicePhoneIcon: require('@/assets/icons/ico_phone.png'),
        icon_linkPayCard: require('@/assets/icons/ico_linkPayCard.png'),
        icon_optCard: require('@/assets/icons/ico_optCard.png'),
        icon_bankCard: require('@/assets/icons/ico_bankCard.png'),
        icon_quickPayCard: require('@/assets/icons/ico_quickpay_cards.png'),
        user: {},
        /*        showLinkPayDialog: false,
                linkPayAccount:"",
                linkPayPwd:"",
                linkPayAmount: null,
                isLinkPwdVisable:false,*/
      }
    },
    methods: {
      getClientName() {
        switch (this.$api.APP_ID) {
          case "09":
            return "关爱通品牌直供";
          case "10":
            return "关爱通苏宁易购";
          case "11":
            return "无锡市民卡";
          case "12":
            return "最珠海";
          case "01":
            return "凤巢公众号"
          default:
            return "凤巢商城"

        }
      },
      showMeqiaPanel () {
        let userInfo = this.$store.state.appconf.userInfo;
        let userDetail = this.$store.state.appconf.userDetail;
        let userName = ""
        let userId = ""
        let telePhone = ""
        if(!Util.isUserEmpty(userInfo)) {
          let UserInfo = JSON.parse(userInfo)
          userId = UserInfo.userId
        }
        if(userDetail.length > 0) {
          let UserDetail  = JSON.parse(userDetail)
          userName =  UserDetail.nickname
          telePhone = UserDetail.telephone
        }
        _MEIQIA('showPanel')
        _MEIQIA('metadata', {
          name: userName, // 美洽默认字段
          tel:telePhone,
          '渠道': this.getClientName(), // 自定义字段
          '用户ID': userId,
          '当前URL': window.location.href,
          '订单号': ''
        });
      },
      hideMeqiaPanel(){
        _MEIQIA('hidePanel');
      },
      updateUserDatail(userDetail) {
        this.$store.commit('SET_USER_DETAIL', JSON.stringify(userDetail));
      },
      onShangHaiBankBtnClick() {
        this.$log("on shanghai bank clicked")
        this.$router.push({
          name: '上海银行卡列表页',
          params: {
            user: this.user
          }
        })
      },

      onOptCardBtnClick() {
        this.$log("opt Card clicked")
        this.$router.push({
          name: '惠民优选卡列表页',
          params: {
            user: this.user
          }
        })
      },
      onQuickPayCardBtnClick() {
        this.$log("onQuickPayCardBtnClick Enter")
        this.$router.push({
          name: '快捷支付银行卡列表页',
          params: {
            user: this.user
          }
        })

      },
      onQueryLinkPayBtnClick() {
        this.$log("link pay account btn clicked")
        //  this.showLinkPayDialog = true;
        this.$router.push({name: '联机账户页'})
      },

      togLinkPayPwdVisable() {
        this.isLinkPwdVisable = !this.isLinkPwdVisable
      },

      /*      queryLinkPay() {
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
            },*/

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
          if (type == 4) {
            this.$router.push({name: '售后工单页'})
          } else {

            this.$router.push({
              name: '历史订单页',
              params: {
                user: this.user
              }
            })
          }
        }

      },
      onCouponCenterClick() {
        this.$log("onCouponCenterClick Enter")
        this.$router.push("/user/couponCenter")
      },
      onUserInfoClick() {
        this.$log("onUserInfoClick Enter")
        if(this.$api.IS_WX_GZH) {
          this.$log("wxOpenId:"+  this.$store.state.appconf.wxOpenId)
          let wxOpenId =  this.$store.state.appconf.wxOpenId
          if(wxOpenId != null && wxOpenId.length >0) {
            if(this.user.nickname == undefined || this.user.nickname.length  == 0) {
              this.$router.push({name: '登录页'})
            } else {
              this.$router.push({
                name: "我的信息",
                params: {
                  user: this.user
                }
              })
            }
          } else {
            this.$router.push({
              name: "我的信息",
              params: {
                user: this.user
              }
            })
          }
        } else {
          this.$router.push({
            name: "我的信息",
            params: {
              user: this.user
            }
          })
        }
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

      .linkPayDialog {
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
      margin-bottom: 3em;
      padding-bottom: 2em;
      background-color: #f8f8f8;

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
                .fz(font-size, 24);
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
        padding: 10px 0px;
        border-radius: 10px;
        background-color: white;

        .van-cell {
          padding: 10pt 10pt;
          img {
            height: 16px;
            width: 16px;
            margin: 3px 10px 3px 3px
          }

        }
      }
    }

    .van-actionsheet {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      min-height: 400px;
    }

    /*    .linkPayAccountBox{
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
        }*/
  }
</style>
