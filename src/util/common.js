const STORAGE_USER_KEY = 'STORAGE_USER_KEY'

export default {
  // 获取
  getLocal(key = STORAGE_USER_KEY) {
    console.log("getLocal:" + key)
    return JSON.parse(window.localStorage.getItem(key))
  },
  // 设置用
  setLocal(res, key = STORAGE_USER_KEY, isSaveOldData = false) {
    //第三个参数是true的话,会增加数据而不是重新设置,res必须是数组
    console.log("setLocal:" + key)
    if (isSaveOldData) {
      if (this.getLocal(key)) {
        let oldData = this.getLocal(key);
        return window.localStorage.setItem(key, JSON.stringify(oldData.concat(res)))
      }
    }
    return window.localStorage.setItem(key, JSON.stringify(res))
  },

  getDisplayPrice(checkedPrice,k) {
    if (k.promotion != undefined && k.promotion.length > 0) {
      let startTime = new Date(k.promotion[0].startDate).getTime()
      let endTime = new Date(k.promotion[0].endDate).getTime()
      let current = new Date().getTime()
      if (current < startTime) {
        return checkedPrice //活动未开始
      } else if (current <= endTime) {
        return checkedPrice-k.promotion[0].discount //活动开始
      } else {
        return checkedPrice// 活动已经结束
      }
    } else {
      return checkedPrice // 无活动
    }
  },

  getPromotionState(k) {
    if (k.promotion != undefined && k.promotion.length > 0) {
      let startTime = new Date(k.promotion[0].startDate).getTime()
      let endTime = new Date(k.promotion[0].endDate).getTime()
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
    return (userInfo == undefined || userInfo.length === 0)
  },

  getCartItem(env, userId, mpu) {
    let cartList = env.$store.state.appconf.cartList;
    try {
      let found = -1;
      for (let i = 0; i < cartList.length; i++) {
        if (cartList[i].baseInfo.userId === userId &&
          cartList[i].baseInfo.mpu === mpu) {
          found = i;
          break;
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
          cartList[i].baseInfo.mpu === cartItem.baseInfo.mpu) {
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
          cartList[i].baseInfo.mpu === cartItem.baseInfo.mpu) {
          found = i;
          break;
        }
      }
      if(cartItem.promotionInfo != undefined) {
        cartItem.promotionInfo['promotionState'] = this.getPromotionState(cartItem.promotionInfo)
        cartItem.goodsInfo['dprice'] = this.getDisplayPrice(cartItem.goodsInfo.price,cartItem.promotionInfo)
      }
      env.$log(cartItem)
      if (found == -1) {
        cartList.push(cartItem) //添加一个新的
      } else {
        //update baseInfo
        cartList[found] = cartItem;
      }
      env.$store.commit('SET_CART_LIST', cartList);
      //env.$log(env.$store.state.appconf.cartList)
    } catch (e) {
      env.$log("error updateCartItem")
    }
  },
}
