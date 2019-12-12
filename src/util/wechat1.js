//weixin-js-sdk应用
const wx = require('weixin-js-sdk')
export default {
  methods: {
    wechatShare(info) {
      // 判断苹果手机
      let _url = ''
      if (window.__wxjs_is_wkwebview === true) {
        _url = window.location.href.split('#')[0] || window.location.href
      } else {
        _url = window.location.href
      }
      // 访问后台接口获取微信参数
      this.$store
        .dispatch('GetWxParam', { url: encodeURIComponent(_url) })
        .then(res => {
          wx.config({
            debug: false,
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: [
              'previewImage',
              'hideAllNonBaseMenuItem',
              'showMenuItems',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'chooseWXPay'
            ] // 必填，需要使用的 JS 接口列表，所有JS接口列表见附录2
          })
        })
        .catch(err => {
          console.log(err)
        })
      wx.ready(() => {
        const share_title = info.title
        const share_desc = info.desc
        const share_link = info.link
        const share_img = info.img
        wx.showOptionMenu()
        wx.onMenuShareTimeline({
          title: share_title, // 分享标题
          link: share_link, // 分享链接
          imgUrl: share_img, // 分享图标
          success: function() {
            this.$toast('已成功分享到朋友圈')
          },
          cancel: function() {
            this.$toast('已取消分享')
          }
        })
        wx.onMenuShareAppMessage({
          title: share_title, // 分享标题
          desc: share_desc, // 分享描述
          link: share_link, // 分享链接
          imgUrl: share_img, // 分享图标
          success: function() {
            this.$toast('已成功分享给您的朋友')
          },
          cancel: function() {
            this.$toast('已取消分享')
          }
        })
      })
    }
  }
}
