<template lang="html">
  <section class="settlement">
    <v-header class="header">
      <h1 slot="title">确认订单</h1>
    </v-header>
    <div v-if="pageloading" style="padding-top: 2.3em">
      <v-loading></v-loading>
    </div>
    <div class="pay" v-else>
      <div class='box'>
      </div>
      <div class="box_after"></div>
      <div class="pay-body">
        <div class="contact-address-card" @click="editAddressOrList">
          <div class="contact-card-left-icon">
            <img :src="icon_conatct_address">
          </div>
          <div class="contact-card-detail">
            <div v-if="addressCount == 0" class="contact-edit">
              您的收获地址为空，点此添加收货地址
            </div>
            <div v-else class="contact-info">
              <p class="recevierInfo">{{receiverName}} <span>{{receiverMobile}}</span></p>
              <span class="recevierAddress">{{receiverAddress}}</span>
            </div>
          </div>
          <div class="contact-card-right-icon">
            <van-icon class="contact-edit" name="arrow" size="12px"/>
          </div>
        </div>
        <div class="pay-list">
          <div class="pay-product">
            <li v-for="item in arregationList" style="list-style: none">
              <div v-if="item.goods.length > 0" class="supplyer">
                <van-cell :title=item.merchantName icon="shop"/>
                <ul>
                  <li v-for="(k,index) in item.goods" :key='index' style="border-bottom: 1px solid #f0f0f0;">
                    <div class="promotionBox"
                         v-if="k.product.promotionInfo.promotion!= undefined && k.product.promotionInfo.promotionState != -1">
                      <span class="promotionTitle">{{k.product.promotionInfo.promotion[0].tag}}</span>
                      <v-countdown class="promotionCountDown"
                                   @start_callback="countDownS_cb(index,k)"
                                   @end_callback="countDownE_cb(index,k)"
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
                        :price="k.product.goodsInfo.dprice"
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
                        :price="k.product.goodsInfo.dprice"
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
            v-track-event="{category:'提交订单', action:'click'}"
          />
        </div>
        <div class="pay-info">
          <van-cell title="支付方式:" value="现金支付">
          </van-cell>
          <van-cell title="发票:" :value="invoiceDetail">
            <van-icon style="margin: 5px;" slot="right-icon" name="weapp-nav" class="custom-icon"
                      @click="showInvoiceSelector()"/>
          </van-cell>
          <van-cell title="优惠券:">
            <div slot="default">
              <span>{{couponUsedTip}}</span>
            </div>
            <van-icon style="margin: 5px;" slot="right-icon" name="weapp-nav" class="custom-icon"
                      @click="showCouponSelector()"/>
          </van-cell>
          <van-actionsheet v-model="showInvoice" title="发票">
            <div class="invoice_layout">
              <h1 class="section-title">
                发票类型
              </h1>
              <div class="RadioStyle">
                <input type="radio" id="eInvoice" value="eInvoice" v-model="invoiceType">
                <label for="eInvoice">电子普通发票</label>
              </div>
              <h1 class="section-title">
                发票抬头
              </h1>
              <div class="RadioStyle">
                <input type="radio" id="personalInvoice" value="personal" v-model="invoiceTitleType">
                <label for="personalInvoice">个人</label>
                <input type="radio" id="enterpriseInvoice" value="enterprise" v-model="invoiceTitleType">
                <label for="enterpriseInvoice">企业</label>
              </div>
              <div class="enterpriseInfo" v-if="invoiceTitleType==='enterprise'">
                <van-cell-group>
                  <van-field
                    v-model="invoiceEnterpriseName"
                    required
                    placeholder="请填写单位名称"
                  />

                  <van-field
                    v-model="invoiceEnterpriseNumber"
                    required
                    placeholder="请填写纳税人识别号"
                  />
                </van-cell-group>
              </div>
              <div class="tip">
                <p>
                  温馨提示： 电子发票与纸票具有相同的法律效力，可以做为维权,保修，报销的有效凭据，且不存在损毁丢失的情况，您永远也不必担心发票损失。
                  订单签收后可在订单详情下载您的电子普通发票。
                </p>
              </div>
              <div class="footer_layout">
                <van-button type="primary" size="large" @click="confirmedInvoiceSelector">确定</van-button>
              </div>
            </div>
          </van-actionsheet>
          <van-actionsheet v-model="showCoupon" title="可用优惠券">
            <div v-if="couponList.length > 0" class="coupon_layout">
              <div class="coupon_main">
                <span class="couponTip">请选择优惠券， 一次仅限一张</span>
                <van-radio-group v-model="radio">
                  <div v-for="coupon in couponList">
                    <van-cell clickable @click=onCouponListClick(coupon) style="background-color: #f0f0f0"
                              v-if="coupon.couponInfo.rules.couponRules.type === 0">
                      <div slot="default" class="coupon-selector">
                        <div class="coupon-title">
                          <div style="margin-top: 30px">
                            <span style="font-size: large; font-weight: bold">￥</span>
                            <span style="font-size: xx-large;font-weight: bold">{{coupon.couponInfo.rules.couponRules.fullReduceCoupon.reducePrice}}</span>
                          </div>
                          <span>{{formateCouponDescription(coupon.couponInfo.rules.couponRules)}}</span>
                        </div>
                        <div class="coupon-detail">
                          <div>
                            <span v-if="coupon.couponInfo.rules.scenario.type===1">仅限某些指定的商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===2">全场商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===3">仅限定某些品牌类商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===4">限提供所描述特定的服务</span>
                          </div>
                          <span style="font-size: small">{{formatEffectiveDateTime(coupon.couponInfo.effectiveStartDate,coupon.couponInfo.effectiveEndDate)}}</span>
                        </div>
                        <div class="coupon-radio">
                          <van-radio :name=coupon.userCouponCode @click="onRadioBtnClick(coupon)"></van-radio>
                        </div>
                      </div>
                    </van-cell>
                    <van-cell clickable @click=onCouponListClick(coupon) style="background-color: #f0f0f0"
                              v-if="coupon.couponInfo.rules.couponRules.type === 1">
                      <div slot="default" class="coupon-selector">
                        <div class="coupon-title">
                          <div style="margin-top: 30px">
                            <span style="font-size: large; font-weight: bold">￥</span>
                            <span style="font-size: xx-large;font-weight: bold">{{coupon.couponInfo.rules.couponRules.cashCoupon.amount}}</span>
                          </div>
                          <span>{{formateCouponDescription(coupon.couponInfo.rules.couponRules)}}</span>
                        </div>
                        <div class="coupon-detail">
                          <div>
                            <span v-if="coupon.couponInfo.rules.scenario.type===1">仅限某些指定的商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===2">全场商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===3">仅限定某些品牌类商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===4">限提供所描述特定的服务</span>
                          </div>
                          <span style="font-size: small">{{formatEffectiveDateTime(coupon.couponInfo.effectiveStartDate,coupon.couponInfo.effectiveEndDate)}}</span>
                        </div>
                        <div class="coupon-radio">
                          <van-radio :name=coupon.userCouponCode @click="onRadioBtnClick(coupon)"></van-radio>
                        </div>
                      </div>
                    </van-cell>
                    <van-cell clickable @click=onCouponListClick(coupon) style="background-color: #f0f0f0"
                              v-if="coupon.couponInfo.rules.couponRules.type === 2">
                      <div slot="default" class="coupon-selector">
                        <div class="coupon-title">
                          <div style="margin-top: 30px">
                            <span style="font-size: xx-large;font-weight: bold">{{coupon.couponInfo.rules.couponRules.discountCoupon.discountRatio * 10}}</span>
                            <span style="font-size: large; font-weight: bold">折</span>
                          </div>
                          <span>{{formateCouponDescription(coupon.couponInfo.rules.couponRules)}}</span>
                        </div>
                        <div class="coupon-detail">
                          <div>
                            <span v-if="coupon.couponInfo.rules.scenario.type===1">仅限某些指定的商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===2">全场商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===3">仅限定某些品牌类商品</span>
                            <span v-if="coupon.couponInfo.rules.scenario.type===4">限提供所描述特定的服务</span>
                          </div>
                          <span style="font-size: small">{{formatEffectiveDateTime(coupon.couponInfo.effectiveStartDate,coupon.couponInfo.effectiveEndDate)}}</span>
                        </div>
                        <div class="coupon-radio">
                          <van-radio :name=coupon.userCouponCode @click="onRadioBtnClick(coupon)"></van-radio>
                        </div>
                      </div>
                    </van-cell>
                  </div>
                </van-radio-group>
              </div>

              <div class="coupon_footer">
                <van-button type="danger" size="large" @click="confirmedCouponSelector()">确定</van-button>
              </div>
            </div>
            <div v-else>
              <div class="noCoupon">
                <img :src="icon_noCoupon">
                <span>您暂无可用的优惠券</span>
              </div>
            </div>
          </van-actionsheet>
        </div>
        <div class="pay-settlement">
          <van-cell title="商品金额:">
            <div slot="default">
              <span style="color: black">￥{{productPay}}</span>
            </div>
          </van-cell>
          <van-cell title="运费:">
            <div slot="default">
              <span style="color: #ff4444">+￥{{freightPay}}</span>
            </div>
          </van-cell>
          <van-cell title="优惠券:">
            <div slot="default">
              <span style="color: #ff4444">-￥{{couponReducedPrice(this.usedCoupon)}}</span>
            </div>
          </van-cell>
        </div>
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
        icon_noCoupon: require('@/assets/icons/ico_noCoupon.png'),
        icon_conatct_address: require('@/assets/icons/ico_contact_address.png'),
        addressCount: 0,
        freight: 0,
        payCarList: [],
        receiverName: '',
        receiverMobile: '',
        receiverAddress: '',
        addressEmptyInfo: '',
        usedAddress: {},
        invoiceDetail: '',
        pageLoadTimerId: -1,
        pageAction: "common",
        locationCity: "南京",
        showCoupon: false,
        showInvoice: false,
        radio: '',
        invoiceRadio: '',
        lastRadio: '',
        usedCoupon: null,
        reducedPriceOfCoupon: 0,
        totalSkuPriceOfCoupon: 0,
        couponTypes: [
          {
            "title": "未使用",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "status": -1,
            "loading": false,
            "finished": false,
          }
        ],
        invoiceType: 'eInvoice',
        invoiceTitleType: 'personal',
        invoiceEnterpriseName: '',
        invoiceEnterpriseNumber: '',
        merchantList: []
      }
    },

    computed: {
      couponUsedTip() {
        if (this.couponList.length > 0) {
          if (this.usedCoupon != null) {
            return "优惠￥" + this.couponReducedPrice(this.usedCoupon)
          } else {
            return this.couponList.length + "张可用"
          }
        } else {
          return "无可用优惠券"
        }
      },
      pageloading() {
        let loading = this.$store.state.appconf.pageLoading;
        if (!loading) {
          if (this.addressCount == 0)
            this.$dialog.confirm({
              title: '您还没有收货地址，请新增一个吧',
              confirmButtonText: '新增地址'
            }).then(() => {
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
          cartList.forEach(item => {
            if (item.baseInfo.userId == user.userId && item.baseInfo.choosed) {
              selectCarList.push(item)
            }
          })
        }
        return selectCarList;
      },

      couponList() {
        let couponList = []
        let allPayList = this.$store.state.appconf.payList;
        this.couponTypes[0].list.forEach(item => {
          let found = -1;
          for (let i = 0; i < allPayList.length; i++) {
            if (allPayList[i].valid && allPayList[i].product.couponList != undefined) {
              for (let j = 0; j < allPayList[i].product.couponList.length; j++) {
                if (allPayList[i].product.couponList[j].id === item.couponId) {
                  //选出选购商品所有对应的优惠券
                  found = j;
                  break;
                }
              }
            }
            if (found != -1) {
              break;
            }
          }
          if (found != -1 && item.couponInfo.rules.couponRules.type != 3) {
            couponList.push(item)
          }
        })

        //已经选出选购商品所有对应的优惠券
        //判断优惠券是否满足条件
        let avaliableCouponList = []
        //this.$log(couponList)
        couponList.forEach(coupon => {
          if (coupon.couponInfo.rules.couponRules.type === 0 ||
            coupon.couponInfo.rules.couponRules.type == 2) { //券不考虑活动折扣
            let fullPrice = 0;
            allPayList.forEach(payItem => {
              if (payItem.valid) {
                for (let i = 0; i < payItem.product.couponList.length; i++) {
                  if (payItem.product.couponList[i].id === coupon.couponInfo.id) {
                    fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                    break;
                  }
                }
              }
            })
            switch (coupon.couponInfo.rules.couponRules.type) {
              case 0:
                if (fullPrice < coupon.couponInfo.rules.couponRules.fullReduceCoupon.fullPrice) {
                  //nothing to do
                } else {
                  avaliableCouponList.push(coupon)
                }
                break;
              case 2:
                if (fullPrice < coupon.couponInfo.rules.couponRules.discountCoupon.fullPrice) {
                  //nothing to do
                } else {
                  avaliableCouponList.push(coupon)
                }
                break;
              default:
                avaliableCouponList.push(coupon)
                break;
            }
          } else {
            avaliableCouponList.push(coupon)
          }
        });
        return avaliableCouponList;
      },

      arregationList() {
        let merchantList = this.$store.state.appconf.merchantList;
        let arregationPayList = [];
        merchantList.forEach(item => {
          arregationPayList.push(
            {
              "merchantCode": item.merchantCode,
              "merchantName": item.merchantName,
              "merchantId": item.merchantId,
              "goods": [],
              price: 0,
              freight: 0
            }
          )
        });

        let allPayList = this.$store.state.appconf.payList;
        try {
          allPayList.forEach(item => {
            if (item.product.promotionInfo != undefined) {
              item.product.promotionInfo['promotionState'] = Util.getPromotionState(item.product.promotionInfo)
              item.product.goodsInfo['dprice'] = Util.getDisplayPrice(item.checkedPrice, item.product.promotionInfo)
            }
            if (item.product.baseInfo.merchantId = 2) {//aoyi
              let itemMerchantCode = item.product.baseInfo.mpu.substring(0, 2)
              arregationPayList.forEach(merchant => {
                  if (itemMerchantCode === merchant.merchantCode) {
                    merchant.goods.push(item)
                  }
                }
              )
            } else {
              arregationPayList.forEach(merchant => {
                  if (item.product.baseInfo.merchantId === merchant.merchantId) {
                    merchant.goods.push(item)
                  }
                }
              )
            }
          })

          arregationPayList.forEach(merchant => {
            let all = 0;
            merchant.goods.forEach(item => {
              if (item.valid) {
                all += item.product.goodsInfo.dprice * item.product.baseInfo.count
              }
            })
            merchant.price = all;
          })
        } catch (e) {
        }
        this.$log("~~~~~~~~~~~~~~~~~~")
        this.$log(arregationPayList);
        return arregationPayList;
      },

      tip() {
        return this.receiverAddress
      },

      freightPay() {
        let freightPay = 0;
        try {
          this.arregationList.forEach(item => {
            freightPay += item.freight;
          })
        } catch (e) {
        }
        return freightPay.toFixed(2)
      },

      productPay() {
        let productPay = 0;
        try {
          this.arregationList.forEach(item => {
            productPay += item.price
          })
        } catch (e) {
        }
        return productPay.toFixed(2)
      },

      allpay() {
        let all = 0;
        all = this.productPay * 100 + this.freightPay * 100 - this.couponReducedPrice(this.usedCoupon) * 100
        return all;
      },
    },

    created() {
      this.obtainMerchantArray();
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
            baseURL: this.$api.ORDER_BASE_URL,
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
      obtainMerchantArray() {
        let that = this;
        this.$api.xapi({
          method: 'get',
          baseURL: this.$api.PRODUCT_BASE_URL,
          url: '/merchantCode/all',
        }).then((response) => {
          let result = response.data.data.result;
          result.forEach(item => {
            let merchantItem = {
              "merchantCode": item.merchantCode,
              "merchantName": item.merchantName,
              "merchantId": item.merchantId,
            }
            this.merchantList.push(merchantItem);
          })
          this.saveMechantList();
        }).catch(function (error) {
          that.$log(error)
        })
      },
      onRadioBtnClick(coupon) {
        this.$log("onRadioBtnClick Enter")
        this.$log(this.radio)
        this.$log(this.lastRadio)
        if (this.lastRadio == this.radio) {
          this.radio = ''
          this.usedCoupon = null;
        } else {
          this.usedCoupon = coupon;
        }
        this.lastRadio = this.radio
      },

      getUsedCouponDetail4Order(coupon) {
        this.$log("getUsedCouponDetail4Order Enter")
        this.$log(coupon)
        if (coupon != null) {
          let merchants = []
          this.arregationList.forEach(item => {
            if (item.goods.length > 0) {
              let skus = []
              item.goods.forEach(sku => {
                if (sku.valid) {
                  this.$log(sku)
                  let found = -1
                  for (let i = 0; i < sku.product.couponList.length; i++) {
                    if (sku.product.couponList[i].id === coupon.couponId) {
                      found = i
                      break;
                    }
                  }
                  if (found != -1) {
                    skus.push({
                      "skuId": sku.product.baseInfo.skuId,
                      "num": sku.product.baseInfo.count,
                    })
                  }
                }
              })
              merchants.push({
                "merchantNo": item.merchantCode,
                "skus": skus
              })
            }
          })
          let couponInfo = {
            'id': coupon.id,
            'code': coupon.userCouponCode,
            'discount': parseFloat(this.reducedPriceOfCoupon),
            "merchants": merchants
          }
          return couponInfo
        } else {
          return null
        }
      },

      getSalePrice(sku) {
        let salePrice = parseFloat(sku.product.goodsInfo.dprice)
        if (this.usedCoupon != null) {
          let found = -1
          for (let i = 0; i < sku.product.couponList.length; i++) {
            if (sku.product.couponList[i].id === this.usedCoupon.couponId) {
              found = i
              break;
            }
          }
          if (found != -1) { //sku 使用了该优惠券
            if (this.totalSkuPriceOfCoupon != 0) {
              salePrice = sku.product.goodsInfo.dprice - this.reducedPriceOfCoupon * sku.product.goodsInfo.dprice / this.totalSkuPriceOfCoupon
            }
          }
        }
        return salePrice.toFixed(2)
      },

      couponReducedPrice(coupon) {
        let reducePrice = 0;
        let fullPrice = 0;
        if (coupon != null) {
          let allPayList = this.$store.state.appconf.payList;
          allPayList.forEach(payItem => {
            if (payItem.valid) {
              for (let i = 0; i < payItem.product.couponList.length; i++) {
                if (payItem.product.couponList[i].id === coupon.couponInfo.id) {
                  fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                  break;
                }
              }
            }
          })
          switch (coupon.couponInfo.rules.couponRules.type) {
            case 0:
              reducePrice = coupon.couponInfo.rules.couponRules.fullReduceCoupon.reducePrice;
              break;
            case 1:
              reducePrice = coupon.couponInfo.rules.couponRules.cashCoupon.amount;
              break;
            case 2:
              reducePrice = fullPrice * (1 - coupon.couponInfo.rules.couponRules.discountCoupon.discountRatio)
              break;
            default:
              break;
          }
        }
        this.reducedPriceOfCoupon = reducePrice.toFixed(2)
        this.totalSkuPriceOfCoupon = fullPrice.toFixed(2)
        return reducePrice.toFixed(2);
      },
      onCouponListClick(coupon) {
        this.$log("onCouponListClick Enter")
        //this.$log(coupon)
        if (this.radio === coupon.userCouponCode) {
          this.radio = ''
          this.usedCoupon = null;
        } else {
          this.radio = coupon.userCouponCode
          this.usedCoupon = coupon;
        }
        this.lastRadio = this.radio
      },

      formateCouponDescription(rules) {
        switch (rules.type) {
          case 0://满减券
            return '满' + rules.fullReduceCoupon.fullPrice + '元可用';
          case 1://代金券
            return '代金券';
          case 2://折扣券
            if (rules.discountCoupon.fullPrice > 0) {
              return '满' + rules.discountCoupon.fullPrice + '元可用';
            } else {
              return '折扣券 ';
            }
          default:
            return ""
        }
      },

      formatEffectiveDateTime(effectiveStartDate, effectiveEndDate) {
        return this.$moment(effectiveStartDate).format('YYYY.MM.DD') + ' - ' + this.$moment(effectiveEndDate).format('YYYY.MM.DD');
      },
      onCouponLoad(index) {
        this.$log("onCouponLoad:" + index)
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!that.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          if (that.couponTypes[index].total == -1 || that.couponTypes[index].total > that.couponTypes[index].list.length) {
            that.couponTypes[index].loading = true;
            let options =
              {
                userOpenId: user.userId,
                status: index + 1,
                "offset": that.couponTypes[index].pageNo++,
                "limit": 50
              }
            that.$api.xapi({
              method: 'post',
              baseURL: this.$api.EQUITY_BASE_URL,
              url: '/coupon/CouponByOpenId',
              data: options
            }).then((response) => {
              let result = response.data.data.result;
              that.$log(result)
              that.couponTypes[index].total = result.total;
              if (result.list == undefined || result.list.length == 0) {
                that.couponTypes[index].loading = false;
                that.couponTypes[index].finished = true;
              } else {
                result.list.forEach(item => {
                  that.couponTypes[index].list.push(item);
                })
                that.couponTypes[index].loading = false;
                if (that.couponTypes[index].list.length >= that.couponTypes[index].total) {
                  that.couponTypes[index].finished = true;
                  that.$log("index:" + index);
                  that.$log(that.couponTypes[index]);
                }
              }
              if (!that.couponTypes[index].finished) {
                that.onCouponLoad(index);
              }
            }).catch(function (error) {
              that.$log(error)
              that.couponTypes[index].loading = false;
              that.couponTypes[index].finished = true;
            })
          }
        }
      },

      showCouponSelector() {
        this.showCoupon = true
      },
      showInvoiceSelector() {
        this.$log("showInvoiceSelector Enter")
        this.showInvoice = true
      },
      confirmedCouponSelector() {
        this.$log(this.radio);

        this.showCoupon = false
      },

      confirmedInvoiceSelector() {
        this.$log(this.invoiceRadio);
        if (this.invoiceTitleType != "personal" && (this.invoiceEnterpriseName.length == 0 || this.invoiceEnterpriseNumber == 0)) {
          this.$toast("请正确填写企业名称与纳税人识别号!")
          return
        }
        const invoice = {
          "invoiceType": this.invoiceType,
          "invoiceTitleType": this.invoiceTitleType,
          "invoiceEnterpriseName": this.invoiceEnterpriseName,
          "invoiceEnterpriseNumber": this.invoiceEnterpriseNumber
        }
        this.$store.dispatch('setInvoicdInfo', JSON.stringify(invoice));
        if (invoice.invoiceType === "eInvoice") {
          this.invoiceDetail = "电子普票";
        }
        if (invoice.invoiceTitleType === "personal") {
          this.invoiceDetail += "(个人)";
        } else {
          this.invoiceDetail += "(企业)";
        }
        this.showInvoice = false
      },

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
        this.$log("save Pay List Enter")
        this.$log(this.payCarList)
        this.$store.commit('SET_PAY_LIST', this.payCarList);
      },
      saveMechantList() {
        this.$log("save Merchant List Enter")
        this.$log(this.merchantList)
        this.$store.commit('SET_MERCHANT_LIST', this.merchantList);
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
          this.receiverName = address.receiverName
          this.receiverMobile = address.mobile
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
        this.$log("deleteOrderedGoodsInCar Enter")
        let allPayList = this.$store.state.appconf.payList;
        try {
          allPayList.forEach(item => {
            Util.deletCartItem(this, item.product)
          })
        } catch (e) {
        }
      },

      getComposedOrderOption(userInfo, receiverId) {
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

        this.arregationList.forEach(item => {
          if (item.goods.length > 0) {
            let skus = []
            let saleAmount = item.freight;
            let amount = item.freight;
            item.goods.forEach(sku => {
              if (sku.valid) {
                let promotionId = 0
                if (sku.product.promotionInfo.promotionState == 1) {
                  promotionId = sku.product.promotionInfo.promotion[0].id
                }
                let unitPrice = parseFloat(sku.checkedPrice).toFixed(2)
                let salePrice = this.getSalePrice(sku)
                saleAmount += salePrice * sku.product.baseInfo.count
                amount += unitPrice * sku.product.baseInfo.count
                skus.push({
                  "skuId": sku.product.baseInfo.skuId,
                  "mpu": sku.product.baseInfo.mpu,
                  "merchantId": sku.product.baseInfo.merchantId,
                  "num": sku.product.baseInfo.count,
                  "unitPrice": unitPrice,
                  "salePrice": salePrice,
                  "promotionId": promotionId,
                  "promotionDiscount": (unitPrice - sku.product.goodsInfo.dprice).toFixed(2)
                })
              }
            })
            //APP ID 10:无锡市民卡 (2位) + CITY ID (3位)+ 商户 ID (2位)+ 用户ID (8位)
            // let usrId = this.prefixInteger(user.userId, 8);
            let tradeNo = "10" + locationCode.cityId + item.merchantCode + user.userId
            merchants.push({
              "tradeNo": tradeNo,//主订单号 = APP ID (2位)+ CITY ID (3位) + 商户ID (2位) + USER ID (8位)
              "merchantNo": item.merchantCode, //商户号
              "merchantId": item.merchantId,
              "payment": "01", //支付方式， 现金支付
              "servFee": item.freight, //运费
              "amount": amount,     //应给商户的实际总价
              "saleAmount": saleAmount,//用户支付给商户的实际总价 = 单品salePrice*number + 运费
              "type": 1,//订单类型 0: 实时式订单  1: 预占型订单
              "skus": skus
            })
          }
        })
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

        let couponInfo = this.getUsedCouponDetail4Order(this.usedCoupon)
        if (couponInfo != null) {
          options['coupon'] = couponInfo;
        }
        this.$log("Order options:")
        this.$log(options)
        return options;
      },

      openCashPage(user, merchantNo, orderNos, pAnOrderInfo) {
        let that = this;
        //pAnOrderInfo.orderAmount = 1 //for test
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
          baseURL: this.$api.SSO_BASE_URL,
          // url: '/zhcs/payment',
          url: '/payment/pingan',
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
              pAnOrderInfo.orderNo = orderNo
              that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
              that.$jsbridge.call("openCashPage", pAnOrderInfo);
              this.$router.replace({
                name: "收银台页",
                params: {
                  orderInfo: pAnOrderInfo
                }
              })
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
              let options = this.getComposedOrderOption(userInfo, receiverId);
              this.$log(JSON.stringify(options))
              if (this.isValidOrder(options)) {
                if (options != null) {
                  that.$api.xapi({
                    method: 'post',
                    baseURL: this.$api.ORDER_BASE_URL,
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
                    this.$log(result.length)
                    this.$log(result[0].tradeNo)
                    if (result != undefined && result.length > 0 && result[0].tradeNo.length > 8) {
                      let len = result[0].tradeNo.length;
                      orderNos = JSON.stringify(result[0].tradeNo.substr(len - 8)).replace(/\"/g, "");
                      if (options.merchants.length == 1) {//单商户
                        merchantNo = options.merchants[0].merchantNo;
                      }
                      orderNo = this.$api.APP_ID + merchantNo + user.openId + orderNos
                    }
                    if (orderNo.length > 0) {
                      that.$log("orderNo is:" + orderNo)
                      options.merchants.forEach(item => {
                        amount += item.saleAmount;
                      })
                      let pAnOrderInfo = {
                        "accessToken": user.accessToken,
                        "orderNo": '',// orderNo,
                        "orderAmount": amount * 100,//分
                        "openId": user.openId,
                        "businessType": "11"
                      }
                      if (that.pageAction == "direct") {
                        this.$store.commit('SET_PAY_DIRECT_PRODUCT', '')
                      } else {
                        that.deleteOrderedGoodsInCar();
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
        this.arregationList.forEach(item => {
          if (item.price > 0) {
            carriges.push({
              "amount": item.price,
              "merchantNo": item.merchantCode
            })
          }
        })
        that.$log("options is:" + JSON.stringify(options))
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.PRODUCT_BASE_URL,
          url: '/prod/carriage',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          this.$log("运费  result is:" + JSON.stringify(result));
          result.forEach(iFreight => {
            this.arregationList.forEach(item => {
              if (iFreight.merchantNo === item.merchantCode) {
                item.freight = parseFloat(iFreight.freightFare);
              }
            })
          });
          this.$store.commit('SET_PAGE_LOADING', false);
          this.$log("page loading end");
          if (this.pageLoadTimerId != -1) {
            clearTimeout(this.pageLoadTimerId)
          }
        }).catch(function (error) {
          that.$log(error)
          that.$store.commit('SET_PAGE_LOADING', false);
          that.$log("pageLoading:  error,loading is:" + that.$store.state.appconf.pageLoading)
          that.$log("无法获取到运费")
          if (this.pageLoadTimerId != -1) {
            clearTimeout(this.pageLoadTimerId)
          }
        })
      },
      getUserCouponList() {
        this.onCouponLoad(0);
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
            if (item.baseInfo.merchantId === 2) { //aoyi
              inventorySkus.push({"skuId": item.baseInfo.skuId, "remainNum": item.baseInfo.count})
              skus.push({"skuId": item.baseInfo.skuId})
            }
            this.payCarList.push({"product": item, "valid": true, "checkedPrice": item.goodsInfo.price})
          }
        } else {
          this.selectedCarList.forEach(item => {
            this.$log(item)
            if (item.baseInfo.merchantId === 2) { //aoyi
              inventorySkus.push({"skuId": item.baseInfo.skuId, "remainNum": item.baseInfo.count})
              skus.push({"skuId": item.baseInfo.skuId})
            }
            if (item.promotionInfo.promotion != null && item.promotionInfo.promotion.length > 0) {
              item.promotionInfo.promotionState = Util.getPromotionState(item.promotionInfo);
            }
            //////////////////
            this.payCarList.push({"product": item, "valid": true, "checkedPrice": item.goodsInfo.price})
          })
        }
        this.$log("paylist:")
        this.$log(this.payCarList)
        let locationCode = this.getLocationCode()

        this.savePayList();
        this.getUserCouponList();

        if (skus.length > 0)
        { //has aoyi product
          //////////////////////查询库存//////////////////
          let options = {
            "cityId": locationCode.cityId,
            "countyId": locationCode.countyId,
            "skus": inventorySkus,
          }
          this.$log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            baseURL: this.$api.PRODUCT_BASE_URL,
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
            this.$log("价格 options:" + JSON.stringify(options));
            this.$api.xapi({
              method: 'post',
              baseURL: this.$api.PRODUCT_BASE_URL,
              url: '/prod/price',
              data: options,
            }).then((response) => {
              let result = response.data.data.result;
              this.$log("价格 result is:" + JSON.stringify(result));
              result.forEach(item => {
                for (let i = 0; i < this.payCarList.length; i++) {
                  // this.$log("价格:" + JSON.stringify(item) + ",i:" + i + ",this.payCarList[i].skuId:" + this.payCarList[i].product.skuId)
                  if (item != null && this.payCarList[i].valid && this.payCarList[i].product.baseInfo.skuId == item.skuId
                  ) {
                    //this.$log("价格 change true");
                    this.payCarList[i].checkedPrice = item.price
                  }
                }
              })
              //开始聚合不同商家
              this.getfreightPay();
            }).catch(function (error) {
              that.$log(error)
            })
          }).catch(function (error) {
            that.$log(error)
          })
        } else {//other merchant
          this.$store.commit('SET_PAGE_LOADING', false);
          this.$log("page loading end");
          if (this.pageLoadTimerId != -1) {
            clearTimeout(this.pageLoadTimerId)
          }
        }
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

  .settlement {
    width: 100%;
    height: 100%;
    top: 0px;

    .header {
      width: 100%;
      position: fixed;
      z-index: 5;
      top: 0;
    }

    .pay {
      width: 100%;
      top: 0px;
      background-color: #f8f8f8;
      padding-top: 3em;
      padding-bottom: 10px;

      .box {
        padding-top: .5em;
        position: relative;
        width: 100%;
        line-height: 12vw;
        background-color: #ff4444;

        .userHeader {
          width: 100%;
          line-height: 12vw;
          background-size: auto 100%;
          padding: 3.2vw 0;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;

          .headerTitle {
            display: flex;
            flex-direction: row;
            width: 90%;

            .header-icon {
              margin-left: 5vw;

              img {
                display: inline-block;
                border-radius: 50%;
                height: 50px;
                width: 50px;
              }
            }

            > span {
              margin-top: 1vw;
              margin-left: 3.2vw;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              word-break: break-all;
              .fz(font-size, 30);
              color: #ffffff;
              letter-spacing: .3vw;
            }
          }

          .header-right {
            width: 10%;
            display: flex;
            flex-direction: row;

            .van-icon {
              width: 100%;
              float: right;
              color: white;
            }
          }
        }
      }

      .box_after {
        bottom: -60px;
        height: 60px;
        border-radius: 0 0 30% 30%;
        background-color: #ff4444;
        overflow: hidden;
        z-index: -1;
      }


      .custom-text {
        text-align: left;
        .fz(font-size, 30px);
      }

      .pay-body {
        margin-top: -50px;

        .contact-address-card {
          background-color: white;
          height: 80px;
          border-radius: 10px;
          margin: 10px;
          display: flex;
          flex-direction: row;

          .contact-card-left-icon {
            line-height: 80px;

            img {
              width: 35px;
              height: 35px;
              margin-top: -5px;
              margin-left: 10px;
            }
          }

          .contact-card-detail {
            width: 100%;
            height: 80px;
            justify-content: center;
            margin-left: 10px;

            .contact-edit {
              line-height: 80px;
              text-align: center;
              color: #000000;
              .fz(font-size, 30);
            }

            .contact-info {
              display: flex;
              flex-direction: column;
              height: 80px;
              font-size: large;
              justify-items: center;
              margin-top: 15px;
              color: black;

              .recevierInfo {
                margin: 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
                .fz(font-size, 35);

                > span {
                  .fz(font-size, 25);
                  color: #8a8a8a;
                }
              }

              .recevierAddress {
                margin: 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
                .fz(font-size, 25);
              }
            }
          }

          .contact-card-right-icon {
            line-height: 80px;
            margin-right: 10px;
          }

        }

        .pay-info {
          margin: 10px;
          background-color: white;
          padding: 2px;
          border-radius: 10px;

          .van-cell {
            background-color: white;
            margin-top: -1px;
          }

          .invoice_layout {
            width: 100%;
            text-align: center;

            .enterpriseInfo {
              margin: 1.2em;
            }

            .tip {
              margin: 1.2em;
              .fz(font-size, 25);
              text-align: left;
            }

            .RadioStyle {
              display: flex;
              margin: 1em;

              input {
                display: none
              }

              label {
                border: 1px solid #00a4ff;
                padding: 2px 10px 2px 5px;
                line-height: 28px;
                min-width: 80px;
                text-align: center;
                float: left;
                margin: 2px;
                border-radius: 4px
              }

              input:checked + label {
                background: url('../../../assets/images/ico_checkon.svg') no-repeat right bottom;
                background-size: 21px 21px;
                color: #00a4ff
              }
            }

            .section-title {
              background-color: #ffffff;
              text-align: left;
              font-weight: bold;
              margin: 1em;
              .fz(font-size, 35);
              color: #000000;
            }

            .footer_layout {
              margin: 1em;
            }
          }

          .coupon_layout {
            .coupon_main {
              .couponTip {
                padding: 5px;
                color: #000;
                font-size: large;
              }
            }
          }

          .noCoupon {
            width: 100%;
            background-color: #f8f8f8;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: Center;
            height: 300px;

            img {
              margin: 4vw;
            }

            span {
              margin: 2vw;
              color: #8a8a8a;
            }
          }

          .van-radio-group {
            background-color: #f0f0f0;

            .coupon-selector {
              height: 100px;
              display: flex;

              .coupon-title {
                width: 35%;
                display: inline-block;
                text-align: center;
                color: white;
                background-color: #1989fa;
                justify-content: center;
              }

              .coupon-detail {
                width: 55%;
                display: inline-block;
                text-align: left;
                background-color: white;
                color: black;
                padding: 10px;
              }

              .coupon-radio {
                width: 10%;
                display: flex;
                display: inline-block;
                line-height: 100px;
                background-color: white;
              }
            }
          }
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

        .pay-list {
          margin: 10px;
          background-color: white;
          padding: 2px;
          border-radius: 10px;

          .pay-product {
            .supplyer {
              border-radius: 10px;
              padding: 5px;

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
          margin: 10px 10px 5.7em 10px;
          background-color: white;
          padding: 2px;
          border-radius: 10px;
        }
      }
    }
  }

</style>
