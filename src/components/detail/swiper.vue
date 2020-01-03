<template lang="html">
  <div class="swiper">
    <div class="shareBox" @click="onShareBtnClick" v-if="showShare">
      <img src="https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_share.png">
    </div>
    <van-swipe :autoplay="4000">
      <van-swipe-item v-for="(k,index) in swiperData" :key="index">
        <img v-lazy="k.imgPath">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>

  export default {
    props: ['swiperData', 'goods'],
    data()  {
      return {
        showShare: false
      }
    },
    created() {
      if(this.$api.APP_ID == '11' || this.$api.APP_ID == '12')
        this.showShare = true
    },
    methods: {
      onShareBtnClick() {
        this.$log('onShareBtnClick Enter')
        this.$log(this.goods)
        let _url = ''
        if (window.__wxjs_is_wkwebview === true) {
          _url = window.location.href.split('#')[0] || window.location.href
        } else {
          _url = window.location.href
        }
        let url = "https://wechat.weesharing.com"+window.location.pathname
        let encodeURL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe5b7d5b7722a1577&redirect_uri="+
           encodeURIComponent(url) + window.location.search +
          "&response_type=code&scope=snsapi_userinfo&state=0102#wechat_redirect"
        this.$log(encodeURL)
        let options = {
          image: this.swiperData[0].imgPath,
          title: "惠民优选",
          content: this.goods.name,
          shareUrl: encodeURL
        }
        sc.share(options,function (res) {
          if (res.code == 0) {
            this.$log("分享成功")
          } else {
            this.$log("分享失败")
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .swiper {
    width: 100%;
    min-height: 20em;
    position: relative;

    .shareBox{
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1;
      img {
        height: 20px;
        width: 20px;
      }
    }
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
