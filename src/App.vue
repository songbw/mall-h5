<template>
  <div id="app" v-if="configured">
    <transition name="fadeIn">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"
                     v-wechat-title='$route.meta.title != undefined ? $route.meta.title : title'></router-view>
      </keep-alive>
    </transition>
    <transition name="fadeIn">
      <router-view v-if="!$route.meta.keepAlive"
                   v-wechat-title='$route.meta.title != undefined ? $route.meta.title : title'></router-view>
    </transition>
  </div>
</template>

<script>
  import Loading from '@/common/_loading'
  import {
    Lazyload
  } from 'vant';

  Vue.use(Lazyload, {
    preLoad: 1.3,
    error: require('../static/error.png'),
    loading: require('../static/loading.png'),
    attempt: 3,
    adapter: {
      loaded({bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error, Init}) {
        el.setAttribute("class", "fadeIn")
      }
    },
    observer: true,
    observerOptions: {rootMargin: '1500px', threshold: 0.05}
  })
  export default {
    components: {
      'v-loading': Loading
    },
    computed: {
      fetchLoading() {
        return this.$store.state.detail.fetchLoading
      }
    },
    data() {
      return {
        title: "",
        configured: false
      }
    },
    beforeCreate() {
      this.$api.xapi({
        method: 'get',
        url: '/static/serverConfig.json'
      }).then((result) => {
        //用一个全局字段保存ApiUrl 也可以用sessionStorage存储
        console.log("getConfigJson" + JSON.stringify(result.data))
        let serverUrl = result.data.SERVICE_URL;
        let testPaymentUrl = result.data.TESTSTUB_PAYMENT_URL
        let testUser = result.data.TEST_USER
        let title = result.data.MALL_TITLE
        let isQpayCardSaved = result.data.IS_QUICKPAY_CARD_SAVED
        this.$api.GOODS_URL_PREFIX = result.data.GOODS_URL_PREFIX
        this.$api.APP_ID = result.data.iAppID
        this.$api.T_APP_ID = result.data.tAppID
        this.$api.APP_SOURCE = "00"
        if (!result.data.APP_SOURCE != undefined) {
          this.$api.APP_SOURCE = result.data.APP_SOURCE
        }
        this.$api.SERVICE_URL = serverUrl;
        this.$api.SERVR_PHONE_NUM = result.data.SERVR_PHONE_NUM
        this.$api.PRODUCT_BASE_URL = serverUrl + "/v2/products/"
        this.$api.AGGREGATION_BASE_URL = serverUrl + "/v2/aggregations/"
        this.$api.ORDER_BASE_URL = serverUrl + "/v2/orders/"
        this.$api.EQUITY_BASE_URL = serverUrl + "/v2/equities/"
        this.$api.SSO_BASE_URL = serverUrl + "/v2/ssoes/"
        this.$api.WORKER_ORDER_BASE_URL = serverUrl + "/v2/workorders"
        this.$api.TESTSTUB_PAYMENT_BASE_URL = testPaymentUrl + "/v1/"
        this.$api.BASE_BASE_URL = serverUrl + "/v2/bases/"
        this.$api.ES_BASE_URL = serverUrl + "/v2/elasticsearches/"
        this.$api.AGGREGATE_PAY_URL = serverUrl + "/v2/aggpays/"
        this.$api.LINKPAY_ACCOUNT_URL = serverUrl + "/v2/woas/"
        this.$api.PINGAN_AUTH_URL = serverUrl + "/v2/pingans/"
        this.$api.FREIGHTS_URL = serverUrl + "/v2/freights/"
        this.$api.OPTCARDS_URL = serverUrl + "/v2/wocs/"
        this.$api.VENDOR_URL = serverUrl + "/v2/vendors/"
        this.$api.QUICKLY_PAY_URL = serverUrl + "/v2/cardpayment/"
        if (testUser != undefined && testUser.length > 0)
          this.$api.TEST_USER = testUser
        if (title != undefined && title.length > 0)
          this.title = title
        if (isQpayCardSaved != undefined && isQpayCardSaved == '0') {
          this.$api.IS_QUICKPAY_CAN_SAVE = false;
        }
        if (this.$api.APP_ID === "10" || this.$api.APP_ID === "09") {
          this.$api.IS_GAT_APP = true;
          this.clearStorage();
          this.configured = true
        } else if (this.$api.APP_ID == "11") {
          switch (this.$api.APP_SOURCE) {//APP
            case '00': {
              this.getLoginAuthInfo();
              setTimeout(() => {
                this.configured = true
              }, 1000);
              break;
            }
            case '01': {//微信公众号
              this.$api.IS_WX_GZH = true;
              this.clearStorage();
              this.configured = true
              break;
            }
            default://nothing to do
              this.configured = true
              break;
          }
        } else if (this.$api.APP_ID == "01") {
          switch (this.$api.APP_SOURCE) {//APP
            case '01': {//微信公众号
              this.$api.IS_WX_GZH = true;
              this.clearStorage();
              this.configured = true
              break;
            }
            default://nothing to do
              this.configured = true
              break;
          }
        } else {
          this.configured = true
        }
      }).catch((error) => {
        console.log(error)
      });
    },

    methods: {
      clearStorage() {
        let payList = []
        this.$store.commit('SET_PAY_LIST', this.payList);
        let cartList = []
        this.$store.commit('SET_CART_LIST', cartList);
        let merchantList = []
        this.$store.commit('SET_MERCHANT_LIST', merchantList);
        let addressList = []
        this.$store.commit('SET_ADDRESS_LIST', addressList);
        let userDetail = ''
        this.$store.commit('SET_USER_DETAIL', userDetail);

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
            let data = this.$md5(rt.token)
            if (rt.newUser) {
              data = "1" + data
            } else {
              data = "0" + data
            }
            this.$log(data)
            that.$store.commit('SET_GUYS_INFO', data);
            that.configured = true
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
        //  this.$toast("requestCode:"+requestCode)
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
          //   this.$toast("initCode:"+initCode)
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
              });
            sc.setToolBar({
              leftBtns: [
                {iconType: 0}
              ]
            });
          })
          sc.error((res) => {
            console.error({res})
          })
        } catch (e) {
        }
      },
    }
  }
</script>

<style lang="less">
  html, body, #app {
    width: 100%;
    height: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
  }

  body,
  dd,
  dl,
  dt,
  fieldset,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  html,
  img,
  legend,
  li,
  ol,
  p,
  ul {
    margin: 0;
    padding: 0;
    -moz-user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  button,
  fieldset,
  img,
  input {
    border: none;
    padding: 0;
    margin: 0;
    outline-style: none;
  }

  ul, li {
    background-color: #ffffff;
  }

  ol,
  ul {
    list-style: none;
  }

  input {
    padding-top: 0;
    padding-bottom: 0;
    font-family: "SimSun", "宋体";
  }

  input,
  select {
    vertical-align: middle;
  }

  input,
  select,
  textarea {
    font-size: 12px;
    margin: 0;
  }

  textarea {
    resize: none;
  }

  /*防止拖动*/
  img {
    border: 0;
    vertical-align: middle;
  }

  /*  去掉图片低测默认的3像素空白缝隙*/
  table {
    border-collapse: collapse;
  }

  //去斜体
  i {
    font-style: normal
  }

  body {
    font-family: PingFangSC-Light, helvetica, 'Heiti SC';
    color: #666;
    background: #fff;
  }

  a {
    color: #666;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-decoration: none;
    font-weight: normal;
    font-size: 100%;
    font-family: PingFangSC-Light, helvetica, 'Heiti SC';
  }

  .ac {
    text-align: center;
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }

  .fadeIn {
    animation: fadeIn 1s linear;
    -webkit-animation: fadeIn 1s linear;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

</style>
