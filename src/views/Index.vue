<template lang="html">
  <!-- 在首页父组件发送http请求,后将数据通过props传递给子组件,可减少请求次数,减少服务器压力 -->
  <div class="wrap">
    <v-header :mBackgroundColor="this.mHeader.backgroundColor" v-if="showHeader">
      <h1 slot="title">凤巢商城</h1>
    </v-header>
    <div v-if="pageloading || userTokenLoading">
      <v-loading></v-loading>
    </div>
    <div :style="{'background-color': mBackgroundColor}" v-else class="home-body">
      <div class='box' :style="{'background-color': this.mHeader.backgroundColor}">
        <van-search placeholder="搜索您感兴趣的商品"
                    shape="round"
                    :background=this.mHeader.backgroundColor
                    readonly
                    @click="onSearchInputClick()"
                    v-if="this.mHeader.showSearchBar"/>
      </div>
      <div class="box_after" :style="{'background-color': this.mHeader.backgroundColor}"></div>
      <div class="index_main">
        <div v-for="item in datas">
          <div v-if="item.type==='0'" style="margin-left: 5px;margin-right: 5px; border-radius: 10px">
            <v-swiper :datas="item.data"/>
          </div>
          <div v-else-if="item.type==='1'" style="margin-left: 5px;margin-right: 5px;">
            <v-service :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          </div>
          <div v-else-if="item.type==='2'" style="margin-left: 5px;margin-right: 5px;">
            <v-sectionSquared :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          </div>
          <div v-else-if="item.type==='3'" style="margin-left: 5px;margin-right: 5px;">
            <v-sectionSlide :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          </div>
          <div v-else-if="item.type==='7'" style="margin-left: 5px;margin-right: 5px;">
            <v-imgmap :datas="item.data"/>
          </div>
          <div v-else-if="item.type==='4'">
            <v-sectionGoods :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          </div>
          <div v-else-if="item.type==='8'">
            <v-sectionCompBox :datas="item.data" :mBackgroundColor="mBackgroundColor"></v-sectionCompBox>
          </div>
        </div>
      </div>
      <v-baseline :style="{'background-color': mBackgroundColor}"></v-baseline>
    </div>
    <van-dialog
      v-model="showDialog"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
      style="background-color: transparent"
    >
      <div class="gitDialog" v-if="icon_git.length > 0">
        <img :src=icon_git @click="onGiftDialogImgClick">
        <van-icon name="close" @click="onGiftDialogCloseBtnClicks"/>
      </div>
    </van-dialog>
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
  import sectionImgMap from '@/components/index/sectionImgMap.vue'
  import sectionCompBox from '@/components/index/sectionCompBox.vue'
  import Baseline from '@/common/_baseline.vue'
  import Loading from '@/common/_loading.vue'
  import Footer from '@/common/_footer.vue'

  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
      'v-swiper': Swiper,
      'v-service': sectionService,
      'v-sectionSquared': sectionSquared,
      'v-sectionSlide': sectionSlide,
      'v-sectionGoods': sectionGoods,
      'v-imgmap': sectionImgMap,
      'v-sectionCompBox': sectionCompBox,
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
      }
    },

    data() {
      return {
        datas: {},
        loading: true,
        mBackgroundColor: '#FFFFFF',
        mHeader: {
          backgroundColor: '#FFFFFF',
          showSearchBar: false
        },
        pageloading: true,
        showHeader: true,
        showDialog: false,
        //icon_git: require('@/assets/icons/ico_gift.png'),
        icon_git: "",
        userTokenLoading: true,
      }
    },

    beforeCreate() {
      let that = this;
      this.pageloading = true;
      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.AGGREGATION_BASE_URL,
        url: '/aggregation/findHomePage'
      }).then((response) => {
        // const pako = require('pako');
        //const jsonString = pako.inflate(response.data.data.result.content, {to: 'string'})
        let jsonString = response.data.data.result.content
        this.datas = JSON.parse(jsonString);
        for (let i = 0; i < this.datas.length; i++) {
          if (this.datas[i].type === '4')
            this.datas[i].data.id = 0;
        }
        this.$log(this.datas);
        this.$log(response.data.data.result)
        this.mBackgroundColor = response.data.data.result.backgroundColor


        if (response.data.data.result.header != undefined) {
          let header = JSON.parse(response.data.data.result.header)
          this.mHeader = header
          if (this.mHeader.novicePackUrl != undefined && this.mHeader.novicePackUrl.length > 0) {
            this.icon_git = this.mHeader.novicePackUrl
          }
        }
        this.$log(this.mHeader);
        this.pageloading = false;
      }).catch(function (error) {
        //alert(error)
        that.$log(error)
        that.pageloading = false;
      })
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
      if (this.$api.IS_GAT_APP) {
        let auth_code = this.$route.query.auth_code;
        this.$log(`auto_code$(auth_code)`)
        if (auth_code != undefined) {
          //获取关爱通openId
          this.getThirdPartyAccessTokenInfo(auth_code)
        }
        //this.testGAT();
      } else {
        setTimeout(() => {
          if(this.userTokenLoading) {
            this.userTokenLoading = false;
            this.$toast("获取用户信息超时!")
          }

        }, 10000);
/*        window.onload = () => {
          this.getLoginAuthInfo();
        }*/
        setTimeout(() => {
          this.test();
          //this.getAccessTokenInfo();
          this.startLocation();
          this.setStatusBarColor(0xFFFFFFFF)//通知App titile 背景
          //this.getUserInfo();
          //this.updateLocation();
        }, 1000);
      }
    },
    computed: {
      userToken() {
        return  this.$store.state.appconf.token;
      },
      mlocation() {
        return this.$store.state.appconf.location;
      }
    },
    watch:{
      userToken(newValue, oldVal) {
        if (newValue && newValue.length > 0) {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
             this.userTokenLoading= false;
          }
        }
      },
    },
    methods: {
      isValidLeavedPath(to) {
        let path = to.path;
        // if("/category/all | /car | ^/index/ | /detail".match(path))
        if (path.match('(^/index/)|(/user)|(/category/all)|(/car)|(/detail)|(/search)|(^/category/goods/promotion/)'))
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
      testGAT() {
        //  let openId = "DFDBF1C25AB@EF6E2A7@AEM1L5D6GBD2"
        //let openId = "52d7fd1f46e55ac6a2435818a00c06c0"
        //let openId = "46e794551c9144be82cc86c25703b936" //贺总
        let openId = "4a742681f23b4d45b13a78bd99c0bf46"
        this.$log("openId:" + openId);
        if (openId != undefined) {
          let userId = this.$api.APP_ID + openId;
          //let auth_code = "12345678"
          //this.getThirdPartyAccessTokenInfo(auth_code)
          let accessToken = "TTTTTTTTTTTT"
          let userInfo = {
            openId: openId,
            accessToken: accessToken,
            userId: userId
          }
          this.$log(userInfo)
          this.$store.commit('SET_USER', JSON.stringify(userInfo));
          this.thirdPartLogined(openId, accessToken);
        }
      },
      test() {
        let dsBridge = require("dsbridge");
        Vue.prototype.$jsbridge = dsBridge;
        this.initJsNativeCb();
        //let openId = "DFDBF1C25AB@EF6E2A7@AEM1L5D6GBD2"
       // let openId = "44391000fd194ab888b1aa81c03c3710"
        let openId = "4a742681f23b4d45b13a78bd99c0bf46"
        if (this.$api.TEST_USER.length > 0)
          openId = this.$api.TEST_USER
        //let openId = "46e794551c9144be82cc86c25703b936" //贺总
        this.$log("openId:" + openId);
        if (openId != undefined) {
          let userId = this.$api.APP_ID + openId;
          //let auth_code = "12345678"
          //this.getThirdPartyAccessTokenInfo(auth_code)
          let accessToken = "TTTTTTTTTTTT"
          let userInfo = {
            openId: openId,
            accessToken: accessToken,
            userId: userId
          }
          this.$log(userInfo)
          this.$store.commit('SET_USER', JSON.stringify(userInfo));
          this.thirdPartLogined(openId, accessToken);
        }
      },
      closeWindow() {
        if (!this.$api.IS_GAT_APP) {
          this.$jsbridge.call("closeWindow");
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
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
        this.$router.replace({path: '/car/orderList'})
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
            let accessToken = jsonObj.userToken;
            if (openId != undefined) {
              let userId = that.$api.APP_ID + openId;
              let userInfo = {
                openId: openId,
                accessToken: accessToken,
                userId: userId
              }
              that.$log("userInfo  is:" + JSON.stringify(userInfo));
              that.$store.commit('SET_USER', JSON.stringify(userInfo));
              that.thirdPartLogined(openId, accessToken)
            }
          } catch (e) {
            that.$log(e)
          }
        })
      },

      thirdPartLogined(openId, accessToken) {
        let that = this;
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/thirdLogin',
          data: {
            iAppId: this.$api.APP_ID,
            accessToken: accessToken,
            openId: openId,
          }
        }).then((response) => {
          let rt = response.data.data.result
          this.$log("local information:" + JSON.stringify(rt));
          if (rt.token != null) {
            that.$store.commit('SET_TOKEN', rt.token);
          }
          //if (rt.newUser != undefined && rt.newUser) {
            //if (!this.$api.IS_GAT_APP)
            //  this.showDialog = true;
          //}
        }).catch(function (error) {
          that.$log(error)
        })
      },


      setStatusBarColor(color) {
        this.$jsbridge.call("initStatusBarColor", color);
      },

      getThirdPartyAccessTokenInfo(authCode) {
        let that = this;
        that.$api.xapi({
          method: 'get',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/thirdParty/token/gat',
          params: {
            iAppId: this.$api.APP_ID,
            initCode: authCode,
          }
        }).then((response) => {
          let rt = response.data.data.result
          that.$log("rt:" + JSON.stringify(rt));
          let openId = rt.openId;
          let accessToken = rt.accessToken;
          if (openId != undefined) {
            let userId = that.$api.APP_ID + openId;
            let userInfo = {
              openId: openId,
              accessToken: rt.accessToken,
              userId: userId
            }
            that.$log("userInfo  is:" + JSON.stringify(userInfo));
            that.$store.commit('SET_USER', JSON.stringify(userInfo));
            that.thirdPartLogined(openId, accessToken)
          }
        }).catch(function (error) {
          that.$log(error)
        })
      },

      getInitCode() {
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.PINGAN_AUTH_URL,
          url: '/pingan/initCode',
        })
      },


      getPingAnThirdPartyAccessTokenInfo(requestCode) {
        let that = this;
        that.$api.xapi({
          method: 'get',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/thirdParty/token',
          params: {
            iAppId: this.$api.APP_ID,
            requestCode: requestCode,
          }
        }).then((response) => {
          let rt = response.data.data.result
          that.$log("rt:" + JSON.stringify(rt));
          let openId = rt.openId;
          let accessToken = rt.accessToken;
          if (openId != undefined) {
            let userId = that.$api.APP_ID + openId;
            let userInfo = {
              openId: openId,
              accessToken: rt.accessToken,
              userId: userId
            }
            that.$log("userInfo  is:" + JSON.stringify(userInfo));
            that.$store.commit('SET_USER', JSON.stringify(userInfo));
            that.thirdPartLogined(openId, accessToken)
          }
        }).catch(function (error) {
          that.$log(error)
        })
      },

      async getLoginAuthInfo() {
        try {
          let ret = await this.getInitCode()
          let initCode = ret.data.data.initCode
          if (!initCode)
            return
          sc.config({
            debug: false,   // 是否开启调试模式 , 调用的所有 api 的返回值会 在客户端 alert 出来
            appId: this.$api.T_APP_ID,  // 在统一 APP 开放平台服务器申请的 appId
            initCode,
            nativeApis: ['userAuth']
          })

          sc.ready(() => {
            sc.userAuth(
              {appId: this.$api.T_APP_ID},
              res => {  /* sc.userAuth 会首先判断用户是否登录，若没有登录，则会主动 调起登录窗口，无需在此调用 isLogin 和 login 接口             */
                if (res.code === 0) { //    用户同意授权
                  const requestCode = res.data.requestCode;
                  this.getPingAnThirdPartyAccessTokenInfo(requestCode);
                } else {  /* 用户拒绝授权或其它失败情况
                               code: - 1 默认失败
                               code: - 10001    没有初始化 JSSDK
                               code: - 10002    用户点击拒绝授权
                                code: - 10003    用户未登录 */
                  console.warning(res.message)
                }
              })
          })
          sc.error((res) => {
            console.error({res})
          })
        } catch (e) {
        }
      },

      getAccessTokenInfo() {
        let that = this;
        that.$jsbridge.call("fetchInitCode", "fengcao", function (initCode) {
          that.$log("initCode is:" + initCode);
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/sso/thirdParty/token',
            params: {
              iAppId: this.$api.APP_ID,
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
          baseURL: this.$api.ORDER_BASE_URL,
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
      },

      onSearchInputClick() {
        this.$log("onSearchInputClick")
        this.$router.push({name: '搜索页'})
      },

      onGiftDialogImgClick() {
        this.$log("onGiftDialogImgClick Enter")
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo)
          this.$router.push({
            name: "新人礼包页"
          })
        } else {
          this.$log("无法获得用户信息，请重新登录授权")
        }
      },

      onGiftDialogCloseBtnClicks() {
        this.$log("onGiftDialogCloseBtnClicks Enter")
        this.showDialog = false
      },

    }
  }
</script>


<style lang="less" scoped>
  .wrap {
    width: 100%;
    height: 100%;
    top: 0px;

    .home-body {
      width: 100%;
      top: 0px;
      background-color: #f8f8f8;

      .box {
        position: relative;
        width: 100%;
        line-height: 15vw;
        background-color: #ff4444;

      }

      .box_after {
        bottom: -60px;
        height: 60px;
        border-radius: 0 0 30% 30%;
        background-color: #ff4444;
        overflow: hidden;
        z-index: -1;
      }

      .index_main {
        margin-top: -50px;
      }
    }

    .gitDialog {
      width: 100%;
      display: flex;
      flex-direction: column;
      color: white;
      background-color: transparent;
      align-items: center;

      img {
        width: 100%;

      }

      .van-icon {
        margin-top: 20px;
        font-size: xx-large;
      }
    }
  }


</style>
