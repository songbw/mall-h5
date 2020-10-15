var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  iAppID: '"11"',
  tAppID: '""',
  CONFIG_URL: '"https://testapi.weesharing.com"',
  SERVICE_URL:'"https://testapi.weesharing.com"',
  SERVR_PHONE_NUM: '"4000797717"',
  GOODS_URL_PREFIX: '"https://iwallet-1258175138.file.myqcloud.com"'
})
