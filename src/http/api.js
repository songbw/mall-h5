import axios from 'axios'
import store from '@/vuex/store.js'
import router from '../router'

const GOODS_URL_PREFIX = "https://iwallet-1258175138.cos.ap-beijing.myqcloud.com"
const TEST_BASE_URL = "http://148.70.12.185:8000/api/mall"
const SERVER_BASE_URL = "http://42.121.121.128:8080"
//const SERVER_BASE_URL = "http://172.21.6.244:8080"

const tapi = axios.create();
tapi.defaults.baseURL = TEST_BASE_URL;
tapi.defaults.timeout = 5000;
tapi.defaults.headers.post['Content-Type'] = 'application/json';
tapi.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

// 请求拦截
tapi.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  store.commit('SET_LOADING', true);
  // 如果有token,添加到请求报文 后台会根据该报文返回status
  if (store.state.login.token) {
    config.headers.Authorization = `token ${store.state.login.token}`;
  }

  return config;

}, function (error) {
  // 对请求错误做些什么
  alert('网络错误,请稍后再试');

  store.commit('SET_LOADING', false);

  return Promise.reject(error);
});

// 添加响应拦截器
tapi.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 加到时器主要是为了 展示Loading效果 项目中应去除
  setTimeout(() => {
    store.commit('SET_LOADING', false);
  }, 300)

  return response;

}, function (error) {
  // 对响应错误做点什么
  store.commit('SET_LOADING', false);

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


const xapi = axios.create();
xapi.defaults.baseURL = SERVER_BASE_URL;
xapi.defaults.timeout = 5000;
xapi.defaults.headers.post['Content-Type'] = 'application/json';
// 请求拦截
xapi.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  store.commit('SET_LOADING', true);
  // 如果有token,添加到请求报文 后台会根据该报文返回status
  if (store.state.login.token) {
    config.headers.Authorization = `token ${store.state.login.token}`;
  }
  return config;

}, function (error) {
  // 对请求错误做些什么
  alert('网络错误,请稍后再试');

  store.commit('SET_LOADING', false);

  return Promise.reject(error);
});

// 添加响应拦截器
xapi.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 加到时器主要是为了 展示Loading效果 项目中应去除
  setTimeout(() => {
    store.commit('SET_LOADING', false);
  }, 300)

  return response;

}, function (error) {
  // 对响应错误做点什么
  store.commit('SET_LOADING', false);

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
  tapi,
  xapi,
  GOODS_URL_PREFIX
}
