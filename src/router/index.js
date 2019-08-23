const Index = resolve => require(['@/views/Index.vue'], resolve)
const IndexSub = resolve => require(['@/components/index/sub/main.vue'], resolve)
const Category = resolve => require(['@/views/Category.vue'], resolve)
const CategoryMain = resolve => require(['@/components/category/main.vue'], resolve)
const CategoryList = resolve => require(['@/components/category/goods/list.vue'], resolve)
const Cart = resolve => require(['@/views/Cart.vue'], resolve)
const User = resolve => require(['@/views/User.vue'], resolve)
const Detail = resolve => require(['@/views/Detail.vue'], resolve)
const Search = resolve => require(['@/views/Search.vue'], resolve)
const Settlement = resolve => require(['@/components/car/pay/settlement.vue'], resolve)
const OrderList = resolve => require(['@/components/car/pay/orderList.vue'], resolve)
const OrderDetail = resolve => require(['@/components/car/pay/orderDetail.vue'], resolve)
const Logistics = resolve => require(['@/components/car/pay/logistics.vue'], resolve)
const Address = resolve => require(['@/components/car/pay/address.vue'], resolve)
const AddressList = resolve => require(['@/components/car/pay/addressList.vue'], resolve)
const Login = resolve => require(['@/views/login.vue'], resolve)
const Casher = resolve => require(['@/components/car/pay/casher.vue'], resolve)
const Cashering = resolve => require(['@/components/car/pay/cashering.vue'], resolve)
const Promotion = resolve => require(['@/components/category/goods/promotion.vue'], resolve)
const AfterSaleService = resolve => require(['@/components/car/pay/afterSaleService.vue'], resolve)
const CouponCenter = resolve => require(['@/components/user/couponCenter.vue'], resolve)
const CouponList = resolve => require(['@/components/user/couponList.vue'], resolve)
const UserInfo = resolve => require(['@/components/user/userInfo.vue'], resolve)
const CouponChange = resolve => require(['@/components/user/couponChange.vue'], resolve)
const CouponListActivity = resolve => require(['@/components/user/couponListActivity.vue'], resolve)
const CouponWouldCollect = resolve => require(['@/components/user/couponWouldCollect.vue'], resolve)
const CouponGift = resolve => require(['@/components/user/couponGift.vue'], resolve)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '首页',
      component: Index,
      meta: {
        keepAlive: true, //此组件需要被缓存
        title: '苏宁易购',
      }
    },
    {
      path: '/index/:id',
      name: '活动页',
      component: IndexSub,
      meta: {
        title: '苏宁易购',
      }
    },

    {
      path: '/category',
      name: '分类页',
      redirect: '/category/all',
      component: Category,
      meta: {
        title: '商品分类',
      },
      children: [{
        path: '/category/:tab',
        component: CategoryMain,
        meta: {
          keepAlive: true, //此组件需要被缓存
          title: '商品分类',
        }
      },]
    },
    {
      path: '/category/goods/list',
      name: '商品列表页',
      component: CategoryList,
      meta: {
        title: '商品列表',
      }
    },
    {
      path: '/pay/casher',
      name: '收银台页',
      component: Casher,
      meta: {
        title: '收银台',
      }
    },
    {
      path: '/pay/cashering',
      name: '支付中页',
      component: Cashering,
      meta: {
        title: '支付中',
      }
    },
    {
      path: '/car',
      name: '购物车页',
      component: Cart,
      meta: {
        title: '购物车',
      }
    },
    {
      path: '/car/pay',
      name: '支付页',
      component: Settlement,
      meta: {
        title: '确认订单',
      },
      children: [{
        path: '/car/pay/:action',
        component: Settlement,
        meta: {
          title: '确认订单',
        }
      },]
    },
    {
      path: '/car/orderList',
      name: '订单列表页',
      component: OrderList,
      meta: {
        title: '我的订单',
      }
    },
    {
      path: '/car/orderDetail',
      name: '订单详情页',
      component: OrderDetail,
      meta: {
        title: '订单详情',
      }
    },
    {
      path: '/car/Logistics',
      name: '物流信息页',
      component: Logistics,
      meta: {
        title: '物流信息',
      }
    },
    {
      path: '/car/address',
      name: '地址页',
      redirect: '/car/address/new',
      component: Address,
      meta: {
        title: '地址编辑',
      },
      children: [{
        path: '/car/address/:id',
        component: Address,
        meta: {
          title: '地址编辑',
        }
      },]
    },
    {
      path: '/car/addressList',
      name: '地址列表页',
      component: AddressList,
      meta: {
        title: '用户地址',
      }
    },
    {
      path: '/car/afterSaleService',
      name: '售后服务页',
      component: AfterSaleService,
      meta: {
        title: '售后服务',
      }
    },
    {
      path: '/user',
      name: '用户页',
      component: User,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录才能进入的
        title: '我的',
      },
    }, {
      path: '/detail',
      name: '详情页',
      component: Detail,
      meta: {
        title: '商品详情',
      }
    },
    {
      path: '/search',
      name: '搜索页',
      component: Search,
      meta: {
        title: '搜索',
      }
    }, {
      path: '/login',
      name: '登录页',
      component: Login,
      meta: {
        title: '用户登录',
      }
    },
    {
      path: '/category/goods/promotion/:id',
      name: '商品促销列表',
      component: Promotion,
      meta: {
        title: '商品促销',
      }
    },
    {
      path: '/user/couponCenter',
      name: '领券中心',
      component: CouponCenter,
      meta: {
        title: '领券中心',
      }
    },
    {
      path: '/user/couponList',
      name: '我的卡券',
      component: CouponList,
      meta: {
        title: '优惠券',
      }
    },
    {
      path: '/user/userInfo',
      name: '我的信息',
      component: UserInfo,
      meta: {
        title: '个人信息',
      }
    },
    {
      path: '/user/couponChange',
      name: '兑换优惠券',
      component: CouponChange,
      meta: {
        title: '兑换优惠券',
      }
    },
    {
      path: '/user/couponListActivity',
      name: '优惠活动',
      component: CouponListActivity,
      meta: {
        title: '优惠活动',
      }
    },
    {
      path: '/user/couponWouldCollect',
      name: '待领取券页',
      component: CouponWouldCollect,
      meta: {
        title: '待领取券',
      }
    },
    {
      path: '/user/couponGift',
      name: '新人礼包页',
      component: CouponGift,
      meta: {
        title: '新人礼包',
      }
    },

  ]
})
