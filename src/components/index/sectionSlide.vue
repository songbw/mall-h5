<template>
  <section class="sectionSlide">
    <mt-cell  v-if="datas.settings.title.show">
      <h1 slot="title" class="sectionSlide-title">
        {{datas.settings.title.textValue}}
      </h1>
    </mt-cell>
    <div class="sectionSlide-banner">
      <img v-lazy="datas.settings.title.imageUrl" v-if="datas.settings.title.hasImage" @click="onBannerClick(datas.settings.title.targetUrl)">
    </div>
     <!--
    <router-link :to="{name:'分类页'}" class="sectionSlide-banner">
      <img v-lazy="datas.banner">
    </router-link>
    -->
    <div class="sectionSlide-list">
      <ul>
        <li v-for="(k,index) in datas.list"  @click="onGoodsClick(k)" :key="index">
          <img v-lazy="k.imagePath">
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
    },
    methods: {
      updateCurrentGoods(goods) {
        //console.log("goods :" + JSON.stringify(goods));
        this.$store.commit('SET_CURRENT_GOODS',JSON.stringify(goods));
      },
      See(e) {
        window.location.href = e
      },
      onBannerClick(targetId) {
        console.log("onBannerClick:"+targetId);
        if(targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          console.log("id:"+id);
          this.$router.push({ path: '/index/'+id});
        } else {
          this.See(targetId);
        }
      },
      onGoodsClick(goods) {
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

  .sectionSlide-banner {
    display:block;
    width: 100%;

    img {
      display:block;
      width:100%
    }
  }

</style>
