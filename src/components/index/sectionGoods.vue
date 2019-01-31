<template lang="html">
  <section class="sectionGoods">
    <div>
      <van-tabs v-model="active" sticky  @click="onClick">
        <van-tab v-for="(category,index) in datas.list" :title=category.title :key="index">
          <h1 class="sectionGoods-title">
            {{ category.title }}
          </h1>  
        </van-tab>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <ul class="sectionGoods-list">
            <li v-for="(k,index) in goodsList" @click="onGoodsClick(k)" :key="index">
              <img v-lazy="k.imagePath">
              <p>{{k.intro}}</p>
              <span>￥{{k.price}}</span>
            </li>
          </ul>
        </div>
      </van-tabs>
    </div>


  </section>
</template>

<script>
  import {Lazyload} from 'mint-ui';

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
        active: 0,
        loading: false,
        finished: false,
        offset:-100,
        goodsList: [],
        busy: false,
      //  count: -1 //消抖
      };
    },
    methods: {
      loadMore: function() {
        this.$log("loadMore Enter");
        this.busy = true;
        if(this.goodsList.length > 0 && this.active < this.datas.list.length-1) {
          this.active++;
        }
        this.goodsList = this.datas.list[this.active].skus;
 /*       if(this.active < this.datas.list.length-1) {
          this.datas.list[this.active].skus.forEach(item => {
            this.goodsList.push(item);
          });
        }*/

        this.busy = false;
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS',JSON.stringify(goods));
      },
      onGoodsClick(goods) {
       // console.log("goods is:"+JSON.stringify(goods))
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            url: '/prod',
            params: {
              id: goods.skuid,
            }
          }).then((res) => {
                //console.log("current Goods:"+JSON.stringify(res.data.data.result));
                this.updateCurrentGoods(res.data.data.result);
                this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {

        }
      },
      onClick(index, title) {
        this.goodsList = this.datas.list[this.active].skus;
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .sectionGoods {
    width: 100%;
    overflow: hidden;
    .pt();

    .sectionGoods-list {
      width: 100%;
      display: -ms-flex;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: flex-start;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      overflow: hidden;

      li {
        width: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0 3vw;

        img {
          display: block;
          width: 100%;
        }

        > p {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          bottom: 0;
          left: 0;
          width: 100%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          padding: 1.2vw 2vw;
        }

        > h3 {
          padding-top: 3vw;
          .fz(font-size, 40);
        }

        > span {
          display: inline-block;
          align-content: center;
          color: #b4282d;
          padding: 1.2vw 2vw;
          .fz(font-size, 30);
        }
      }
    }

    .sectionGoods-title {
      text-align: center;
      .fz(font-size, 25);
      font-weight: bold;
      padding: 2vw;
      position: relative;
      background-color: #ffffff;
    }

    .item {
      display: inline-block;
    }

    .nav {
      padding: 10px;
    }

    .link {
      color: inherit;
      padding: 20px;
      display: block;
    }
  }
</style>
