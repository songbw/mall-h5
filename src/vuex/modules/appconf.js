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
  invoice: '',
  payDirectProduct: '',
  currentOrderInfo: '',
  currentNaviIndex: 0,
  currentOrderListIndex: 0,
  currentCouponPageInfo: '',
  cartList: [],
  merchantList: [],
  userDetail: '',
  currentOptCard: '',
  guysInfo: '',
  wxOpenId: '',
  appId: '',
  appSource: '',
  backfromOuterlink: false,
  pickupProdInfo:'',
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

  [types.SET_CART_LIST](state, res) {
    state.cartList = res
  },

  [types.SET_MERCHANT_LIST](state, res) {
    state.merchantList = res
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

  [types.SET_PAY_DIRECT_PRODUCT](state, res) {
    state.payDirectProduct = res
  },

  [types.SET_CURRENT_ORDER_INFO](state, res) {
    state.currentOrderInfo = res
  },


  [types.SET_CURRENT_NAVI_INDEX](state, res) {
    console.log("SET_CURRENT_NAVI_INDEX")
    state.currentNaviIndex = res
  },

  [types.SET_CURRENT_ORDER_LIST_INDEX](state, res) {
    console.log("SET_CURRENT_ORDER_LIST_INDEX")
    state.currentOrderListIndex = res
  },

  [types.SET_CURRENT_COUPON_PAGE_INFO](state, res) {
    state.currentCouponPageInfo = res
  },

  [types.SET_USER_DETAIL](state, res) {
    state.userDetail = res
  },

  [types.SET_CURRENT_OPT_CARDS](state, res) {
    state.currentOptCard = res
  },

  [types.SET_GUYS_INFO](state, res) {
    state.guysInfo = res
  },

  [types.SET_WX_OPENID](state, res) {
    state.wxOpenId = res
  },

  [types.SET_APPID](state, res) {
    state.appId = res
  },

  [types.SET_APP_SOURCE](state, res) {
    state.appSource = res
  },

  [types.SET_BACK_FROME_OUTERLINK](state, res) {
    state.backfromOuterlink = res
  },

  [types.SET_PICKUP_PRODUCTS_INFO](state, res) {
    state.pickupProdInfo = res
  },
}

const actions = {
  setInvoicdInfo({commit}, res) {
    console.log("setInvoicdInfo Enter");
    Util.setLocal(res, 'invoice', false);
    commit(types.SET_INVOICE_INFO);
  },

  getInvoiceInfo({commit}) {
    console.log("getInvoiceInfo Enter");
    commit(types.SET_INVOICE_INFO);
  },

}

export default {
  state,
  mutations,
  actions
}
