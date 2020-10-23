<template lang="html">
  <div class="splash">
    <div class="centerContext" v-if="this.$api.APP_ID == '12'" :style="{'background-color': '#fbfcfd'}">
        <img src="https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/splash/12/splash.jpg" alt="">
    </div>
    <div class="centerContext" v-else-if="this.$api.APP_ID == '11'" :style="{'background-color': '#fbfcfd'}">
      <img src="https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/splash/11/splash.jpg" alt="">
    </div>
    <div class="centerContext" v-else-if="this.$api.APP_ID == '14'" :style="{'background-color': '#fbfcfd'}">
      <img src="https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/splash/14/splash.jpg" alt="">
    </div>
    <div class="centerContext" v-else  :style="{'background-color': '#fbfcfd'}">
      <img src="https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/splash/00/splash.jpg" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
       /* splashImg: require('@/assets/icons/ico_splash.png'),*/
      }
    },
    mounted() {
/*      if(this.$api.APP_ID != '12') {
        this.snow()
      }*/
    },
    beforeDestroy() {
/*      setTimeout(() => {
        if(this.sf != null) {
          this.sf.destroy()
        }
      }, 5000);*/
    },
    methods: {
/*      snow() {
        const Snowflakes = require('magic-snowflakes');
        this.sf = new Snowflakes({
          color: '#ffffff', // Default: "#5ECDEF"
          container: document.querySelector('#snowflakes-container'), // Default: document.body
          count: 100, // 100 snowflakes. Default: 50
          minOpacity: 0.1, // From 0 to 1. Default: 0.6
          maxOpacity: 0.95, // From 0 to 1. Default: 1
          minSize: 8, // Default: 8
          maxSize: 18, // Default: 18
          rotation: true, // Default: true
          speed: 1, // The property affects the speed of falling. Default: 1
          wind: false, // Without wind. Default: true
          zIndex: 100 // Default: 9999});
        })
        this.sf.start()
      }*/
    }
  }
</script>

<style lang="less" scoped>
  .splash {
    width: 100%;
    height: 100%;
    top: 0px;
 //   background: linear-gradient(45deg,#ca273a,#ca273a,#ca273a);
    .centerContext {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: Center;
      background-color:#ca273a;
      img{
         width: 100%;
         height: 100vh;
      }
    }
  }

</style>
