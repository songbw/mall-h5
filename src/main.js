//import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/vuex/store.js'   //vuex
import services from '@/http/api.js'       //http请求
import vueLogger from "vue-logger";
import LyTab from 'ly-tab'
import animated from 'animate.css'
import coupon from 'v-coupon'
Vue.use(coupon)
Vue.use(animated)
Vue.use(LyTab)

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
} from 'vant';

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
  .use(Actionsheet);


///////////////////////////////////////////////////////////////////////
Vue.config.productionTip = false
//增加全局Service变量
Vue.prototype.$api = services;
////////////////////////////////////////////////////////////////////////
//增加Android/ios bridge 全局变量
let dsBridge = require("dsbridge");
Vue.prototype.$jsbridge = dsBridge;
////////////////////////////////////////////////////////////////////////
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
});

// 用钩子函数beforeEach()对路由进行判断

router.beforeEach((to, from, next) => {
  //document.body.scrollTop = 0;
  console.log("route:" + from.fullPath + "-->" + to.fullPath)

  next();
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
