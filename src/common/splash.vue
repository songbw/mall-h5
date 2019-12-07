<template lang="html">
  <div class="splash"  >
    <div class="centerContext" id="snowflakes-container">

    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        splashImg: require('@/assets/icons/ico_splash.png'),
      }
    },
    mounted() {
      this.snow()
    },
    methods: {
      snow() {
        const Snowflakes = require('magic-snowflakes');
        Snowflakes({
          color: '#ffffff', // Default: "#5ECDEF"
          container: document.querySelector('#snowflakes-container'), // Default: document.body
          count: 100, // 100 snowflakes. Default: 50
          minOpacity: 0.1, // From 0 to 1. Default: 0.6
          maxOpacity: 0.95, // From 0 to 1. Default: 1
          minSize: 8, // Default: 8
          maxSize: 18, // Default: 18
          rotation: true, // Default: true
          speed: 1.5, // The property affects the speed of falling. Default: 1
          wind: false, // Without wind. Default: true
          zIndex: 100 // Default: 9999});
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .splash {
    width: 100%;
    height: 100vh;
    top: 0px;
    background: linear-gradient(45deg,#fc4444,#c779d0,#4bc0c8);
    .centerContext {
      width: 100%;
      height: 100vh;
      background:url('../assets/icons/ico_splash.png') no-repeat center;
      z-index: 1;
    }
  }

</style>
