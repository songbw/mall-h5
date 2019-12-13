import wx from 'weixin-js-sdk'

function configWechat(env, callback) {
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
    baseURL: env.$api.WECHAT_CONFIG_URL,
    url: '/jssdk/sign',
    data: options
  }).then(res => {
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
        if(callback) callback()
      })
    });
}

export {
  configWechat
}

