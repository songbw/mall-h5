<template>
  <div id="app" v-if="configured">
    <transition name="fadeIn">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" v-wechat-title='$route.meta.title != undefined ? $route.meta.title : title'></router-view>
      </keep-alive>
    </transition>
    <transition name="fadeIn">
      <router-view v-if="!$route.meta.keepAlive" v-wechat-title='$route.meta.title != undefined ? $route.meta.title : title'></router-view>
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
        title:"",
        configured:false
      }
    },
    beforeCreate() {
      this.$api.xapi({
        method: 'get',
        url: '/static/serverConfig.json'
      }).then((result)=>{
        //用一个全局字段保存ApiUrl 也可以用sessionStorage存储
        console.log("getConfigJson"+ JSON.stringify(result.data))
        let serverUrl = result.data.SERVICE_URL;
        let testPaymentUrl = result.data.TESTSTUB_PAYMENT_URL
        let testUser = result.data.TEST_USER
        let title = result.data.MALL_TITLE
        this.$api.GOODS_URL_PREFIX = result.data.GOODS_URL_PREFIX
        this.$api.APP_ID = result.data.iAppID
        this.$api.T_APP_ID = result.data.tAppID
        this.$api.SERVICE_URL = serverUrl;
        this.$api.SERVR_PHONE_NUM = result.data.SERVR_PHONE_NUM
        this.$api.PRODUCT_BASE_URL = serverUrl+"/v2/products/"
        this.$api.AGGREGATION_BASE_URL = serverUrl+"/v2/aggregations/"
        this.$api.ORDER_BASE_URL = serverUrl+"/v2/orders/"
        this.$api.EQUITY_BASE_URL = serverUrl+"/v2/equities/"
        this.$api.SSO_BASE_URL = serverUrl+"/v2/ssoes/"
        this.$api.WORKER_ORDER_BASE_URL = serverUrl+"/v2/workorders"
        this.$api.TESTSTUB_PAYMENT_BASE_URL = testPaymentUrl+"/v1/"
        this.$api.BASE_BASE_URL =  serverUrl+"/v2/bases/"
        this.$api.ES_BASE_URL = serverUrl+ "/v2/elasticsearches/"
        this.$api.AGGREGATE_PAY_URL = serverUrl + "/v2/aggpays/"
        if(testUser != undefined && testUser.length > 0)
          this.$api.TEST_USER = testUser
        if(title !=undefined && title.length > 0)
          this.title = title
        if(this.$api.APP_ID === "10" || this.$api.APP_ID === "09")
          this.$api.IS_GAT_APP = true;
        this.configured = true
      }).catch((error)=>{console.log(error)});
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
