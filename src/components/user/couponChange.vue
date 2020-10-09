<template lang="html">
  <section class="changeCoupon">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">兑换优惠券</h1>
    </v-header>
    <div>
      <van-tabs v-model="active" sticky @click="onClick" :swipe-threshold="swipeThreshold" swipeabl>
        <van-tab v-for="(item, type) in couponTypes" :title="item.title" :key="type">
          <div v-if="active == 0" class="cardBody">
            <div class="cardTitle">
              <img :src=mall_logo alt="">
            </div>
            <div class="cardForm">
              <van-field v-model="cardNumber" type="number" clearable maxlength="30" placeholder="请输入券码" />
              <van-field v-model="cardPwd" type="number" clearable maxlength="30" placeholder="请输入密码" />
            </div>
            <div class="cardConfirmBox">
              <van-button size="large" type="primary" @click="oncardBtnClick">兑 换
              </van-button>
            </div>
          </div>
          <div v-else>
            <div class="changeCouponBody">
              <div class="changCouponTip">
                <span>兑换码使用:
                  在当前页输入兑换码即可兑换为相应的优惠券。一个兑换码只能兑换一张优惠券，不可重复使用</span>
              </div>
              <div class="changeCouponBox">
                <van-field class="changeCouponInputBox" v-model="couponCode" placeholder="请输入兑换码" clearable />
                <van-button class="ChangeCouponBtn" size="large" type="danger" @click="onChangeCouponBtnClick">立即兑换
                </van-button>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </section>
</template>

<script>
  import Header from "@/common/_header.vue";
  import Util from "@/util/common";
  export default {
    components: {
      "v-header": Header
    },

    data() {
      return {
        couponCode: "",
        showHeader: true,
        active: 0,
        cardNumber: "",
        cardPwd: "",
        mall_logo: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_logo.png',
        couponTypes: [{
            title: "提货券"
          },
          {
            title: "优惠券"
          }
        ]
      };
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
    },

    methods: {
      bindCard(userId) {
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/card/binds',
          data: {
            openId: userId,
            card: this.cardNumber,
            password: this.cardPwd
          }
        })
      },

      async oncardBtnClick() {
        this.$log("oncardBtnClick Enter");
        let that = this
        if (this.cardNumber.length === 0) {
          this.$toast("请输入券码")
          return
        }
        if (this.cardPwd.length === 0) {
          this.$toast("请输入密码")
          return
        }
        let userInfo = this.$store.state.appconf.userInfo;

        if (!Util.isUserEmpty(userInfo)) {
          try {
            let user = JSON.parse(userInfo);
            let response = await this.bindCard(user.userId)
            this.$log(response)
            if (response.data.code == 200) {
              //进入提货券页
              this.$router.push({
                path: "/user/billoflading",
                query: {
                  id: this.cardNumber
                }
              });
            }
          } catch (e) {

            if (e.response.data.message == "该卡已被绑定") {
              that.$toast(e.response.data.message)
              this.$router.push({
                path: "/user/billofladingList",
              });
            } else {
              if (e.response.data.status == 404) {
                this.$log("没有找到券信息")
              } else {
                that.$toast(e.response.data.message)
              }
            }
          }
        } else {
          this.$toast("没有用户信息，请先登录")
        }

      },
      onChangeCouponBtnClick() {
        this.$log("onChangeCouponBtnClick Enter");
        this.$log(this.couponCode);
        let that = this;
        if (that.couponCode.length > 0) {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
            let user = JSON.parse(userInfo);
            let options = {
              userOpenId: user.userId,
              userCouponCode: this.couponCode
            };
            that.$api
              .xapi({
                method: "post",
                baseURL: this.$api.EQUITY_BASE_URL,
                url: "/coupon/redemption",
                data: options
              })
              .then(response => {
                // let result = response.data.data.result;
                that.$log(response.data);
                let rt = response.data;
                if (rt.msg == "Success") {
                  that.$toast("兑换成功");
                } else {
                  that.$toast(rt.msg);
                }
              })
              .catch(function (error) {
                that.$log(error);
              });
          }
        } else {
          this.$toast("请输入正确的兑换码");
        }
      }
    }
  };

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .cardBody {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;
    flex-direction: column;
    width: 100%;
    padding-top: 20px;

    .cardTitle {
      width: 100%;
      padding: 10px 0px;
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: center;

      .TitleText {
        font-weight: bold;
        margin-left: 12px;
        margin-bottom: 10px;
        .fz(font-size, 45);
        color: #333333;
      }

      img {
        margin: 0 auto;
        height: 82px;
        width: 100px;
      }
    }

    .cardForm {
      display: flex;
      flex-direction: column;
      margin: 10px;

      .van-field {
        margin-top: 10px;
        font-weight: 500;
      }
    }

    .cardConfirmBox {
      width: 95%;
      margin: 10px;
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
  }

  .changeCoupon {
    min-height: 100vh;

    .changeCouponBody {
      .changCouponTip {
        margin: 10px;
      }

      .changeCouponBox {
        margin: 10px;

        .changeCouponInputBox {
          margin-top: 10px;
          border: 1px solid #ff4444;
        }

        .ChangeCouponBtn {
          margin-top: 10px;
        }
      }
    }
  }

  .van-button {
    background: linear-gradient(to right, #EF3949, #EF3949);
    border: none;
    font-weight: 600;
    margin-top: 10px;

    &--large {
      width: 100%;
      height: 50px;
      line-height: 40px;
    }
  }

</style>
