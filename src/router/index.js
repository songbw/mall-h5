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
const LogisticsYyt = resolve => require(['@/components/car/pay/logisticsYyt.vue'], resolve)
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
const CoinBalance = resolve => require(['@/components/user/coinBalance.vue'], resolve)
const WorkerOrderList = resolve => require(['@/components/car/pay/workerOrderList.vue'], resolve)
const WorkerOrderDetail = resolve => require(['@/components/car/pay/workerOrderDetail.vue'], resolve)
const OptCardList = resolve => require(['@/components/user/optCardList.vue'], resolve)
const OptCardDetail = resolve => require(['@/components/user/optCardDetail.vue'], resolve)
const Qrcode = resolve => require(['@/views/qrcode.vue'], resolve)
const ShangHaiCardList = resolve => require(['@/components/user/shanghaiBankCardList.vue'], resolve)
const QuickPayCardList = resolve => require(['@/components/user/quickpayCardList.vue'], resolve)
const LinkPayAccount = resolve => require(['@/components/user/linkPayAccount.vue'], resolve)

const HistoryOrder = resolve => require(['@/components/user/historyOrderList.vue'], resolve)
const HistoryOrderDetail = resolve => require(['@/components/user/historyOrderDetail.vue'], resolve)
const ShangHaiProtocol = resolve => require(['@/components/user/shanghaiBankProtcol.vue'], resolve)
const FcLogin = resolve => require(['@/views/fcLogin.vue'], resolve)
const FcRegister = resolve => require(['@/views/fcRegister.vue'], resolve)
const FcResetPwd = resolve => require(['@/views/fcResetPwd.vue'], resolve)


export default new VueRouter({
  mode: 'history',
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
      meta: {
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
    {
      path: '/user/coinBalance',
      name: '余额账户',
      component: CoinBalance,
      meta: {
        title: '余额账户',
      }
    },
    {
      path: '/pay/workerOrderList',
      name: '售后工单页',
      component: WorkerOrderList,
      meta: {
        title: '售后工单',
      }
    },
    {
      path: '/pay/workerOrderDetail',
      name: '工单详情页',
      component: WorkerOrderDetail,
      meta: {
        title: '工单详情',
      }
    },
    {
      path: '/user/optCardList',
      name: '惠民优选卡列表页',
      component: OptCardList,
      meta: {
        title: '我的惠民优选卡',
      }
    },
    {
      path: '/user/optCardDetail',
      name: '惠民优选卡详情页',
      component: OptCardDetail,
      meta: {
        title: '惠民优选卡详情',
      }
    },    {
      path: '/qrcode',
      name: '二维码页',
      component: Qrcode,
      meta: {
        title: '二维码',
      }
    },
    {
      path: '/user/shanghaiCardList',
      name: '上海银行卡列表页',
      component: ShangHaiCardList,
      meta: {
        title: '我的钱包',
      }
    },
    {
      path: '/user/quickpayCardList',
      name: '快捷支付银行卡列表页',
      component: QuickPayCardList,
      meta: {
        title: '我的快捷支付银行卡',
      }
    },
    {
      path: '/user/linkPayAccount',
      name: '联机账户页',
      component: LinkPayAccount,
      meta: {
        title: '我的联机账户',
      }
    },
    {
      path: '/user/historyOrderList',
      name: '历史订单页',
      component: HistoryOrder,
      meta: {
        title: '我的历史订单',
      }
    },
    {
      path: '/user/historyOrderDetail',
      name: '历史订单详情页',
      component: HistoryOrderDetail,
      meta: {
        title: '历史订单详情',
      }
    },
    {
      path: '/user/shanghaiBankProtocol',
      name: '上海银行电商资金管理业务电子协议页',
      component: ShangHaiProtocol,
      meta: {
        title: '上海银行电商资金管理业务电子协议',
      }
    },
    {
      path: '/fcLogin',
      name: '商城登录页',
      component: FcLogin,
      meta: {
        title: '登录',
      }
    },
    {
      path: '/fcRegister',
      name: '商城注册页',
      component: FcRegister,
      meta: {
        title: '注册',
      }
    },
    {
      path: '/fcResetPwd',
      name: '商城重置密码页',
      component: FcResetPwd,
      meta: {
        title: '重置密码',
      }
    },
    {
      path: '/car/LogisticsYyt',
      name: '怡亚通物流信息页',
      component: LogisticsYyt,
      meta: {
        title: '物流信息',
      }
    },
  ]
})
