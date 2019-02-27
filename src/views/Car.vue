<template lang="html">
  <div class="car">
    <!-- slot分发内容 让子组件混合父组件的内容 -->
    <v-header>
      <h1 slot="title">购物车</h1>
    </v-header>
    <van-list v-model="loading" :finished="finished" @load="onLoad" style="list-style: none">
      <div slot="loading">
      </div>
      <div class="nothingInCar" v-cloak v-if="finished && this.$store.state.appconf.selStateInCarList.length === 0">
        <img :src="nothingInCar_bg"/>
        <span>购物车是空的，美好的生活需要您的填充！</span>
      </div>

      <div v-else>
        <div class="carlist">
          <van-swipe-cell :right-width="60"   v-for="(k,index) in this.selStateInCarList">
            <div style="display: flex;flex-direction: row;justify-content: left;background-color: #ffffff">
              <div style="width: 8%;display: flex;flex-direction: column;justify-content: center; margin-left: 1em;">
                <van-checkbox
                  v-model="k.choose"
                  class="checkedBox"
                  @change="singleChecked(index,k)">
                </van-checkbox>
              </div>
              <div style="width: 92%; display: flex;flex-direction: column;justify-content: center;">
                <van-card
                  :price="k.price"
                  :title="k.desc"
                  :thumb="k.image">
                  <div slot="footer">
                    <van-stepper v-model="k.count" @change="onCountChange(k.id,k.skuid,k.count)"/>
                  </div>
                </van-card>
              </div>
            </div>
            <div slot="right" @click=onDeleteBtnClick(k,index)  class="rightSlot">
              <span style="margin-left: 1em">删除</span>
            </div>
          </van-swipe-cell>
        </div>

      </div>
    </van-list>
    <v-footer/>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Footer from '@/components/car/footer.vue'

  export default {
    computed: {
      SelfList() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("10")
        });
      },

      SuningList() {
        // `this` points to the vm instance
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("20")
        });
      },

      VIPsList() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("30")
        });
      },

      TMallList() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("50")
        });
      },

      JDList() {
        // `this` points to the vm instance
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        return this.selStateInCarList.filter(function (item) {
          return String(item.skuId).startsWith("60")
        });
      },

    },


    data() {
      return {
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        loading: false,
        finished: false,
        selStateInCarList: [],
        nothingInCar_bg: require('@/assets/images/cart.svg'),
      }
    },

    methods: {
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },
      onDeleteBtnClick(k, index) {
        let that = this;
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        this.selStateInCarList.splice(index, 1);
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);

        this.$api.xapi({
          method: 'delete',
          url: '/cart',
          params: {
            id: k.id,
          }
        }).then((response) => {
          that.$log("onDeleteBtnClick success")
        }).catch(function (error) {
          that.$log(error)
        })
      },

      onCountChange(id, skuid, count) {
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          this.selStateInCarList = this.$store.state.appconf.selStateInCarList;
          for (let i = 0; i < this.selStateInCarList.length; i++) {
            if (this.selStateInCarList[i].id == id && this.selStateInCarList[i].userId == user.userId) {
              this.selStateInCarList[i].count = count;
              break;
            }
          }
          this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
          let options = {
            "id": id,
            "count": count
          }
          this.$api.xapi({
            method: 'put',
            url: '/cart/num',
            data: options,
          }).then((response) => {
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          // no user
          this.selStateInCarList = this.$store.state.appconf.selStateInCarList;
          for (let i = 0; i < this.selStateInCarList.length; i++) {
            if (this.selStateInCarList[i].id == id && this.selStateInCarList[i].userId == -1) {
              this.selStateInCarList[i].count = count;
              break;
            }
          }
          this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
        }
      },

      loadCartListBy(user) {
        let userInfo = JSON.parse(user);
        if (this.total == -1 || this.total > this.list.length) {
          let options = {
            "openId": userInfo.userId,
            "pageNo": this.pageNo++
          }
          this.$api.xapi({
            method: 'post',
            url: '/cart/all',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            this.$log("load from network car list is:" + JSON.stringify(this.result.list));
            this.result.list.forEach(item => {
              this.list.push(item);
              this.getSkuInfoBy(item, userInfo);
            })
            this.loading = false;
            if (this.list.length >= this.total) {
              setTimeout(() => {
                this.finished = true;
              }, 500);
            }
          }).catch(function (error) {
            console.log(error)
            this.finished = true;
          })
        }
      },

      onLoad() {
        // let userInfo=this.$jsbridge.call("getUserInfo");
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          this.loadCartListBy(userInfo);
        } else {
          this.getCarListWithoutUser();
        }
      },

      getCarListWithoutUser() {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        this.loading = false;
        this.finished = true;
      },

      updateSelectedCarlist(item, product, user) {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        let choose = true;
        let found = false;
        let goods = Object();
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == item.id && this.selStateInCarList[i].userId == user.userId) {
            //sync data
            this.selStateInCarList[i].count = item.count
            this.selStateInCarList[i].skuId = item.skuId
            this.selStateInCarList[i].price = product.price
            goods = this.selStateInCarList[i];
            found = true;
            break;
          }
        }
        if (!found) {
          goods = {
            "userId": user.userId,
            "id": item.id,
            "image": product.image,
            "desc": product.brand + ' ' + product.name + ' ' + product.model,
            "skuId": item.skuId,
            "count": item.count,
            "price": product.price,
            "choose": true,
            "isDel": 0
          }
          this.selStateInCarList.push(goods);
          this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
        }
        return goods;
      },

      getSkuInfoBy(item, user) {
        this.$api.xapi({
          method: 'get',
          url: '/prod',
          params: {
            id: item.skuId,
          }
        }).then((res) => {
          let product = res.data.data.result;
          //this.$log(product);
          if (product != null) {
            this.updateSelectedCarlist(item, product, user)
          } else {
            this.$log("product:" + JSON.stringify(product) + ",skuId:" + item.skuId)
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      singleChecked(index, k) {
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == k.id && this.selStateInCarList[i].userId == k.userId) {
            this.selStateInCarList[i].choose = k.choose;
            break;
          }
        }
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
      }

    },
    components: {
      'v-header': Header,
      'v-footer': Footer
    },
  }

</script>

<style lang="less" scoped>
  @import "../assets/fz.less";

  .car {
    width: 100%;
    margin-bottom: 18vw;
    background-color: #f0f0f0;

    .checkBox-con {
      padding: 0.6rem;
    }

    .van-card {
      background-color: #ffffff;

      &__price {
        margin-top: 0.5em;
        .fz(font-size, 40);
      }
    }

    .van-card__footer > div {
      display: flex !important;
      align-items: center;
      float: right;
      justify-content: space-around;
    }

    .nothingInCar {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: Center;
      background-color: #ffffff;

      img {
        margin: 4vw;
      }

      span {
        margin: 2vw;
      }
    }

    [v-cloak] {
      display: none !important;
    }

    .van-list {
      background-color: #ffffff;
    }

    .carlist{
      background-color: #f0f0f0;
      .van-swipe-cell{
        margin-bottom: 5px;
      }

      .rightSlot{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width:60px;
        height:100%;
        background-color: #ff4444;
        color: #ffffff
      }
    }

  }
</style>
