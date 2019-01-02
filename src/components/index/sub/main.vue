<template lang="html">
  <div class="index">
    <v-header>
      <h1 slot="title">商城活动页</h1>
    </v-header>
    <li v-for="item in datas" style="list-style: none">
      <v-swiper v-show="item.type==='0'" :datas="item.data"/>
      <v-service v-show="item.type==='1'" :datas="item.data"/>
      <v-sectionSquared v-show="item.type==='2'" :datas="item.data"/>
      <v-sectionSlide v-show="item.type==='3'" :datas="item.data"/>
      <v-sectionGoods v-show="item.type==='4'" :datas="item.data"/>
    </li>
    <v-baseline/>
    <v-footer/>
  </div>
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
    data() {
      return {
        datas: {},
        loading: true
      }
    },

    beforeCreate() {
      console.log("beforeCreate Enter")
    },

    methods: {
    }
  }
</script>


<style lang="less" scoped>
  .index {
    width: 100%;
    padding-bottom: 14vw;
    background-color: #F8FCFF;
  }
</style>
