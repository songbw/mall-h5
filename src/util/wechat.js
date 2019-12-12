const wx = require('weixin-js-sdk')
export const callWechat = (env,action) => {
  let _url = ''
  if (window.__wxjs_is_wkwebview === true) {
    _url = window.location.href.split('#')[0] || window.location.href
  } else {
    _url = window.location.href
  }
  let options = {
    url: _url
  }
  env.$api.xapi({
    method: 'post',
    baseURL: "http://api.weesharing.com/v2/guanaitong-client/",
    url: '/jssdk/sign',
    data: options
  })
    .then(res => {
      console.log(res.data);
      wx.config({
        debug: false,
        appId: res.data.data.appId, // 必填，公众号的唯一标识
        timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.data.signature, // 必填，签名，见附录1
        jsApiList: [
          'chooseWXPay',
          'scanQRCode'
        ]
      })

      wx.ready(() => {
        if(action == 'chooseWXPay') {

        } else if(action == 'scanQRCode') {

        } else {
          //do noting
        }
      })
    });
}

