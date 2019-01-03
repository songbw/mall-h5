<template lang="html">
  <mt-swipe :auto="4000">
    <mt-swipe-item v-for="k in datas.list">
        <img :src="k.imageUrl" @click="onClick(k.targetUrl)">
    </mt-swipe-item>
  </mt-swipe>
</template>

<script>
  export default {
    props: {
      datas: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    methods: {
      See(e) {
        window.location.href = e
      },
      onClick(targetId) {
        console.log("onClick:"+targetId);
        if(targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          console.log("id:"+id);
          this.$router.push({ path: '/index/'+id});
         // this.$router.push({ path: '/index/23'});
        } else {
          this.See(targetId);
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  .mint-swipe {
    width: 100%;
    height: 50vw;

    a, img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
