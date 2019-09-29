<template lang="html">
  <section class="myOptCardDetail">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">惠民优选卡详情</h1>
    </v-header>
    <div class="optCardDetailBody">
      <div class="optCardDetailMain">
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'

  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      'v-footer': Footer
    },

    data() {
      return {
        user: {},
        launchedLoaded: false,
        card: {}
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
      this.user = this.$route.params.user;
      this.card = this.$route.params.card;
      this.$log(this.user)
      this.$log(this.card)
    },

    methods: {
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .myOptCardDetail {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .optCardDetailBody {
      .optCardDetailMain {
        width: 100%;
      }
    }
  }
</style>
