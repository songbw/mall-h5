import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
//按需加载,当渲染其他页面时才加载其组件,并缓存,减少首屏加载时间
const Index = resolve => require(['@/views/Index.vue'], resolve)
const IndexSub = resolve => require(['@/components/index/sub/main.vue'], resolve)
const Category = resolve => require(['@/views/Category.vue'], resolve)
const CategoryMain = resolve => require(['@/components/category/main.vue'], resolve)
const CategoryList = resolve => require(['@/components/category/goods/list.vue'], resolve)
const Car = resolve => require(['@/views/Car.vue'], resolve)
const User = resolve => require(['@/views/User.vue'], resolve)
const Detail = resolve => require(['@/views/Detail.vue'], resolve)
const Search = resolve => require(['@/views/Search.vue'], resolve)
const Pay = resolve => require(['@/components/car/pay/pay.vue'], resolve)
const Address = resolve => require(['@/components/car/pay/address.vue'], resolve)
const AddressList = resolve => require(['@/components/car/pay/addressList.vue'], resolve)
const Login = resolve => require(['@/views/login.vue'], resolve)
const Casher = resolve => require(['@/components/car/pay/casher.vue'], resolve)

export default new Router({
  mode:'history',//默认是hash模式
  linkActiveClass:'link-active',
  scrollBehavior(to,from,savePosition){ // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
    console.log(to) // to：要进入的目标路由对象，到哪里去
    console.log(from) // from：离开的路由对象，哪里来
    console.log(savePosition) // savePosition：会记录滚动条的坐标，点击前进/后退的时候记录值{x:?,y:?}
    if(savePosition) {
      return savePosition;
    }else{
      return {x:0,y:0}
    }
  },
  routes: [
    {
      path: '/',
      name: '首页',
      component: Index,
    },
    {
      path: '/index/:id',
      name: '活动页',
      component: IndexSub,
    },

    {
      path: '/category',
      name: '分类页',
      redirect: '/category/all',
      component: Category,
      children: [{
        path: '/category/:tab',
        component: CategoryMain
      },]
    },
    {
      path: '/category/goods/list',
      name: '商品列表页',
      component: CategoryList
    },
    {
      path: '/car/casher',
      name: '收银台页',
      component: Casher
    },
    {
      path: '/car',
      name: '购物车页',
      component: Car
    },
    {
      path: '/car/pay',
      name: '支付页',
      component: Pay
    },
    {
      path: '/car/address',
      name: '地址页',
      redirect: '/car/address/new',
      component: Address,
      children: [{
        path: '/car/address/:id',
        component: Address
      },]
    },
    {
      path: '/car/addressList',
      name: '地址列表页',
      component: AddressList
    },
    {
      path: '/user',
      name: '用户页',
      component: User,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录才能进入的
      },
    }, {
      path: '/detail',
      name: '详情页',
      component: Detail
    }, {
      path: '/search',
      name: '搜索页',
      component: Search
    }, {
      path: '/login',
      name: '登录页',
      component: Login
    }
  ]
})
