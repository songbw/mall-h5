<template lang="html">
  <div class="detaillist">
    <v-header>
      <h1 slot="title">商品列表</h1>
      <router-link :to="{name:'购物车页'}" slot="right">
        <van-icon name="shopping-cart-o" size="1.2em"/>
      </router-link>
    </v-header>

    <van-list v-model="loading"
              :finished="finished"
              @load="onLoad">
      <li v-for="k in list" :key="k.id" style="list-style: none">
        <div class="goods-detail" @click="onListClick(k)">
          <van-card
            :price="k.price"
            desc=""
            :title="k.brand+ ' '+ k.name + ' '+ k.model"
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
        iconAdd2car: require('@/assets/images/addtoCar.png'),
      }
    },

    components: {
      'v-header': Header
    },

    methods: {
      onLoad() {
        let category = this.$route.query.category;
        let search = this.$route.query.search;

        if (category != null && category.length > 0) {
          if (this.total == -1 || this.total > this.list.length) {
            let options = {
              "category": category,
              "pageNo": this.pageNo++
            }
            this.$api.xapi({
              method: 'post',
              url: '/prod/all',
              data: options,
            }).then((response) => {
              this.result = response.data.data.result;
              this.total = this.result.total;
              this.result.list.forEach(item => {
                this.list.push(item);
              })
              this.loading = false;
              if (this.list.length >= this.total)
                this.finished = true;
            }).catch(function (error) {
              console.log(error)
              this.finished = true;
            })
          }
        } else if (search != undefined && search.length > 0) {
          let options = {
            "keyword": search,
            "pageNo": this.pageNo++
          }
          this.$api.xapi({
            method: 'post',
            url: '/es/prod',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            this.result.list.forEach(item => {
              this.list.push(item);
            })
            this.loading = false;
            if (this.list.length >= this.total)
              this.finished = true;
          }).catch(function (error) {
            console.log(error)
            this.finished = true;
          })
        } else {
          //error
          this.finished = true;
        }
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
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          this.$toast("商品已成功添加到购物车！")
        }).catch(function (error) {
          console.log(error)
        })
      },
    },

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .detaillist {
    width: 100%;
    background-color: #f0f0f0;

    .van-list {
      .van-card {
        background-color: #ffffff;
        margin-top: 1em;
        &__price {
          margin-top: 0.5em;
          .fz(font-size, 40);
        }
      }

      .goods-action {
        background-color: #ffffff;
        text-align: right;
        margin-right: 1em;
        color: #000000;

        .van-button {
          background: url('../../../assets/images/addtoCar.png') no-repeat center;
          background-size: 30px 25px;
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
