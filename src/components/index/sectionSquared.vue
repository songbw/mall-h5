<template lang="html">
  <section class="sectionSquared"
           :style="{'margin-bottom': datas.settings.marginBottom+'px'}">
    <div class="squaredBody">
      <div v-if="datas.settings.title.show">
        <div v-if="datas.settings.title.text.hasLink">
          <van-cell :is-link="datas.settings.title.text.hasLink"
                    :value="datas.settings.title.text.linkTitle"
                    :url="datas.settings.title.text.linkUrl">
            <h1 slot="title" class="sectionSquared-title" :style="{'text-align': datas.settings.title.text.align}">
              {{datas.settings.title.text.value}}
            </h1>
          </van-cell>
        </div>
        <div v-else>
          <van-cell>
            <h1 slot="title" class="sectionSquared-title" :style="{'text-align': datas.settings.title.text.align}">
              {{datas.settings.title.text.value}}
            </h1>
          </van-cell>
        </div>
      </div>
      <div v-for="item in datas.list">
        <ul class="sectionSquared-list">
          <li v-for="k in item.grids">
            <img v-lazy="k.imageUrl" @click="onClick(k.targetUrl)" alt="">
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: ['datas', 'mBackgroundColor'],
    methods: {
      See(e) {
        window.location.href = e
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      gotoPromotionPage(promotionId) {
        this.$router.push({path: '/category/goods/promotion/' + promotionId});
      },
      gotoGoodsPage(mpu) {
        this.$router.push({path:"/detail",query:{
            mpu:mpu
          }});
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
          } else  if (paths[0] === 'coupon_center') {
            this.$router.push({path:'/user/couponCenter'})
          } else if (paths[0] === 'commodity') {
            try {
              if (paths[1] != null)
                this.gotoGoodsPage(paths[1]);
            } catch (e) {
            }
          } else if (paths[0] === 'promotion') {
            try {
              if (paths[1] != null) {
                //this.gotoGoodsPage(paths[1]);
                //this.$log("promotion:"+paths[1])
                this.gotoPromotionPage(paths[1]);
              }
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("https://") || targetId.startsWith("http://")) {
          this.See(targetId);
        }
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .squaredBody {
    background-color: transparent;

    .sectionSquared-title {
      .fz(font-size, 40);
      font-weight: bold;
    }

    .sectionSquared-list {
      display: -ms-flex;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      list-style: none;
     // margin-bottom: 1px;
      background-color: transparent;

      li:first-child:nth-last-child(1) {
        /* -或者可以使用- li:only-child { */
        width: 100%;

        img {
          width: 100%;
          display: inline-block;
        }
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
        list-style: none;
        display: inline-block; //使li对象显示为一行
        //margin: 1.5px;
        text-align: center;
        background-color: transparent;

        img {
          width: 100%;
          display: inline-block;
        }

        img:nth-child(1) {
          margin-left: 1px;
        }
      }
    }
  }


</style>
