import Util from '../../util/common'
import * as types from '../types'

const state = {
  location: '',
  currentGoods:'',
  userInfo:'',
  carList:'',
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
  }
}


export default {
  state,
  mutations
}
