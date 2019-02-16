<template lang="html">
  <section class="sectionSquared">
    <mt-cell v-if="datas.settings.title.show">
      <h1 slot="title" class="sectionSquared-title">
        {{datas.settings.title.text.value}}
      </h1>
      <i class="icon-right" v-if="(datas.settings.title.text.hasLink===true)"
         @click="See(datas.settings.title.text.linkUrl)"></i>
    </mt-cell>
    <li v-for="item in datas.list" style="list-style: none">
      <ul class="sectionSquared-list">
        <li v-for="k in item.grids">
          <img v-lazy="k.imageUrl" @click="onClick(k.targetUrl)">
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
      },
      onClick(targetId) {
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({path: '/index/' + id});
        } else {
          this.See(targetId);
        }
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .sectionSquared-title {
    text-align: left;
    .fz(font-size, 40);
    font-weight: bold;
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
