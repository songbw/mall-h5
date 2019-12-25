<template lang="html">
  <div>{{this.datas}}</div>
</template>

<script>
  export default {
    props: ['datas']
  }
</script>

<style lang="less" scoped>
  div {
    padding-top: 5vw;
    padding-bottom: 18vw;
    text-align: center;
    letter-spacing: .2vw;
    color: rgb(158, 158, 158);
    font-family: Lato, "Microsoft Jhenghei", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    font-weight: 600;
    font-size: 14px;
  }
</style>
