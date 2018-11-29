<template>
  <div class="section0-list">
    <ul>
      <li v-for="k in datas.list" :key="k.id">
        <router-link :to="{name: k.urlPathName}">
          <img v-lazy="k.imgPath">
        </router-link>
        <h2 class="ac">
          {{k.title}}
        </h2>
      </li>
    </ul>
  </div>
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

  .section0-list {
    overflow-x: auto;
    display: -ms-flex;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    padding: 0 2vw 0 2vw;

    ul {
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      justify-content: space-around;
      padding-top: 3vw;

      li {
        width: 50%;
        padding: 1vw;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;

        a,
        img {
          width: 100%;
          display: block;
        }

        h2 {
          .fz(font-size, 30);
          color: #333;
        }
      }
    }
  }
</style>
