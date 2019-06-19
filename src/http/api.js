//import axios from 'axios'
import store from '@/vuex/store.js'
import router from '../router'

//const GOODS_URL_PREFIX = "https://iwallet-1258175138.cos.ap-beijing.myqcloud.com"
const GOODS_URL_PREFIX = "https://iwallet-1258175138.file.myqcloud.com"

//const SERVER_BASE_URL = "http://192.168.1.35:8080"  //local debug
const SERVER_BASE_URL = "http://119.3.111.161:8080"
const APP_ID = "10" //无锡市民卡
const SERVR_PHONE_NUM= "4000797717";
const OPEN_CASHER_URL = "http://localhost:1322/#/pay/casher";

const USER_BASE_URL="http://119.3.3.226:8081/";

const PRODUCT_BASE_URL = "http://119.3.111.161:8080";
const AGGREGATION_BASE_URL = "http://119.3.111.161:8080"
const ORDER_BASE_URL = "http://119.3.111.161:8080"
const EQUITY_BASE_URL = "http://119.3.111.161:8080"
const SSO_BASE_URL = "http://119.3.3.226:8081/"

/*const PRODUCT_BASE_URL = "https://api.weesharing.com/v2/products/";
const AGGREGATION_BASE_URL = "https://api.weesharing.com/v2/aggregations/"
const ORDER_BASE_URL = "https://api.weesharing.com/v2/orders/"
const EQUITY_BASE_URL = "https://api.weesharing.com/v2/equitys/"
const SSO_BASE_URL = "http://api.weesharing.com/v2/ssoes/"*/

//const PRODUCT_BASE_URL = "http://119.3.111.161:8080";

const xapi = axios.create();
xapi.defaults.baseURL = SERVER_BASE_URL;
xapi.defaults.timeout = 20000;
xapi.defaults.headers.post['Content-Type'] = 'application/json';
// 请求拦截
xapi.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // store.commit('SET_LOADING', true);
  // 如果有token,添加到请求报文 后台会根据该报文返回status
  if (store.state.login.token) {
    config.headers.Authorization = `token ${store.state.login.token}`;
  }
  //Util.test();
  return config;

}, function (error) {
  // 对请求错误做些什么
  alert('网络错误,请稍后再试');

  // store.commit('SET_LOADING', false);

  return Promise.reject(error);
});

// 添加响应拦截器
xapi.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 加到时器主要是为了 展示Loading效果 项目中应去除
  //setTimeout(() => {
  // store.commit('SET_LOADING', false);
  //}, 300)

  return response;

}, function (error) {
  // 对响应错误做点什么
  // store.commit('SET_LOADING', false);
  console.log("receive network response error:" + error)
  if (errore.response) {

    if (error.response.status == 401) {
      // 如果返回401 即没有权限，跳到登录页重新登录
      store.commit('CHANGE_TOKEN', 0);

      alert('请重新登录');

      router.replace({
        path: 'login',
        query: {redirect: router.currentRoute.fullPath}
      })

    }
  }

  return Promise.reject(error);
});


export default {
  xapi,
  GOODS_URL_PREFIX,
  APP_ID,
  SERVR_PHONE_NUM,
  OPEN_CASHER_URL,
  USER_BASE_URL,
  PRODUCT_BASE_URL,
  AGGREGATION_BASE_URL,
  ORDER_BASE_URL,
  EQUITY_BASE_URL,
  SSO_BASE_URL
}
