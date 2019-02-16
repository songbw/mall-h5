import Util from '../../util/common'
import * as types from '../types'

const state = {
  location: '',//{"latitude":"40.072267","longitude":"116.246324","locTime":"2018-12-18 08:51:05","country":"中国","province":"北京市","city":"北京市","district":"海淀区"}
  locationCode: '',//{"provinceId":"10","cityId":"010","district":"08"}
  addressList: [],
  usedAddressId: -1,
  currentGoods: '',
  userInfo: '',//{"code":200,"token":"ed6f4fc9a99949649be1e075c3eca075","userId":2,"username":"13810864380"}
  selStateInCarList: [], //'[{"userId":1,"id":2,"choose":true,"isDel":0}]' //userId:用户ID "id":商品ID，"choose":购物车选中状态，“idDel":是否删除
  pageLoading: false,//全局加载状态的Loading
  payList: [],
  token: '',
  invoice: ''
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

  [types.SET_USED_ADDRESS_ID](state, res) {
    state.usedAddressId = res
  },

  [types.SET_ADDRESS_LIST](state, res) {
    state.addressList = res
  },

  [types.SET_PAGE_LOADING](state, res) {
    state.pageLoading = res
  },

  [types.SET_PAY_LIST](state, res) {
    state.payList = res
  },

  [types.SET_TOKEN](state, res) {
    state.token = res
  },

  //获取当前发票信息
  [types.SET_INVOICE_INFO](state) {
    state.invoice = Util.getLocal('invoice')
  },
}

const actions = {
  setAddress({commit}, res) {
    // Util.setLocal(res, 'address', true);
    // commit(types.SET_ADDRESS
  },

  setInvoicdInfo({commit}, res) {
    console.log("setInvoicdInfo Enter");
    Util.setLocal(res, 'invoice', false);
    commit(types.SET_INVOICE_INFO);
  },

}


export default {
  state,
  mutations,
  actions
}
