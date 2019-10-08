<template lang="html">
  <section class="qrcode">
    <div class="qrcodeInfo">
      <qr-code
        :text=text
        size="200"
        color="#000000"
        bg-color="#ffffff"
        error-level="L">
      </qr-code>
      <span class="qrcode_text">
        {{text}}
      </span>
    </div>

  </section>
</template>

<script>
  export default {
    data() {
      return {
        text:"https://goo.gl/9eIWP9",
        showHeader: true
      }
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
      this.text = this.$route.params.text;
      this.$log(this.$route)
    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  .qrcode {
    width: 100%;
    height: 100%;
    top: 0px;

    .qrcodeInfo {
      width: 100%;
      padding-top: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: Center;

      .qrcode_text {
        margin-top: 10px;
        font-weight: lighter;
        color: black;
        .fz(font-size, 35);
      }
    }

  }

</style>
