<template>
  <header :style="{'background-color':defaultBgColor}">
    <van-row type="flex"
             :style="{'color':backIsDeepColor? 'white':'blank'}">
      <van-col span="3">
        <div style="margin-top: 3px" v-if="this.$api.APP_ID != '10'">
          <van-icon name="arrow-left"@click="closeWindow" v-if="$route.name==='首页'"></van-icon>
          <van-icon name="arrow-left" @click="$router.go(-1)" v-else></van-icon>
        </div>
      </van-col>
      <van-col span="18">
        <slot name="title"></slot>
      </van-col>
      <van-col span="3" style="margin-top: 3px">
        <slot name="right"></slot>
      </van-col>
    </van-row>
  </header>
</template>


<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  header {
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: 0.8em 0.15em 0em 0.15em;
    height: 2.2em;
    background-color: #FF4444;
  }


</style>


<script>
  export default {
    props: ['mBackgroundColor'],
    data() {
      return {
        defaultBgColor: '#FF4444',
        backIsDeepColor: false
      }
    },

    watch: {
      mBackgroundColor: function(newVal){
        this.defaultBgColor = newVal;
        this.isDeepColor(this.defaultBgColor)
      }
    },

    mounted() {
      if(this.mBackgroundColor != undefined) {
        this.defaultBgColor = this.mBackgroundColor;
      }
      this.isDeepColor(this.defaultBgColor)
    },
    methods: {
      isDeepColor(hexColor) {
        if(hexColor != null) {
          if (hexColor.substr(0, 1) == "#") hexColor = hexColor.substring(1);
          hexColor = hexColor.toLowerCase();
          let b = new Array();
          for (let x = 0; x < 3; x++) {
            b[0] = hexColor.substr(x * 2, 2)
            b[3] = "0123456789abcdef";
            b[1] = b[0].substr(0, 1)
            b[2] = b[0].substr(1, 1)
            b[20 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2])
          }
          let grayLevel  =  b[20] * 0.299 +  b[21] * 0.587 +  b[22]* 0.114
          if(grayLevel >= 192)
            this.backIsDeepColor = false
          else
            this.backIsDeepColor = true
        } else {
          //default is #FF44444
          this.backIsDeepColor = true
        }
      },
      closeWindow() {
        if(this.$api.IS_GAT_APP) {
          this.$jsbridge.call("closeWindow");
        }
      },
    }
  }
</script>
