<template lang="html">
  <footer class="footer">
    <div class="footer-result">
      <p>共{{count}}件 金额：</p>
      <p><span>{{allpay}} </span>元</p>
    </div>
    <router-link :to="{ name: '分类页'}" class="footer-goon" replace>
      继续购物
    </router-link>
    <a class="footer-pay" @click="goPay">
      去结算
    </a>
  </footer>
</template>

<script>

  export default {
    computed: {
      // 勾选的商品数量
      count() {
        // 如果已选择列表为空 就返回0
        let selCount = 0;
        let userInfo = this.$store.state.appconf.userInfo;
        try {
          if (!this.isUserEmpty(userInfo)) {
            let user = JSON.parse(userInfo);
            let cartList = this.$store.state.appconf.cartList;
            cartList.forEach(item => {
               if(item.baseInfo.userId == user.userId) {
                 if(item.baseInfo.choosed)
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

              if(item.baseInfo.userId == user.userId) {
                  if(item.baseInfo.choosed) {
                    if(item.promotionInfo.promotionState === 1) {
                      try {
                        all += (item.goodsInfo.checkedPrice - item.promotionInfo.promotion[0].discount) * item.baseInfo.count
                      } catch (e) {
                        all += item.goodsInfo.checkedPrice * item.baseInfo.count
                      }
                    } else {
                      all += item.goodsInfo.checkedPrice * item.baseInfo.count
                    }
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

    .footer-result,
    a {
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      text-align: center;
    }

    .footer-result {
      p {
        .fz(font-size, 24);
        color: #999;
      }

      p:last-of-type {
        padding: 1vw 0 0 1vw;

        span {
          color: @cl;
          .fz(font-size, 42);
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
