<template lang="html">
  <div class="wrap">
    <v-header v-if="showHeader">
      <h1 slot="title">商品分类</h1>
    </v-header>
    <div class="view">
      <v-aside :datas="class1Data.list"/>
      <router-view
        :datas="class1Data.list"
      />
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>

  import Header from '@/common/_header.vue'
  import Aside from '@/components/category/aside.vue'
  import Footer from '@/common/_footer.vue'

  export default {
    components: {
      'v-header': Header,
      'v-aside': Aside,
      'v-footer':Footer
    },

    beforeRouteEnter(to, from, next) {
      next(vm=>{
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 1);
      })
    },


    data() {
      return {
        allData: {},
        class1Data: {},
        showHeader: true
      }
    },
    created() {
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.PRODUCT_BASE_URL,
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
      margin-bottom: 3.2em;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
  }
</style>
