import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from '@/vuex/store.js'   //vuex
import services from '@/http/api.js'       //http请求
import less from 'less'
import Mint from 'mint-ui';    //移动端UI
import 'mint-ui/lib/style.css'


Vue.use(Mint);

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
  AddressList
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
  .use(AddressList);


Vue.config.productionTip = false

//增加全局Service变量
Vue.prototype.$api = services;

//增加Android/ios bridge 全局变量
let dsBridge = require("dsbridge");
Vue.prototype.$jsbridge = dsBridge;

// 用钩子函数beforeEach()对路由进行判断

router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;
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
