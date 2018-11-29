<template>
  <section class="sectionSlide">
    <mt-cell>
      <h1 slot="title" class="sectionSlide-title">
        {{datas.headTitle}}
      </h1>
      <i class="icon-right" v-show="datas.headMore === 1"></i>
    </mt-cell>
    <div class="sectionSlide-list">
      <ul>
        <li v-for="k in datas.list" :key="k.id">
          <router-link :to="{name:'详情页'}">
            <img v-lazy="k.imgPath">
          </router-link>
          <h2 class="sectionSlide-list-title ac">
            {{k.title}}
          </h2>
          <p class="sectionSlide-list-intro">
            {{k.intro}}
          </p>
          <p class="sectionSlide-list-price">
            ￥{{k.price}}
          </p>
        </li>
      </ul>
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
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .sectionSlide-title {
    .bt();
    text-align: left;
    .fz(font-size, 40);
    font-weight: bold;
    padding: 2vw;
    position: relative;
    background-color: #ffffff;
  }

  .sectionSlide-list {
    overflow-x: auto;
    width: 100%;
    .pt();
    /*原生滑动*/
    -webkit-overflow-scrolling: touch;

    > ul {
      .bt();
      display: -ms-flex;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      padding: 0vw;
      width: 100%;

      li {
        margin-right: 5vw;
        width: 26vw;

        a,
        img {
          display: block;
          width: 100%;
        }

        h2,
        p {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        h2 {
          .fz(font-size, 30);
          padding-top: 2vw;
          color: #333;
        }

        p.sectionSlide-list-intro {
          padding-top: 1vw;
          .fz(font-size, 26);
          color: rgb(0, 0, 0);
        }

        p.sectionSlide-list-price {
          color: #b4282d;
        }
      }
    }
  }

</style>
