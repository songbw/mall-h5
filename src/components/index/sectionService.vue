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
      See(e) {
        window.location.href = e
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      gotoGoodsPage(skuid) {
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            url: '/prod',
            params: {
              id: skuid,
            }
          }).then((res) => {
            this.updateCurrentGoods(res.data.data.result);
            this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {
        }
      },
      onClick(targetId) {
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({path: '/index/' + id});
        } else if (targetId.startsWith("route://")) {
          let target = targetId.substr(8);
          let paths = target.split("/");
          this.$log(paths);
          if (paths[0] === 'category') {
            this.$router.push({path: '/category'})
          } else if (paths[0] === 'commodity') {
            try {
              if (paths[1] != null)
                this.gotoGoodsPage(paths[1]);
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
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
    width: 100%;
    white-space: nowrap;

    ul {
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      padding-top: 3vw;

      li {
        padding: 1vw;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 20%;
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
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
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
        width: 20%;
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
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
  }
</style>
