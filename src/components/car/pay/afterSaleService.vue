<template lang="html">
  <section class="afterSaleService">
    <v-header>
      <h1 slot="title">售后服务</h1>
    </v-header>
    <div class="serviceBody">
      <div class="goodsBox"></div>
      <div class="requireReasonBox"></div>
      <div class="discibleQuestion"></div>
      <div class="contactBox"></div>
    </div>
  </section>
</template>


<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        goods: {},
        contact: {},
        openId: ''
      }
    },


    created() {
      this.goods = this.$route.params.goods;
      this.contact = this.$route.params.contact;
      this.openId = this.$route.params.openId;
      this.$log(this.goods)
      this.$log(this.contact)
      this.$log( this.openId)
    },

    computed: {},

    methods: {}
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  .afterSaleService{
     .serviceBody{
       .goodsBox{

       }
       .requireReasonBox{

       }
       .discibleQuestion{

       }
       .contactBox{

       }
     }
  }

</style>
