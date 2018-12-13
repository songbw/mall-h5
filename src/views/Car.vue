<template lang="html">

  <div class="car">
    <!-- slot分发内容 让子组件混合父组件的内容 -->
    <v-header>
      <h1 slot="title">购物车</h1>
    </v-header>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
        <mt-cell-swipe
          v-for="k in productList"
          :right="[{content: '删除',style: { background: 'red', color: '#fff'},
                handler: function(){ onDeleteBtnClick(k.id) }}]">
          <div slot="title" class="swipecell-left">
            <van-checkbox
              v-model="k.choose"
              class="checkedBox"
              @change="singleChecked(k.choose,index)">
            </van-checkbox>
          </div>
          <van-card
            :price="k.product.price"
            :title="k.product.brand+ ' '+ k.product.name + ' '+ k.product.model"
            :thumb="k.product.image">
            <div slot="footer">
              <van-stepper v-model="k.count" @change="onCountChange(k.id,k.product.skuid,k.count)"/>
            </div>
          </van-card>
        </mt-cell-swipe>
    </van-list>
    <!-- 根据购物车是否有商品加载不同的组件 -->
    <!--
    <v-something v-if="list.length > 0"/>
    <v-nothing v-else/>
    -->
    <v-footer/>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Nothing from '@/components/car/nothing.vue'
  import Something from '@/components/car/something.vue'
  import Footer from '@/components/car/footer.vue'

  export default {
    data() {
      return {
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        productList: [],
        loading: false,
        finished: false
      }
    },
    methods: {
      onDeleteBtnClick(id) {
        console.log("onDeleteBtnClick id:"+id)
      },
      onCountChange(id,skuid,count) {
        console.log("onCountChange id:"+id+",skuid:"+skuid+",count:"+count)
        //change carlist
        let options = {
          "id": id,
          "count": count
        }
        console.log("options:" + JSON.stringify(options));
        this.$api.xapi({
          method: 'put',
          url: '/cart/num',
          data: options,
        }).then((response) => {
          console.log("response is:" + JSON.stringify(response));
          if(response.data.code == 200) {
            console.log("change goods count success!")
          } else {
            console.log("network issue when change goods count!")
          }
        }).catch(function (error) {
          console.log(error)
          this.finished = true;
        })

      },
      onLoad() {
        let userInfo = JSON.parse(this.$store.state.appconf.userInfo);
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
            console.log("list is:" + JSON.stringify(this.result.list));
            this.result.list.forEach(item => {
              this.list.push(item);
              this.getSkuIynfoBy(item);
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
      getSkuIynfoBy(item) {
        this.$api.xapi({
          method: 'get',
          url: '/prod',
          params: {
            id: item.skuId,
          }
        }).then((res) => {
          //console.log("product info:"+JSON.stringify( res.data.data.result));
          let product = res.data.data.result;
          this.productList.push(
            {
              "product": product,
              "count": item.count,
              "id":item.id,
              "choose": true
            })
        }).catch((error) => {
          console.log(error)
        })
      },
      onClose(clickPosition, instance) {
        switch (clickPosition) {
          case 'right':
            break;
        }
      },
      singleChecked(checked, index) {
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

    .checkBox-con {
      padding: 0.6rem;
    }

    .checkedBox {

    }

    .swipecell-left {

    }

    .van-card__footer > div {
      display: flex !important;
      align-items: center;
      justify-content: space-around;
    }

  }
</style>
