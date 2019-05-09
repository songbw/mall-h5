<template lang="html">
  <!-- 在首页父组件发送http请求,后将数据通过props传递给子组件,可减少请求次数,减少服务器压力 -->
  <div class="wrap">
    <v-header>
      <h1 slot="title">商城</h1>
      <router-link :to="{name:'搜索页'}" slot="right">
        <van-icon name="search" size="1.2em"/>
      </router-link>
    </v-header>
    <div v-if="pageloading">
      <v-loading></v-loading>
    </div>
    <div :style="{'background-color': mBackgroundColor}" v-else class="home-body">
      <div>
        <li v-for="item in datas" style="list-style: none">
          <div v-if="item.type==='0'" style="padding-left: 5px;padding-right: 5px">
            <v-swiper :datas="item.data"/>
          </div>
          <div v-else-if="item.type==='1'" style="padding-left: 5px;padding-right: 5px">
            <v-service :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          </div>
          <div v-else-if="item.type==='2'" style="padding-left: 5px;padding-right: 5px">
            <v-sectionSquared :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          </div>
          <div v-else-if="item.type==='3'" style="padding-left: 5px;padding-right: 5px">
            <v-sectionSlide :datas="item.data"/>
          </div>
          <div v-else-if="item.type==='7'" style="padding-left: 5px;padding-right: 5px">
            <v-imgmap :datas="item.data"/>
          </div>
          <div v-else="item.type==='4'">
            <v-sectionGoods :datas="item.data"/>
          </div>
        </li>
      </div>
    </div>
    <v-baseline></v-baseline>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Swiper from '@/components/index/swiper.vue'
  import sectionService from '@/components/index/sectionService.vue'
  import sectionSquared from '@/components/index/sectionSquared.vue'
  import sectionSlide from '@/components/index/sectionSlide.vue'
  import sectionGoods from '@/components/index/sectionGoods.vue'
  import Baseline from '@/common/_baseline.vue'
  import Loading from '@/common/_loading.vue'
  import Footer from '@/common/_footer.vue'

  export default {
    components: {
      'v-header': Header,
      'v-swiper': Swiper,
      'v-service': sectionService,
      'v-sectionSquared': sectionSquared,
      'v-sectionSlide': sectionSlide,
      'v-sectionGoods': sectionGoods,
      'v-baseline': Baseline,
      'v-loading': Loading,
      'v-footer': Footer
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 0);
      })
    },


    beforeRouteLeave(to, from, next) {
      // 必须调用next(),next(true)进入原计划的下个页面
      // next(false)进入from页面(即原本的页面)
      let isValidPath = this.isValidLeavedPath(to);
      console.log("isValidPath:" + isValidPath + ",path:" + to.path)
      if (isValidPath) {
        next()
      } else {
        next(false)
        this.closeWindow()
      }
    },

    data() {
      return {
        datas: {},
        loading: true,
        mBackgroundColor: '#FFFFFF',
        icon_orderList: require('@/assets/images/icon_order.png'),
        icon_shopCart: require('@/assets/images/icon_shopping_cart.png'),
        pageloading: true
      }
    },

    beforeCreate() {
      let that = this;
      this.pageloading = true;
      this.$api.xapi({
        method: 'get',
        url: '/aggregation/findHomePage'
      }).then((response) => {
        // const pako = require('pako');
        //const jsonString = pako.inflate(response.data.data.result.content, {to: 'string'})
        let jsonString = response.data.data.result.content
        this.datas = JSON.parse(jsonString);
        this.$log(this.datas);
        this.mBackgroundColor = response.data.data.result.backgroundColor
        this.pageloading = false;
      }).catch(function (error) {
        //alert(error)
        that.$log(error)
        that.pageloading = false;
      })
    },

    created() {
      this.initJsNativeCb();
      setTimeout(() => {
        //this.test();

        this.getAccessTokenInfo();
        this.startLocation();
        this.setStatusBarColor(0xFFFFFFFF)//通知App titile 背景
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
      isValidLeavedPath(to) {
        let path = to.path;
        // if("/category/all | /car | ^/index/ | /detail".match(path))
        if (path.match('(^/index/)|(/category/all)|(/car)|(/detail)|(/search)|(^/category/goods/promotion/)'))
          return true;
        return false;
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
        //  let openId = "DFDBF1C25AB@EF6E2A7@AEM1L5D6GBD2"
        let openId = "44391000fd194ab888b1aa81c03c3710"
        //let openId = "46e794551c9144be82cc86c25703b936" //贺总
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
      closeWindow() {
        this.$jsbridge.call("closeWindow");
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
  .wrap {
    width: 100%;
    height: 100%;

    .home-body {
      width: 100%;
      background-color: #ffffff;
    }
  }


</style>
