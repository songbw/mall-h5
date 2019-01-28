import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from '@/vuex/store.js'   //vuex
import services from '@/http/api.js'       //http请求
import less from 'less'
import Mint from 'mint-ui';    //移动端UI
import 'mint-ui/lib/style.css'
//import { JSEncrypt } from 'jsencrypt'
import jsrsasign from 'jsrsasign'
import vueLogger from "vue-logger";

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
  AddressList,
  Search,
  Field
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
  .use(Field);


/*function jsonURLParams(json,reverse){
  // 创建一个空数组
  let jsonArr = [];
  // 往空数组里面导入json对象
  for(let i in json){
    let obj = {}
    obj[i] = json[i];
    jsonArr.push(obj);
  }
  // 数组长度小于2  或 不是json格式数据
  if(jsonArr.length < 2 || typeof jsonArr[0] !== "object") return jsonArr;
  // 数字类型排序
  if(typeof getKey(jsonArr[0]) === "number") {
    jsonArr.sort(function(x, y) { return getKey(x) - getKey(y)});
  }
  // 字符串类型排序
  if(typeof getKey(jsonArr[0]) === "string") {
    // 按字符编码的顺序来排序
    jsonArr.sort(function(x, y) {
      let lenX = getKey(x).length,lenY = getKey(y).length,len = (lenX <= lenY) ? lenX : lenY;
      for (let i = 0; i < len; i++) {
        if (getKey(x).charCodeAt(i) != getKey(y).charCodeAt(i)) {
          return getKey(x).charCodeAt(i) - getKey(y).charCodeAt(i);
        }
        if (i == len - 1) {
          return getKey(x).length - getKey(y).length;
        }
      }
    }
  }
  // 倒序
  if(reverse) {
    jsonArr.reverse();
  }
  // 创建一个空字符串
  let jsonString = "";
  for(let i in jsonArr){
    if(i < jsonArr.length - 1){
      jsonString += getKey(jsonArr[i]) + "=" + jsonArr[i][getKey(jsonArr[i])] + "&"
    }else{
      jsonString += getKey(jsonArr[i]) + "=" + jsonArr[i][getKey(jsonArr[i])]
    }
  }
  // 封装函数获取json的key
  function getKey(json){
    for(let i in json){
      return i;
    }
  }
  return jsonString;
}*/
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
    h=h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let second=date.getSeconds();
    second=second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
  },
  dev: true,
  levels: ["log", "warn", "debug", "error", "dir"],
  forceLevels: []
});

// 用钩子函数beforeEach()对路由进行判断

router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;
  console.log("route:"+from.fullPath+"-->"+to.fullPath)
  
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
