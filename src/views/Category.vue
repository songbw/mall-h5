<template lang="html">
  <div class="wrap">
    <v-header class="header">
      <h1 slot="title">商品分类</h1>
      <router-link :to="{name:'购物车页'}" slot="right">
        <van-icon name="cart" size="1em"/>
      </router-link>
    </v-header>
    <section class="view">
      <v-aside :datas="class1Data.list"/>
      <router-view
        :datas="class1Data.list"
      />
    </section>
  </div>
</template>

<script>

  import Header from '@/common/_header.vue'
  import Aside from '@/components/category/aside.vue'

  export default {
    components: {
      'v-header': Header,
      'v-aside': Aside
    },
    data() {
      return {
        allData: {},
        class1Data: {},
      }
    },
    created() {
      this.$api.xapi({
        method: 'get',
        url: '/category/ones'
      }).then((res) => {
        this.class1Data = res.data.data;
      }).catch((error) => {
      })
    }
  }
</script>

<style lang="less" scoped>
  .wrap {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-flow: column nowrap;
    flex-flow: column nowrap;

    .view {
      width: 100%;
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
  }
</style>
