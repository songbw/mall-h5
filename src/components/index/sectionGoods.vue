<template lang="html">
  <section class="sectionGoods"
           :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}">
    <div class="container" ref="container">
      <div v-if="datas.settings.hasTabBar">
        <ly-tab :id="fixedBarId" :class="{fixedBar : isFixed}" v-model="selectedId" :items="items" :options="options"
                @change="onTabChanged"
                :style="{'background-color': datas.settings.floorTitleColor}">
        </ly-tab>
        <div>
          <div v-for="(category,index) in datas.list" :title=category.title :key="index">
            <ul :id="sectionGoodsListId"
                :class="datas.settings.countPerLine==3 ? 'sectionGoods-list3' : 'sectionGoods-list2' "
                :style=" (mBackgroundColor == undefined || mBackgroundColor=='#FFFFFF')?{}:{'background-color':mBackgroundColor}">
              <li v-for="(k,index) in category.skus" @click="onGoodsClick(k)" :key="index">
                <img v-lazy="k.imagePath || k.image">
                <div class="goodsComment">
                  <p>{{(k.intro != undefined && k.intro.length > 0)? k.intro : k.name}}</p>
                </div>
                <div class="goodsFooter">
                  <div class="goodsPriceBox">
                    <p v-if="k.discount != undefined && datas.settings.countPerLine == 2"
                       :style="{'color': datas.settings.priceTextColor,'background-color': datas.settings.priceBackgroundColor}">
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{(k.price - k.discount).toFixed(2)}}
                      <span
                        style="font-size: x-small;margin-right: -3px;color: #8c8c8c;text-decoration: line-through;">￥</span>
                      <span style="font-size: x-small;color: #8c8c8c;text-decoration: line-through;">{{k.price}}</span>
                    </p>

                    <p v-else
                       :style="{'color': datas.settings.priceTextColor,'background-color': datas.settings.priceBackgroundColor}">
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{(k.discount != undefined?(k.price - k.discount).toFixed(2):k.price)}}
                    </p>
                  </div>
                  <div class="goodsBuyBox">
                    <van-button size="mini" @click.stop="" @click="onAdd2carBtnClick(k)"></van-button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        <div>
          <div v-for="(category,index) in datas.list" :title=category.title :key="index">
            <div class="sectionGoods-title" :style="{'background-color':datas.settings.floorTitleColor}">
              <span>{{category.title}}</span>
            </div>
            <ul
                :class="datas.settings.countPerLine==3 ? 'sectionGoods-list3' : 'sectionGoods-list2' "
                :style=" (mBackgroundColor == undefined || mBackgroundColor=='#FFFFFF')?{}:{'background-color':mBackgroundColor}">
              <li v-for="(k,index) in category.skus" @click="onGoodsClick(k)" :key="index">
                <img v-lazy="k.imagePath || k.image">
                <div class="goodsComment">
                  <p>{{(k.intro != undefined && k.intro.length > 0)? k.intro : k.name}}</p>
                </div>
                <div class="goodsFooter">
                  <div class="goodsPriceBox">
                    <p v-if="k.discount != undefined && datas.settings.countPerLine == 2"
                       :style="{'color': datas.settings.priceTextColor,'background-color': datas.settings.priceBackgroundColor}">
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{(k.price - k.discount).toFixed(2)}}
                      <span
                        style="font-size: x-small;margin-right: -3px;color: #8c8c8c;text-decoration: line-through;">￥</span>
                      <span style="font-size: x-small;color: #8c8c8c;text-decoration: line-through;">{{k.price}}</span>
                    </p>

                    <p v-else
                       :style="{'color': datas.settings.priceTextColor,'background-color': datas.settings.priceBackgroundColor}">
                      <span style="font-size: x-small;margin-right: -3px;">￥</span>
                      {{(k.discount != undefined?(k.price - k.discount).toFixed(2):k.price)}}
                    </p>
                  </div>
                  <div class="goodsBuyBox">
                    <van-button size="mini" @click.stop="" @click="onAdd2carBtnClick(k)"></van-button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Util from '@/util/common'

  export default {
    props: ['datas', 'mBackgroundColor'],
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
        fixedBarId: 'fixedBar',
        sectionGoodsListId: 'sectionGoods-list'

      };
    },

    deactivated() {
      this.isFixed = false;
    },

    created() {
      this.fixedBarId = 'fixedBar' + this.datas.id
      this.sectionGoodsListId = 'sectionGoods-list' + this.datas.id
      this.datas.list.forEach(item => {
        this.items.push({label: item.title})
      });
      this.$log("################################## ")
      this.$log(this.datas)
    },

    mounted() {
      window.addEventListener('scroll', this.handleScroll);
      this.goodsLists = document.querySelectorAll('#' + this.sectionGoodsListId)
    },

    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },

    methods: {
      onTabChanged(item, index) {
        if (this.isTabChanging) {
          this.isTabChanging = false;
        } else {
          let movePos = (this.goodsLists[index].offsetTop - document.querySelector('#' + this.fixedBarId).offsetHeight) + 1;
          // this.$log("movePos is:" + movePos)
          this.isTabChanging = true;
          setTimeout(() => {
            this.isTabChanging = false;
          }, 500);
          window.scroll(0, movePos)

        }
      },
      handleScroll() {
        if (document.querySelector('#' + this.fixedBarId) == null)
          return;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (!this.isFixed) {
          this.tabsOffsetTop = document.querySelector('#' + this.fixedBarId).offsetTop;
        }
        if (scrollTop >= this.tabsOffsetTop) {
          this.isFixed = true;
          this.marginTop = document.querySelector('#' + this.fixedBarId).offsetHeight + 'px';
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
        this.$log("onGoodsClick Enter")
        this.$log(goods)
        let mpu = goods.mpu
        if (mpu == null) {
          mpu = goods.skuid;
        }
        this.$router.push({
          path: "/detail", query: {
            mpu: mpu
          }
        });
        /*        try {
                  //获取goods信息，update current googds
                  this.$api.xapi({
                    method: 'get',
                    baseURL: this.$api.PRODUCT_BASE_URL,
                    url: '/prod',
                    params: {
                      mpu: mpu,
                    }
                  }).then((res) => {
                    this.updateCurrentGoods(res.data.data.result);
                    this.$router.push("/detail");
                  }).catch((error) => {
                    console.log(error)
                  })
                } catch (e) {

                }*/
      },
      onAdd2carBtnClick(goods) {
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          this.add2Car(userInfo, goods);
        } else {
          this.$toast("没有用户信息，请先登录,再添加购物车")
        }
      },

      add2Car(userInfo, goods) {
        let user = JSON.parse(userInfo);
        this.$log(goods)
        let userId = user.userId;
        let mpu = goods.mpu;
        if (mpu == null) {
          mpu = goods.skuid;
        }
        let addtoCar = {
          "openId": userId,
          "mpu": mpu
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart',
          data: addtoCar,
        }).then((response) => {
          this.result = response.data.data.result;
          this.$log(this.result)
          this.$toast("添加到购物车成功！")
          let cartItem = Util.getCartItem(this, user.userId, goods.mpu)
          this.$log(goods)
          if (cartItem == null) {
            let baseInfo = {
              "userId": user.userId,
              "skuId": goods.skuid,
              "mpu": goods.mpu,
              "merchantId": goods.merchantId,
              "count": 1,
              "choosed": true,
              "cartId": this.result,
            }
            let goodsInfo = {
              "id": goods.id,
              "skuId": goods.skuid,
              "mpu": goods.mpu,
              "merchantId": goods.merchantId,
              "image": goods.imagePath,
              "category": goods.category,
              "name": goods.name,
              "brand": goods.brand,
              "model": goods.model,
              "price": goods.price,
              "checkedPrice": goods.price
            }
            let couponList = []
            let promotionInfo = {}
            cartItem = {
              "baseInfo": baseInfo,
              "goodsInfo": goodsInfo,
              "couponList": couponList,
              "promotionInfo": promotionInfo,
            }
          } else {
            cartItem.baseInfo.count++;
          }
          Util.updateCartItem(this, cartItem)
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .sectionGoods {
    width: 100%;
    overflow: hidden;

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

      li {
        width: 48%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        //border: 4px solid transparent;
        border-radius: 5px;
        margin: 1vw;

        img {
          width: 100%;
          height: 11em;
          display: inline-block;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }

        .goodsComment {
          margin: 2px 5px;
          min-height: 2.4em;

          > p {
            .fz(font-size, 25);
            min-height: 2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
            bottom: 0;
            left: 0;
            width: 100%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #323233;
          }
        }

        .goodsFooter {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          padding-bottom: 3px;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-items: center;
          min-height: 2em;


          .goodsPriceBox {
            width: 80%;
            line-height: 2em;
            margin-left: 5px;

            > span {
              display: inline-block;
              align-content: center;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              word-break: break-all;
              bottom: 0;
              left: 0;
              color: #ff4444;
              .fz(font-size, 30);
            }
          }

          .goodsBuyBox {
            width: 20%;
            justify-content: center;
            line-height: 2em;

            .van-button {
              margin: 1vw;
              background: url('../../assets/icons/ico_add_cart.png') no-repeat center;
              background-size: 15px 15px;
              border: none;
              float: right;
            }

            .van-button:active {
              opacity: 0;
            }
          }


        }
      }
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

      li {
        width: 32%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        //   border: 3px solid #f0f0f0;
        border-radius: 5px;
        margin: .8vw;

        img {
          width: 100%;
          height: 7em;
          display: inline-block;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }

        .goodsComment {
          margin: 2px 5px;
          min-height: 2.4em;

          > p {
            .fz(font-size, 25);
            min-height: 2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
            bottom: 0;
            left: 0;
            width: 100%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #323233;
          }
        }

        .goodsFooter {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-items: center;
          min-height: 2em;
          padding-bottom: .1em;

          .goodsPriceBox {
            width: 80%;
            line-height: 2em;
            margin-left: 5px;

            > span {
              display: inline-block;
              align-content: center;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              word-break: break-all;
              bottom: 0;
              left: 0;
              color: #ff4444;
              .fz(font-size, 30);
            }
          }

          .goodsBuyBox {
            width: 20%;
            justify-content: center;
            line-height: 2em;

            .van-button {
              margin: 1vw;
              background: url('../../assets/icons/ico_add_cart.png') no-repeat center;
              background-size: 15px 15px;
              border: none;
              float: right;
            }

            .van-button:active {
              opacity: 0;
            }
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
      .fz(font-size, 30);
      font-weight: bold;
      padding: 2vw;
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
