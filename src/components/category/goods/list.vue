<template lang="html">
  <div class="detaillist">
    <v-header class="header">
      <h1 slot="title">商品列表</h1>
      <router-link :to="{name:'购物车页'}" slot="right">
        <van-icon color="white" name="shopping-cart-o" size="1.2em"/>
      </router-link>
    </v-header>
    <van-list v-model="loading"
              :finished="finished"
              @load="onLoad">
      <li v-for="k in list" :key="k.id" style="list-style: none">
        <div class="goods-detail" @click="onListClick(k)">
          <van-card
            :price="k.price"
            desc="南京"
            :title=composeGoodsTitle(k)
            :thumb="k.image"
            centered>
          </van-card>
        </div>
        <div class="goods-action">
          <van-button size="mini" @click="onAdd2carBtnClick(k)"></van-button>
        </div>
      </li>
    </van-list>
  </div>
</template>

<script>
  import Util from '../../../util/common'
  import Header from '@/common/_header.vue'

  export default {
    data() {
      return {
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        loading: false,
        finished: false,
        launchedLoading: false
      }
    },

    components: {
      'v-header': Header
    },

    mounted() {
      setTimeout(() => {
        if(!this.launchedLoading) {
          this.onLoad()
        }
      }, 1000);
    },

    methods: {
      onLoad() {
        let category = this.$route.query.category;
        let search = this.$route.query.search;
        let that = this
        this.launchedLoading = true
        if (category != null && category.length > 0) {
          if (this.total == -1 || this.total > this.list.length) {
            let options = {
              "category": category,
              "pageNo": this.pageNo++
            }
            this.$api.xapi({
              method: 'post',
              baseURL: this.$api.PRODUCT_BASE_URL,
              url: '/prod/all',
              data: options,
            }).then((response) => {
              this.result = response.data.data.result;
              this.$log(this.result)
              this.total = this.result.total;
              if(this.result.list.length == 0) {
                this.loading = false;
                this.finished = true;
              } else {
                this.result.list.forEach(item => {
                  this.list.push(item);
                })
                this.loading = false;
                if (this.list.length >= this.total)
                  this.finished = true;
              }
            }).catch(function (error) {
              console.log(error)
              that.finished = true;
            })
          }
        } else if (search != undefined && search.length > 0) {
          let options = {
            "keyword": search,
            "pageNo": this.pageNo++
          }
          this.$api.xapi({
            method: 'post',
        //    baseURL: this.$api.PRODUCT_BASE_URL,
            url: '/es/prod',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            if(this.result.list == undefined || this.result.list.length == 0) {
              this.loading = false;
              this.finished = true;
            } else {
              this.result.list.forEach(item => {
                this.list.push(item);
              })
              this.loading = false;
              if (this.list.length >= this.total)
                this.finished = true;
            }
          }).catch(function (error) {
            console.log(error)
            that.finished = true;
          })
        } else {
          //error
          this.finished = true;
        }
      },
      composeGoodsTitle(goods) {
         return  goods.name
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      onListClick(goods) {
        this.updateCurrentGoods(goods);
        this.$router.push("/detail");
      },
      onAdd2carBtnClick(goods) {
        //this.$log("onAdd2carBtnClick Enter",goods)
        let userInfo = this.$store.state.appconf.userInfo;
        //this.$log("userInfo:" + userInfo);
        if (!this.isUserEmpty(userInfo)) {
          this.add2Car(userInfo, goods);
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length == 0)
      },

      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let skuId = goods.skuid;
        let addtoCar = {
          "openId": userId,
          "skuId": skuId
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          this.$log("xxxxxxxxxxxxxxxxxxx")
          this.$log(this.result)
          this.$toast("添加到购物车成功！")
          let cartItem = Util.getCartItem(this, user.userId, goods.skuid)
          if (cartItem == null) {
            let baseInfo = {
              "userId": user.userId,
              "skuId": goods.skuid,
              "count": 1,
              "choosed": true,
              "cartId": this.result,
            }
            let goodsInfo = {
              "id": goods.id,
              "skuId": goods.skuid,
              "image": goods.image,
              "category": goods.category,
              "name": goods.name,
              "brand": goods.brand,
              "model": goods.model,
              "price": goods.price,
              "checkedPrice": goods.price
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
            let found = -1;
            for (let i = 0; i < cartItem.couponList.length; i++) {
              if (cartItem.couponList[i].coupon.couponInfo.id == this.coupon.couponInfo.id) {
                found = i;
                break;
              }
            }
            if (found != -1) {
              cartItem.couponList.splice(found, 1)
            }
            cartItem.couponList.push(this.coupon.couponInfo)
          }
          Util.updateCartItem(this, cartItem)
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .detaillist {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .header{
      width:100%;
      position:fixed;
      z-index:5;
      top:0;
    }
    .van-list {
      padding-top: 2.3em;
      background-color: #f8f8f8;
      .van-card {
        background-color: #ffffff;
        margin-top: 1em;
        &__price {
          margin-top: 0.5em;
          margin-top: 18px;
          .fz(font-size, 35);
        }
      }

      .goods-action {
        background-color: #ffffff;
        text-align: right;
        margin-right: 1em;
        color: #000000;
        margin-top: -2em;

        .van-button {
          background: url('../../../assets/icons/ico_add_cart.png') no-repeat center;
          background-size: 25px 25px;
          border: none;
        }

        .van-button:active {
          opacity: 0;
        }

        img {
          width: 30px;
          height: 25px;
        }
      }
    }

  }
</style>
