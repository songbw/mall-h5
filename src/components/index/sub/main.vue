<template lang="html">
  <div class="index">
    <v-header>
      <h1 slot="title">{{title}}</h1>
    </v-header>
    <li v-for="item in datas" style="list-style: none">
      <v-swiper v-if="item.type==='0'" :datas="item.data"/>
      <v-service v-else-if="item.type==='1'" :datas="item.data"/>
      <v-sectionSquared  v-else-if="item.type==='2'" :datas="item.data"/>
      <v-sectionSlide v-else-if="item.type==='3'" :datas="item.data"/>
      <v-sectionGoods v-else="item.type==='4'" :datas="item.data"/>
    </li>
    <v-baseline/>
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
        loading: true,
        title:''
      }
    },

    beforeCreate() {
      console.log("beforeCreate Enter")
      let id = this.$route.params.id;
      this.$api.xapi({
        method: 'get',
        url: '/aggregation/findById',
        params: {
          id:id
        },
      }).then((response) => {
        this.title = response.data.data.result.name;
        const pako = require('pako');
        const jsonString = pako.inflate(response.data.data.result.content, { to: 'string' })
       // console.log("data:"+jsonString);
        this.datas = JSON.parse(jsonString);
        this.$log(response.data.data.result)
        this.$log(jsonString)
      }).catch(function (error) {
        alert(error)
      })
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
