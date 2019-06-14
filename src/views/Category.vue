<template lang="html">
  <div class="wrap">
    <v-header class="header" >
      <h1 slot="title">商品分类</h1>
<!--      <router-link :to="{name:'购物车页'}" slot="right">
        <van-icon name="shopping-cart-o" size="1.2em"/>
      </router-link>-->
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

/*    beforeRouteLeave(to, from, next) {
      if (this.flag) {//这是一个点击事件
        //说明我是点击事件的跳转
        next(); //正常执行手机返回键也是正常返回上一个路由
      } else {
        if (from.path !== '/') { //要离开的路由不是site
          next();//
        }
        //说明我是返回事件的跳转
        //next(false);
        this.$router.replace({path: '/'})//返回键要返回的路由
      }
    },*/

    data() {
      return {
        allData: {},
        class1Data: {},
      }
    },
    created() {
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
      margin-bottom: 3em;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
  }
</style>
