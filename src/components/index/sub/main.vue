<template lang="html">
  <section>
    <div class="index" :style="{'background-color': mBackgroundColor}">
      <v-header>
        <h1 slot="title">{{title}}</h1>
      </v-header>
      <div style="padding: 5px">
        <li v-for="item in datas" style="list-style: none">
          <v-swiper v-if="item.type==='0'" :datas="item.data"/>
          <v-service v-else-if="item.type==='1'" :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          <v-sectionSquared v-else-if="item.type==='2'" :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
          <v-sectionSlide v-else-if="item.type==='3'" :datas="item.data"/>
          <v-sectionGoods v-else="item.type==='4'" :datas="item.data"/>
        </li>
      </div>
      <!--    <v-baseline/>-->
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Swiper from '@/components/index/swiper.vue'
  import sectionService from '@/components/index/sectionService.vue'
  import sectionSquared from '@/components/index/sectionSquared.vue'
  import sectionSlide from '@/components/index/sectionSlide.vue'
  import sectionGoods from '@/components/index/sectionGoods.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'

  //import { Toast } from 'mint-ui'
  export default {
    components: {
      'v-header': Header,
      'v-swiper': Swiper,
      'v-service': sectionService,
      'v-sectionSquared': sectionSquared,
      'v-sectionSlide': sectionSlide,
      'v-sectionGoods': sectionGoods,
      'v-baseline': Baseline,
      'v-footer': Footer
    },
    watch: {
      '$route' (to, from) {
        if (to.name === '活动页') {
          let id = this.$route.params.id;
          console.log("活动页:"+id)
          this.$api.xapi({
            method: 'get',
            url: '/aggregation/findById',
            params: {
              id: id
            },
          }).then((response) => {
            this.title = response.data.data.result.name;
            //const pako = require('pako');
           // const jsonString = pako.inflate(response.data.data.result.content, {to: 'string'})
            let jsonString = response.data.data.result.content
            this.datas = JSON.parse(jsonString);
            // this.$log(response.data.data.result)
            // this.$log(jsonString)
            this.mBackgroundColor = response.data.data.result.backgroundColor
          }).catch(function (error) {
            alert(error)
          })

        }
      }
    },
    data() {
      return {
        datas: {},
        loading: true,
        title: '',
        mBackgroundColor: '#FFFFFF',
        icon_orderList: require('@/assets/images/icon_order.png'),
        icon_shopCart: require('@/assets/images/icon_shopping_cart.png'),
      }
    },

    beforeCreate() {
      let id = this.$route.params.id;
      this.$api.xapi({
        method: 'get',
        url: '/aggregation/findById',
        params: {
          id: id
        },
      }).then((response) => {
        this.title = response.data.data.result.name;
       // const pako = require('pako');
        //const jsonString = pako.inflate(response.data.data.result.content, {to: 'string'})
        let jsonString = response.data.data.result.content
        this.datas = JSON.parse(jsonString);
        // this.$log(response.data.data.result)
        this.$log(this.datas)
        this.mBackgroundColor = response.data.data.result.backgroundColor
      }).catch(function (error) {
        alert(error)
      })
    },

    methods: {
      gotoShoppingCart() {
        this.$log("gotoShoppingCart Enter")
        this.$router.push({name: '购物车页'})
      },
      gotoOrderList() {
        this.$log("gotoOrderList Enter")
        this.$router.push({name: '订单列表页'})
      },
    }
  }
</script>


<style lang="less" scoped>
  .index {
    width: 100%;
    padding-bottom: 4vw;
    background-color: #F8FCFF;
  }
</style>
