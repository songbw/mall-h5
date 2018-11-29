<template lang="html">
  <section class="sectionSquared">
    <mt-cell>
      <h1 slot="title" class="sectionSquared-title">
        {{datas.headTitle}}
      </h1>
      <i class="icon-right" v-show="datas.headMore===1" @click="See('http://www.baidu.com')"></i>
    </mt-cell>
    <li v-for="item in datas.list" style="list-style: none">
      <ul class="sectionSquared-list">
        <li v-for="k in item" :key="k.id">
          <router-link :to="{name:'详情页'}">
            <img v-lazy="k.imgPath" alt="">
          </router-link>
        </li>
      </ul>
    </li>
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
    methods: {
      See(e) {
        window.location.href = e
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .sectionSquared-title {
    .bt();
    text-align: left;
    .fz(font-size, 40);
    font-weight: bold;
    padding: 2vw;
    position: relative;
    background-color: #ffffff;
  }

  .sectionSquared-list {
    display: -ms-flex;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    list-style: none;

    li:first-child:nth-last-child(1) {
      /* -或者可以使用- li:only-child { */
      width: 100%;
    }

    /* 两个元素时 */

    li:first-child:nth-last-child(2),
    li:first-child:nth-last-child(2) ~ li {
      width: 50%;
    }

    /* 三个元素时 */

    li:first-child:nth-last-child(3),
    li:first-child:nth-last-child(3) ~ li {
      width: 33.3333%;
    }

    /* 四个元素时 */

    li:first-child:nth-last-child(4),
    li:first-child:nth-last-child(4) ~ li {
      width: 25%;
    }

    li {
      width: 25%;
      padding: 1vw;
      list-style: none;
      display: inline-block; //使li对象显示为一行
      img {
        width: 100%;
        display: block;
      }
    }
  }

</style>
