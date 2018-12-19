import Util from '../../util/common'
import * as types from '../types'

const state = {
  location: {},//{"latitude":"40.072267","longitude":"116.246324","locTime":"2018-12-18 08:51:05","country":"中国","province":"北京市","city":"北京市","district":"海淀区"}
  locationCode:{},//{"provinceId":"10","cityId":"010","district":"08"}
  address:{},
  addressCode:{},
  currentGoods:'',
  userInfo:'',//{"code":200,"token":"ed6f4fc9a99949649be1e075c3eca075","userId":2,"username":"13810864380"}
  selStateInCarList:[], //'[{"userId":1,"id":2,"choose":true,"isDel":0}]' //userId:用户ID "id":商品ID，"choose":购物车选中状态，“idDel":是否删除
}

const mutations = {
  [types.SET_LOCATION](state, res) {
    state.location = res
  },

  [types.SET_CURRENT_GOODS](state, res) {
    state.currentGoods = res
  },

  [types.SET_USER](state, res) {
    state.userInfo = res
  },

  [types.SET_SELECTED_CARLIST](state, res) {
    state.selStateInCarList = res
  },

  [types.SET_LOCATION_CODE](state, res) {
    state.locationCode = res
  },

  [types.SET_ADDRESS](state, res) {
    state.address = res
  },

  [types.SET_ADDRESS_CODE](state, res) {
    state.addressCode = res
  }
}


export default {
  state,
  mutations
}