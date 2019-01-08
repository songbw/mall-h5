<template lang="html">
  <div class="car">
    <!-- slot分发内容 让子组件混合父组件的内容 -->
    <v-header>
      <h1 slot="title">购物车</h1>
    </v-header>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <mt-cell-swipe
        v-for="(k,index) in this.selStateInCarList"
        :key="k.id"
        :right="[{content: '删除',style: { background: 'red', color: '#fff'},
        handler: function(){ onDeleteBtnClick(k,index) }}]">
        <div slot="title">
          <van-checkbox
            v-model="k.choose"
            class="checkedBox"
            @change="singleChecked(index,k)">
          </van-checkbox>
        </div>
        <van-card
          :price="k.price"
          :title="k.desc"
          :thumb="k.image">
          <div slot="footer">
            <van-stepper v-model="k.count" @change="onCountChange(k.id,k.skuid,k.count)"/>
          </div>
        </van-card>
      </mt-cell-swipe>
    </van-list>
    <v-footer/>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Nothing from '@/components/car/nothing.vue'
  import Something from '@/components/car/something.vue'
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
          return  String(item.skuId).startsWith("20")
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
        selStateInCarList: []
      }
    },

    methods: {
      isUserEmpty(userInfo) {
        return (userInfo == null ||userInfo == undefined || JSON.stringify(userInfo) == "{}")
      },
      onDeleteBtnClick(k, index) {
        console.log("onDeleteBtnClick id:" + k.id + ",index:" + index)
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        this.selStateInCarList.splice(index, 1);
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
        console.log("selStateInCarList:" + JSON.stringify(this.selStateInCarList))

        this.$api.xapi({
          method: 'delete',
          url: '/cart',
          params: {
            id: k.id,
          }
        }).then((response) => {
          //console.log("response is:" + JSON.stringify(response))
          console.log("onDeleteBtnClick success")
        }).catch(function (error) {
          console.log(error)
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
          console.log("onCountChange id:" + id + ",skuid:" + skuid + ",count:" + count)
          let options = {
            "id": id,
            "count": count
          }
          this.$api.xapi({
            method: 'put',
            url: '/cart/num',
            data: options,
          }).then((response) => {
            console.log("change goods count success!")
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
          console.log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/cart/all',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            //console.log("list is:" + JSON.stringify(this.result.list));
            this.result.list.forEach(item => {
              this.list.push(item);
              this.getSkuInfoBy(item, userInfo);
            })
            this.loading = false;
            if (this.list.length >= this.total)
              this.finished = true;
          }).catch(function (error) {
            console.log(error)
            this.finished = true;
          })
        }
      },

      onLoad() {
        let userInfo=this.$jsbridge.call("getUserInfo");
        if( userInfo != null && userInfo.length > 0) {
          console.log("Car onLoad getUserInfo ret is:"+userInfo);
          this.$store.commit('SET_USER',userInfo);
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
          if (product != null) {
            this.updateSelectedCarlist(item, product, user)
          } else {
            console.log("product:" + JSON.stringify(product) + ",skuId:" + item.skuId)
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      singleChecked(index, k) {
        // console.log("index:" + index + ",k.choose:" + k.choose)
        //update selStateInCarList
        this.selStateInCarList = this.$store.state.appconf.selStateInCarList
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == k.id && this.selStateInCarList[i].userId == k.userId) {
            this.selStateInCarList[i].choose = k.choose;
            break;
          }
        }
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
        console.log("selStateInCarList:" + JSON.stringify(this.selStateInCarList))
      }

    },
    components: {
      'v-header': Header,
      'v-nothing': Nothing,
      'v-something': Something,
      'v-footer': Footer
    },
  }

</script>

<style lang="less" scoped>
  @import "../assets/fz.less";

  .car {
    width: 100%;
    padding-bottom: 14vw;

    .van-swipe-cell {
      .van-swipe-cell_right {
        color: white;
        font-size: 15px;
        width: 65px;
        height: 100%;
        display: inline-block;
        text-align: center;
        line-height: 44px;
        background-color: red;
      }
    }


    .checkBox-con {
      padding: 0.6rem;
    }

    .van-card__footer > div {
      display: flex !important;
      align-items: center;
      justify-content: space-around;
    }
  }
</style>
