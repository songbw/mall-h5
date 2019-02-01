<template lang="html">
  <section class="sectionGoods">
    <div class="container" ref="container">
      <ly-tab id="fixedBar" :class="{fixedBar : isFixed}" v-model="selectedId" :items="items" :options="options"
              @change="onTabChanged">
      </ly-tab>
      <div :style="{ marginTop: marginTop }">
        <div v-for="(category,index) in datas.list" :title=category.title :key="index" class="content">
          <ul class="sectionGoods-list">
            <li v-for="(k,index) in category.skus" @click="onGoodsClick(k)" :key="index">
              <img v-lazy="k.imagePath">
              <p>{{k.intro}}</p>
              <span>￥{{k.price}}</span>
            </li>
          </ul>
        </div>
      </div>
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
        offset: -100,
        goodsList: [],
        busy: false,
        inGoodsListField: false,
        goodsLists: null,
        selectedId: 0,
        items: [],
        options: {
          activeColor: '#f44336'
          // 可在这里指定labelKey为你数据里文字对应的字段
        },
        isFixed: false,
        isTabChanging: false,
        tabsOffsetTop: 0,
        marginTop: 0,
      };
    },

    created() {
      this.datas.list.forEach(item => {
        this.items.push({label: item.title})
      });
    },

    mounted() {
      window.addEventListener('scroll', this.handleScroll);
      this.goodsLists = document.querySelectorAll('.sectionGoods-list')
    },

    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },

    methods: {
      onTabChanged(item, index) {
     //   this.$log("index:" + index + ",label:" + item.label + ",isScrollChanged:" + this.isScrollChanged)
        if (this.isTabChanging) {
          this.isTabChanging = false;
        } else {
          let movePos = (this.goodsLists[index].offsetTop - document.querySelector('#fixedBar').offsetHeight) + 1;
     //     this.$log("offsetTop is:" + movePos)
          this.isTabChanging = true;
          setTimeout(() => {
            this.isTabChanging = false;
          }, 500);
          window.scroll(0, movePos)

        }
      },
      handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (!this.isFixed) {
          this.tabsOffsetTop = document.querySelector('#fixedBar').offsetTop;
        }
        //this.$log("tabsOffsetTop is:" + this.tabsOffsetTop)
        if (scrollTop >= this.tabsOffsetTop) {
          this.isFixed = true;
          this.marginTop = document.querySelector('#fixedBar').offsetHeight + 'px';
          let found = -1;
          for (let i = 0; i < this.goodsLists.length; i++) {
            if (i == this.goodsLists.length - 1) {
              if (scrollTop >= this.goodsLists[i].offsetTop) {
                found = i;
              }
            } else {
              if (scrollTop >= this.goodsLists[i].offsetTop && scrollTop < this.goodsLists[i + 1].offsetTop) {
                found = i;
              }
            }
          }
          // this.active = found;
          if (found != -1) {
           // this.$log("found is:" + found);
            if (this.selectedId != found && !this.isTabChanging) {
              this.isTabChanging = true;
              this.selectedId = found;
            }
          }
        } else {
          this.isFixed = false;
          this.marginTop = 0;
        }
      },

      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
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

    .fixedBar {
      position: fixed;
      top: 0;
      z-index: 999;
      width: 100%;
      background-color: white;
    }

  }
</style>
