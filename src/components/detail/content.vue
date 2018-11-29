<template lang="html">
  <section class="content">
    <li v-for="k in contentData">
      <img :src="k.imgPath">
    </li>
  </section>

</template>

<script>
  export default {
    props: {
      contentData: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .content {
    width: 100%;
    margin-top: 10px;
    border-top: 20px solid #F8FCFF;

    li {
      padding: 1vw;
      list-style: none;
      display: inline-block; //使li对象显示为一行
      img {
        width: 100%;
        display: block;
      }
    }
  }
</style>
