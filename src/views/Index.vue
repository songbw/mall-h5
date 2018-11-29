<template lang="html">
  <!-- 在首页父组件发送http请求,后将数据通过props传递给子组件,可减少请求次数,减少服务器压力 -->
  <div class="index">
    <v-header/>
    <li v-for="item in datas" style="list-style: none">
      <v-swiper v-show="item.name==='swiper'" :datas="item.data"/>
      <v-service v-show="item.name==='service'" :datas="item.data"/>
      <v-sectionSquared v-show="item.name==='squared'" :datas="item.data"/>
      <v-sectionSlide v-show="item.name==='slideGoods'" :datas="item.data"/>
      <v-sectionGoods v-show="item.name==='navGoods'" :datas="item.data"/>
    </li>
    <v-baseline/>
    <v-footer/>
  </div>
</template>

<script>
  import Header from '@/components/index/header.vue'
  import Swiper from '@/components/index/swiper.vue'

  import Section1 from '@/components/index/section1.vue'
  import Section2 from '@/components/index/section2.vue'
  import Section3 from '@/components/index/section3.vue'
  import Section4 from '@/components/index/section4.vue'
  import sectionService from '@/components/index/sectionService.vue'
  import sectionSquared from '@/components/index/sectionSquared.vue'
  import sectionSlide from '@/components/index/sectionSlide.vue'
  import sectionGoods from '@/components/index/sectionGoods.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'
  import index from '@/http/mock.js' //模拟数据
  export default {
    components: {
      'v-section1': Section1,
      'v-section2': Section2,
      'v-section3': Section3,
      'v-section4': Section4,
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
      this.$api.tapi({
        method: 'post',
        url: '/index'
      }).then((response) => {
        this.datas = response.data;
        console.log("datas:" + JSON.stringify(this.datas))

      }).catch(function (error) {
        alert(error)
      })
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
