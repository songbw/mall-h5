<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px'}">
    <div class="section0-list">
      <ul>
        <li v-for="k in datas.list.slice(0,5)" @click="onClick(k.targetUrl)">
          <img v-lazy="k.imageUrl">
          <h2>
            {{k.name}}
          </h2>
        </li>
      </ul>
    </div>
    <div class="section1-list" v-if="datas.list.length > 5">
      <ul class="ul_left">
        <li v-for="k in datas.list.slice(5,10)" @click="onClick(k.targetUrl)">
          <img v-lazy="k.imageUrl">
          <h2>
            {{k.name}}
          </h2>
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
    },
    methods: {
      onClick(targetId) {
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({path: '/index/' + id});
          // this.$router.push({ path: '/index/23'});
        } else if (targetId.startsWith("route://")) {
          let target = targetId.substr(8);
          if (target === 'category') {
            this.$router.push({path: '/category'})
          }
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

  .section0-list {
    ul {
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      padding-top: 3vw;

      li {
        padding: 1vw;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 20vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;
        a,
        img {
          width: 100%;
          display: block;
        }

        h2 {
          .fz(font-size, 28);
          color: #333;
          padding: 2vw 1.2vw;
          overflow: hidden;
          word-break:keep-all;
          white-space:nowrap;
        }
      }
    }
  }

  .section1-list {
    ul {
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      padding-top: 3vw;

      li {
        padding: 1vw;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 20vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;
        a,
        img {
          width: 100%;
          display: block;
        }

        h2 {
          .fz(font-size, 28);
          color: #333;
          padding: 2vw 1.2vw;
          word-break:keep-all;
          white-space:nowrap;
        }
      }
    }
  }
</style>
