<template lang="html">
  <section class="main">
      <iframe :src="url" title="" v-if="url.length > 0"></iframe> 
  </section>
</template>

<script>
  export default {
    data() {
      return {
        url: ''
      }
    },

    created() {
      this.$log("@@@@@@@@@@@@@ 关爱通收银台 @@@@@@@@@@@@@@@@@@@@@") 
      this.$log(this.$route.params)     
      if(this.$route.params != undefined && this.$route.params.url != undefined){
        this.url = this.$route.params.url;
      } else {
        this.$log("关爱通收银台url为空")
        this.$router.go(-1)
      }
    },

    methods: {
    }
  }
</script>

<style lang="less" scoped>


  .main {
    width: 100%;
    height: 100%;
    top: 0px;
    iframe{
      width: 100%;
      height: 100%;
    }

  }

</style>
