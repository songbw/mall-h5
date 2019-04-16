<template lang="html">
  <section class="afterSaleService">
    <v-header>
      <h1 slot="title">售后服务</h1>
    </v-header>
    <div class="serviceBody">
      <div class="goodsBox">
        <van-card
          :num="goods.num"
          :price="goods.unitPrice"
          :title="goods.name"
          :thumb="goods.image">
        </van-card>
        <div slot="footer">
          <van-cell title="申请数量:" title-class="requireNumberTitle" >
            <van-stepper v-model="count"/>
          </van-cell>
        </div>
      </div>
      <div class="requireReasonBox">
        <span>XXXXXXXX</span>

      </div>
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
        openId: '',
        count:0
      }
    },


    created() {
      this.goods = this.$route.params.goods;
      this.contact = this.$route.params.contact;
      this.openId = this.$route.params.openId;
      this.count = this.goods.num;
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
       background-color: #f8f8f8;
       .goodsBox{
         .requireNumberTitle{
           .fz(font-size, 32)
         }
         .van-card {
           background-color: #ffffff;
           margin-top: 5px;
           &__price {
             margin-top: 2em;
             .fz(font-size, 30);
           }
         }
       }
       .requireReasonBox{
         background-color: #ffffff;
         margin-top: 10px;
       }
       .discibleQuestion{

       }
       .contactBox{

       }
     }
  }

</style>
