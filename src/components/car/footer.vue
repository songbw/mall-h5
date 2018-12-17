<template lang="html">
  <footer class="footer">

    <div class="footer-result">
      <p>共{{count}}件 金额：</p>
      <p><span>{{allpay}} </span>元</p>
    </div>
    <router-link :to="{ name: '分类页'}" class="footer-goon" >
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
    count () {
      // 如果已选择列表为空 就返回0
      let selCount = 0;
      if (this.$store.state.appconf.selStateInCarList == undefined) {
        return selCount
      } else {
        let userInfo =  this.$store.state.appconf.userInfo;
        console.log("user:"+userInfo)
        try {
          if(userInfo != undefined) {
            let user = JSON.parse(userInfo)
            let selStateInCarList = this.$store.state.appconf.selStateInCarList;
            selStateInCarList.forEach(item => {
              if(item.userId == user.userId && item.choose ) {
                selCount += item.count;
              }
            })
          }
        } catch (e) {
        }
        return selCount;
      }
    },

    //勾选的商品的价格总和
    allpay () {
      let all = 0;
      let userInfo =  this.$store.state.appconf.userInfo;
      console.log("user:"+userInfo)
      try {
        if(userInfo != undefined) {
          let user = JSON.parse(userInfo)
          let selStateInCarList = this.$store.state.appconf.selStateInCarList;
          selStateInCarList.forEach(item => {
            if(item.userId == user.userId && item.choose ) {
              all += item.price * item.count
            }
          })
        }
      } catch (e) {
      }

      // 没有勾选 即为0
      return all
    }
  },

  methods: {
/*    getLocationCode() {
       let code ={"provinceId":"10","cityId":"010","district":"08"}
       if(/!*送货地址*!/) {
         code = this.$store.state.appconf.userInfo;
       } else if(this.this.$store.state.appconf.locationCode != undefined) {
         code = this.$store.state.appconf.locationCode;
       }
       return  code
    },

    checkStorage() {

      let skus =  [{"skuId":"20000579"},{"skuId":"20001234"},{"skuId":"20000028"}]
      let options = {
        "provinceId":"10",
        "cityId":"010",
        "district":"08",
        "skus": skus
      }
      console.log("options:" + JSON.stringify(options));
      this.$api.xapi({
        method: 'post',
        url: '/prod/inventory',
        data: options,
      }).then((response) => {
        let result = response.data.data.result;
        console.log("result is:" + JSON.stringify(result));
      }).catch(function (error) {
        console.log(error)
      })
    },*/
    //点击跳转到支付页
    goPay () {
      // 如果有选择商品才能跳转
      if (this.allpay) {
        //查询库存
        //this.checkStorage()
        // 保存+缓存选择的商品 ,在支付页能用到
        this.$router.push({ name: '支付页' })

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
      .fz(font-size,24);
      color: #999;
    }

    p:last-of-type {
      padding: 1vw 0 0 1vw;
      span {
        color: @cl;
        .fz(font-size,42);
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
