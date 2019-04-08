//import Vue from 'vue'
//import Router from 'vue-router'

//Vue.use(Router);
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
const Invoice = resolve => require(['@/components/car/pay/invoice.vue'], resolve)
const OrderList = resolve => require(['@/components/car/pay/orderList.vue'], resolve)
const OrderDetail = resolve => require(['@/components/car/pay/orderDetail.vue'], resolve)
const Logistics = resolve => require(['@/components/car/pay/logistics.vue'], resolve)
const Address = resolve => require(['@/components/car/pay/address.vue'], resolve)
const AddressList = resolve => require(['@/components/car/pay/addressList.vue'], resolve)
const Login = resolve => require(['@/views/login.vue'], resolve)
const Casher = resolve => require(['@/components/car/pay/casher.vue'], resolve)
const Promotion = resolve => require(['@/components/category/goods/promotion.vue'], resolve)


export default new VueRouter({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Index,
      meta: {
        keepAlive: true, //此组件需要被缓存
      }
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
        component: CategoryMain,
        meta: {
          keepAlive: true, //此组件需要被缓存
        }
      },]
    },
    {
      path: '/category/goods/list',
      name: '商品列表页',
      component: CategoryList
    },
    {
      path: '/pay/casher',
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
      component: Pay,
      children: [{
        path: '/car/pay/:action',
        component: Pay
      },]
    },
    {
      path: '/car/oderList',
      name: '订单列表页',
      component: OrderList
    },
    {
      path: '/car/oderDetail',
      name: '订单详情页',
      component: OrderDetail
    },
    {
      path: '/car/Logistics',
      name: '物流信息页',
      component: Logistics
    },
    {
      path: '/car/invoice',
      name: '发票页',
      component: Invoice
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
    },
    {
      path: '/category/goods/promotion/:id',
      name: '商品促销列表',
      component: Promotion,
    },
  ]
})
