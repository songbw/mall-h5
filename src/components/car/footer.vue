<template lang="html">
  <footer class="footer">
    <van-checkbox
      v-model="checked"
      checked-color="#FF4444"
      @click="checkboxClicked()"
    >
      全选
    </van-checkbox>
    <div class="footer-result">
      <p>合计: <span> ￥{{allpay.toFixed(2)}}</span></p>
    </div>
    <van-button round type="danger" style="margin-right:10px;width: 30%" @click="goPay">去结算 ( {{count}} )</van-button>
  </footer>
</template>

<script>

  export default {
    data() {
      return {
        selected: false,
      }
    },
    computed: {
      // 勾选的商品数量
      checked() {
        let checked = true;
        let cartList = this.$store.state.appconf.cartList;
        if (cartList.length === 0)
          checked = false;
        else {
          for (let i = 0; i < cartList.length; i++) {
            if (!cartList[i].baseInfo.choosed) {
              checked = false;
              break;
            }
          }
        }
        return checked;
      },
      count() {
        // 如果已选择列表为空 就返回0
        let selCount = 0;
        let userInfo = this.$store.state.appconf.userInfo;
        try {
          if (!this.isUserEmpty(userInfo)) {
            let user = JSON.parse(userInfo);
            let cartList = this.$store.state.appconf.cartList;
            cartList.forEach(item => {
              if (item.baseInfo.userId == user.userId) {
                if (item.baseInfo.choosed)
                  selCount += item.baseInfo.count;
              }
            });
          }
        } catch (e) {
        }
        return selCount;
      },

      //勾选的商品的价格总和
      allpay() {
        let all = 0;
        let userInfo = this.$store.state.appconf.userInfo;
        console.log("allpay Enter")
        try {
          if (!this.isUserEmpty(userInfo)) {
            let user = JSON.parse(userInfo)
            let cartList = this.$store.state.appconf.cartList;
            cartList.forEach(item => {

              if (item.baseInfo.userId == user.userId) {
                if (item.baseInfo.choosed) {
                  all += item.goodsInfo.dprice * item.baseInfo.count
                }
              }
            });
          }
        } catch (e) {
        }
        // 没有勾选 即为0
        return all
      }
    },

    methods: {
      checkboxClicked() {
        this.$log("checkboxClicked Enter:" + this.checked)
        let cartList = this.$store.state.appconf.cartList;
        if(this.checked) {
          cartList.forEach(item => {
            item.baseInfo.choosed = false
          })
        } else {
          cartList.forEach(item => {
            item.baseInfo.choosed = true
          })
        }
      },
      isUserEmpty(userInfo) {
        return (userInfo == null || userInfo == undefined || userInfo.length == 0)
      },
      goPay() {
        // 如果有选择商品才能跳转
        if (this.allpay) {
          let userInfo = this.$store.state.appconf.userInfo;
          try {
            if (!this.isUserEmpty(userInfo)) {
              this.$router.push({name: '支付页'})
            } else {
              //no mobile App
              this.$dialog.alert({
                title: '您还没登录，请用App登录',
              }).then(() => {
                //on confirm
              }).catch(() => {
                // on cancel
              });
            }
          } catch (e) {
          }


        } else {
          this.$dialog.alert({
            title: '您还没有选择商品'
          }).then(() => {
          });
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";

  .footer {
    width: 100%;
    height: 16vw;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #ffffff;

    .van-checkbox {
      margin-left: 20px;
      margin-top: 1px;
    }

    .footer-result,
    a {
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      text-align: left;
      margin-left: 20px;
    }

    .footer-result {
      p {
        .fz(font-size, 31);
        color: #000000;
      }

      p:last-of-type {
        span {
          color: #FF4444;
          .fz(font-size, 30);
        }
      }
    }

    .footer-goon {
      background-color: #f4f4f4;
      line-height: 16vw;
    }

    .footer-pay {
      background-color: @cl;
      line-height: 16vw;
      color: #fff;
    }
  }
</style>
