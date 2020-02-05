import store from '@/vuex/store.js'
import router from '../router'

const APP_ID = ""
const T_APP_ID =""
const TEST_USER = ""
const SERVICE_URL = ""
const TESTSTUB_PAYMENT_URL = ""
const SERVR_PHONE_NUM= ""
const GOODS_URL_PREFIX = ""
const IS_GAT_APP = false
const IS_WX_GZH =  false
const HAS_HEADER = false
const IS_QUICKPAY_CAN_SAVE = true
const APP_SOURCE = "00"

/*let SERVICE_URL = "http://192.168.200.37:8000";
let TESTSTUB_PAYMENT_URL = "http://192.168.200.122:8088"*/

const ES_BASE_URL = SERVICE_URL+ "/v2/elasticsearches/"
const TESTSTUB_PAYMENT_BASE_URL = TESTSTUB_PAYMENT_URL+"/v1/";
const PRODUCT_BASE_URL = SERVICE_URL+"/v2/products/";
const AGGREGATION_BASE_URL = SERVICE_URL+"/v2/aggregations/"
const ORDER_BASE_URL = SERVICE_URL+"/v2/orders/"
const EQUITY_BASE_URL = SERVICE_URL+"/v2/equities/"
const SSO_BASE_URL = SERVICE_URL+"/v2/ssoes/"
const WORKER_ORDER_BASE_URL = SERVICE_URL+"/v2/workorders"
const BASE_BASE_URL = SERVICE_URL+"/v2/bases/"
const AGGREGATE_PAY_URL = SERVICE_URL + "/v2/aggpays/"
const LINKPAY_ACCOUNT_URL = SERVICE_URL + "/v2/woas/"
const PINGAN_AUTH_URL = SERVICE_URL + "/v2/pingans/"
const FREIGHTS_URL = SERVICE_URL + "/v2/freights/"

const OPTCARDS_URL = SERVICE_URL +"/v2/wocs/"
const VENDOR_URL = SERVICE_URL + "/v2/vendors/"

const SHANGHAI_BANK_URL = "http://180.76.244.14:8021"

//const QUICKLY_PAY_URL = "http://192.168.200.37:8000/v2/cardpayment/"
const QUICKLY_PAY_URL = SERVICE_URL + "/v2/cardpayment/"

const WECHAT_CONFIG_URL = SERVICE_URL + "v2/guanaitong-client"


const xapi = axios.create();
//xapi.defaults.baseURL = SERVER_BASE_URL;
xapi.defaults.timeout = 20000;
xapi.defaults.headers.post['Content-Type'] = 'application/json';
// 请求拦截
xapi.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (store.state.appconf.token.length > 0) {
    config.headers.Authorization = `token ${store.state.appconf.token}`;
  }
  if (store.state.appconf.appId.length > 0) {
    config.headers.appId = store.state.appconf.appId
  }
  return config;

}, function (error) {
  // 对请求错误做些什么
  alert('网络错误,请稍后再试');
  return Promise.reject(error);
});

// 添加响应拦截器
xapi.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;

}, function (error) {
  // 对响应错误做点什么
  console.log("receive network response error:" + error)
  if (error.response) {
    if (error.response.status == 401) {
      // 如果返回401 即没有权限，跳到登录页重新登录
      console.log("401, 请重新登录")
      if(store.state.appconf.appId === '13') {
        router.replace({
          path: 'fcLogin',
          query: {redirect: router.currentRoute.fullPath}
        })
      }
     // router.push({name: '登录页'})
      //alert('登录已失效，请重新登录');
/*      store.commit('CHANGE_TOKEN', 0);
      alert('请重新登录');
      router.replace({
        path: 'login',
        query: {redirect: router.currentRoute.fullPath}
      })*/
    }
  }
  return Promise.reject(error);
});


export default {
  xapi,
  GOODS_URL_PREFIX,
  APP_ID,
  T_APP_ID,
  SERVR_PHONE_NUM,
  PRODUCT_BASE_URL,
  AGGREGATION_BASE_URL,
  ORDER_BASE_URL,
  EQUITY_BASE_URL,
  SSO_BASE_URL,
  WORKER_ORDER_BASE_URL,
  TESTSTUB_PAYMENT_BASE_URL,
  BASE_BASE_URL,
  ES_BASE_URL,
  AGGREGATE_PAY_URL,
  LINKPAY_ACCOUNT_URL,
  PINGAN_AUTH_URL,
  FREIGHTS_URL,
  OPTCARDS_URL,
  SHANGHAI_BANK_URL,
  VENDOR_URL,
  QUICKLY_PAY_URL,
  IS_GAT_APP,
  IS_WX_GZH,
  HAS_HEADER,
  IS_QUICKPAY_CAN_SAVE,
  TEST_USER,
  APP_SOURCE,
  WECHAT_CONFIG_URL
}
