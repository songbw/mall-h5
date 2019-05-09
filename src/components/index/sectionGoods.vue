<template lang="html">
  <section class="sectionGoods" :style="{'margin-bottom': datas.settings.marginBottom+'px'}">
    <div class="container" ref="container">
      <ly-tab id="fixedBar" :class="{fixedBar : isFixed}" v-model="selectedId" :items="items" :options="options"
              @change="onTabChanged"  :style="{'margin-left': '-5px','background-color': datas.settings.floorTitleColor}">
      </ly-tab>
      <div :style="{marginTop: marginTop}">
        <div v-for="(category,index) in datas.list" :title=category.title :key="index">
          <ul id="sectionGoods-list" :class="datas.settings.countPerLine==3 ? 'sectionGoods-list3' : 'sectionGoods-list2' ">
            <li v-for="(k,index) in category.skus" @click="onGoodsClick(k)" :key="index">
              <img v-lazy="k.imagePath || k.image">
              <p>{{k.intro}}</p>
              <div class="goodsFooter">
                <span :style="{'color': datas.settings.priceTextColor,'background-color': datas.settings.priceBackgroundColor}">￥{{k.price}}</span>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
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
      this.goodsLists = document.querySelectorAll('#sectionGoods-list')
    },

    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },

    methods: {
/*      getCurrentGoodsWidth(countPerLine) {
        this.$log("getCurrentGoodsWidth:"+countPerLine);
        if(countPerLine == 3)
          return '33.33%'
        else
          return '50%'
      },*/
      onTabChanged(item, index) {
        this.$log("index:" + index + ",label:" + item.label + ",isScrollChanged:" + this.isScrollChanged)
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
        if(document.querySelector('#fixedBar') == null)
          return;
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
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            url: '/prod',
            params: {
              id: goods.skuid,
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

    .sectionGoods-list2 {
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
      background-color: #f0f0f0;
      padding-right: 2vw;
      padding-left:  2vw;
      li {
        width: 48vw;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 4px solid #f0f0f0;
        border-radius:15px;
        img {
          width: 100%;
          height: 10em;
          display: inline-block;
          border-top-left-radius:  10px;
          border-top-right-radius: 10px;
        }

        > p {
          .fz(font-size,23);
          min-height: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break:break-all;
          bottom: 0;
          left: 0;
          width: 100%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin-top: 5px;
          color: #323233;
        }

        > h3 {
          padding-top: 3vw;
          .fz(font-size, 40);
        }

        .goodsFooter{
          border-bottom-left-radius:  10px;
          border-bottom-right-radius: 10px;
          > span {
            display: inline-block;
            align-content: center;
            color: #ff4444;
            margin: 1vw;
            .fz(font-size, 30);
            font-weight: bold;
          }
        }

      }
/*      li{
        border-bottom: 2px solid #f0f0f0;
      }
      li:nth-child(2n) {
        border-left: 2px solid #f0f0f0;
      }*/
    }

    .sectionGoods-list3 {
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
      background-color: #f0f0f0;
      padding-right: 2vw;
      padding-left:  2vw;
      li {
        width: 32vw;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 3px  solid #f0f0f0;
        border-radius:15px;
        img {
          width: 100%;
          height: 6.66em;
          display: inline-block;
          border-top-left-radius:  10px;
          border-top-right-radius: 10px;
        }

        > p {
          .fz(font-size,23);
          min-height: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break:break-all;
          bottom: 0;
          left: 0;
          width: 100%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin-top: 5px;
          color: #323233;
        }

        > h3 {
          padding-top: 3vw;
          .fz(font-size, 40);
        }

        .goodsFooter{
          border-bottom-left-radius:  10px;
          border-bottom-right-radius: 10px;
          > span {
            display: inline-block;
            align-content: center;
            color: #ff4444;
            margin: 1vw;
            .fz(font-size, 30);
            font-weight: bold;
          }
        }
      }
      li:nth-child(3n+2) {
        margin-left: 1px;
      }
      li:nth-child(3n+3) {
        margin-left: 1px;
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
