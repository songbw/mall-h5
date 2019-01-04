<template lang="html">
  <!-- 在首页父组件发送http请求,后将数据通过props传递给子组件,可减少请求次数,减少服务器压力 -->
  <div class="index">
    <v-header/>
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

  //import { Toast } from 'mint-ui'
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
      this.$api.xapi({
        method: 'get',
        url: '/aggregation/findHomePage'
      }).then((response) => {
        const pako = require('pako');
        const jsonString = pako.inflate(response.data.data.result.content, { to: 'string' })
        this.datas = JSON.parse(jsonString);
      }).catch(function (error) {
        alert(error)
      })
    },
    /*
    created() {
      window.onLocationUpdate = this.onLocationUpdate;
      this.updateLocation()
    },

    mounted() {
      setTimeout(() =>{
        this.updateLocation()
      },1000);
    },
    computed: {
      mlocation() {
        return this.$store.state.appconf.location;
      }
    },
    methods: {
      updateLocation() {
        console.log("update Location Enter")
        try {
          let method = "send";//js调用的android方法名
          let action = "getLocation";//打电话动作
          let params = {"callback": "onLocationUpdate", "action": action};//android接收参数，json格式
          if(window.jsInterface != undefined) {
            window.jsInterface.invokeMethod(method, [JSON.stringify(params)]);
          }
        } catch  (e) {
          //ignore
          console.log("updateLocation:"+e)
        }
      },

      onLocationUpdate(locationInfo) {
        this.$store.commit('SET_LOCATION',locationInfo);
        //try to get Location Code
        this.getLocationCode(locationInfo)
      },

      getLocationCode(location) {
        console.log("getLocationCode location:" + JSON.stringify(location));
        let options = {
          "latitude":location.latitude,
          "longitude":location.longitude,
          "locTime":location.locTime,
          "country":location.country,
          "province":location.province,
          "city":location.city,
          "county":location.district
        }
        this.$api.xapi({
          method: 'post',
          url: '/address/code',
          data: options,
        }).then((response) => {
          let code = response.data.data.code;
          console.log("location code:"+JSON.stringify(code));
          this.$store.commit('SET_LOCATION_CODE',code);
        }).catch(function (error) {
          console.log(error)
          this.finished = true;
        })
      }
    }*/
  }
</script>


<style lang="less" scoped>
  .index {
    width: 100%;
    padding-bottom: 14vw;
    background-color: #F8FCFF;
  }
</style>
