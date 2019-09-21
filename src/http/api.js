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
const HAS_HEADER = false

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

const xapi = axios.create();
//xapi.defaults.baseURL = SERVER_BASE_URL;
xapi.defaults.timeout = 20000;
xapi.defaults.headers.post['Content-Type'] = 'application/json';
// 请求拦截
xapi.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (store.state.appconf.token) {
    config.headers.Authorization = `token ${store.state.appconf.token}`;
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
  IS_GAT_APP,
  HAS_HEADER,
  TEST_USER
}
