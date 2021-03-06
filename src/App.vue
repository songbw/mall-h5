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
  import Util from '@/util/common'

  import {
    Lazyload
  } from 'vant';

  Vue.use(Lazyload, {
    preLoad: 1.3,
    error: require('../static/error.png'),
    loading: require('../static/loading.png'),
    attempt: 3,
    adapter: {
      loaded({
        bindType,
        el,
        naturalHeight,
        naturalWidth,
        $parent,
        src,
        loading,
        error,
        Init
      }) {
        el.setAttribute("class", "fadeIn")
      }
    },
    observer: true,
    observerOptions: {
      rootMargin: '1500px',
      threshold: 0.05
    }
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
    created() {
      this.appInited()
    },

    methods: {
      getUrlParams(url) {
        const _url = url || window.location.href
        const _urlParams = _url.match(/([?&])(.+?=[^&]+)/igm)
        return _urlParams ? _urlParams.reduce((a, b) => {
          const value = b.slice(1).split('=')
          a[value[0]] = value[1]
          return a
        }, {}) : {}
      },
      async appInited() {
        this.$log("appInited Enter")
        let that = this
        try {
          let configRsp = await this.getAppConfig();
          let appConfig = null;
          let serverUrl = ''
          let testUser = ''
          let title = ''
          let iAppId = ''
          let tAppId = ''
          let servicePhone = ''
          let goodsUrlPrefix = ''
          let platformId = 0
          this.$api.PLATFORM_TYPE = {
            isCommon: 0, // 自注册 
            isWuxiCardApp: 1, //无锡市民卡App
            isLingXiApp: 2, //灵锡App
            isFcWxPub: 3, //凤巢公众号
            isZZHApp: 4, //最珠海App
            isWKYCApp: 5, //万科云城App
            isGATApp: 6, //关爱通App
            isUrlRgApp: 7, //URL导入用户
          }
          if (configRsp.data.data != undefined) {
            appConfig = configRsp.data.data
            this.$log("appConfig:", appConfig)
            serverUrl = appConfig.serverUrl
            testUser = appConfig.TEST_USER
            title = appConfig.mallTitle
            iAppId = appConfig.appId
            tAppId = appConfig.tappId
            servicePhone = appConfig.servicePhone
            goodsUrlPrefix = appConfig.goodsUrlPrefix
            if (appConfig.platformId != undefined) {
              platformId = appConfig.platformId
            }
            this.$api.PLATFORM_ID = platformId
          } else {
            appConfig = configRsp.data
            this.$log("appConfig:", appConfig)
            serverUrl = appConfig.SERVICE_URL
            testUser = appConfig.TEST_USER
            title = appConfig.MALL_TITLE
            iAppId = appConfig.iAppID
            tAppId = appConfig.tAppID
            servicePhone = appConfig.SERVR_PHONE_NUM
            goodsUrlPrefix = appConfig.GOODS_URL_PREFIX
            switch (iAppId) {
              case '01':
              case '03':
              case '04':
                platformId = this.$api.PLATFORM_TYPE.isFcWxPub
                break;
              case '08':
              case '09':
              case '10':
                platformId = this.$api.PLATFORM_TYPE.isGATApp
                break;
              case '11':
                platformId = this.$api.PLATFORM_TYPE.isWuxiCardApp
                break;
              case '12':
                platformId = this.$api.PLATFORM_TYPE.isZZHApp
                break;
              case '14':
              case '20':
              case '21':
                platformId = this.$api.PLATFORM_TYPE.isWKYCApp
                break;
              case '15':
                platformId = this.$api.PLATFORM_TYPE.isLingXiApp
                break;
              case '16':
              case '17':
                platformId = this.$api.PLATFORM_TYPE.isUrlRgApp
                break;
              default:
                platformId = 0
                break;
            }
            this.$api.PLATFORM_ID = platformId
          }
          this.$api.GOODS_URL_PREFIX = goodsUrlPrefix
          this.$api.APP_ID = iAppId
          this.$store.commit('SET_APPID', this.$api.APP_ID);
          this.$api.T_APP_ID = tAppId
          this.$api.SERVICE_URL = serverUrl;
          this.$api.SERVR_PHONE_NUM = servicePhone
          this.$api.APP_SOURCE = "00"
          if (appConfig.APP_SOURCE != undefined) {
            this.$api.APP_SOURCE = appConfig.APP_SOURCE
          }
          this.$store.commit('SET_APP_SOURCE', this.$api.APP_SOURCE);
          this.$api.PRODUCT_BASE_URL = serverUrl + "/v2/products/"
          this.$api.AGGREGATION_BASE_URL = serverUrl + "/v2/aggregations/"
          this.$api.ORDER_BASE_URL = serverUrl + "/v2/orders/"
          this.$api.EQUITY_BASE_URL = serverUrl + "/v2/equities/"
          this.$api.SSO_BASE_URL = serverUrl + "/v2/ssoes/"
          this.$api.WORKER_ORDER_BASE_URL = serverUrl + "/v2/workorders"
          this.$api.BASE_BASE_URL = serverUrl + "/v2/bases/"
          this.$api.ES_BASE_URL = serverUrl + "/v2/elasticsearches/"
          this.$api.AGGREGATE_PAY_URL = serverUrl + "/v2/aggpays/"
          this.$api.LINKPAY_ACCOUNT_URL = serverUrl + "/v2/woas/"
          this.$api.PINGAN_AUTH_URL = serverUrl + "/v2/pingans/"
          this.$api.FREIGHTS_URL = serverUrl + "/v2/freights/"
          this.$api.OPTCARDS_URL = serverUrl + "/v2/wocs/"
          this.$api.VENDOR_URL = serverUrl + "/v2/vendors/"
          this.$api.QUICKLY_PAY_URL = serverUrl + "/v2/cardpayment/"
          this.$api.WECHAT_CONFIG_URL = serverUrl + "/v2/guanaitong-client/"
          this.$api.AOYIS_CONFIG_URL = serverUrl + "/v2/aoyis"
          this.$api.IS_SUPPORTED_MULTI_POINT = false;
          if (testUser != undefined && testUser.length > 0)
            this.$api.TEST_USER = testUser
          if (title != undefined && title.length > 0) {
            this.title = title
            this.$api.MALL_TITLE = title
          }
            

          this.loadMonitorJS()
          if (this.$api.PLATFORM_ID == this.$api.PLATFORM_TYPE.isGATApp) { //关爱通APP
            this.$api.IS_GAT_APP = true;
            this.clearStorage();
            this.configured = true
          } else if (this.$api.PLATFORM_ID == this.$api.PLATFORM_TYPE.isWuxiCardApp ||
            this.$api.PLATFORM_ID == this.$api.PLATFORM_TYPE.isZZHApp) { //无锡市民卡App 或 最珠海App
            switch (this.$api.APP_SOURCE) { //APP
              case "00": {
                this.$log("App")
                if (this.shouldLogin()) {
                  this.getLoginAuthInfo();
                }
                this.configured = true
                break;
              }
              case "01": { //微信公众号
                this.$log("公众号")
                this.$api.IS_WX_GZH = true;
                this.clearStorage();
                this.configured = true
                break;
              }
              default: //nothing to do
                this.$log("其它")
                this.configured = true
                break;
            }
          } else if (this.$api.PLATFORM_ID == this.$api.PLATFORM_TYPE.isWKYCApp) { //万科云城App
            try {
              this.wkycLogin()
            } catch (e) {
              that.$log(e)
              that.configured = true
            }
            this.configured = true
          } else if (this.$api.PLATFORM_ID == this.$api.PLATFORM_TYPE.isLingXiApp) { //灵锡App
            this.$log("LinXiApp")
            if (this.shouldLogin()) {
              setTimeout(() => {
                this.getLingXiLoginAuthInfo();
              }, 100);
            }
          } else {
            this.configured = true
          }
        } catch (error) {
          that.$log("error:", error.response.statusText)
          that.$toast(error.response.status + ":" + error.response.statusText)
        }
      },
      getAppId() {
        let urlParams = this.getUrlParams(window.location.href)
        if (urlParams.appId !== undefined) {
          return urlParams.appId
        }
        return ""
      },
      getAppConfig() {
        let appId = this.getAppId()
        this.$log("appId:", appId)
        if (appId == null || appId.length == 0) {
          return this.$api.xapi({
            method: 'get',
            headers: {
              //当只设置cacahe-control: 'no-cache'时，IE浏览器始终返回304，抓包工具抓不到包，请求不和服务器确认
              //当只设置cacahe-control: 'no-cache'时，google浏览器始终返回200，抓包工具可以抓取包，请求重新从服务器获取数据，没有利用到浏览器的缓存功能
              'cache-control': 'no-cache',
              //当只设置Pragma: 'no-cache'时，IE浏览器始终返回200，抓包工具可以抓到所有包，请求重新从服务器获取数据，没有利用到浏览器的缓存功能
              //当只设置Pragma: 'no-cache'时，google浏览器始终返回200，抓包工具可以抓到所有包，请求重新从服务器获取数据，没有利用到浏览器的缓存功能
              'Pragma': 'no-cache'
              //两个参数同时不设置时，IE浏览器始终返回304，抓包工具抓不到包，请求不和服务器确认
              //两个参数同时不设置时，google浏览器首次返回200，之后始终返回304，并且有和服务器确认
              //两个参数同时设置时，IE浏览器始终返回200，抓包工具可以抓到所有包，请求重新从服务器获取数据，没有利用到浏览器的缓存功能
              //两个参数同时设置时，google浏览器始终返回200，抓包工具可以抓到所有包，请求重新从服务器获取数据，没有利用到浏览器的缓存功能
            },
            url: '/static/serverConfig.json'
          })
        } else {
          this.$api.APP_CONFIG_URL = process.env.CONFIG_URL
          //for test
          return this.$api.xapi({
            method: 'get',
            baseURL: this.$api.APP_CONFIG_URL,
            url: '/v2/vendors/renter/api/appConfig',
            params: {
              appId: appId
            }
          })
        }
      },
      loadExternalJs() {
        if (this.$api.APP_ID == "11" || this.$api.APP_ID == "12") {
          let script = document.createElement('script')
          script.type = 'text/javascript'
          script.src = '//smk-static.oss-cn-hangzhou.aliyuncs.com/js/jpasc-0.4.0.js'
          document.getElementsByTagName('head')[0].appendChild(script)
        } else if (this.$api.APP_ID == "15") {
          //TODO: do somthing
          this.$log("loadExternalJs ls sdk")
          let script = document.createElement('script')
          script.type = 'text/javascript'
          //  script.src = '//mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/js/ls-sdk/ls-sdk.js'
          script.src = '//smk-static.oss-cn-hangzhou.aliyuncs.com/js/ls-sdk-0617.js?v=3.0'
          document.getElementsByTagName('head')[0].appendChild(script)
        }
      },
      loadMonitorJS() {
        console.log("loadMonitorJS Enter")
        let id = '';
        switch (this.$api.APP_ID) {
          case '08':
            id = 'b4c5eb949e4363a0438053b58ed73643'
            break;
          case '09':
            id = '489c1d4ef77566d573266c21b816cbca'
            break;
          case '10':
            break;
          case '11':
            id = 'e5999c4dd415c039d4682ccd929d3374'
            break;
          case '12':
            id = '5cb98b7dc7f3fe90a73f9363f6c4d67f'
            break;
          case '14':
            id = '013c2a67e96a8b835c219320ff617fac'
            break;
          case '15':
            id = '5eff62f2be27f69f4f6fd5dc9ffb3617'
            break;
          case '16':
            id = '8dd797d94ca011d1344614257090f118'
            break;
          case '17':
            id = '56051a56e7fd9a20b07fef556058003a'
            break;
        }
        //console.log("loadMonitorJS:"+id)
        if (id.length > 0) {
          setTimeout(() => {
            var _hmt = _hmt || [];
            window._hmt = _hmt;
            (function () {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?" + id;
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
            console.log("loadMonitorJS complete")
          }, 0);
        }
      },
      shouldLogin() {
        this.$log(this.$route)
        if (this.$route.fullPath == '/pay/cashering' || this.$route.fullPath == '/pay/casher') {
          let userInfo = this.$store.state.appconf.userInfo;
          return Util.isUserEmpty(userInfo)
        }
        return true
      },
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
        this.$log("getPingAnThirdPartyAccessTokenInfo Enter")
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
          let payId = rt.payId
          if (openId != undefined) {
            let userId = that.$api.APP_ID + openId;
            let userInfo = {
              openId: openId,
              accessToken: rt.accessToken,
              userId: userId,
              payId: payId
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
            debug: false, // 是否开启调试模式 , 调用的所有 api 的返回值会 在客户端 alert 出来
            appId: this.$api.T_APP_ID, // 在统一 APP 开放平台服务器申请的 appId
            initCode,
            nativeApis: ['userAuth']
          })

          sc.ready(() => {
            sc.userAuth({
                appId: this.$api.T_APP_ID
              },
              res => {
                /* sc.userAuth 会首先判断用户是否登录，若没有登录，则会主动 调起登录窗口，无需在此调用 isLogin 和 login 接口             */
                if (res.code === 0) { //    用户同意授权
                  const requestCode = res.data.requestCode;
                  this.getPingAnThirdPartyAccessTokenInfo(requestCode);
                } else {
                  /* 用户拒绝授权或其它失败情况
                                               code: - 1 默认失败
                                               code: - 10001    没有初始化 JSSDK
                                               code: - 10002    用户点击拒绝授权
                                                code: - 10003    用户未登录 */
                  //this.$toast("用户拒绝授权登录")
                  console.error(res.code)
                  console.error(res.message)
                  sc.close();
                }
              });
            sc.setToolBar({
              leftBtns: [{
                iconType: 0
              }]
            });
          })
          sc.error((res) => {
            console.error({
              res
            })
            sc.close();
          })
        } catch (e) {}
      },
      async getLingXiLoginAuthInfo() {
        this.$log("getLingXiLoginAuthInfo Enter")
        let that = this
        try {
          let ret = await this.getInitCode()
          let initCode = ret.data.data.initCode
          if (!initCode) {
            that.configured = true
            return
          }

          ls.config({
            debug: false, // 是否开启调试模式 , 调用的所有 api 的返回值会 在客户端 alert 出来
            appId: this.$api.T_APP_ID, // 在统一 APP 开放平台服务器申请的 appId
            initCode: initCode
          })

          ls.ready(() => {
            ls.userAuth({
                appId: this.$api.T_APP_ID
              },
              res => {
                /* sc.userAuth 会首先判断用户是否登录，若没有登录，则会主动 调起登录窗口，无需在此调用 isLogin 和 login 接口             */
                if (res.code === 200) { //    用户同意授权
                  const requestCode = res.data.requestCode;
                  this.getPingAnThirdPartyAccessTokenInfo(requestCode);
                } else {
                  /* 用户拒绝授权或其它失败情况
                                               code: - 1 默认失败
                                               code: - 10001    没有初始化 JSSDK
                                               code: - 10002    用户点击拒绝授权
                                                code: - 10003    用户未登录 */
                  //this.$toast("用户拒绝授权登录")
                  console.error(res.code)
                  console.error(res.message)
                  ls.close();
                }
                that.configured = true
              });
          })
          ls.error((res) => {
            console.error({
              res
            })
            ls.close();
            that.configured = true
          })
        } catch (e) {
          console.log("getLingXiLoginAuthInfo:", e.message)
          that.configured = true
        }
      },
      wkycLogin() {
        let that = this
        that.$log("wkycLogin Enter")
        that.$log("userAgent:" + navigator.userAgent.toLowerCase())
        const params = {
          appid: this.$api.T_APP_ID
        }
        const paramsSubSrv = {
          appkey: this.$api.T_APP_ID
        }

        window.serviceTokenInfoResult = function (res) {
          that.$log("子服务回调结果")
          that.$log(res)
          try {
            let response = JSON.parse(res)
            that.$log(response)
            if (response.code == "0") {
              let openId = response.data.openid;
              let accessToken = response.data.access_token;
              that.$log("openId:" + openId)
              that.$log("accessToke:" + accessToken)
              let payId = -1
              if (openId != undefined) {
                let userId = that.$api.APP_ID + openId;
                let userInfo = {
                  openId: openId,
                  accessToken: accessToken,
                  userId: userId,
                  payId: payId
                }
                that.$log("userInfo  is:" + JSON.stringify(userInfo));
                that.$store.commit('SET_USER', JSON.stringify(userInfo));
                that.thirdPartLogined(openId, accessToken)
              }
            } else {
              that.$log("获取用户授权失败!")
              //that.$toast("获取用户授权失败!")
              that.configured = true
            }
          } catch (e) {
            that.$log(e)
            //that.$toast("获取用户授权失败!")
            that.configured = true
          }
        }

        window.shopUserInfoResult = function (res) {
          that.$log("商圈回调结果")
          that.$log(res)
          //workaround for JSON 不规范
          //  
          //res = res.replace('["app"]', 'app');
          res = res.replace(/\"scope\"\:\"\[\"app\"\]\",/g, "");
          res = res.replace(/\"companyPark\"\:(\s)*(\"\[[\w\W]*\]\"|\"\"|null)\,/g, "");
          // that.$log(res)
          try {
            let response = JSON.parse(res)
            that.$log(response.ret)
            if (response.ret === '0') {
              let userinfo = response.data.userinfo;
              let token = response.data.token
              let openId = userinfo.openid;
              let accessToken = token.access_token;
              that.$log("openId:" + openId)
              that.$log("accessToke:" + accessToken)
              let payId = -1
              if (openId != undefined) {
                let userId = that.$api.APP_ID + openId;
                let userInfo = {
                  openId: openId,
                  accessToken: accessToken,
                  userId: userId,
                  payId: payId
                }
                that.$log("userInfo  is:" + JSON.stringify(userInfo));
                that.$store.commit('SET_USER', JSON.stringify(userInfo));
                that.thirdPartLogined(openId, accessToken)
              }
            } else {
              //获取用户信息失败
              that.$log("获取用户授权失败!")
              // that.$toast("获取用户授权失败!")
              that.configured = true
            }
          } catch (e) {
            that.$log(e)
          }
        }

        window.backHomePageOfiOS = function () {
          that.$log("backHomePageOfiOS Enter")
          that.$router.push({
            name: "首页"
          })
        }

        that.$log("getUserInfo")
        if (/iphone/.test(navigator.userAgent.toLowerCase())) {
          that.$log("iphone call getUerInfo")
          //window.getServiceTokenInfo = function (res) {}
          window.webkit.messageHandlers.getServiceTokenInfo.postMessage(JSON.stringify(paramsSubSrv))
          window.webkit.messageHandlers.getShopUserInfo.postMessage(JSON.stringify(params))
          window.webkit.messageHandlers.hideMainBottom.postMessage(JSON.stringify(params))
        } else {
          that.$log("android call getUerInfo")
          ycapp.getServiceTokenInfo(JSON.stringify(paramsSubSrv))
          ycapp.getShopUserInfo(JSON.stringify(params))
          ycapp.hideMainBottom();
        }
      }
    }
  }

</script>

<style lang="less">
  html,
  body,
  #app {
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

  ul,
  li {
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .4s
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }

</style>
