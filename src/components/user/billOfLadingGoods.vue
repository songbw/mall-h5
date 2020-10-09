<template lang="html">
  <section class="main">
    <div class="noneInfo" v-if="loading">
      <v-loading></v-loading>
    </div>
    <div v-else class="goodslistBody">
      <li v-for="(k,index) in goodsList" :key="index">
        <div class="goodsCard" @click="onClickGoods(k)">
          <div class="card-layout">
            <van-col span="8" class="cardImg">
              <img v-lazy="k.image" alt="">
            </van-col>
            <van-col span="16" class="cardInfo">
              <div class="cardTitle">
                <span>{{k.name}}</span>
              </div>
              <div class="cardTag">
                <span></span>
              </div>
              <div class="cardFooter">
                <div class="priceBox">
                  <div class="salePrice">
                    <p><span>￥</span>{{k.dprice}}</p>
                    <p v-if="k.price > k.dprice" style="margin:6px;color:#888888;font-size:small;text-decoration:line-through"><span>￥</span>{{k.price}}</p>
                  </div>
                </div>
              </div>
            </van-col>
          </div>
        </div>
      </li>
    </div>
  </section>
</template>

<script>
  import Loading from '@/common/_loading.vue'
  import Util from "@/util/common";


  export default {
    components: {
      'v-loading': Loading
    },

    data() {
      return {
        loading: true,
        goodsList: [],
        couponId: -1,
        amount: 0,
        totalPrice: 0
      }
    },

    async created() {
      let that = this
      this.$log("created Enter")
      try {
        let id = this.$route.query.id;
        this.amount = this.$route.query.amount
        if (id != undefined) {
          let repsonse = await this.getGoodsList(id)
          this.$log(repsonse)
          if (repsonse.data.code == 200) {
            this.goodsList = repsonse.data.data.result.couponSkus.list
            this.$log(this.goodsList)
            this.goodsList.forEach(item => {
              item['promotionState'] = Util.getPromotionState(this, item)
              if (item.merchantId == 4) {
                if (item.skuList.length > 0) {
                  this.$log(item.skuList[0])
                  item.price = (item.skuList[0].price / 100).toFixed(2)
                }
              }
              item['dprice'] = 0;
              this.totalPrice = this.totalPrice + parseFloat(item.price)
            })
            if (this.totalPrice > this.amount) {
              let tmpAmount = 0
              for (let i = 0; i < this.goodsList.length; i++) {
                this.goodsList[i].dprice = Math.floor((this.goodsList[i].price * this.amount / this.totalPrice) *
                  100) / 100;
                this.$log(this.goodsList[i].dprice)
                tmpAmount = parseFloat((tmpAmount + this.goodsList[i].dprice).toFixed(2))
              }
              this.$log(tmpAmount)
              let diff = parseFloat((this.amount - tmpAmount).toFixed(2))
              this.$log("diff:"+diff)
              if (diff > 0) {
                for (let i = 0; i < this.goodsList.length; i++) {
                  let temptPrice = parseFloat((diff + this.goodsList[i].dprice).toFixed(2))
                  this.$log(temptPrice)
                  if (this.goodsList[i].price >= temptPrice) {
                    this.goodsList[i].dprice = temptPrice
                    this.$log(this.goodsList[i].dprice)
                    break;
                  }
                }
              }
            } else {
               for (let i = 0; i < this.goodsList.length; i++) {
                this.goodsList[i].dprice = this.goodsList[i].price
               }
            }
          }
        }
      } catch (e) {
        that.$log(e.repsonse)
      }
      this.loading = false
    },

    methods: {
      onClickGoods(k) {
        this.$log("goods clicked:",k)
        this.$router.push({
          path: "/detail",
          query: {
            mpu: k.mpu
          }
        });
      },
      getGoodsList(couponId) {
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/coupon/skuById',
          params: {
            id: couponId,
            limit: 10,
            offset: 1
          }
        })

      }
    }
  }

</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';

  .main {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .noneInfo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: Center;

      img {
        margin: 4vw;
      }

      span {
        margin: 2vw;
      }
    }

    .goodslistBody {
      text-align: left;
      width: 100%;
      background-color: #f8f8f8;
      display: flex;
      flex-direction: column;

      li {
        display: flex;
        list-style: none;
        margin: 5px 0px;
        width: 100%;

        .goodsCard {
          width: 100%;

          .card-layout {
            height: 7rem;
            justify-content: center;

            .promotionBox {
              display: flex;
              .fz(font-size, 25);
              margin-bottom: 5px;

              .promotionTitle {
                color: #ff4444;
                font-weight: bold;
              }

              .promotionCountDown {
                margin-left: 10px;
                color: black;
                .fz(font-size, 25);
              }
            }

            .cardImg {
              height: 100%;
              text-align: center;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .cardInfo {
              height: 100%;
              padding: 5px;

              .cardTitle {
                padding: 0px 2px;
                .fz(font-size, 30);
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break: break-all;
              }

              .cardTag {
                height: 25%;
              }

              .cardFooter {
                padding: 5px 2px;
                width: 100%;
                height: 25%;
                display: flex;

                .priceBox {
                  width: 80%;
                  text-align: left;
                  margin-top: 4px;

                  .salePrice {
                    display: flex;
                    color: #ff4444;
                    .fz(font-size, 42);

                    span {
                      .fz(font-size, 22);
                    }
                  }

                  .originPrice {
                    color: #707070;
                    .fz(font-size, 25);
                    text-decoration: line-through
                  }
                }

                .goodsBuyBox {
                  justify-content: center;
                  float: right;

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
        }
      }
    }

  }

</style>
