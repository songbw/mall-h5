<template lang="html">
  <section class="content">
    <li v-for="k in contentData">
      <img v-lazy="k.imgPath">
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
    li {
      list-style: none;
      img {
        width: 100%;
        display: block;
      }
    }
  }
</style>
