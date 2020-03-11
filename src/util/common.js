import CryptoJS from 'crypto-js'
import areaList from '@/assets/area.js'

const STORAGE_USER_KEY = 'STORAGE_USER_KEY'

export default {
  test() {
      this.$log("timeStamp:"+Date.parse(new Date())/1000);
      let timestamp = Date.parse(new Date())/1000;
      let signString = {
        appid: "20110843",
        appsecret: "78dde3cc1e3cab6cbbabbc1bf88faa4e",
        grant_type: "client_credential",
        timestamp: timestamp
      }
      let formatedString = Util.formatSignString(signString);
      let sign = Util.sha1(formatedString)
      this.$log(formatedString)
      this.$log("SHA1:"+sign)
      let that = this;
      let params = {
        appid: signString.appid,
        grant_type:signString.grant_type,
        timestamp:signString.timestamp,
        sign: ""+sign
      }
      this.$log(params)
      this.$api.xapi({
        method: 'post',
        baseURL: "https://openapi.guanaitong.cc",
        headers:{
          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
        },
        url: '/token/create',
        params: params
      }).then((response) => {
        this.$log(response)
      }).catch(function (error) {
        that.$log(error)
      })
    },
  sha1(encodeStr) {
    return CryptoJS.SHA1(encodeStr);
  },

  formatSignString(jsonObj) {
    let arr = [];
    for (let key in jsonObj) {
      arr.push(key)
    }
    arr.sort();
    let str = '';
    for (let i in arr) {
      if (jsonObj[arr[i]] != null) {
        if (typeof jsonObj[arr[i]] == "object") {
          if (jsonObj[arr[i]] instanceof Array) {
            let len = jsonObj[arr[i]].length;

            str += arr[i] + '=['
            for (let k = 0; k < len; k++) {
              str += '{'
              str += this.formatSignString(jsonObj[arr[i]][k]);
              str += '}'
              if (k < len - 1) {
                str += ','
              }
            }
            str += ']' + "&"
          } else {
            str += arr[i] + '={'
            str += this.formatSignString(jsonObj[arr[i]])
            str += '}' + "&"
          }

        } else {
          if (typeof jsonObj[arr[i]] == "string" && jsonObj[arr[i]].length == 0)
            continue;
          str += arr[i] + "=" + jsonObj[arr[i]] + "&";
        }
      }
    }
    return str.substr(0, str.length - 1)
  },

  // 获取
  getLocal(key = STORAGE_USER_KEY) {
    console.log("getLocal:" + key)
    return JSON.parse(window.localStorage.getItem(key))
  },
  // 设置用
  setLocal(res, key = STORAGE_USER_KEY, isSaveOldData = false) {
    //第三个参数是true的话,会增加数据而不是重新设置,res必须是数组
    if (isSaveOldData) {
      if (this.getLocal(key)) {
        let oldData = this.getLocal(key);
        return window.localStorage.setItem(key, JSON.stringify(oldData.concat(res)))
      }
    }
    return window.localStorage.setItem(key, JSON.stringify(res))
  },

  getDisplayPrice(env,checkedPrice,k) {
    if (k.promotion != undefined && k.promotion.length > 0) {
      let startTime = new Date(env.$moment(k.promotion[0].startDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
      let endTime = new Date(env.$moment(k.promotion[0].endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
      let current = new Date().getTime()
      if (current < startTime) {
        return checkedPrice //活动未开始
      } else if (current <= endTime) {
        return (parseFloat(k.promotion[0].discount).toFixed(2)) //活动开始
      } else {
        return checkedPrice// 活动已经结束
      }
    } else {
      return checkedPrice // 无活动
    }
  },

  getPromotionState(env,k) {
    if (k.promotion != undefined && k.promotion.length > 0) {
      let startTime = new Date(env.$moment(k.promotion[0].startDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
      let endTime = new Date(env.$moment(k.promotion[0].endDate).format('YYYY/MM/DD HH:mm:ss')).getTime()
      let current = new Date().getTime()
      if (current < startTime) {
        return 0 //活动未开始
      } else if (current <= endTime) {
        return 1 //活动开始
      } else {
        return -1 // 活动已经结束
      }
    } else {
      return -1 // 无活动
    }
  },

  isUserEmpty(userInfo) {
    return (userInfo === undefined || userInfo === null|| userInfo.length === 0 )
  },

  getCartItem(env, userId, mpu,skuId) {
    let cartList = env.$store.state.appconf.cartList;
    try {
      let found = -1;
      if(skuId == undefined) {
        for (let i = 0; i < cartList.length; i++) {
          if (cartList[i].baseInfo.userId === userId &&
            cartList[i].baseInfo.mpu === mpu) {
            found = i;
            break;
          }
        }
      } else {
        for (let i = 0; i < cartList.length; i++) {
          if (cartList[i].baseInfo.userId === userId &&
            cartList[i].baseInfo.mpu === mpu && cartList[i].baseInfo.skuId === skuId) {
            found = i;
            break;
          }
        }
      }

      if (found == -1) {
        return null;
      } else {
        return cartList[found]
      }
    } catch (e) {
      return null;
    }
  },

  deletCartItem(env, cartItem) {
    env.$log("deletCartItem Enter")
    env.$log(cartItem)
    env.$log(env.$store.state.appconf.cartList)
    let cartList = env.$store.state.appconf.cartList;
    try {
      let found = -1;
      for (let i = 0; i < cartList.length; i++) {
        if (cartList[i].baseInfo.userId === cartItem.baseInfo.userId &&
          cartList[i].baseInfo.mpu === cartItem.baseInfo.mpu && 
          cartList[i].baseInfo.skuId === cartItem.baseInfo.skuId) {
          found = i;
          break;
        }
      }
      if (found != -1) {
        cartList.splice(found,1)
        env.$store.commit('SET_CART_LIST', cartList);
        env.$log(env.$store.state.appconf.cartList)
      }
    } catch (e) {

    }
  },

  updateCartItem(env, cartItem) {
    env.$log("updateCartItem Enter")
    let cartList = env.$store.state.appconf.cartList;
    try {
      let found = -1;
      for (let i = 0; i < cartList.length; i++) {
        if (cartList[i].baseInfo.userId === cartItem.baseInfo.userId &&
          cartList[i].baseInfo.mpu === cartItem.baseInfo.mpu &&  
          cartList[i].baseInfo.skuId === cartItem.baseInfo.skuId) {
          found = i;
          break;
        }
      }
      if(cartItem.promotionInfo != undefined) {
        cartItem.promotionInfo['promotionState'] = this.getPromotionState(env,cartItem.promotionInfo)
        cartItem.goodsInfo['dprice'] = this.getDisplayPrice(env,cartItem.goodsInfo.price,cartItem.promotionInfo)
      }
      if (found == -1) {
        cartList.unshift(cartItem) //添加一个新的
      } else {
        //update baseInfo
        cartList[found] = cartItem;
      }
      env.$store.commit('SET_CART_LIST', cartList);
      env.$log(env.$store.state.appconf.cartList)
    } catch (e) {
      env.$log("error updateCartItem")
    }
  },

  getRegionId(env,provinceName,cityName,countyName) {
    let reginonId = ""
    let found = -1;
    for (let province_key in areaList.province_list) {
        env.$log("111111111")
        let code = province_key
        let province_name = areaList.province_list[province_key]
        if (province_name === provinceName) {
          found = 1;
          reginonId = code
          break;
        }
      }
    if (found) {
        let found = -1;
        for (let city_key in areaList.city_list) {
          let code = city_key
          let city_name = areaList.city_list[city_key]
          if (city_key.substr(0, 2) === reginonId.substr(0, 2) && city_name === cityName) {
            found = 1;
            reginonId = code
            break;
          }
        }
        if (found) {
          let found = -1;
          for (let county_key in areaList.county_list) {
            let code = county_key
            let county_name = areaList.county_list[county_key]
            if (county_key.substr(0, 4) === reginonId.substr(0, 4) && county_name === countyName) {
              found = 1;
              reginonId = code
              break;
            }
          }
        }
      }

    return reginonId
  }
}
