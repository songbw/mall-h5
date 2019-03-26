<template lang="html">
  <!-- 在首页父组件发送http请求,后将数据通过props传递给子组件,可减少请求次数,减少服务器压力 -->
  <section>
    <div class="index" :style="{'background-color': mBackgroundColor}">
<!--      <v-header/>-->
      <v-header class="header">
        <h1 slot="title">商城</h1>
        <router-link :to="{name:'搜索页'}" slot="right">
          <van-icon name="search" size="1.2em"/>
        </router-link>
      </v-header>
      <div style="padding-left: 5px;padding-right: 5px">
        <li v-for="item in datas" style="list-style: none">
          <v-swiper v-if="item.type==='0'" :datas="item.data"/>
          <v-service v-else-if="item.type==='1'" :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          <v-sectionSquared v-else-if="item.type==='2'" :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          <v-sectionSlide v-else-if="item.type==='3'" :datas="item.data"/>
          <v-sectionGoods v-else="item.type==='4'" :datas="item.data"/>
        </li>
      </div>
      <!--        <v-baseline/>-->
    </div>
    <div class="float-button-group">
      <div class="float-button"  @click="gotoShoppingCart">
        <img style="height: 1.5em;width: 1.5em" :src="icon_shopCart">
      </div>
      <div class="float-button" @click="gotoOrderList">
        <img style="height: 1.5em;width: 1.5em" :src="icon_orderList" >
      </div>
    </div>
  </section>

</template>

<script>
//  import Header from '@/components/index/header.vue'
  import Header from '@/common/_header.vue'
  import Swiper from '@/components/index/swiper.vue'
  import sectionService from '@/components/index/sectionService.vue'
  import sectionSquared from '@/components/index/sectionSquared.vue'
  import sectionSlide from '@/components/index/sectionSlide.vue'
  import sectionGoods from '@/components/index/sectionGoods.vue'
  import Baseline from '@/common/_baseline.vue'

  export default {
    components: {
      'v-header': Header,
      'v-swiper': Swiper,
      'v-service': sectionService,
      'v-sectionSquared': sectionSquared,
      'v-sectionSlide': sectionSlide,
      'v-sectionGoods': sectionGoods,
      'v-baseline': Baseline
    },
    data() {
      return {
        datas: {},
        loading: true,
        mBackgroundColor: '#FFFFFF',
        icon_orderList: require('@/assets/images/icon_order.png'),
        icon_shopCart: require('@/assets/images/icon_shopping_cart.png'),
      }
    },

    beforeCreate() {
      let that = this;
      this.$api.xapi({
        method: 'get',
        url: '/aggregation/findHomePage'
      }).then((response) => {
        const pako = require('pako');
        const jsonString = pako.inflate(response.data.data.result.content, {to: 'string'})
        this.datas = JSON.parse(jsonString);
        this.$log(this.datas);
        this.mBackgroundColor = response.data.data.result.backgroundColor
      }).catch(function (error) {
        //alert(error)
        that.$log(error)
      })
    },

    created() {
      this.initJsNativeCb();
      setTimeout(() => {
        this.test();
        this.setStatusBarColor(0xFFFFFFFF)//通知App titile 背景
        this.getAccessTokenInfo();
        this.startLocation();
        //this.getUserInfo();
        //this.updateLocation();
      }, 1000);
    },
    computed: {
      mlocation() {
        return this.$store.state.appconf.location;
      }
    },
    methods: {
      gotoShoppingCart() {
        this.$log("gotoShoppingCart Enter")
        this.$router.push({name: '购物车页'})
      },
      gotoOrderList() {
        this.$log("gotoOrderList Enter")
        this.$router.push({name: '订单列表页'})
      },
      initJsNativeCb() {
        this.$jsbridge.register('locationResult', (data) => {
          this.$log("locationResult:" + data);
          var responseData = JSON.parse(data);
          if (data != null && data.length > 0) {
            this.$store.commit('SET_LOCATION', data);
            this.getLocationCode(data)
          }
          return "ok";
        });

        this.$jsbridge.register('payResult', (data) => {
          /*
          [2019-03-16 21:55:36 :: LOG]
          payResult:{"code":1,"msg":"支付成功","orderNo":"5f786921c0944d389ab6514eb7406c491552744393140","orderAmount":1}
          */
          this.$log("payResult:" + data);
          var responseData = JSON.parse(data);
          this.onPayResult(responseData);
          return "ok";
        });

      },
      test() {
        //let openId = "DFDBF1C25AB@EF6E2A7@AEM1L5D6GBD2"
        let openId = "44391000fd194ab888b1aa81c03c3710"
        this.$log("openId:" + openId);
        if (openId != undefined) {
          let userInfo = {
            openId: openId,
            userToken: "xxxxxxxxxxxxx",
            accessToken: "TTTTTTTTTTTT",
            userId: this.$api.APP_ID + openId
          }
          this.$log(userInfo)
          this.$store.commit('SET_USER', JSON.stringify(userInfo));
        }
      },

      onPayResult(payResult) {
        this.$store.dispatch('getPrePayOrderList');
        let list = this.$store.state.appconf.prePayOrderList
        this.$log("##### before this.$store.state.appconf.prePayOrderList")
        this.$log(this.$store.state.appconf.prePayOrderList)
        let found = -1;
        for (let i = 0; i < list.length; i++) {
          // this.$log("list["+i+"]:" + JSON.stringify(list[i]) )
          // this.$log("payResult:" + JSON.stringify(payResult))
          if (list[i].orderNo === payResult.orderNo) {
            found = i;
            break;
          }
        }
        //this.$log("found:" + found)
        if (found != -1) {
          list.splice(found, 1);
          this.$store.dispatch('setPrePayOrderList', list);
          //this.$log("##### after this.$store.state.appconf.prePayOrderList")
          //this.$log(this.$store.state.appconf.prePayOrderList)
        }
        this.$router.replace({path: '/car/oderList'})
      },
      getUserInfo(accessToken) {
        let that = this;
        let paramets = {
          appId: "fengcao",
          accessToken: accessToken
        }
        that.$jsbridge.call("fetchUserInfoWithAccessToken", paramets, function (jsonString) {
          that.$log("fetchUserInfoWithAccessToken  is:" + jsonString);
          try {
            let jsonObj = JSON.parse(jsonString);
            let openId = jsonObj.openId;
            let userToken = jsonObj.userToken;
            if (openId != undefined) {
              let userInfo = {
                openId: openId,
                accessToken: accessToken,
                userToken: userToken,
                userId: that.$api.APP_ID + openId
              }
              that.$log("userInfo  is:" + JSON.stringify(userInfo));
              that.$store.commit('SET_USER', JSON.stringify(userInfo));
            }
            that.$api.xapi({
              method: 'get',
              url: '/zhcs/user',
              params: {
                userToken: userToken,
                openId: openId,
              }
            }).then((response) => {
              let rt = response.data.data.result
              that.$log("user information:" + JSON.stringify(rt));
            }).catch(function (error) {
              that.$log(error)
            })
          } catch (e) {
            that.$log(e)
          }
        })
      },

      setStatusBarColor(color) {
        this.$jsbridge.call("initStatusBarColor", color);
      },

      getAccessTokenInfo() {
        let that = this;
        that.$jsbridge.call("fetchInitCode", "fengcao", function (initCode) {
          that.$log("initCode is:" + initCode);
          that.$api.xapi({
            method: 'get',
            url: '/zhcs/token',
            params: {
              initCode: initCode,
            }
          }).then((response) => {
            let rt = response.data.data.result
            that.$log("rt:" + JSON.stringify(rt));
            if (rt != undefined) {
              let accessToken = rt.accessToken;
              that.$log("accessToken:" + accessToken);
              that.getUserInfo(accessToken);
            } else {
              that.$log(response.data.msg);
            }
          }).catch(function (error) {
            that.$log(error)
          })
        })
      },

      startLocation() {
        this.$jsbridge.call("startLoaction");
      },

      /*      updateLocation() {
              let locationInfo = this.$jsbridge.call("getLocation");
              this.$log("updateLocation getLocation ret is:" + locationInfo);
              if (locationInfo != null && locationInfo.length > 0) {
                this.$store.commit('SET_LOCATION', locationInfo);
                this.getLocationCode(locationInfo)
              }
            },*/

      getLocationCode(locationInfo) {
        let that = this;
        let location = JSON.parse(locationInfo);
        let options = {
          "latitude": location.latitude,
          "longitude": location.longitude,
          "locTime": location.locTime,
          "country": location.country,
          "province": location.province,
          "city": location.city,
          "county": location.district
        }
        //this.$log("options:"+JSON.stringify(options))
        this.$api.xapi({
          method: 'post',
          url: '/address/code',
          data: options,
        }).then((response) => {
          let code = response.data.data.code;
          this.$log("location code:" + JSON.stringify(code));
          this.$store.commit('SET_LOCATION_CODE', code);
        }).catch(function (error) {
          that.$log(error)
          that.finished = true;
        })
      }
    }
  }
</script>


<style lang="less" scoped>
  .index {
    width: 100%;
    padding-bottom: 14vw;
    background-color: #ffffff;
  }

  .float-button-group {
    position: fixed;
    bottom: 20px;
    right: 10px;

    .float-button {
      opacity: 0.8;
      background: #27282C;
      margin: 2px;
      height: 3em;
      width: 3em;
      text-align: center;
      line-height: 3em;
      border-radius: 50%;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;

    }
  }
</style>
