<template lang="html">

  <div class="address">
    <v-header>
      <h1 slot="title">地址编辑</h1>
    </v-header>
    <div class="pay-address">
      <div>
        <p class="main-address-per">收货人:<span>周俊</span></p>
        <p class="main-address-tel">15985698749</p>
      </div>
      <p>收货地址:<span>河南省郑州市中原区秦岭路8号院59号单元28层15号东户第三家</span></p>
    </div>
  </div>
</template>

<script>
  import Util from '../../../util/common'
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header
    },
    data() {
      return {
        confirm: ''
      }
    },

    computed: {

    },
    mounted() {

    },

    beforeCreate() {

    },

    methods: {

    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

</style>
