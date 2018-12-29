<template lang="html">
  <section class="sectionGoods">
    <div>
      <van-tabs v-model="active" sticky  @click="onClick">
        <van-tab v-for="category in datas.list" :title=category.title>
          <h1 class="sectionGoods-title">
            {{ category.title }}
          </h1>  
          <van-list v-model="loading"
                    :finished="finished"
                    :offset="offset"
                    @load="onLoad">
            <ul class="sectionGoods-list">
              <li v-for="k in category.goods" :key='k.id'>
                <router-link :to="{name:'详情页'}">
                  <img v-lazy="k.imgPath">
                </router-link>
                <p>{{k.intro}}</p>
                <!--
                <h3>{{k.title}}</h3>
                -->
                <span>￥{{k.price}}</span>
              </li>
            </ul>
          </van-list>
        </van-tab>
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
        offset:-100
      };
    },
    methods: {
      onClick(index, title) {
        if (this.active < this.datas.list.length - 1)
          this.finished = false;
        else
          this.finished = true;
      },
      onLoad() {
        setTimeout(() => {
          this.loading = false;
          let i = this.active;
          if (this.active < this.datas.list.length - 1) {
            this.active = i + 1;
            if (this.active == this.datas.list.length - 1) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
        }, 200);
      }
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

        > a {
          display: block;
          width: 100%;
          position: relative;

          img {
            display: block;
            width: 100%;
          }

          > p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: gold;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 1.2vw 2vw;
          }
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
      .bt();
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
