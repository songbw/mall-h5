//import axios from 'axios'
import store from '@/vuex/store.js'
import router from '../router'

const SERVER_BASE_URL = "http://119.3.111.161:8080"
const OPEN_CASHER_URL = "http://localhost:1322/#/pay/casher";
const USER_BASE_URL="http://119.3.3.226:8081/";

const APP_ID = "11" //10:关爱通
const T_APP_ID ="" //20110843:关爱通
const SERVR_PHONE_NUM= "4000797717";
const GOODS_URL_PREFIX = "https://iwallet-1258175138.file.myqcloud.com"

let SERVICE_URL = "https://api.weesharing.com"
let TESTSTUB_PAYMENT_URL = "http://119.3.111.161:8088"

/*let SERVICE_URL = "http://192.168.200.37:8000";
let TESTSTUB_PAYMENT_URL = "http://192.168.200.122:8088"*/

if (process.env.NODE_ENV === 'development') { //生产环境走的地址
  SERVICE_URL = "http://192.168.200.37:8000";
  TESTSTUB_PAYMENT_URL = "http://192.168.200.122:8088"
}

const ES_BASE_URL = SERVICE_URL+ "/v2/elasticsearches/"
const TESTSTUB_PAYMENT_BASE_URL = TESTSTUB_PAYMENT_URL+"/v1/";

const PRODUCT_BASE_URL = SERVICE_URL+"/v2/products/";
const AGGREGATION_BASE_URL = SERVICE_URL+"/v2/aggregations/"
const ORDER_BASE_URL = SERVICE_URL+"/v2/orders/"
const EQUITY_BASE_URL = SERVICE_URL+"/v2/equities/"
const SSO_BASE_URL = SERVICE_URL+"/v2/ssoes/"
const WORKER_ORDER_BASE_URL = SERVICE_URL+"/v2/workorders"
const BASE_BASE_URL = SERVICE_URL+"/v2/bases/"

const xapi = axios.create();
xapi.defaults.baseURL = SERVER_BASE_URL;
xapi.defaults.timeout = 20000;
xapi.defaults.headers.post['Content-Type'] = 'application/json';
// 请求拦截
xapi.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (store.state.login.token) {
    config.headers.Authorization = `token ${store.state.login.token}`;
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
  OPEN_CASHER_URL,
  USER_BASE_URL,
  PRODUCT_BASE_URL,
  AGGREGATION_BASE_URL,
  ORDER_BASE_URL,
  EQUITY_BASE_URL,
  SSO_BASE_URL,
  WORKER_ORDER_BASE_URL,
  TESTSTUB_PAYMENT_BASE_URL,
  BASE_BASE_URL,
  ES_BASE_URL
}
