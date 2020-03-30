//store.js
import createPersistedState from "vuex-persistedstate"
// 头部分类
import detail from './modules/detail'
import category from './modules/category'
import login from './modules/login'
import appconf from './modules/appconf'


export default new Vuex.Store({
  plugins: [createPersistedState()],
/*   plugins: [createPersistedState({
    storage: window.sessionStorage
  })], */
  modules: {
    appconf,
    detail,
    category,
    login
  }
})
