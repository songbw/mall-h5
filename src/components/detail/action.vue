<template lang="html">
  <section>
    <van-goods-action class="goodsAction">
      <van-goods-action-mini-btn class="contactServiceBtn"
                                 text="联系客服"
                                 icon="chat-o"
                                 @click="showMeqiaPanel">
      </van-goods-action-mini-btn>
      <van-goods-action-mini-btn class="gotoCartBtn"
                                 icon="cart-o"
                                 text="购物车"
                                 @click="gotoCar"
                                 :info="cartNumber > 0? cartNumber : ''">

      </van-goods-action-mini-btn>
      <van-goods-action-big-btn class="add2CartBtn" text="加入购物车" @click="addGoodsCar"/>
      <van-goods-action-big-btn class="buyDirectBtn" text="立即购买" primary @click="gotoPay"/>
    </van-goods-action>
    <div v-if="sku != null">
      <van-sku
        v-model="showBase"
        :sku="sku"
        goods="测试商品"
        goods-id="1"
        hide-stock= true
        disable-stepper-input=true
      />
    </div>

  </section>

</template>

<script>
  import Util from '@/util/common'

  export default {
    props: {
      datas: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        selStateInCarList: [],
        myCouponIcon: require('@/assets/icons/ico_mycoupon.png'),
        chCouponIcon: require('@/assets/icons/ico_changecoupon.png'),
        cartNumber: 0,
        showBase: false,
        sku:null
      }
    },

    computed: {
      cartListCount() {
        let count = this.$store.state.appconf.cartList.length
        return count
      }
    },

    watch:{
      cartListCount(newValue, oldVal) {
        if(newValue > 99)
          this.cartNumber = 99
        else
          this.cartNumber = newValue
      },
      datas(newValue, oldVal) {
        this.$log("datas changed @@@@@@@@@@@@@@@@@@@")
        this.$log(newValue)
        if(newValue != null) {
          if(this.datas.skuList != undefined && this.datas.skuList.length > 0) {
            this.sku =  {
              // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
              // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
              tree: [
                {
                  k: '颜色', // skuKeyName：规格类目名称
                  v: [
                    {
                      id: '30349', // skuValueId：规格值 id
                      name: '红色', // skuValueName：规格值名称
                      imgUrl: 'https://img.yzcdn.cn/1.jpg' // 规格类目图片，只有第一个规格类目可以定义图片
                    },
                    {
                      id: '1215',
                      name: '蓝色',
                      imgUrl: 'https://img.yzcdn.cn/2.jpg'
                    }
                  ],
                  k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                }
              ],
              // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
              list: [
                {
                  id: 2259, // skuId，下单时后端需要
                  price: 100, // 价格（单位分）
                  s1: '1215', // 规格类目 k_s 为 s1 的对应规格值 id
                  s2: '1193', // 规格类目 k_s 为 s2 的对应规格值 id
                  s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                  stock_num: 110 // 当前 sku 组合对应的库存
                }
              ],
              price: '1.00', // 默认价格（单位元）
              stock_num: 227, // 商品总库存
              collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
              none_sku: false, // 是否无规格商品
              hide_stock: false // 是否隐藏剩余库存
            }
          }
        }
      }
    },

    created() {
      if(this.$store.state.appconf.cartList != undefined) {
        this.cartNumber = this.$store.state.appconf.cartList.length
      }
    },

    beforeDestroy (){
      this.hideMeqiaPanel()
    },

    methods: {
      getClientName() {
        switch (this.$api.APP_ID) {
          case "09":
            return "关爱通品牌直供";
          case "10":
            return "关爱通苏宁易购";
          case "11":
            return "无锡市民卡";
          default:
            return "凤巢商城"

        }
      },
      showMeqiaPanel () {
        let userInfo = this.$store.state.appconf.userInfo;
        let userDetail = this.$store.state.appconf.userDetail;
        let userName = ""
        let userId = ""
        let telePhone = ""
        if(!Util.isUserEmpty(userInfo)) {
          let UserInfo = JSON.parse(userInfo)
          userId = UserInfo.userId
        }
        if(userDetail.length > 0) {
          let UserDetail  = JSON.parse(userDetail)
          userName =  UserDetail.nickname
          telePhone = UserDetail.telephone
        }
        _MEIQIA('showPanel')
        _MEIQIA('metadata', {
          name: userName, // 美洽默认字段
          tel:telePhone,
          '渠道': this.getClientName(), // 自定义字段
          '用户ID': userId,
          '当前URL': window.location.href,
          '订单号': ''
        });
      },
      hideMeqiaPanel(){
        _MEIQIA('hidePanel');
      },

      add2SelectedCarlistWithoutUser() {//
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList;
        let choose = true;
        let found = -1;
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == this.datas.id && this.selStateInCarList[i].userId == -1) {
            found = i;
            break;
          }
        }
        if (found != -1) {
          this.selStateInCarList[found].count++;
        } else {
          this.selStateInCarList.push({
            "userId": -1,
            "id": this.datas.id,
            "image": this.datas.image,
            "desc": this.datas.brand + ' ' + this.datas.name + ' ' + this.datas.model,
            "skuId": this.datas.skuId,
            "mpu": this.datas.mpu,
            "merchantId": this.datas.merchantId,
            "count": 1,
            "price": this.datas.price,
            "choose": true,
            "isDel": 0
          });
        }
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
      },

      addGoodsCar() {
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          if(this.datas.skuList != undefined && this.datas.skuList.length > 0)
          {
            this.showBase = true;
          } else {
            this.add2Car(userInfo, this.datas);
          }


        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },

      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let mpu = goods.mpu;
        let addtoCar = {
          "openId": userId,
          "mpu": mpu
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          if(response.data.code == 200) {
            this.$toast("添加到购物车成功！")
            let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
            if (cartItem == null) {
              let baseInfo = {
                "userId": user.userId,
                "skuId": goods.skuid,
                "mpu": goods.mpu,
                "merchantId": goods.merchantId,
                "count": 1,
                "choosed": true,
                "cartId": this.result,
              }
              let goodsInfo = {
                "id": goods.id,
                "skuId": goods.skuid,
                "mpu": goods.mpu,
                "merchantId": goods.merchantId,
                "image": goods.image,
                "category": goods.category,
                "name": goods.name,
                "brand": goods.brand,
                "model": goods.model,
                "price": goods.price,
                "checkedPrice": goods.price,
                "type": goods.type == undefined? 0:goods.type
              }
              let couponList = []
              let promotionInfo = {}
              cartItem = {
                "baseInfo": baseInfo,
                "goodsInfo": goodsInfo,
                "couponList": couponList,
                "promotionInfo": promotionInfo,
              }
            } else {
              cartItem.baseInfo.count++;
              cartItem.goodsInfo.type =  (goods.type == undefined? 0:goods.type)
            }
            Util.updateCartItem(this, cartItem)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },

      gotoPay() {
        this.$log("gotoPay Enter")
        this.$log(this.datas);
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          let goods = this.datas
          let baseInfo = {
            "userId": user.userId,
            "skuId": goods.skuid,
            "mpu": goods.mpu,
            "merchantId": goods.merchantId,
            "count": 1,
            "choosed": true,
            "cartId": -1,
          }
          let goodsInfo = {
            "id": goods.id,
            "skuId": goods.skuid,
            "mpu": goods.mpu,
            "merchantId": goods.merchantId,
            "image": goods.image,
            "category": goods.category,
            "name": goods.name,
            "brand": goods.brand,
            "model": goods.model,
            "price": goods.price,
            "type": goods.type == undefined? 0:goods.type
          }
          let couponList = goods.coupon
          let promotionInfo = {
            "promotion": goods.promotion,
            "promotionState": Util.getPromotionState(this,goods)
          }
          let product = {
            "baseInfo": baseInfo,
            "goodsInfo": goodsInfo,
            "couponList": couponList,
            "promotionInfo": promotionInfo,
          }
          this.$store.commit('SET_PAY_DIRECT_PRODUCT', JSON.stringify(product));
          this.$router.push({path: '/car/pay/direct'})
          /*          this.$router.push({
                      name: "支付页",
                      params: {
                        tryPayed: tryPayed
                      }
                    })*/

        } else {
          this.$toast("没有用户信息，请先登录再购买")
        }
      },

      gotoCar() {
        this.$router.push("/car");
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .goodsAction {
    background-color: white;
    width: 100%;

    .contactServiceBtn {
      width: 10%;
      margin-top: 5px;
      color: black;
    }

    .gotoCartBtn {
      width: 10%;
      margin-top: 5px;
      color: black;
    }

    .add2CartBtn {
      background-color: #EA8F24;
      border-radius: 30px;
      height: 40px;
      line-height: 40px;
      margin: 8px 2px 2px 2px;
    }

    .buyDirectBtn {
      background-color: #EA3724;
      border-radius: 30px;
      height: 40px;
      line-height: 40px;
      margin: 8px 2px 2px 2px;
    }
  }


</style>
