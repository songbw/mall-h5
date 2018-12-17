import Util from '../../util/common'
import * as types from '../types'

const state = {
  location: {},
  locationCode:{},
  address:{},
  addressCode:{},
  currentGoods:'',
  userInfo:'',//
  carList:'',//
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
