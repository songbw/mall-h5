<template lang="html">
  <div class="login">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">商品详情</h1>
    </v-header>
    <div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header
    },
    data() {
      return {
        account: '',
        password: '',
        toggle: !this.$store.state.login.token
      }
    },
    methods: {

    }
  }

</script>

<style lang="less" scoped>
  .login {
  }
</style>
