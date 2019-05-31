<template lang="html">
  <section  class="settlement">
    <v-header class="header">
      <h1 slot="title">确认订单</h1>
    </v-header>
    <div v-if="pageloading" style="padding-top: 2.3em">
      <v-loading></v-loading>
    </div>
    <div class="pay" v-else>
      <div class="pay-body">
        <div class="contact-address-card" @click="editAddressOrList">
          <van-row type="flex">
            <van-col span="22">
              <div v-if="addressCount == 0" class="contact-edit" style="background-color: white">
                您的收获地址为空，点此添加收货地址
              </div>
              <div v-else>
                <van-cell>
                  <template slot="title">
                    <span class="custom-text">{{receiverInfo}}</span>
                    <p>
                      <van-icon name="location"></van-icon>
                      <span class="custom-text">{{receiverAddress}}</span>
                    </p>
                  </template>
                </van-cell>
              </div>
            </van-col>
            <van-col span="2" style="background: white;display: flex;">
              <van-icon class="contact-edit" name="arrow" size="12px"/>
            </van-col>
          </van-row>
        </div>
        <div class="address-line"></div>
        <div class="pay-info">
          <van-cell title="支付方式:" value="现金支付">
          </van-cell>
          <van-cell title="发票:" :value="invoiceDetail" is-link to="/car/invoice">
          </van-cell>
          <van-cell title="优惠券:" :value="invoiceDetail" is-link>
          </van-cell>
        </div>
      </div>
      <div class="pay-list">
        <div class="pay-product">
          <li v-for="item in arregationList" style="list-style: none">
            <div v-if="item.goods.length > 0" class="supplyer">
              <van-cell :title=item.supplyerName icon="shop"/>
              <ul>
                <li v-for="(k,index) in item.goods" :key='index' style="border-bottom: 1px solid #f0f0f0;">
                  <div class="promotionBox" v-if="k.product.promotionInfo != undefined && k.product.promotionInfo.promotionState != -1">
                    <span class="promotionTitle">{{k.product.promotionInfo.promotion[0].tag}}</span>
                    <v-countdown class="promotionCountDown"
                                 @start_callback="countDownS_cb(index,k.product)"
                                 @end_callback="countDownE_cb(index,k.product)"
                                 :startTime="new Date(k.product.promotionInfo.promotion[0].startDate).getTime()"
                                 :endTime="new Date(k.product.promotionInfo.promotion[0].endDate).getTime()"
                                 :secondsTxt="''">
                    </v-countdown>
                  </div>
                  <div v-if="k.product.promotionInfo.promotionState === 1">
                    <div v-if="!k.valid">
                      <van-cell title="商品已售罄，不计入订单" icon="info" style="color: #ff4444"/>
                    </div>
                    <van-card
                      :desc="locationCity"
                      :num="k.product.baseInfo.count"
                      :price="k.checkedPrice-k.product.goodsInfo.promotion[0].discount"
                      :title="k.product.goodsInfo.name"
                      :thumb="k.product.goodsInfo.image"
                      :origin-price="k.checkedPrice">
                    </van-card>
                  </div>
                  <div v-else>
                    <div v-if="!k.valid">
                      <van-cell title="商品已售罄，不计入订单" icon="info" style="color: #ff4444"/>
                    </div>
                    <van-card
                      :num="k.product.baseInfo.count"
                      :price="k.checkedPrice"
                      :title="k.product.goodsInfo.name"
                      :thumb="k.product.goodsInfo.image">
                      <div slot="desc">
                        <span class="prodDesc">{{locationCity}}</span>
                      </div>
                    </van-card>
                  </div>
                </li>
              </ul>
              <div class="supplyerSummery">
                <span
                  style="margin-left: 1em">商品合计: ￥{{item.price.toFixed(2)}}元  ， 运费￥{{item.freight.toFixed(2)}}元 </span>
              </div>
            </div>
          </li>
        </div>
        <div class="pay-footer"></div>
        <van-submit-bar
          :price="allpay"
          button-text="提交订单"
          @submit="onSubmit"
          :tip=tip
        />
      </div>
      <div class="pay-settlement">
        <van-cell title="商品金额:" value=0>
        </van-cell>
        <van-cell title="运费:" :value="invoiceDetail">
        </van-cell>
        <van-cell title="优惠券:" :value="invoiceDetail">
        </van-cell>
      </div>
    </div>
  </section>

</template>

<script>
  import Header from '@/common/_header.vue'
  import Loading from '@/common/_loading.vue'
  import CountDown from '@/common/_vue2-countdown.vue'
  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
      'v-loading': Loading,
      "v-countdown": CountDown
    },
    data() {
      return {
        addressCount: 0,
        freight: 0,
        payCarList: [],
        receiverInfo: '',
        receiverAddress: '',
        addressEmptyInfo: '',
        usedAddress: {},
        invoiceDetail: '',
        pageLoadTimerId: -1,
        pageAction: "common",
        locationCity: "南京"
      }
    },

    computed: {
      pageloading() {
        let loading = this.$store.state.appconf.pageLoading;
        if (!loading) {
          if (this.addressCount == 0)
            this.$dialog.confirm({
              title: '您还没有收货地址，请新增一个吧',
              confirmButtonText: '新增地址'
            }).then(() => {
              //on confirm
              //on confirm
              this.$router.push({name: '地址页'})
            }).catch(() => {
              // on cancel
            });
        }
        return loading;
      },
      selectedCarList() {
        let selectCarList = [];
        let userInfo = this.$store.state.appconf.userInfo
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          let cartList = this.$store.state.appconf.cartList;
          this.$log(cartList)
          cartList.forEach(item => {
            if (item.baseInfo.userId == user.userId && item.baseInfo.choosed) {
              selectCarList.push(item)
            }
          })
        }
        return selectCarList;
      },

      arregationList() {
        let payList = [
          {
            "supplyer": "20",
            "supplyerName": "苏宁易购",
            goods: [],
            price: 0,
            freight: 0
          },
          {
            "supplyer": "30",
            "supplyerName": "唯品会",
            goods: [],
            price: 0,
            freight: 0
          },
          {
            "supplyer": "50",
            "supplyerName": "天猫精选",
            goods: [],
            price: 0,
            freight: 0
          },
          {
            "supplyer": "60",
            "supplyerName": "京东",
            goods: [],
            price: 0,
            freight: 0
          },
          {
            "supplyer": "10",
            "supplyerName": "商城自营",
            goods: [],
            price: 0,
            freight: 0
          },

        ]
        let allPayList = this.$store.state.appconf.payList;
        try {
          allPayList.forEach(item => {
            if (item.product.baseInfo.skuId.startsWith("20")) {//苏宁易购
              payList[0].goods.push(item);
            } else if (item.product.baseInfo.skuId.startsWith("30")) {//唯品会
              payList[1].goods.baseInfo.push(item);
            } else if (item.product.baseInfo.skuId.startsWith("50")) {//天猫精选
              payList[2].goods.push(item);
            } else if (item.product.baseInfo.skuId.startsWith("60")) {//京东
              payList[3].goods.push(item);
            } else { //商城自营
              payList[4].goods.push(item);
            }
          })
          payList.forEach(supplyer => {
            let all = 0;
            supplyer.goods.forEach(item => {
              //this.$log("item:" + JSON.stringify(item))
              if (item.valid) {
                //change for promotion
                if (item.product.promotionInfo.promotionState === 1) {
                  try {
                    all += (item.checkedPrice - item.product.promotionInfo.promotion[0].discount) * item.product.baseInfo.count
                  } catch (e) {
                    all += item.checkedPrice * item.product.baseInfo.count
                  }
                } else {
                  all += item.checkedPrice * item.product.baseInfo.count
                }
              }
            })
            supplyer.price = all;
          })
        } catch (e) {
        }
        return payList;
      },

      // 商品价格总和

      tip() {
        let productPay = 0;
        let freightPay = 0;
        try {
          this.arregationList.forEach(item => {
            // this.$log("allPay item:" + JSON.stringify(item))
            productPay += item.price
            freightPay += item.freight;
          })
        } catch (e) {
        }

        return '商品总价:' + productPay.toFixed(2) + '元   合计运费:' + freightPay.toFixed(2) + '元'
      },

      allpay() {
        let all = 0;
        try {
          this.arregationList.forEach(item => {
            // this.$log("allPay item:" + JSON.stringify(item))
            all += item.price + item.freight;
          })
        } catch (e) {
        }
        return all * 100;
      }
    },

    created() {
      let action = this.$route.params.action;
      if (action == "direct") {
        this.pageAction = "direct";
      }
      this.$store.dispatch('getInvoiceInfo');
      const invoiceInfo = this.$store.state.appconf.invoice;
      this.$log("created:" + invoiceInfo)
      if (invoiceInfo != undefined && invoiceInfo.length > 0) {
        try {
          const invoice = JSON.parse(invoiceInfo);
          if (invoice.invoiceType === "eInvoice") {
            this.invoiceDetail += "电子普票";
          }
          if (invoice.invoiceTitleType === "personal") {
            this.invoiceDetail += "(个人)";
          } else {
            this.invoiceDetail += "(企业)";
          }

        } catch (e) {
          this.$log("invoice:" + e);
        }
      } else {
        const invoice = {
          "invoiceType": "eInvoice",
          "invoiceTitleType": "personal",
          "invoiceEnterpriseName": "",
          "invoiceEnterpriseNumber": ""
        }
        this.$store.dispatch('setInvoicdInfo', JSON.stringify(invoice));
        this.invoiceDetail = "电子普票(个人)";
      }
      this.pageLoadTimerId = setTimeout(() => {
        this.$store.commit('SET_PAGE_LOADING', false);
        this.$log("pageLoading:  10s end")
      }, 10000);
    },

    beforeCreate() {
      let that = this;
      this.$log("pay page mounted Enter")
      this.$store.commit('SET_PAGE_LOADING', true);
      this.$log("pageLoading start,loading is: " + this.$store.state.appconf.pageLoading)
      try {
        let userInfo = this.$store.state.appconf.userInfo;
        this.$log("userInfo:" + userInfo)
        if (!(userInfo == undefined || userInfo.length == 0)) {
          let user = JSON.parse(userInfo)
          let options = {
            "openId": user.userId,
            "pageNo": 1,
            "pageSize": "20",
          }
          // this.$log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/receiver/all',
            data: options,
          }).then((response) => {
            let result = response.data.data.result;
            this.addressCount = result.total;
            if (this.addressCount == 0) {
              this.addressEmptyInfo = "您的收获地址为空，点此添加收货地址";
              this.$store.commit('SET_USED_ADDRESS_ID', -1);
              this.updateUsedAddress();
              this.getCarList();
            } else {
              // this.$log("ADDRESS LIST is:" + JSON.stringify(result.list))
              this.$store.commit('SET_ADDRESS_LIST', result.list);
              this.updateUsedAddress();
              this.getCarList();
            }
          }).catch(function (error) {
            that.$log(error)
          })
        } else {
          this.$log("ERROR!!, not get UserInfo in Pay page")
        }
      } catch (e) {
        that.$log(e)
      }
    },

    beforeDestroy() {
      this.$dialog.close();
    },

    methods: {
      countDownS_cb(index, k) {
        let found = -1;
        for (let i = 0; i < this.payCarList.length; i++) {
          if (this.payCarList[i].product.baseInfo.skuId == k.skuId) {
            found = i;
          }
        }
        if (found != -1) {
          this.payCarList[found].product.promotionInfo.promotionState = Util.getPromotionState(k)
          this.savePayList()
        }
      },
      countDownE_cb(index, k) {
        let found = -1;
        for (let i = 0; i < this.payCarList.length; i++) {
          if (this.payCarList[i].product.baseInfo.skuId == k.skuId) {
            found = i;
          }
        }
        if (found != -1) {
          this.payCarList[found].product.promotionInfo.promotionState = Util.getPromotionState(k)
          let len = this.payCarList[found].product.promotionInfo.promotion.length;
          this.payCarList[found].product.promotionInfo.promotion.splice(0, len);
          this.savePayList()
        }
      },

      See(e) {
        this.$log("jump to:" + e)
        window.location.href = e
        //window.location.replace(e)
      },
      gotoCasherPage(merchantNo, userId, orderNo, amount) {
        let url = this.$api.OPEN_CASHER_URL +
          "?merchantNo=" + merchantNo +
          "&userId=" + userId +
          "&orderNo=" + orderNo +
          "&amount=" + amount +
          "&isOutlink=" + false +
          "&isPayDirect=" + (this.pageAction == 'direct' ? true : false)
        this.See(url);
      },
      savePayList() {
        this.$store.commit('SET_PAY_LIST', this.payCarList);
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },

      updateUsedAddress() {
        this.$log("updateUsedAddress Enter!")
        let address = {};
        let list = this.$store.state.appconf.addressList;
        this.$log("list:" + JSON.stringify(list))
        let id = this.$store.state.appconf.usedAddressId;
        this.$log("updateUsedAddress id:" + id)
        try {
          if (id == undefined || id == -1) {
            if (this.addressCount > 0) {
              for (let i = 0; i < list.length; i++) {
                if (list[i].state == 1) {
                  id = i;
                  address = list[i]
                  break;
                }
              }
              if (id == undefined || id == -1) {
                id = list[0].id;
                address = list[0]
              }
            }
          } else {
            if (this.addressCount > 0) {
              for (let i = 0; i < list.length; i++) {
                if (id == list[i].id) {
                  address = list[i]
                  break;
                }
              }
            }
          }
        } catch (e) {
        }
        if (list.length > 0 && id == -1) {
          id = list[0].id
          address = list[0]
        }
        if (JSON.stringify(address) != "{}") {
          this.receiverInfo = "收货人:" + address.receiverName + "  " + address.mobile
          this.receiverAddress = (address.provinceName != null ? address.provinceName : "") +
            (address.cityName != null ? address.cityName : "") +
            (address.countyName != null ? address.countyName : "") +
            (address.address != null ? address.address : "")
        }
        this.$store.commit('SET_USED_ADDRESS_ID', id);
        this.usedAddress = address
      },

      prefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
      },

      deleteOrderedGoodsInCar() {
        let selStateInCarList = this.$store.state.appconf.selStateInCarList
        this.arregationList.forEach(item => {
          if (item.goods.length > 0) {
            item.goods.forEach(sku => {
              let found = -1;
              for (let i = 0; i < selStateInCarList.length; i++) { //从CarList中删除订单中的货物
                if (selStateInCarList[i].skuId === sku.product.skuId) {
                  found = i;
                  break;
                }
              }
              if (found != -1) {
                selStateInCarList.splice(found, 1);
              }
            })
          }
        })
      },

      getComposedOderOption(userInfo, receiverId) {
        let user = JSON.parse(userInfo)
        let invoiceType = "eInvoice"
        let invoiceTitleName = ""
        let invoiceEnterpriseNumber = ""
        let merchants = []

        let locationCode = this.getLocationCode()

        const invoiceInfo = this.$store.state.appconf.invoice;
        if (invoiceInfo != undefined && invoiceInfo.length > 0) {
          try {
            const invoice = JSON.parse(invoiceInfo);
            invoiceType = invoice.invoiceType
            if (invoice.invoiceTitleType === "personal") {
              invoiceTitleName = "个人"
              invoiceEnterpriseNumber = ""
            } else {
              invoiceTitleName = invoice.invoiceEnterpriseName
              invoiceEnterpriseNumber = invoice.invoiceEnterpriseNumber
            }
          } catch (e) {

          }
        }
        //let selStateInCarList = this.$store.state.appconf.selStateInCarList
        this.arregationList.forEach(item => {
          if (item.goods.length > 0) {
            let skus = []
            item.goods.forEach(sku => {
              //this.$log("onSubmit，sku is:"+JSON.stringify(sku))
              let unitPrice = sku.checkedPrice;
              let promotionId = "";
              let couponId = "";
              if (sku.product.promotionState == 1) {
                unitPrice = sku.checkedPrice - sku.product.promotion[0].discount
                promotionId = sku.product.promotion[0].id
              }
              if (sku.valid) {
                skus.push({
                  "skuId": sku.product.skuId,
                  "num": sku.product.count,
                  "unitPrice": unitPrice,
                  "promotionId": promotionId,
                  "couponId": couponId
                })
              }
            })
            //APP ID 10:无锡市民卡 (2位) + CITY ID (3位)+ 商户 ID (2位)+ 用户ID (8位)
            // let usrId = this.prefixInteger(user.userId, 8);
            let tradeNo = "10" + locationCode.cityId + item.supplyer + user.userId
            merchants.push({
              "tradeNo": tradeNo,//主订单号 = APP ID (2位)+ CITY ID (3位) + 商户ID (2位) + USER ID (8位)
              "merchantNo": item.supplyer, //商户号
              "payment": "01", //支付方式， 现金支付
              "servFee": item.freight, //运费
              "amount": item.price + item.freight,//总价
              "type": 1,//订单类型 0: 实时式订单  1: 预占型订单
              "skus": skus
            })
          }
        })
        // this.$store.commit('SET_SELECTED_CARLIST', selStateInCarList);
        let options = {
          "openId": user.userId,
          "companyCustNo": "11",
          "receiverId": receiverId,//接收地址ID
          "remark": "",//用户自填字段，比如周末不配送
          "invoiceType": invoiceType,
          "invoiceTitleName": invoiceTitleName,
          "invoiceEnterpriseNumber ": invoiceEnterpriseNumber,
          "merchants": merchants
        }
        this.$log("Order options:" + JSON.stringify(options))
        return options;
      },

      openCashPage(user, merchantNo, orderNos, pAnOrderInfo) {
        let that = this;
        pAnOrderInfo.orderAmount = 1 //for test
        let options = {
          "openId": pAnOrderInfo.openId,
          "appId": this.$api.APP_ID,
          "merchantNo": merchantNo,
          "orderNos": orderNos,
          "goodsName": "商品支付订单",
          "amount": pAnOrderInfo.orderAmount
        }
        that.$log("预下单:" + JSON.stringify(options))
        that.$api.xapi({
          method: 'post',
          url: '/zhcs/payment',
          data: options,
        }).then((response) => {
          that.$log("预下单返回 :" + JSON.stringify(response.data))
          if (response.data.msg === "会员不存在") {
            //未开通钱包
            let walletInfo = {
              accessToken: user.accessToken,
              openId: user.openId,
            }
            that.$log("walletInfo:" + JSON.stringify(walletInfo))
            that.$jsbridge.call("dredgeWallet", walletInfo);
          } else {
            if (response.data.data.result != undefined) {
              let orderNo = response.data.data.result.orderNo
              if (that.pageAction == "direct") {
                this.$store.commit('SET_PAY_DIRECT_PRODUCT', '')
              } else {
                that.deleteOrderedGoodsInCar();
              }
              pAnOrderInfo.orderNo = orderNo
              that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
              that.$jsbridge.call("openCashPage", pAnOrderInfo);
            }
          }
        }).catch(function (error) {
          that.$log(error)
        })
      },

      isValidOrder(options) {
        this.$log("isValidOrder:" + JSON.stringify(options))
        let count = 0;
        options.merchants.forEach(merchant => {
            count += merchant.skus.length;
          }
        )
        if (count > 0)
          return true;
        return false;
      },
      onSubmit() {
        let that = this
        that.$log("onSubmit Enter!!!")
        let userInfo = this.$store.state.appconf.userInfo;
        if (!this.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          let receiverId = this.$store.state.appconf.usedAddressId;
          that.$log("onSubmit receiverId is:" + receiverId)
          if (receiverId == undefined || receiverId == -1) {
            this.$dialog.alert({
              title: '请检查收件人信息是否已经填写',
            }).then(() => {
            })
          } else {
            try {
              let options = this.getComposedOderOption(userInfo, receiverId);
              if (this.isValidOrder(options)) {
                if (options != null) {
                  that.$api.xapi({
                    method: 'post',
                    url: '/order',
                    data: options,
                  }).then((response) => {
                    that.$log("onSubmit:" + JSON.stringify(response.data));
                    let result = response.data.data.result;
                    that.$log("result:" + JSON.stringify(result))
                    let orderNo = ""
                    let amount = 0;
                    let merchantNo = ""
                    let orderNos = ""
                    if (result != undefined && result.length > 0 && result[0].orderNo.length > 8) {
                      let len = result[0].orderNo.length;
                      orderNos = JSON.stringify(result[0].orderNo.substr(len - 8)).replace(/\"/g, "");
                      if (options.merchants.length == 1) {//单商户
                        merchantNo = options.merchants[0].merchantNo;
                      }
                      orderNo = this.$api.APP_ID + merchantNo + user.openId + orderNos
                    }
                    if (orderNo.length > 0) {
                      that.$log("orderNo is:" + orderNo)
                      options.merchants.forEach(item => {
                        amount += item.amount;
                      })
                      let pAnOrderInfo = {
                        "accessToken": user.accessToken,
                        "orderNo": '',// orderNo,
                        "orderAmount": amount * 100,//分
                        "openId": user.openId,
                        "businessType": "11"
                      }
                      that.openCashPage(user, merchantNo, orderNos, pAnOrderInfo)
                    } else {
                      that.$log("can not get correct orderNo");
                      that.$toast("服务器失败")
                    }

                  }).catch(function (error) {
                    that.$log(error)
                  })

                }
              } else {
                this.$log("无效订单")
                this.$toast("无效订单")
              }
            } catch (e) {
            }
          }
        } else {
          this.$dialog.alert({
            title: '未获取到用户信息，请检查用户是否已经登录',
          }).then(() => {
          })
        }

      },
      getfreightPay() {
        /////////////查询运费////////////////////////
        let that = this;
        let all = 0;
        let carriges = [];
        let options = {
          "carriages": carriges,
        }
        this.$log("xxxxxxxxxxxxxxxxxxxx")
        this.$log(this.arregationList)
        this.arregationList.forEach(item => {
          if (item.price > 0) {
            carriges.push({
              "amount": item.price,
              "merchantNo": item.supplyer
            })
          }
        })
        that.$log("options is:" + JSON.stringify(options))
        this.$api.xapi({
          method: 'post',
          url: '/prod/carriage',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          this.$log("运费  result is:" + JSON.stringify(result));
          result.forEach(iFreight => {
            this.arregationList.forEach(item => {
              if (iFreight.merchantNo === item.supplyer) {
                item.freight = parseFloat(iFreight.freightFare);
              }
            })
          });
          // this.$log("this.arregationList is:" + JSON.stringify(this.arregationList));
          this.$store.commit('SET_PAGE_LOADING', false);
          this.$log("page loading end");
          if (this.pageLoadTimerId != -1) {
            clearTimeout(this.pageLoadTimerId)
          }
        }).catch(function (error) {
          that.$log(error)
          that.$store.commit('SET_PAGE_LOADING', false);
          that.$log("pageLoading:  error,loading is:" + that.$store.state.appconf.pageLoading)
          this.$log("无法获取到运费")
          if (this.pageLoadTimerId != -1) {
            clearTimeout(this.pageLoadTimerId)
          }
        })
      },
      getCarList() {
        this.$log("carList Enter !!!!!!!!!")
        let that = this;
        let inventorySkus = [];
        let skus = [];
        this.payCarList = [];
        if (this.pageAction == "direct") {
          let payDirectProduct = this.$store.state.appconf.payDirectProduct;
          this.$log("+++++++++++++++++++++");
          this.$log(payDirectProduct);
          if (payDirectProduct.length > 0) {
            let item = JSON.parse(payDirectProduct);
            inventorySkus.push({"skuId": item.skuId, "remainNum": item.count})
            skus.push({"skuId": item.skuId})
            this.payCarList.push({"product": item, "valid": true, "checkedPrice": item.goodsInfo.price})
          }
        } else {
          this.selectedCarList.forEach(item => {
            inventorySkus.push({"skuId": item.baseInfo.skuId, "remainNum": item.baseInfo.count})
            skus.push({"skuId": item.baseInfo.skuId})
            if (item.promotionInfo.promotion.length > 0) {
              item.promotionInfo.promotionState = Util.getPromotionState(item);
            }
            //////////////////
            this.payCarList.push({"product": item, "valid": true, "checkedPrice": item.goodsInfo.price})
          })
        }
        this.$log("paylist:")
        this.$log(this.payCarList)
        let locationCode = this.getLocationCode()
        //////////////////////查询库存//////////////////
        let options = {
          "cityId": locationCode.cityId,
          "countyId": locationCode.countyId,
          "skus": inventorySkus,
        }
        this.$log("options:" + JSON.stringify(options));
        this.$api.xapi({
          method: 'post',
          url: '/prod/inventory',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          this.$log("库存 result is:" + JSON.stringify(result));
          result.forEach(item => {
            for (let i = 0; i < this.payCarList.length; i++) {
              if (this.payCarList[i].product.baseInfo.skuId === item.skuId) {
                if ("1" === item.state) {
                  this.payCarList[i].valid = true
                } else {
                  this.payCarList[i].valid = false
                }
              }
            }
          })
          //////////////////////查询价格//////////////////
          options = {
            "cityId": locationCode.cityId,
            "skus": skus,
          }
          // this.$log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/prod/price',
            data: options,
          }).then((response) => {
            let result = response.data.data.result;
            this.$log("价格 result is:" + JSON.stringify(result));
            result.forEach(item => {
              for (let i = 0; i < this.payCarList.length; i++) {
                // this.$log("价格:" + JSON.stringify(item) + ",i:" + i + ",this.payCarList[i].skuId:" + this.payCarList[i].product.skuId)
                if (item != null && this.payCarList[i].product.baseInfo.skuId == item.skuId) {
                  //this.$log("价格 change true");
                  this.payCarList[i].checkedPrice = item.price
                }
              }
            })
            //开始聚合不同商家
            this.savePayList();
            this.getfreightPay();
          }).catch(function (error) {
            that.$log(error)
          })
        }).catch(function (error) {
          that.$log(error)
        })

      },
      editAddressOrList() {
        this.$log("addressCount:" + this.addressCount)
        if (this.addressCount) { //go to Address List
          this.$router.push({name: '地址列表页'})
        } else { //没有Address //go to Address edit
          this.$router.push({name: '地址页'})
        }
      },

      getLocationCode() {
        let code = {"provinceId": "100", "cityId": "510", "countyId": "06"}//江苏无锡市滨湖区
        if (/*送货地址*/JSON.stringify(this.usedAddress) != "{}") {
          code = this.usedAddress;
          this.locationCity = this.usedAddress.cityName;
        } else if (this.$store.state.appconf.locationCode != undefined &&
          this.$store.state.appconf.locationCode.length > 0) {
          this.$log("code:" + this.$store.state.appconf.locationCode)
          code = this.$store.state.appconf.locationCode;
          this.locationCity = JSON.parse(this.$store.state.appconf.location).city;
        }
        return code
      },
    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  .settlement{
    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }
    .pay {
      width: 100%;
      padding-top: 2.3em;
      background-color: #f0f0f0;
      .custom-text {
        text-align: left;
        .fz(font-size, 30px);
      }
      .pay-body {
        .pay-info {
          background-color: white;
          margin-top: 10px;

          .van-cell {
            background-color: white;
            margin-top: -1px;
          }
        }
        .contact-edit {
          padding: 20px 0;
          text-align: center;
          color: #000000;
          line-height: 30px;
          .fz(font-size, 30);
        }
        .address-line {
          content: '';
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: repeating-linear-gradient(-45deg,
          #ff6c6c 0,
          #ff6c6c 20%,
          transparent 0,
          transparent 25%,
          blue 0,
          blue 45%,
          transparent 0,
          transparent 50%);
          background-size: 80px;
        }
      }
      .pay-list {
        .pay-product {
          .supplyer {
            margin-top: 10px;
            border-radius: 10px;
            padding: 5px;

            background-color: white;
            .promotionBox {
              display: flex;
              margin: 15px 5px 5px 15px;
              .fz(font-size, 25);

              .promotionTitle {
                color: #ff4444;
                font-weight: bold;
              }

              .promotionCountDown {
                margin-left: 10px;
                margin-top: 2px;
                color: black;
                .fz(font-size, 25);
              }
            }

            .supplyerSummery {
              margin-top: 10px;
              font-weight: bold;
              color: #2c3e50;
              padding-bottom: 10px;
            }

            span {
              .fz(font-size, 30);
            }
          }
          li {
            list-style: none;
          }
          .van-card {
            background-color: #ffffff;

            &__price {
              margin-top: 0.5em;
              .fz(font-size, 40);
            }
          }
        }
        .pay-footer {
          background-color: white;
          bottom: 0;
          left: 0;
          width: 100%;
        }
      }
      .pay-settlement {
        margin-top: 10px;
        margin-bottom:5.7em;
      }
    }
  }

</style>
