<template lang="html">
  <div class="swiper">
    <span></span>
    <van-swipe :autoplay="4000">
      <van-swipe-item v-for="(k,index) in swiperData" :key="index">
        <img v-lazy="k.imgPath">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
  export default {
    props: {
      swiperData: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .swiper {
    width: 100%;
    min-height: 20em;

    .van-swipe {
      width: 100%;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .back {
      width: 7vw;
      height: 7vw;
      position: absolute;
      left: 4vw;
      top: 2vw;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      text-align: center;

      span {
        display: inline-block;
        line-height: 7vw;
        .fz(font-size, 40);
        transform: rotate(-180deg);

        &::before {
          color: #fff;
        }
      }

      &:active {
        transform: scale(1.3);
      }
    }
  }
</style>
