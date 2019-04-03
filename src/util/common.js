const STORAGE_USER_KEY = 'STORAGE_USER_KEY'

export default {
  // 获取
  getLocal(key = STORAGE_USER_KEY) {
    console.log("getLocal:"+key)
    return JSON.parse(window.localStorage.getItem(key))
  },
  // 设置用
  setLocal(res, key = STORAGE_USER_KEY, isSaveOldData = false) {
    //第三个参数是true的话,会增加数据而不是重新设置,res必须是数组
    console.log("setLocal:"+key)
    if (isSaveOldData) {
      if (this.getLocal(key)) {
        let oldData = this.getLocal(key);
        return window.localStorage.setItem(key, JSON.stringify(oldData.concat(res)))
      }
    }
    return window.localStorage.setItem(key, JSON.stringify(res))
  },

  getPromotionState(k) {
    if(k.promotion != undefined && k.promotion.length > 0) {
      let startTime = new Date(k.promotion[0].startDate).getTime()
      let endTime = new Date(k.promotion[0].endDate).getTime()
      let current = new Date().getTime()
      if(current <  startTime) {
        return 0 //活动未开始
      } else if(current <= endTime) {
        return 1 //活动开始
      } else {
        return -1 // 活动已经结束
      }
    } else {
      return -1 // 无活动
    }
  },
}
