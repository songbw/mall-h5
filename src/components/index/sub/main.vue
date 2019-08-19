<template lang="html">
  <section>
    <div class="index" :style="{'background-color': mBackgroundColor}">
      <v-header :mBackgroundColor="this.mHeader.backgroundColor" v-if="showHeader">
        <h1 slot="title">{{title}}</h1>
      </v-header>
      <div v-if="pageloading">
        <v-loading></v-loading>
      </div>
      <div :style="{'background-color': mBackgroundColor}" v-else class="home-body">
        <div class='box' :style="{'background-color': this.mHeader.backgroundColor}">
          <van-search placeholder="搜索您感兴趣的商品"
                      shape="round"
                      :background=this.mHeader.backgroundColor
                      readonly
                      @click="onSearchInputClick()"
                      v-if="this.mHeader.showSearchBar"/>
        </div>
        <div class="box_after" :style="{'background-color': this.mHeader.backgroundColor}"></div>
        <div class="index_main">
          <div v-for="item in datas" >
            <div v-if="item.type==='0'" style="margin-left: 5px;margin-right: 5px; border-radius: 10px">
              <v-swiper :datas="item.data"/>
            </div>
            <div v-else-if="item.type==='1'" style="margin-left: 5px;margin-right: 5px;">
              <v-service :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
            <div v-else-if="item.type==='2'" style="margin-left: 5px;margin-right: 5px;">
              <v-sectionSquared :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
            <div v-else-if="item.type==='3'" style="margin-left: 5px;margin-right: 5px;">
              <v-sectionSlide :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
            <div v-else-if="item.type==='7'" style="margin-left: 5px;margin-right: 5px;">
              <v-imgmap :datas="item.data"/>
            </div>
            <div v-else-if="item.type==='4'">
              <v-sectionGoods :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
          </div>
        </div>
        <v-baseline :style="{'background-color': mBackgroundColor}"></v-baseline>
      </div>
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
  import sectionImgMap from '@/components/index/sectionImgMap.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'
  import Loading from '@/common/_loading.vue'
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
      'v-footer': Footer,
      'v-loading': Loading,
      'v-imgmap': sectionImgMap
    },
    watch: {
      '$route' (to, from) {
        if (to.name === '活动页') {
          let id = this.$route.params.id;
          console.log("活动页:"+id)
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.AGGREGATION_BASE_URL,
            url: '/aggregation/findById',
            params: {
              id: id
            },
          }).then((response) => {
            this.title = response.data.data.result.name;
            let jsonString = response.data.data.result.content
            this.datas = JSON.parse(jsonString);
            for (let i = 0 ; i < this.datas.length; i++) {
              if(this.datas[i].type === '4')
                this.datas[i].data.id = id;
            }
            this.mBackgroundColor = response.data.data.result.backgroundColor
            if(response.data.data.result.header != undefined)
            {
              let header =  JSON.parse(response.data.data.result.header)
              this.mHeader = header
            }
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
        pageloading:true,
        title: '',
        mBackgroundColor: '#FFFFFF',
        mHeader:{
          backgroundColor: '#FFFFFF',
          showSearchBar:false
        },
        showHeader: true,
      }
    },

    beforeCreate() {
      let id = this.$route.params.id;
      let that = this
      this.pageloading = true;
      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.AGGREGATION_BASE_URL,
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
        for (let i = 0 ; i < this.datas.length; i++) {
          if(this.datas[i].type === '4')
            this.datas[i].data.id = id;
        }
        this.$log(this.datas)
        this.mBackgroundColor = response.data.data.result.backgroundColor
        if(response.data.data.result.header != undefined)
        {
          let header =  JSON.parse(response.data.data.result.header)
          this.mHeader = header
        }
        this.pageloading = false;
      }).catch(function (error) {
        alert(error)
        that.pageloading = false;
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
      onSearchInputClick() {
        this.$log("onSearchInputClick")
        this.$router.push({name:'搜索页'})
      }
    }
  }
</script>


<style lang="less" scoped>
  .index {
    width: 100%;
    padding-bottom: 4vw;
    background-color: #F8FCFF;

    .home-body {
      width: 100%;
      top: 0px;
      background-color: #f8f8f8;

      .box {
        position: relative;
        width: 100%;
        line-height: 15vw;
        background-color: #ff4444;

      }
      .box_after{
        bottom: -60px;
        height: 60px;
        border-radius: 0 0 30% 30%;
        background-color:  #ff4444;
        overflow: hidden;
        z-index: -1;
      }
      .index_main{
        margin-top: -50px;
      }
    }
  }
</style>
