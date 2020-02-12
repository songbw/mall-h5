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
        :goods="goods_info"
        :goods-id="goods_id"
        :hide-stock="sku.hide_stock"
        :initial-sku="initialSku"
        reset-stepper-on-hide
        reset-selected-sku-on-hide
        disable-stepper-input
        :close-on-click-overlay="closeOnClickOverlay"
        :custom-sku-validator="customSkuValidator"
        @buy-clicked="onBuyClicked"
        @add-cart="onAddCartClicked"
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
        sku: null,
        initialSku: null,
        goods_info: null,
        goods_id: "",
        showCustom: false,
        showStepper: false,
        closeOnClickOverlay: true,  //点击空白处关闭购物框
        customSkuValidator: () => '请正确选择商品规格'
      }
    },

    computed: {
      cartListCount() {
        let count = this.$store.state.appconf.cartList.length
        return count
      }
    },

    watch: {
      cartListCount(newValue, oldVal) {
        if (newValue > 99)
          this.cartNumber = 99
        else
          this.cartNumber = newValue
      },
      async datas(newValue, oldVal) {
        this.$log("datas changed @@@@@@@@@@@@@@@@@@@")
        this.$log(newValue)
        if (newValue != null) {
          this.goods_info = {
            // 商品标题
            title: this.datas.name,
            // 默认商品 sku 缩略图
            picture: this.datas.image
          }
          this.goods_id = this.datas.mpu
          if (this.datas.skuList != undefined && this.datas.skuList.length > 0) {
            let tree = [];
            let list = [];
            try {
              let response = await this.getInventory()
              this.$log(response)
              if (response.data.code === 200) {
                let ret = response.data.data.skuInvList;
                this.datas.skuList.forEach(sku => {
                  sku['stock_num'] = 0
                  this.$log(ret)
                  if(sku.status == 1) {
                    for (let i = 0; i < ret.length; i++) {
                      if (ret[i].code === sku.code) {
                        sku.stock_num = ret[i].inventoryCount
                        break;
                      }
                    }
                  }
                })
              }
            } catch (e) {
            }
            this.datas.skuList.forEach(sku => {
              sku.propertyList.forEach(property => {
                let foundKey = -1;
                for (let i = 0; i < tree.length; i++) {
                  if (tree[i].k == property.name) {
                    foundKey = 1;
                    let foundVal = -1;
                    for (let j = 0; j < tree[i].v.length; j++) {
                      if (tree[i].v[j].name == property.val) {
                        foundVal = 1;
                        break;
                      }
                    }
                    if (foundVal != -1) {
                      let propertyCount = tree[i].v.tree[i].length + 1;
                      tree[i].v.push({
                        id: tree[i].k_id + propertyCount,
                        name: property.val,
                        imgUrl: sku.goodsLogo
                      })
                    }
                    break;
                  }
                }
                let num = tree.length + 1
                if (foundKey == -1) {//新的属性
                  tree.push({
                    k: property.name,
                    k_id: "" + num,
                    v: [
                      {
                        id: num + "1",
                        name: property.val,
                        imgUrl: sku.goodsLogo
                      }
                    ],
                    k_s: 's' + num,
                  })
                }
              })
            })
            let total_stock_num = 0
            this.$log(this.datas.skuList)
            this.datas.skuList.forEach(sku => {
              let item = {
                id: sku.code,
                price: sku.price,
                s1: '0',
                s2: '0',
                s3: '0',
                s4: '0',
                s5: '0',
                stock_num: sku.stock_num,
                goods_id: this.datas.mpu
              }
              sku.propertyList.forEach(property =>{
                 for(let i =0;i < tree.length; i++) {
                   if(tree[i].k === property.name) {
                     this.$log(tree[i])
                     for(let j=0; j < tree[i].v.length; j++) {
                       if(tree[i].v[j].name === property.val){
                         item[tree[i].k_s]  = tree[i].v[j].id
                         break;
                       }
                     }
                   }
                 }
              })
              total_stock_num += item.stock_num
              list.push(item)
            })
            this.$log("!!!!!!!!!!!!!!!!!!!!!!!")
            tree.forEach(item => {
              item['count'] = item.v.length
            })
            this.sku = {
              // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
              // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
              tree: tree,
              list: list,
              price: parseFloat(this.datas.price).toFixed(2),
              stock_num: total_stock_num, // 商品总库存
              none_sku: false,  // 是否无规格商品 false正常显示那些可供选择的标准，此处是颜色和尺寸
              hide_stock: false,  // 是否隐藏剩余库存 false正常显示剩余多少件的那个库存
            }
            this.$log(this.sku)
            if(list.length > 0) {
              this.initialSku = {
                s1: list[0].s1,
                s2: list[0].s2,
                s3: list[0].s3,
                s4: list[0].s4,
                s5: list[0].s5,
                selectedNum: 1 //下面的数字选择框的数字即买了多少件
              }
              this.$log(this.initialSku)
            }
          }
        }
      }
    },

    created() {
      if (this.$store.state.appconf.cartList != undefined) {
        this.cartNumber = this.$store.state.appconf.cartList.length
      }
    },

    beforeDestroy() {
      this.hideMeqiaPanel()
    },

    methods: {
      getInventory() {
        this.$log("getInventory Enter")
        let codesArray = []
        this.datas.skuList.forEach(sku => {
          codesArray.push(sku.code)
        })
        let codes = codesArray.join(",");
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.AOYIS_CONFIG_URL,
          url: '/star/product/inventory',
          data: {
            codes: codes
          },
        })
      },
      onBuyClicked(skuData) {
        this.$log("onBuyClicked Enter")
        this.$log(skuData)
        if (skuData != undefined) {
          let selectSkuId = skuData.selectedSkuComb.id
          let stock_num = skuData.selectedSkuComb.stock_num
          if(stock_num > 0) {
            let selectPrice = parseFloat((skuData.selectedSkuComb.price/100).toFixed(2))
            let userInfo = this.$store.state.appconf.userInfo;
            if (!Util.isUserEmpty(userInfo)) {
              let user = JSON.parse(userInfo);
              let goods = this.datas
              let baseInfo = {
                "userId": user.userId,
                "skuId": selectSkuId,
                "mpu": goods.mpu,
                "merchantId": goods.merchantId,
                "count": skuData.selectedNum,
                "choosed": true,
                "cartId": -1,
              }
              let goodsInfo = {
                "id": goods.id,
                "skuId": selectSkuId,
                "mpu": goods.mpu,
                "merchantId": goods.merchantId,
                "image": goods.image,
                "category": goods.category,
                "name": goods.name,
                "brand": goods.brand,
                "model": goods.model,
                "price": selectPrice,
                "type": goods.type == undefined ? 0 : goods.type
              }
              let couponList = goods.coupon
              let promotionInfo = {
                "promotion": goods.promotion,
                "promotionState": Util.getPromotionState(this, goods)
              }
              let product = {
                "baseInfo": baseInfo,
                "goodsInfo": goodsInfo,
                "couponList": couponList,
                "promotionInfo": promotionInfo,
              }
              this.$store.commit('SET_PAY_DIRECT_PRODUCT', JSON.stringify(product));
              this.$router.push({path: '/car/pay/direct'})
            } else {
              this.$toast("没有用户信息，请先登录再购买")
            }
          } else {
            this.$toast("库存不足，无法购买该商品")
          }

        }
      },
      onAddCartClicked(skuData) {
        this.$log("onAddCartClicked Enter")
        this.$log(skuData)
        if (skuData != undefined) {
          let selectSkuId = skuData.selectedSkuComb.id
          let stock_num = skuData.selectedSkuComb.stock_num
          if(stock_num > 0) {
            let userInfo = this.$store.state.appconf.userInfo;
            if (!Util.isUserEmpty(userInfo)) {
              this.add2Car(userInfo, this.datas, skuData);
            } else {
              this.$toast("没有用户信息，请先登录,再添加购物车")
            }
          } else {
            this.$toast("库存不足，无法购买该商品")
          }

        }
      },
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
      showMeqiaPanel() {
        let userInfo = this.$store.state.appconf.userInfo;
        let userDetail = this.$store.state.appconf.userDetail;
        let userName = ""
        let userId = ""
        let telePhone = ""
        if (!Util.isUserEmpty(userInfo)) {
          let UserInfo = JSON.parse(userInfo)
          userId = UserInfo.userId
        }
        if (userDetail.length > 0) {
          let UserDetail = JSON.parse(userDetail)
          userName = UserDetail.nickname
          telePhone = UserDetail.telephone
        }
        _MEIQIA('showPanel')
        _MEIQIA('metadata', {
          name: userName, // 美洽默认字段
          tel: telePhone,
          '渠道': this.getClientName(), // 自定义字段
          '用户ID': userId,
          '当前URL': window.location.href,
          '订单号': ''
        });
      },
      hideMeqiaPanel() {
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
        this.$log(this.datas)
        if (!Util.isUserEmpty(userInfo)) {
          if(this.datas.state === '0') {
            this.$toast("该商品已下架")
          } else {
            if (this.datas.skuList != undefined && this.datas.skuList.length > 0) {
              this.showBase = true;
            } else {
              this.add2Car(userInfo, this.datas);
            }
          }
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },

      add2Car(userInfo, goods, skuData) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let mpu = goods.mpu;
        let count = 1;
        let selectSkuId = mpu
        let selectPrice = goods.price
        if (skuData != undefined) {
          selectSkuId = skuData.selectedSkuComb.id
          selectPrice = parseFloat((skuData.selectedSkuComb.price/100).toFixed(2))
          count = skuData.selectedNum
        }
        let addtoCar = {
          "openId": userId,
          "mpu": mpu,
          "skuId": selectSkuId,
          "count": count
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          if (response.data.code == 200) {
            this.$toast("添加到购物车成功！")
            let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
            if (cartItem == null) {
              let baseInfo = {
                "userId": user.userId,
                "skuId": selectSkuId,
                "mpu": goods.mpu,
                "merchantId": goods.merchantId,
                "count": count,
                "choosed": true,
                "cartId": this.result,
              }
              let goodsInfo = {
                "id": goods.id,
                "skuId": selectSkuId,
                "mpu": goods.mpu,
                "merchantId": goods.merchantId,
                "image": goods.image,
                "category": goods.category,
                "name": goods.name,
                "brand": goods.brand,
                "model": goods.model,
                "price": selectPrice,
                "checkedPrice": selectPrice,
                "type": goods.type == undefined ? 0 : goods.type
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
              cartItem.baseInfo.count = count + cartItem.baseInfo.count;
              cartItem.goodsInfo.type = (goods.type == undefined ? 0 : goods.type)
            }
            Util.updateCartItem(this, cartItem)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },

      gotoPay() {
        this.$log("gotoPay Enter")
        if (this.datas.skuList != undefined && this.datas.skuList.length > 0) {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
            if(this.datas.state === '0') {
              this.$toast("该商品已下架")
            } else {
              this.showBase = true;
            }
          } else {
            this.$toast("没有用户信息，请先登录再购买")
          }

        } else {
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
              "type": goods.type == undefined ? 0 : goods.type
            }
            let couponList = goods.coupon
            let promotionInfo = {
              "promotion": goods.promotion,
              "promotionState": Util.getPromotionState(this, goods)
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
