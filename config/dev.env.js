var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  iAppID: '"11"',
  tAppID: '""',
  SERVICE_URL:'"https://api.weesharing.com"',
  TESTSTUB_PAYMENT_URL: '"http://119.3.111.161:8088"',
  SERVR_PHONE_NUM: '"4000797717"',
  GOODS_URL_PREFIX: '"https://iwallet-1258175138.file.myqcloud.com"'
})
