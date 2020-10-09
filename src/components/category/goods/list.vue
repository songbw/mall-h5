<template lang="html">
  <div class="detaillist">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">商品列表</h1>
    </v-header>
    <div class="box" v-if="active === 0" :style="{'top':showHeader? '2.6em':'0px'}">
      <div class="orderBySelected actived" @click="onSelectedBtnClick">
        <span>精选</span>
      </div>
      <div class="orderByPrice" @click="onPriceBtnClick">
        <span>按价格排序</span>
        <img :src="icon_select_none" alt="">
      </div>
    </div>
    <div class="box" :style="{'top':showHeader? '2.6em':'0px'}" v-else>
      <div class="orderBySelected" @click="onSelectedBtnClick">
        <span>精选</span>
      </div>
      <div class="orderByPrice actived" @click="onPriceBtnClick">
        <span>按价格排序</span>
        <img :src="icon_select_top" v-if="tagPrice === 0" alt="">
        <img :src="icon_select_btm" alt="" v-else>
      </div>
    </div>
    <div class="productList" :style="{'padding-top':showHeader? '4em':'1.5em'}">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-if="list.length > 0">
          <li v-for="k in list" :key="k.id" style="list-style: none;margin: 5px">
            <div class="goods-detail" @click="onListClick(k)">
              <van-card :price="k.price" :thumb="k.image" centered>
                <div slot="title">
                  <span class="cartTitle">
                    {{composeGoodsTitle(k)}}
                  </span>
                </div>
                <div slot="desc" v-if="k.promotion != undefined && k.promotion.length > 0">
                  <span class="description">
                    {{getPromtionPrice(k)}}
                  </span>
                </div>
              </van-card>
            </div>
            <div class="goods-action">
              <van-button size="mini" @click.stop="" @click="onAdd2carBtnClick(k)"></van-button>
            </div>
          </li>
        </div>
        <div v-else>
          <div v-if="finished && !loading" class="noGoodsList">
            <img :src="icon_empty_search" alt="">
            <span class="noGoodsList_text">暂无搜索结果...</span>
          </div>
        </div>

      </van-list>
    </div>
    <div>
      <img :src="icon_shopCart" @click="gotoCart()"
        style="width: 3rem;height: 3rem;position: fixed;bottom: 2rem;right: .5rem;z-index: 9999;" alt=""/>
    </div>
  </div>
</template>

<script>
  import Util from '../../../util/common'
  import Header from '@/common/_header.vue'

  export default {
    data() {
      return {
        pageNo: 1,
        pageSize: 30,
        total: -1,
        result: {},
        list: [],
        loading: false,
        finished: false,
        launchedLoading: false,
        showHeader: false,
        icon_shopCart: require('@/assets/icons/ico_cart-circle.png'),
        icon_select_top: require('@/assets/icons/ico_select_top.png'),
        icon_select_btm: require('@/assets/icons/ico_select_btm.png'),
        icon_select_none: require('@/assets/icons/ico_select_none.png'),
        icon_empty_search: require('@/assets/icons/ico_empty_search.png'),
        active: 0,
        tagPrice: 0, //0 升序 1 降序
        isLoadingByNewOrder: false,
      }
    },

    components: {
      'v-header': Header
    },
    created() {
      if (this.$api.IS_GAT_APP) {
        this.showHeader = false;
      }
    },
    mounted() {
      setTimeout(() => {
        if (!this.launchedLoading) {
          this.onLoad()
        }
      }, 1000);
    },

    methods: {
      getPromtionPrice(k) {
        let promotionPrice = ""
        if (k.promotion != undefined && k.promotion.length > 0) {
          promotionPrice = "活动价: ￥" + k.promotion[0].discount
        }
        return promotionPrice
      },
      reOrderList() {
        this.list.sort(function (a, b) {
          return 0
/*           if (this.$api.APP_ID == '10' || this.$api.APP_ID == '08') {
            return 0
          } else {
            try {
              if (a.merchantId == 2 && b.merchantId != 2) {
                return 1
              } else if (a.merchantId != 2 && b.merchantId == 2) {
                return -1
              } else if ((a.merchantId != 2 && b.merchantId != 2) || (a.merchantId == 2 && b.merchantId == 2)) {
                return 0
              }
            } catch (e) {
              return 0
            }
          } */
        })
      },
      resetList() {
        this.isLoadingByNewOrder = true
        this.list = [];
        this.pageNo = 1;
        this.total = -1;
        this.loading = false;
        this.finished = false;
      },
      onSelectedBtnClick() {
        if (this.active === 1) {
          this.active = 0;
          this.resetList();
          this.onLoadByOrder();
        }
      },
      onPriceBtnClick() {
        if (this.active === 0) {
          this.active = 1;
          this.resetList();
          this.onLoadByOrder();
        } else {
          if (this.tagPrice === 0) {
            this.tagPrice = 1
            this.resetList();
            this.onLoadByOrder();
          } else {
            this.tagPrice = 0
            this.resetList();
            this.onLoadByOrder();
          }
        }
      },
      gotoCart() {
        this.$router.push({
          name: '购物车页'
        })
      },
      onLoadByOrder() {
        let categories = this.$route.query.category;
        let search = this.$route.query.search;
        let that = this
        this.launchedLoading = true
        if (categories != null && categories.length > 0) {
          let categoriesArray = categories.split('_');
          this.$log(categoriesArray)

          if (this.total == -1 || this.total > this.list.length) {
            if (categoriesArray.length > 1) {
              let options = {
                "categories": categoriesArray,
                "pageNo": this.pageNo++,
                "pageSize": this.pageSize
              }
              if (this.active === 1) {
                if (this.tagPrice === 0) { //升序
                  options['priceOrder'] = "ASC"
                } else { //降序
                  options['priceOrder'] = "DESC"
                }
              }
              this.$api.xapi({
                method: 'post',
                baseURL: this.$api.PRODUCT_BASE_URL,
                url: '/prod/all/categories',
                data: options,
              }).then((response) => {
                this.result = response.data.data.result;
                this.$log(this.result)
                this.total = this.result.total;
                if (this.result.list.length == 0) {
                  this.loading = false;
                  this.isLoadingByNewOrder = false
                  this.finished = true;
                  this.list = []
                } else {
                  this.list = []
                  this.result.list.forEach(item => {
                    this.list.push(item);
                  })
                  if (this.active == 0) {
                    this.reOrderList();
                  }
                  this.loading = false;
                  this.isLoadingByNewOrder = false
                  if (this.list.length >= this.total)
                    this.finished = true;
                }
              }).catch(function (error) {
                console.log(error)
                that.loading = false;
                this.isLoadingByNewOrder = false
                that.finished = true;
                this.list = []
              })
            } else if (categoriesArray.length == 1) {
              let category = categoriesArray[0]
              let options = {
                "category": category,
                "pageNo": this.pageNo++,
                "pageSize": this.pageSize
              }
              if (this.active === 1) {
                if (this.tagPrice === 0) { //升序
                  options['priceOrder'] = "ASC"
                } else { //降序
                  options['priceOrder'] = "DESC"
                }
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
                if (this.result.list.length == 0) {
                  this.loading = false;
                  this.isLoadingByNewOrder = false
                  this.finished = true;
                  this.list = []
                } else {
                  this.list = []
                  this.result.list.forEach(item => {
                    this.list.push(item);
                  })
                  if (this.active == 0) {
                    this.reOrderList();
                  }
                  this.loading = false;
                  this.isLoadingByNewOrder = false
                  if (this.list.length >= this.total)
                    this.finished = true;
                }
              }).catch(function (error) {
                console.log(error)
                that.loading = false;
                this.isLoadingByNewOrder = false
                that.finished = true;
                this.list = []
              })
            } else {
              that.loading = false;
              this.isLoadingByNewOrder = false
              that.finished = true;
              this.list = []
            }
          }
        } else if (search != undefined && search.length > 0) {
          let options = {
            "keyword": search,
            "pageNo": this.pageNo++,
            "pageSize": this.pageSize
          }
          if (this.active === 1) {
            if (this.tagPrice === 0) { //升序
              options['priceOrder'] = "ASC"
            } else { //降序
              options['priceOrder'] = "DESC"
            }
          }
          this.$api.xapi({
            method: 'post',
            baseURL: this.$api.ES_BASE_URL,
            url: '/es/prod',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            if (this.result.list == undefined || this.result.list.length == 0) {
              this.loading = false;
              this.isLoadingByNewOrder = false
              this.finished = true;
              this.list = []
            } else {
              this.list = []
              this.result.list.forEach(item => {
                this.list.push(item);
              })
              if (this.active == 0) {
                this.reOrderList();
              }
              this.loading = false;
              this.isLoadingByNewOrder = false
              if (this.list.length >= this.total)
                this.finished = true;
            }
          }).catch(function (error) {
            console.log(error)
            that.loading = false;
            this.isLoadingByNewOrder = false
            that.finished = true;
          })
        } else {
          //error
          this.loading = false;
          this.isLoadingByNewOrder = false
          this.finished = true;
        }
      },
      onLoad() {
        let categories = this.$route.query.category;
        let search = this.$route.query.search;
        let that = this
        this.launchedLoading = true
        if (this.isLoadingByNewOrder)
          return
        if (categories != null && categories.length > 0) {
          let categoriesArray = categories.split('_');
          this.$log(categoriesArray)
          if (this.total == -1 || this.total > this.list.length) {
            if (categoriesArray.length > 1) {
              let options = {
                "categories": categoriesArray,
                "pageNo": this.pageNo++,
                "pageSize": this.pageSize
              }
              if (this.active === 1) {
                if (this.tagPrice === 0) { //升序
                  options['priceOrder'] = "ASC"
                } else { //降序
                  options['priceOrder'] = "DESC"
                }
              }
              this.$api.xapi({
                method: 'post',
                baseURL: this.$api.PRODUCT_BASE_URL,
                url: '/prod/all/categories',
                data: options,
              }).then((response) => {
                this.result = response.data.data.result;
                this.$log(this.result)
                this.total = this.result.total;
                if (this.result.list.length == 0) {
                  this.loading = false;
                  this.finished = true;
                } else {
                  this.result.list.forEach(item => {
                    this.list.push(item);
                  })
                  if (this.active == 0) {
                    this.reOrderList();
                  }
                  this.loading = false;
                  if (this.list.length >= this.total)
                    this.finished = true;
                }
              }).catch(function (error) {
                console.log(error)
                that.loading = false;
                that.finished = true;
              })
            } else if (categoriesArray.length == 1) {
              let category = categoriesArray[0]
              let options = {
                "category": category,
                "pageNo": this.pageNo++,
                "pageSize": this.pageSize
              }
              if (this.active === 1) {
                if (this.tagPrice === 0) { //升序
                  options['priceOrder'] = "ASC"
                } else { //降序
                  options['priceOrder'] = "DESC"
                }
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
                if (this.result.list.length == 0) {
                  this.loading = false;
                  this.finished = true;
                } else {
                  this.result.list.forEach(item => {
                    this.list.push(item);
                  })
                  if (this.active == 0) {
                    this.reOrderList();
                  }
                  this.loading = false;
                  if (this.list.length >= this.total)
                    this.finished = true;
                }
              }).catch(function (error) {
                console.log(error)
                that.loading = false;
                that.finished = true;
              })
            }
          } else {
            that.loading = false;
            that.finished = true;
          }
        } else if (search != undefined && search.length > 0) {
          let options = {
            "keyword": search,
            "pageNo": this.pageNo++,
            "pageSize": this.pageSize
          }
          if (this.active === 1) {
            if (this.tagPrice === 0) { //升序
              options['priceOrder'] = "ASC"
            } else { //降序
              options['priceOrder'] = "DESC"
            }
          }
          this.$api.xapi({
            method: 'post',
            baseURL: this.$api.ES_BASE_URL,
            url: '/es/prod',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            if (this.result.list == undefined || this.result.list.length == 0) {
              this.loading = false;
              this.finished = true;
            } else {
              this.result.list.forEach(item => {
                this.list.push(item);
              })
              if (this.active == 0) {
                this.reOrderList();
              }
              this.loading = false;
              if (this.list.length >= this.total)
                this.finished = true;
            }
          }).catch(function (error) {
            console.log(error)
            that.loading = false;
            that.finished = true;
          })
        } else {
          //error
          this.loading = false;
          this.finished = true;
        }
      },
      composeGoodsTitle(goods) {
        return goods.name
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      onListClick(goods) {
        this.$log("onListClick Enter")
        let mpu = goods.mpu
        if (mpu == null) {
          mpu = goods.skuid;
        }
        this.$router.push({
          path: "/detail",
          query: {
            mpu: mpu
          }
        });
        /*        try {
                  this.$api.xapi({
                    method: 'get',
                    baseURL: this.$api.PRODUCT_BASE_URL,
                    url: '/prod',
                    params: {
                      mpu: mpu,
                    }
                  }).then((res) => {
                    this.updateCurrentGoods(res.data.data.result);
                    this.$router.push("/detail");
                  }).catch((error) => {
                    console.log(error)
                  })
                } catch (e) {

                }*/
      },
      onAdd2carBtnClick(goods) {
        //this.$log("onAdd2carBtnClick Enter",goods)
        let userInfo = this.$store.state.appconf.userInfo;
        //this.$log("userInfo:" + userInfo);
        if (!Util.isUserEmpty(userInfo)) {
          this.add2Car(userInfo, goods);
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },
      gotoGoodsPage(mpu) {
        this.$router.push({
          path: "/detail",
          query: {
            mpu: mpu
          }
        });
      },
      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        let userId = user.userId;
        let that = this
        let mpu = goods.mpu;
        let skuId = goods.skuId
        if (goods.skuid != undefined)
          skuId = goods.skuid
        if (mpu != skuId) {
          this.gotoGoodsPage(mpu)
        } else {
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
            if (response.data.code == 200) {
              this.$toast("添加到购物车成功！")
              let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
              if (cartItem == null) {
                let baseInfo = {
                  "userId": user.userId,
                  "skuId": skuId,
                  "mpu": goods.mpu,
                  "merchantId": goods.merchantId,
                  "count": 1,
                  "choosed": true,
                  "cartId": this.result,
                }
                let goodsInfo = {
                  "id": goods.id,
                  "skuId": skuId,
                  "mpu": goods.mpu,
                  "merchantId": goods.merchantId,
                  "image": goods.image,
                  "category": goods.category,
                  "name": goods.name,
                  "brand": goods.brand,
                  "model": goods.model,
                  "price": goods.price,
                  "checkedPrice": goods.price,
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
                cartItem.baseInfo.count++;
                cartItem.goodsInfo.type = (goods.type == undefined ? 0 : goods.type)
              }
              Util.updateCartItem(this, cartItem)
            }
          }).catch(function (error) {
            console.log(error)
          })
        }
      }
    },
  }

</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .detaillist {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    top: 0px;
    background-color: #f8f8f8;

    .box {
      width: 100%;
      position: fixed;
      z-index: 5;
      background-color: #ff4444;
      display: flex;
      color: #ffcccc;

      .actived {
        color: white;
      }

      .orderBySelected {
        width: 50%;
        display: flex;
        justify-content: center;

        span {
          margin: 4px;
          .fz(font-size, 30);
        }
      }

      .orderByPrice {
        width: 50%;
        display: flex;
        justify-content: center;

        span {
          margin: 4px;
          .fz(font-size, 30);
        }

        img {
          width: 18px;
          height: 18px;
          margin: 6px;
        }
      }
    }

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .productList {
      .noGoodsList {
        width: 100%;
        background-color: #f8f8f8;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;
        height: 500px;

        img {
          height: 130px;
          width: 130px;
        }

        span {
          margin: 2vw;
        }

        .noGoodsList_text {
          font-weight: lighter;
          color: black;
          .fz(font-size, 35);
        }
      }

      .van-list {
        margin-top: 5px;
        background-color: #f8f8f8;

        .van-card {
          background-color: #ffffff;
          margin-top: 1em;

          &__price {
            margin-top: 0.5em;
            .fz(font-size, 35);
          }

          .cartTitle {
            .fz(font-size, 25);
            min-height: 2rem;
            overflow: hidden;
            margin-bottom: 2px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
            bottom: 0;
            left: 0;
            width: 100%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #000000;
            text-shadow: 0px 0px #000;
          }

          .description {
            margin-left: -2px;
            color: #ff4444;
            background-color: #fff1f1;
            border: 1px solid #f2b6b8;
            border-radius: 3px;
            padding: 2px 5px;
            font-size: xx-small;
          }
        }

        .goods-action {
          background-color: #ffffff;
          text-align: right;
          color: #000000;
          margin-top: -3.0em;
          width: 5em;
          float: right;
          z-index: 1;

          .van-button {
            // background-color: #ff4444;
            background: url('../../../assets/icons/ico_add_cart.png') no-repeat center;
            background-size: 20px 20px;
            padding: 20px 30px;
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


  }

</style>
