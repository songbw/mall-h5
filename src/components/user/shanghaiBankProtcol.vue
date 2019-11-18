<template lang="html">
  <section class="bankProtocol">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">上海银行电商资金管理业务电子协议</h1>
    </v-header>
    <div class="bankCardProtocolBody">
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
        showHeader: false
      }
    },


    created() {
      this.showHeader = this.$api.HAS_HEADER;
    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .bankProtocol {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .bankCardProtocolBody {
      background-color: #f8f8f8;
    }
  }
</style>
