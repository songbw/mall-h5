import App from './App'
import router from './router'
import store from '@/vuex/store.js' //vuex
import services from '@/http/api.js' //http请求
import vueLogger from "vue-logger";
import LyTab from 'ly-tab'
import coupon from 'v-coupon'
//import ba from 'vue-ba'
import VueWechatTitle from 'vue-wechat-title'
import VueQRCodeComponent from 'vue-qrcode-component'
import VConsole from 'vconsole'
import md5 from 'js-md5';
import './mock/index.js'

import {
  Button,
  Tab,
  Tabs,
  Card,
  List,
  Cell,
  CellGroup,
  GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  Sku,
  Stepper,
  Row,
  Col,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  SwipeCell,
  Icon,
  Dialog,
  ContactCard,
  ContactList,
  ContactEdit,
  SubmitBar,
  AddressEdit,
  AddressList,
  Search,
  Field,
  Step,
  Steps,
  Swipe,
  SwipeItem,
  Tabbar,
  TabbarItem,
  Actionsheet,
  Progress,
  DatetimePicker,
  Popup,
  Circle,
  Collapse,
  CollapseItem,
  Picker
} from 'vant';

import VueAwesomeSwiper from 'vue-awesome-swiper'
//import 'swiper/css/swiper.css'
// If you use Swiper 6.0.0 or higher
import 'swiper/swiper-bundle.css'
Vue.use(VueAwesomeSwiper)

if (process.env.NODE_ENV === 'production') {
  new VConsole()
}

Vue.component('qr-code', VueQRCodeComponent)
Vue.use(VueWechatTitle)
//Vue.use(ba, "03a0d710c71e9da54f17e6e0544e5030")
//Vue.use(ba, { siteId: "03a0d710c71e9da54f17e6e0544e5030" })
Vue.use(LyTab)
if (process.env.NODE_ENV === 'production') {
  Vue.use(vueLogger, {
    prefix: () => {
      const date = new Date()
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      let second = date.getSeconds();
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    dev: true,
    levels: ["log", "warn", "debug", "error", "dir"],
    forceLevels: []
  })
} else {
  Vue.use(vueLogger, {
    prefix: () => {
      const date = new Date()
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      let second = date.getSeconds();
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    dev: true,
    levels: ["log", "warn", "debug", "error", "dir"],
    forceLevels: []
  })
}
Vue.use(Button)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(List)
  .use(Cell)
  .use(CellGroup)
  .use(GoodsAction)
  .use(GoodsActionBigBtn)
  .use(GoodsActionMiniBtn)
  .use(Sku)
  .use(Stepper)
  .use(Row)
  .use(Col)
  .use(RadioGroup)
  .use(Radio)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SwipeCell)
  .use(Icon)
  .use(Dialog)
  .use(ContactCard)
  .use(ContactList)
  .use(ContactEdit)
  .use(SubmitBar)
  .use(AddressEdit)
  .use(AddressList)
  .use(Search)
  .use(Field)
  .use(Step)
  .use(Steps)
  .use(Swipe)
  .use(SwipeItem)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Actionsheet)
  .use(Progress)
  .use(DatetimePicker)
  .use(Popup)
  .use(Circle)
  .use(Collapse)
  .use(CollapseItem)
  .use(Picker);


Vue.use(coupon);

///////////////////////////////////////////////////////////////////////
Vue.config.productionTip = false
//增加全局Service变量
Vue.prototype.$api = services;
Vue.prototype.$md5 = md5;
Vue.prototype.$moment = moment;
////////////////////////////////////////////////////////////////////////
//增加Android/ios bridge 全局变量
//let dsBridge = require("dsbridge");
//Vue.prototype.$jsbridge = dsBridge;
////////////////////////////////////////////////////////////////////////

// 用钩子函数beforeEach()对路由进行判断

router.beforeEach((to, from, next) => {
  console.log("vue route:" + from.fullPath + "-->" + to.fullPath)
  console.log(to)
  if (from.fullPath === '/' && to.fullPath === '/car/pay') {
    store.commit("SET_BACK_FROME_OUTERLINK", true)
    next({
      path: '/user',
      replace: true
    })
  } else if (from.fullPath === '/' && to.name != '首页') {
    store.commit("SET_BACK_FROME_OUTERLINK", true)
    next()
  } else if (from.fullPath === '/' && to.name === '首页') {
    store.commit("SET_BACK_FROME_OUTERLINK", false)
    next()
  } else {
    next();
  }
})


router.afterEach((to, from) => {
  //  let allowShare = !!to.meta.allowShare;
  if (!!window.__wxjs_is_wkwebview) { // IOS
    if (window.entryUrl == "" || window.entryUrl == undefined) {
      let authUrl = `${window.location.origin}${to.fullPath}`;
      window.entryUrl = authUrl; // 将后面的参数去除
    }
  } else {
    // 安卓
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
