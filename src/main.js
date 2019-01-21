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
////////////////////////////////////////////////////////////////////////
//增加RSA 加密
/*Vue.prototype.$getCode = function (data) {
  let encrypt = new JSEncrypt()
  encrypt.setPubKey('');
  return encrypt.encrypt(data);
}*/
//增加RSA 签名
Vue.prototype.$getsign = function (data)  {
  let rsa = new jsrsasign.RSAKey()
  //key 是一个私钥，这里先提供假的，这个私钥跟后台的公钥是一对，后台用公钥解密，前端用私钥加密生成签名
  let private_key = "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC+dEYYvNPjdgsT\n" +
    "0nWQ1UwYs+Q2KKnr4hWJNTv0qPgTUX2uw69ON951V8rzZoroJ0n4hp6Wa+8OGu+P\n" +
    "atxodHKtJoeLuOCMEv9ra5VplV+heWbuFRxygOXq9KamWaPT22sI18kco3eY3AgF\n" +
    "SgB5Ly5Pv9fZERY9pIgkY7Tet+rXTFdSvyTALL03I9Ly1t3+YzCmcU8o7lC+A6tQ\n" +
    "JHWXsmlTd9yGzM6Q+2x20atbGDIwIzuNj0oGksqZLMZHW3m5GtzOeTMuHGaghBXm\n" +
    "djb+oKN50QqhM1k5TYBwwBU3K7ff7AolfMwY1nENOv42+LU3g0FAc4vJ8fRH1GZV\n" +
    "95Iv1H1JAgMBAAECggEAFkZhIGmNWrAmsYXO7EaWJNl9Wnw9C3Kg1DBet8m/YfsI\n" +
    "+RS3/yz3nr/K49bdbjOSKjgMeklbZ0ntNNfpuWnNM8Uq20OfN6LNLtIhYnzu92LM\n" +
    "kBH2BspembFNgG1BhPjHtvwN8ISJ613orj2uen3zK66jXybpdAI3ThI/SEE4fT+j\n" +
    "za15LylmbrAw4S9JiJybbPChIpcBp6F/KypwWKi24x7NkKrX60MEl19jSUZHpIYn\n" +
    "rAdeM8uGuUYl5AqqPGfCr5lNnUtbtM4pSk7pMuZ7Fc++uPkZDt8ct9ErEFD/6yJW\n" +
    "uaOBIdoafDcqZuyN/j/8a6N2vIEIV76oi0oeBOXeAQKBgQDncrYHwoJpYtjJhk3z\n" +
    "TUjNDuDdTgqXwbwUstOAD4/j9yitfsnCnPiNcElHICXiDaBTH5RGB85f+r6JI1d1\n" +
    "wvwjYcfFsbxmx/pBMpvZ+6ct/uFbGVPyATOGz5A6IAFJUnUykgnXj7bZo1AUDU+C\n" +
    "Mm7gLiCCQwyU8nWYIrJCsn1zwQKBgQDSqFFKyuFIGnngQ67M1jzSW1hEDut2gEQF\n" +
    "ecKH0HDShEw4xJmWfKWYCl/S24qUcQE2+hYPi69THOpPGk/BD8260LjeUdN92mnD\n" +
    "2p87Hk4f782zlNZZ5OZjVqUn0v9F5u4uC60cGd1q6owTVxWdIjQvhUk9KYV08yUm\n" +
    "X81mO8hLiQKBgQCLkihle42rQbmbpYsiWou5ZOyDaEmJBIKINOLIShoqjeSQ43GG\n" +
    "E6TrnjgCVUejDzaMifGfXZu9U3dNOevHDyN/rrqK5EjJ7nRilsNXa6OAYEDD7/0o\n" +
    "ZkMNW+QMuTotXjVgnqKixH6utgZXYUN+Ly2fsRFXnFldBO2XJe07vWlbwQKBgGwr\n" +
    "/FpwpZA18EGF39vVYzQNrdx84NJf+Q3qwUamdVjUkKNR6SBKb2oMYbpP+/BPuvT1\n" +
    "JKDk9Km0HmlyNGQJ7nWwuk2HLRfiMQ9eUwezfyCNLk657fwJO3jlRDeX9Hd7pvDE\n" +
    "FCdq7LT7LeS8gh/HMY75XWtnx90PAhObfEi0CB0pAoGBAOE0z08ElrvQ0xJP1Xx3\n" +
    "ter/yPLtownc9tW9EH9d9cZhj1sNxmR4vTvQSci9F0KES7hEEf2R0x/20+pscbZG\n" +
    "9POoGFNUTAgfFj2Hr6WrHRCHuKHcgtQ6R1Q9jsgcLx7YFJvrV5PuUiqufgDwGRna\n" +
    "xR0z0xvl/q+TWTBNg1ur6s6o\n" +
    "-----END PRIVATE KEY-----"

  //后台生产出来的私钥是PKCS#8的格式
  rsa = jsrsasign.KEYUTIL.getKey( private_key )

  //MD5withRSA SHA1withRSA SHA256withRSA 编码算法 这个参数可以选择，需要跟后台协定好
  let sig = new jsrsasign.KJUR.crypto.Signature({"alg": "MD5withRSA", "prov": "cryptojs/jsrsa"});;
  sig.init(rsa)
  //传入待加密字符串data
  sig.updateString(data)
  //生成密文
  let sign = jsrsasign.hextob64(sig.sign());
  console.log("sign:"+sign)
  return sign
}
//json 排序

Vue.prototype.$getordedstr =function jsonOrdedarams(json,reverse){
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
    })
  }
  // 倒序
  if(reverse) {
    jsonArr.reverse();
  }
  // 创建一个空字符串
  let jsonString = "";
  for(let i in jsonArr){
    if(i < jsonArr.length ){
      if(jsonArr[i][getKey(jsonArr[i])].length > 0)
        jsonString += getKey(jsonArr[i]) + jsonArr[i][getKey(jsonArr[i])]
    }
  }
  console.log("jsonString:"+jsonString);
  // 封装函数获取json的key
  function getKey(json){
    for(let i in json){
      return i;
    }
  }
  return jsonString;
}

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
