<template lang="html">
  <section class="couponCenter">
    <v-header class="header">
      <h1 slot="title">领券中心</h1>
    </v-header>
    <div class="couponCenterBody">
      <div class="couponCenterHeader">
        <img :src="couponCenterHeaderImg">
      </div>
      <div class="couponCenterMain">

      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      'v-footer': Footer
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 3);
      })
    },
    data() {
      return {
        couponCenterHeaderImg: require('@/assets/icons/ico_couponCenterHeader.jpg'),
      }
    },
    methods: {
      onOrderListBarClick(type) {
        //订单类型
        this.$log("onOrderListBarClick:" + type);
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', type);
        this.$router.push({name: '订单列表页'})
      },
      onCouponCenterClick() {
        this.$log("onCouponCenterClick Enter")
        this.$router.push("/user/couponCenter")
      }

    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .couponCenter {
    width: 100%;
    background-color: #ff4601;
    height: 100vh;

    .couponCenterBody {
      .couponCenterHeader {
        img {
          width: 100%;
          display: inline-block;
        }
      }
      .couponCenterMain{
        width: 100%;
      }
    }
  }
</style>
