<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}">
    <div class="wrap">
<!--      <div v-if="datas.settings.title.show" class="couponBoxTitle">
        <img :src="datas.settings.title.imageUrl">
      </div>-->
    </div>
  </section>
</template>

<script>
  export default {
    props: ['datas', 'mBackgroundColor'],
    data() {
      return {}
    },
    created() {
      this.$log("section Coupon Enter")
      this.$log(this.datas)
      this.$log(this.mBackgroundColor)
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .wrap {
    width: 100%;
    height: 100%;
    top: 0px;
    .couponBoxTitle {
      img {
        width: 100%;
      }
    }
  }

</style>
