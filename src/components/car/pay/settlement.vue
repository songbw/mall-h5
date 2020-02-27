<template lang="html">
  <section class="settlement">
    <v-header class="header" v-if="showHeader">
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
            <van-icon class="contact-edit" name="arrow" size="12px" />
          </div>
        </div>
        <div class="pay-list">
          <!--关爱通平台-->
          <div class="pay-product" v-if="this.$api.IS_GAT_APP">
            <li v-for="item in arregationList" style="list-style: none">
              <div v-if="item.goods.length > 0" class="supplyer">
                <van-cell :title=item.merchantName icon="shop" />
                <ul>
                  <li v-for="(k,index) in item.goods" :key='index' style="border-bottom: 1px solid #f8f8f8;">
                    <div class="promotionBox"
                      v-if="k.product.promotionInfo.promotion!= undefined && k.product.promotionInfo.promotionState != -1">
                      <span class="promotionTitle">{{k.product.promotionInfo.promotion[0].tag}}</span>
                      <v-countdown class="promotionCountDown" @start_callback="countDownS_cb(index,k)"
                        @end_callback="countDownE_cb(index,k)"
                        :startTime="getDateTime(k.product.promotionInfo.promotion[0].startDate)"
                        :endTime="getDateTime(k.product.promotionInfo.promotion[0].endDate)" :secondsTxt="''">
                      </v-countdown>
                    </div>
                    <!--商品有活动的布局-->
                    <div v-if="k.product.promotionInfo.promotionState === 1">
                      <div v-if="!k.valid">
                        <van-cell title="商品库存不足，不计入订单" icon="info" style="color: #ff4444" />
                      </div>
                      <van-card :desc="locationCity" :num="k.product.baseInfo.count" :price="k.product.goodsInfo.dprice"
                        :title="k.product.goodsInfo.name" :thumb="k.product.goodsInfo.image"
                        :origin-price="k.checkedPrice">
                        <!--                        <div slot="footer" @click.stop="" class="cardStepper">
                          <van-stepper v-model="k.product.baseInfo.count" integer @click.stop="" @change="onCountChange(k)"/>
                        </div>-->
                      </van-card>
                    </div>
                    <!--商品无活动的布局-->
                    <div v-else>
                      <div v-if="!k.valid">
                        <van-cell title="商品库存不足，不计入订单" icon="info" style="color: #ff4444" />
                      </div>
                      <van-card :num="k.product.baseInfo.count" :price="k.product.goodsInfo.dprice"
                        :title="k.product.goodsInfo.name" :thumb="k.product.goodsInfo.image">
                        <div slot="desc">
                          <span class="prodDesc">{{locationCity}}</span>
                        </div>
                        <!--                        <div slot="footer" @click.stop="" class="cardStepper">
                          <van-stepper v-model="k.product.baseInfo.count" integer @click.stop="" @change="onCountChange(k)"/>
                        </div>-->
                      </van-card>
                    </div>
                  </li>
                </ul>
                <div class="supplyerSummery">
                  <span style="margin-left: 1em">商品合计: ￥{{item.price.toFixed(2)}}元 ， 运费￥{{item.freight.toFixed(2)}}元
                  </span>
                </div>
              </div>
            </li>
          </div>
          <!--其它平台-->
          <div class="pay-product" v-else>
            <div v-for="item in arregationList" style="list-style: none">
              <div v-if="item.goods.length > 0" class="supplyer">
                <div v-for="(k,index) in item.goods" :key='index'>
                  <div class="promotionBox"
                    v-if="k.product.promotionInfo.promotion!= undefined && k.product.promotionInfo.promotionState != -1">
                    <span class="promotionTitle">{{k.product.promotionInfo.promotion[0].name}}</span>
                    <v-countdown class="promotionCountDown" @start_callback="countDownS_cb(index,k)"
                      @end_callback="countDownE_cb(index,k)"
                      :startTime="getDateTime(k.product.promotionInfo.promotion[0].startDate)"
                      :endTime="getDateTime(k.product.promotionInfo.promotion[0].endDate)" :secondsTxt="''">
                    </v-countdown>
                  </div>
                  <!--商品有活动的布局-->
                  <div v-if="k.product.promotionInfo.promotionState === 1">
                    <div v-if="!k.valid">
                      <van-cell title="商品库存不足，不计入订单" icon="info" style="color: #ff4444" />
                    </div>
                    <van-card :num="k.product.baseInfo.count" :price="k.product.goodsInfo.dprice"
                      :title="k.product.goodsInfo.name" :thumb="k.product.goodsInfo.image"
                      :origin-price="k.checkedPrice">
                      <div slot="desc">
                        <span style="font-size: small">{{locationCity}}</span>
                      </div>
                      <!--                      <div slot="footer" @click.stop="" class="cardStepper">
                        <van-stepper v-model="k.product.baseInfo.count" integer @click.stop="" @change="onCountChange(k)"/>
                      </div>-->
                    </van-card>
                  </div>
                  <!--商品无活动的布局-->
                  <div v-else>
                    <div v-if="!k.valid">
                      <van-cell title="商品库存不足，不计入订单" icon="info" style="color: #ff4444" />
                    </div>
                    <van-card :num="k.product.baseInfo.count" :price="k.product.goodsInfo.dprice"
                      :title="k.product.goodsInfo.name" :thumb="k.product.goodsInfo.image">
                      <div slot="desc">
                        <span style="font-size: small">{{locationCity}}</span>
                      </div>
                      <!--                      <div slot="footer" @click.stop="" class="cardStepper">
                        <van-stepper v-model="k.product.baseInfo.count" integer @click.stop="" @change="onCountChange(k)"/>
                      </div>-->
                    </van-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pay-footer"></div>
          <van-submit-bar :loading="isOnSummitting" :price="allpay" button-text="提交订单" @submit="onSubmit" :tip=tip />
        </div>
        <div class="pay-info">
          <!--          <van-cell title="支付方式:" :value="payway">
                    </van-cell>-->
          <!--          <van-cell title="发票:" :value="invoiceDetail">
                      <van-icon style="margin: 5px;" slot="right-icon" name="weapp-nav" class="custom-icon"
                                @click="showInvoiceSelector()"/>
                    </van-cell>-->
          <van-cell title="优惠券:" v-if="pageAction != 'pickupGoods'">
            <div slot="default">
              <span>{{couponUsedTip}}</span>
            </div>
            <van-icon style="margin: 5px;" slot="right-icon" name="weapp-nav" class="custom-icon"
              @click="showCouponSelector()" />
          </van-cell>
          <van-actionsheet v-model="showInvoice" title="发票" class="invoice_layout">
            <div>
              <div class="invoiceTip">
                商城启用电子普通发票，订单完成后24小时内开具，点击"我的订单"查看与下载
              </div>
              <div class="invoiceTypeBox">
                <h1 class="section-title">
                  发票类型
                </h1>
                <div class="RadioStyle">
                  <input type="radio" id="eInvoice" value="eInvoice" v-model="invoiceType">
                  <label for="eInvoice">电子发票</label>
                </div>
                <span
                  style="text-align: left;font-weight: lighter;font-size: x-small;margin: 15px;color: #8c8c8c">电子普通发票与纸质普通发票具备同等法律效力，可支持报销入账</span>
              </div>
              <div class="invoiceTitleBox">
                <h1 class="section-title">
                  发票抬头
                </h1>
                <div class="RadioStyle">
                  <div>
                    <input type="radio" id="personalInvoice" value="personal" v-model="invoiceTitleType">
                    <label for="personalInvoice">个人</label>
                  </div>
                  <div style="margin-left: 10px">
                    <input type="radio" id="enterpriseInvoice" value="enterprise" v-model="invoiceTitleType">
                    <label for="enterpriseInvoice">单位</label>
                  </div>
                </div>
                <span
                  style="text-align: left;font-weight: lighter;font-size: x-small;margin: 15px;color: #8c8c8c">电子普通发票与纸质普通发票具备同等法律效力，可支持报销入账</span>
                <div class="enterpriseInfo" v-if="invoiceTitleType==='enterprise'">
                  <van-cell-group>
                    <van-field v-model="invoiceEnterpriseName" required placeholder="请填写单位名称" />

                    <van-field v-model="invoiceEnterpriseNumber" required placeholder="请填写纳税人识别号" />
                  </van-cell-group>
                </div>
              </div>
              <div class="invoiceReceiver">
                <h1 class="section-title">
                  收票人信息
                </h1>
                <div class="invoiceReceiverInfo">
                  <van-cell-group>
                    <van-field v-model="invoiceReceiverMobile" required placeholder="收票人手机号" />

                    <van-field v-model="invoiceReceiverEmail" required placeholder="收票人邮箱" />
                  </van-cell-group>
                </div>
                <div class="footer_layout">
                  <van-button type="danger" size="large" round @click="confirmedInvoiceSelector">确定</van-button>
                </div>
              </div>
            </div>
          </van-actionsheet>
          <van-actionsheet v-model="showCoupon" title="优惠券" class="coupon_layout">
            <div class="couponTip">
              <span class="tipLeft">可用优惠券({{couponList.length }})</span>
              <span class="tipRight"> 一个订单只能使用一张优惠券，不能叠加使用</span>
            </div>
            <div v-if="couponList.length > 0">
              <div class="hasCoupon">
                <van-radio-group v-model="radio">
                  <div class="couponList">
                    <div class="coupon coupon-white" v-for="(k,i) in couponList" :key="i" @click=onCouponListClick(k)>
                      <div class="coupon-main">
                        <div class="coupon-img">
                          <img :src="k.couponInfo.imageUrl.length?k.couponInfo.imageUrl: couponImg">
                        </div>
                        <div class="coupon-info coupon-hole coupon-info-right-dashed">
                          <div class="coupon-price">
                            <span v-if="k.couponInfo.rules.couponRules.type <2" style="margin-right: -7px">￥</span>
                            {{formateCouponPrice(k.couponInfo.rules.couponRules)}}
                            <span>{{formateCouponDetail(k.couponInfo.rules.couponRules)}}</span>
                          </div>
                          <div class="coupon-desc">{{formateCouponDescription(k.couponInfo)}}</div>
                          <div class="coupon-expire-date">
                            {{formatEffectiveDateTime(k.couponInfo.effectiveStartDate,k.couponInfo.effectiveEndDate)}}
                          </div>
                        </div>
                      </div>
                      <div class="coupon-get">
                        <van-radio :name=k.userCouponCode @click.stop="" @click="onRadioBtnClick(k)"
                          checked-color="#FF4444"></van-radio>
                      </div>
                    </div>
                  </div>
                </van-radio-group>
              </div>
            </div>
            <div v-else>
              <div class="noCoupon">
                <img :src="icon_noCoupon">
                <span class="noCoupon_line1">很遗憾</span>
                <span class="noCoupon_line2">您暂时还没有可用的优惠券</span>
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
        hasVirtualGoods: false,
        freightPay: 0,
        payway: '现金支付',
        showHeader: true,
        isOnSummitting: false,
        icon_noCoupon: require('@/assets/icons/ico_noCoupon.png'),
        icon_conatct_address: require('@/assets/icons/ico_contact_address.png'),
        couponImg: 'https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_coupon.png',
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
        couponTypes: [{
          "title": "未使用",
          "list": [],
          "total": -1,
          "pageNo": 1,
          "status": -1,
          "loading": false,
          "finished": false,
        }],
        invoiceType: 'eInvoice',
        invoiceTitleType: 'personal',
        invoiceEnterpriseName: '',
        invoiceEnterpriseNumber: '',
        invoiceReceiverMobile: '',
        invoiceReceiverEmail: '',
        merchantList: [],
        isAoyiDataLoaded: false,
        isOtherDataLoaded: false,
        usedRegionId: ""
      }
    },
    watch: {
      isAoyiDataLoaded(newValue, oldVal) {
        this.$log("isAoyiDataLoaded: newVale:" + newValue)
        if (newValue && this.isOtherDataLoaded) {
          this.$store.commit('SET_PAGE_LOADING', false);
        }
      },
      isOtherDataLoaded(newValue, oldVal) {
        this.$log("isOtherDataLoaded: newVale:" + newValue)
        if (newValue && this.isAoyiDataLoaded) {
          this.$store.commit('SET_PAGE_LOADING', false);
        }
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
              this.$router.push({
                name: '地址页'
              })
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
        if (this.pageAction === "pickupGoods") {
          return [];
        }
        let allPayList = this.$store.state.appconf.payList;
        this.$log("conpon List Enter")
        this.$log(this.couponTypes[0].list)
        this.couponTypes[0].list.forEach(item => {
          let found = -1;
          if (item.couponInfo.rules.scenario.type == 1) {
            for (let i = 0; i < allPayList.length; i++) {
              if (allPayList[i].valid && allPayList[i].product.couponList != undefined) {
                for (let j = 0; j < item.couponInfo.rules.scenario.couponMpus.length; j++) {
                  if (item.couponInfo.rules.scenario.couponMpus[j] == allPayList[i].product.baseInfo.mpu) {
                    //选出选购商品所有对应的优惠券
                    found = j;
                    break;
                  }
                }
              }
            }
            if (found != -1) {
              couponList.push(item)
            }
          } else {
            if (item.couponInfo.rules != null && item.couponInfo.rules.scenario.type === 3) { //类别券单独处理
              for (let i = 0; i < allPayList.length; i++) {
                if (allPayList[i].valid) {
                  for (let j = 0; j < item.couponInfo.rules.scenario.categories.length; j++) {
                    if (item.couponInfo.rules.scenario.categories[j] === allPayList[i].product.goodsInfo.category) {
                      couponList.push(item)
                      break;
                    }
                  }
                }
              }
            } else if (item.couponInfo.rules != null && item.couponInfo.rules.scenario.type === 2) { //全场类
              couponList.push(item)
            }
          }
        })

        //已经选出选购商品所有对应的优惠券
        //判断优惠券是否满足条件
        let avaliableCouponList = []
        this.$log(couponList)
        couponList.forEach(coupon => {
          if (this.isCouponActivied(coupon)) {
            if (coupon.couponInfo.rules.couponRules.type === 0 ||
              coupon.couponInfo.rules.couponRules.type == 2) {
              let fullPrice = 0;
              if (coupon.couponInfo.rules.scenario.type === 3) {
                allPayList.forEach(payItem => {
                  if (payItem.valid) {
                    for (let i = 0; i < coupon.couponInfo.rules.scenario.categories.length; i++) {
                      if (coupon.couponInfo.rules.scenario.categories[i] === payItem.product.goodsInfo
                        .category) {
                        fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                        break;
                      }
                    }
                  }
                })
              } else {
                allPayList.forEach(payItem => {
                  if (payItem.valid) {
                    if (coupon.couponInfo.rules.scenario.type === 2) {
                      fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                    } else {
                      for (let j = 0; j < coupon.couponInfo.rules.scenario.couponMpus.length; j++) {
                        if (coupon.couponInfo.rules.scenario.couponMpus[j] == payItem.product.baseInfo.mpu) {
                          fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                          break;
                        }
                      }
                    }
                  }
                })
              }
              this.$log("fullPrice:" + fullPrice)
              switch (coupon.couponInfo.rules.couponRules.type) {
                case 0:
                  if (fullPrice < coupon.couponInfo.rules.couponRules.fullReduceCoupon.fullPrice) {
                    //nothing to do
                  } else {
                    let found = -1;
                    for (let i = 0; i < avaliableCouponList.length; i++) {
                      if (avaliableCouponList[i].code == coupon.code) {
                        found = 1;
                        break;
                      }
                    }
                    if (found == -1) {
                      avaliableCouponList.push(coupon)
                    }
                  }
                  break;
                case 2:
                  if (fullPrice < coupon.couponInfo.rules.couponRules.discountCoupon.fullPrice) {
                    //nothing to do
                  } else {
                    let found = -1;
                    for (let i = 0; i < avaliableCouponList.length; i++) {
                      if (avaliableCouponList[i].code == coupon.code) {
                        found = 1;
                        break;
                      }
                    }
                    if (found == -1) {
                      avaliableCouponList.push(coupon)
                    }
                  }
                  break;
                default: {
                  let found = -1;
                  for (let i = 0; i < avaliableCouponList.length; i++) {
                    if (avaliableCouponList[i].code == coupon.code) {
                      found = 1;
                      break;
                    }
                  }
                  if (found == -1) {
                    avaliableCouponList.push(coupon)
                  }
                  break;
                }
              }
            } else {
              let found = -1;
              for (let i = 0; i < avaliableCouponList.length; i++) {
                if (avaliableCouponList[i].code == coupon.code) {
                  found = 1;
                  break;
                }
              }
              if (found == -1) {
                avaliableCouponList.push(coupon)
              }
            }
          }
        });
        if (this.usedCoupon != null) {
          let found = -1
          for (let i = 0; i < avaliableCouponList.length; i++) {
            if (this.usedCoupon.couponId === avaliableCouponList[i].couponId) {
              found = i;
              break;
            }
          }
          if (found == -1) {
            this.radio = ''
            this.lastRadio = ''
            this.usedCoupon = null
          }
        }
        return avaliableCouponList;
      },

      arregationList() {
        this.$log("####################")
        let merchantList = this.$store.state.appconf.merchantList;
        let arregationPayList = [];
        merchantList.forEach(item => {
          arregationPayList.push({
            "merchantCode": item.merchantCode,
            "merchantName": item.merchantName,
            "merchantId": item.merchantId,
            "goods": [],
            price: 0,
            freight: 0
          })
        });

        let allPayList = this.$store.state.appconf.payList;
        try {
          allPayList.forEach(item => {
            if (item.product.promotionInfo != undefined) {
              item.product.promotionInfo['promotionState'] = Util.getPromotionState(this, item.product
                .promotionInfo)
              item.product.goodsInfo['dprice'] = Util.getDisplayPrice(this, item.checkedPrice, item.product
                .promotionInfo)
            }
            if (item.product.baseInfo.merchantId === 2) { //aoyi
              if (item.product.baseInfo.mpu != null) {
                let itemMerchantCode = item.product.baseInfo.mpu.substring(0, 2)
                arregationPayList.forEach(merchant => {
                  if (itemMerchantCode === merchant.merchantCode) {
                    merchant.goods.push(item)
                  }
                })
              }
            } else {
              arregationPayList.forEach(merchant => {
                if (item.product.baseInfo.merchantId === merchant.merchantId) {
                  merchant.goods.push(item)
                }
              })
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
        } catch (e) {}
        this.$log("~~~~~~~~~~~~~~~~~~")
        this.$log(arregationPayList);
        return arregationPayList;
      },

      tip() {
        return this.receiverAddress
      },


      productPay() {
        let productPay = 0;
        try {
          this.arregationList.forEach(item => {
            productPay += item.price
          })
        } catch (e) {}
        return productPay.toFixed(2)
      },

      allpay() {
        let all = 0;
        all = parseInt((this.productPay * 100 + this.freightPay * 100 - this.couponReducedPrice(this.usedCoupon) * 100)
          .toFixed(0))
        if (all < 0)
          all = 0
        return all;
      },
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
      if (this.$api.IS_GAT_APP) {
        this.payway = '关爱通支付'
      }
      this.obtainMerchantArray();
      let action = this.$route.params.action;
      if (action == "direct") {
        this.pageAction = "direct";
      } else if (action == "pickupGoods") {
        this.pageAction = "pickupGoods";
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
          "invoiceEnterpriseNumber": "",
          "invoiceReceiverMobile": "",
          "invoiceReceiverEmail": "",
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
      wkycCasher(orderInfo) {
        let that = this
        let payOptions = {
          appId: this.$api.APP_ID,
          orderNo: orderInfo.orderNo
        }
        balancePay = {
          actPayFee: "" + orderInfo.orderAmount,
          openId: user.openId,
          orderNo: orderInfo.orderNo,
          payType: "balance"
        }
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.AGGREGATE_PAY_URL,
          url: '/wspay/pay',
          data: payOptions,
        }).then((response) => {
          this.$log(response)

        }).catch(function (error) {
          that.$toast("请求支付失败")
          // that.payBtnSubmitLoading = false;
        })
      },
      wkycPay() {
        let that = this
        let tradeOrderNo = 'tral' + Date.now() + Math.floor(Math.random() * 100000)
        let payLoad = JSON.stringify({
          merchantNo: 'MCH100001',
          amount: 0.01,
          tradeOrderNo: tradeOrderNo,
          notifyUrl: 'https://testwkyc.weesharing.com/payment/cb',
          expireTimeMinute: 20,
          goodsDesc: '马拉松报名费用'
        });
        that.$log(payLoad); // 调试使用代码

        if (/iphone|ipad/.test(navigator.userAgent.toLowerCase())) {
          let temp;
          window.payOrder = function () {}
          window.webkit.messageHandlers.payOrder.postMessage(payLoad)
        } else {
          window.ycapp.payOrder(payLoad);
        }

        // 调用支付后的回调方法，只需要定义到window对象下，app会自动回调此方法
        window.payResult = function (res) {
          // 请注意此处返回的数据为json字符串，返回结果见下方内容
          let response = JSON.parse(res)
          that.$log(response);
          if (response.code == '0') {
            if (response.data.payStatus == 0) { //"具体的支付状态：0（成功）,-1（失败），-2（取消）",
              /*               that.$router.replace({
                              path: '/pay/cashering',
                              query: {
                                outer_trade_no: tradeOrderNo
                              }
                            }) */
            } else {
              /*               that.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', 0);
                            that.$router.replace({
                              path: '/car/orderList'
                            }) */
            }
          }

        }
      },
      async onCountChange(goods) {
        this.$log("onCountChange Enter")
        if (this.pageAction == 'direct') {
          if (this.$api.IS_GAT_APP) {
            this.getAoyifreightPay();
            this.getPlatformFreightPay();
          } else {
            if (this.pageAction != "pickupGoods") {
              let ret = await this.getAllasPlatformFreight()
              this.$log(ret)
              if (ret.data.code == 200) {
                let result = ret.data.data.result
                if (result.totalPrice > 0) {
                  result.priceBeans.forEach(iFreight => {
                    this.arregationList.forEach(item => {
                      if (item.price > 0 && item.merchantId != 2) {
                        if (iFreight.merchantId === item.merchantId) {
                          item.freight = parseFloat(iFreight.shipPrice);
                        }
                      } else if (item.price > 0 && item.merchantId == 2) {
                        if (iFreight.merchantCode === item.merchantCode) {
                          item.freight = parseFloat(iFreight.shipPrice);
                        }
                      }
                    })
                  });
                }
              }
            }
            this.upDatefreightPay()
          }
          return
        }
        let k = goods.product
        this.$log(k)
        Util.updateCartItem(this, k);
        let options = {
          "id": k.baseInfo.cartId,
          "count": k.baseInfo.count,
          "mpu": k.baseInfo.mpu
        }
        this.$api.xapi({
          method: 'put',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/cart/num',
          data: options,
        }).then(async (response) => {
          if (this.$api.IS_GAT_APP) {
            this.getAoyifreightPay();
            this.getPlatformFreightPay();
          } else {
            let ret = await this.getAllasPlatformFreight()
            this.$log(ret)
            if (ret.data.code == 200) {
              let result = ret.data.data.result
              if (result.totalPrice > 0) {
                result.priceBeans.forEach(iFreight => {
                  this.arregationList.forEach(item => {
                    if (item.price > 0 && item.merchantId != 2) {
                      if (iFreight.merchantId === item.merchantId) {
                        item.freight = parseFloat(iFreight.shipPrice);
                      }
                    } else if (item.price > 0 && item.merchantId == 2) {
                      if (iFreight.merchantCode === item.merchantCode) {
                        item.freight = parseFloat(iFreight.shipPrice);
                      }
                    }
                  })
                });
              }
            }
            this.upDatefreightPay()
          }
        }).catch(function (error) {
          console.log(error)
        })


      },
      upDatefreightPay() {
        this.freightPay = 0;
        try {
          this.arregationList.forEach(item => {
            if (item.freight > 0) {
              this.freightPay += item.freight;
            }
          })
        } catch (e) {}
      },
      getDateTime(time) {
        return new Date(this.$moment(time).format('YYYY/MM/DD HH:mm:ss')).getTime()
      },
      isCouponActivied(coupon) {
        let ret = false;
        if (coupon.status === 1) {
          let startTime = new Date(coupon.couponInfo.effectiveStartDate.replace(/-/g, '/')).getTime()
          let endTime = new Date(coupon.couponInfo.effectiveEndDate.replace(/-/g, '/')).getTime()
          let current = new Date().getTime()
          if (current < startTime) {
            ret = false //券活动未开始
          } else if (current <= endTime) {
            ret = true //活动开始
          } else {
            ret = false // 活动已经结束
          }
        }
        return ret
      },
      formateCouponPrice(rules) {
        switch (rules.type) {
          case 0: //满减券
            return rules.fullReduceCoupon.reducePrice;
          case 1: //代金券
            return rules.cashCoupon.amount;
          case 2: //折扣券
            return (rules.discountCoupon.discountRatio * 10).toFixed(1) + ' 折';
          default:
            return ""
        }
      },

      formateCouponDescription(couponInfo) {
        switch (couponInfo.rules.scenario.type) {
          case 1: //满减券
            return "仅限某些指定的商品可用";
          case 2: //代金券
            return "全场商品可用";
          case 3: //折扣券
            return "仅限定某些品牌类商品可用";
          default:
            return "限提供所描述特定的服务可用"
        }
      },

      formateCouponDetail(rules) {
        switch (rules.type) {
          case 0: //满减券
            return '满' + rules.fullReduceCoupon.fullPrice + '元可用';
          case 1: //代金券
            return '代金券';
          case 2: //折扣券
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
        return this.$moment(effectiveStartDate).format('YYYY.MM.DD') + ' - ' + this.$moment(effectiveEndDate).format(
          'YYYY.MM.DD');
      },
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
        if (this.radio === this.lastRadio) {
          this.radio = ''
          this.usedCoupon = null;
        } else {
          this.radio = coupon.userCouponCode
          this.usedCoupon = coupon;
          this.showCoupon = false
        }
        this.lastRadio = this.radio

      },

      getUsedCouponDetail4Order(coupon) {
        this.$log("getUsedCouponDetail4Order Enter")
        this.$log(coupon)
        if (coupon != null) {
          let merchants = []
          let totalCouponDiscount = 0
          this.arregationList.forEach(item => {
            if (item.goods.length > 0) {
              let skus = []
              //let couponOccupiedPrice4OnPerMerchant = 0;
              let couponDiscountOfMerchant = 0;
              item.goods.forEach(sku => {
                if (sku.valid) {
                  this.$log(sku)
                  let found = -1
                  if (coupon.couponInfo.rules.scenario.type === 3) {
                    for (let i = 0; i < coupon.couponInfo.rules.scenario.categories.length; i++) {
                      if (coupon.couponInfo.rules.scenario.categories[i] === sku.product.goodsInfo.category) {
                        found = 1; //找到
                        break;
                      }
                    }
                  } else if (coupon.couponInfo.rules.scenario.type === 2) {
                    found = 1; //找到
                  } else {
                    for (let j = 0; j < coupon.couponInfo.rules.scenario.couponMpus.length; j++) {
                      if (coupon.couponInfo.rules.scenario.couponMpus[j] == sku.product.baseInfo.mpu) {
                        found = j
                        break;
                      }
                    }
                  }
                  if (found != -1) {
                    let unitCouponDiscount = Math.floor((this.reducedPriceOfCoupon * sku.product.goodsInfo
                      .dprice / this.totalSkuPriceOfCoupon) * 100) / 100;
                    let skuCouponDiscount = unitCouponDiscount * sku.product.baseInfo.count;
                    skus.push({
                      "skuId": sku.product.baseInfo.skuId,
                      "mpu": sku.product.baseInfo.mpu,
                      "num": sku.product.baseInfo.count,
                      "dprice": sku.product.goodsInfo.dprice,
                      "salePrice": (sku.product.goodsInfo.dprice - unitCouponDiscount).toFixed(2),
                      "skuCouponDiscount": skuCouponDiscount
                    })
                    // couponOccupiedPrice4OnPerMerchant += sku.product.goodsInfo.dprice * sku.product.baseInfo.count
                    couponDiscountOfMerchant = parseFloat((couponDiscountOfMerchant + skuCouponDiscount)
                      .toFixed(2))
                  }
                }
              })
              this.$log(skus)
              merchants.push({
                "merchantNo": item.merchantCode,
                "skus": skus,
                //   "couponOccupiedPrice": couponOccupiedPrice4OnPerMerchant,
                "couponDiscountOfMerchant": couponDiscountOfMerchant
              })

              totalCouponDiscount = parseFloat((totalCouponDiscount + couponDiscountOfMerchant).toFixed(2))
            }
          })
          this.$log(this.reducedPriceOfCoupon)
          if (totalCouponDiscount != this.reducedPriceOfCoupon) {
            // coupon 价格不平， 重新分配,由于coupon 单价计算是舍去2位后的数据，所以reducedPriceOfCoupon大于等于totalCouponDiscount
            // 把多余的优惠差价给最大的优惠价格拥有的商户
            if (merchants.length > 0) {
              let maxMerchants = 0;
              if (merchants.length > 1) {
                for (let i = 1; i < merchants.length; i++) {
                  if (merchants[i].couponOccupiedPrice > merchants[maxMerchants].couponOccupiedPrice) {
                    maxMerchants = i;
                  }
                }
              }
              let diff = parseFloat((this.reducedPriceOfCoupon - totalCouponDiscount).toFixed(2))
              //把多余的优惠差价给最大的优惠价格拥有的商户
              merchants[maxMerchants].couponDiscountOfMerchant = parseFloat((merchants[maxMerchants]
                .couponDiscountOfMerchant + diff).toFixed(2))
              //找到maxMerchants这个商户的有最大优惠券价值的SKU，把多余的券值赋给这个SKU
              let maxMpu = 0;
              if (merchants[maxMerchants].skus.length > 1) {
                for (let i = 1; i < merchants[maxMerchants].skus.length; i++) {
                  if (merchants[maxMerchants].skus[i].skuCouponDiscount > merchants[maxMerchants].skus[maxMpu]
                    .skuCouponDiscount) {
                    maxMpu = i;
                  }
                }
              }
              //把多余的券值赋给这个SKU
              merchants[maxMerchants].skus[maxMpu].skuCouponDiscount = parseFloat((merchants[maxMerchants].skus[maxMpu]
                .skuCouponDiscount + diff).toFixed(2))
            }
          }
          let couponDiscount = parseFloat(this.reducedPriceOfCoupon)
          let couponInfo = {
            'id': coupon.id,
            'code': coupon.userCouponCode,
            'discount': couponDiscount,
            "merchants": merchants
          }
          return couponInfo
        } else {
          return null
        }
      },

      couponReducedPrice(coupon) {
        let reducePrice = 0;
        let fullPrice = 0;

        if (this.pageAction === "pickupGoods") {
          if (coupon != null) {
            let allPayList = this.$store.state.appconf.payList;
            allPayList.forEach(payItem => {
              if (payItem.valid) {
                fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
              }
            })
            this.$log("fullPrice:" + fullPrice)
            reducePrice = fullPrice
          }

          this.reducedPriceOfCoupon = reducePrice.toFixed(2)
          this.totalSkuPriceOfCoupon = fullPrice.toFixed(2)
          this.$log("reducedPriceOfCoupon:" + this.reducedPriceOfCoupon)
          return this.reducedPriceOfCoupon;
        } else {
          if (coupon != null) {
            let allPayList = this.$store.state.appconf.payList;
            if (coupon.couponInfo.rules.scenario.type === 3) { //类目品牌类
              allPayList.forEach(payItem => {
                if (payItem.valid) {
                  for (let i = 0; i < coupon.couponInfo.rules.scenario.categories.length; i++) {
                    if (coupon.couponInfo.rules.scenario.categories[i] === payItem.product.goodsInfo.category) {
                      fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                      break;
                    }
                  }
                }
              })
            } else {
              allPayList.forEach(payItem => {
                if (payItem.valid) {
                  if (coupon.couponInfo.rules.scenario.type === 2) { //全场类
                    fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                  } else {
                    for (let j = 0; j < coupon.couponInfo.rules.scenario.couponMpus.length; j++) {
                      if (coupon.couponInfo.rules.scenario.couponMpus[j] == payItem.product.baseInfo.mpu) {
                        fullPrice += payItem.product.goodsInfo.dprice * payItem.product.baseInfo.count
                        break;
                      }
                    }
                  }
                }
              })
            }
            this.$log("fullPrice:" + fullPrice)

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
            if (reducePrice > fullPrice) {
              reducePrice = fullPrice;
            }
          }

          this.reducedPriceOfCoupon = reducePrice.toFixed(2)
          this.totalSkuPriceOfCoupon = fullPrice.toFixed(2)
          this.$log("reducedPriceOfCoupon:" + this.reducedPriceOfCoupon)
          return this.reducedPriceOfCoupon;
        }


      },
      onCouponListClick(coupon) {
        this.$log("onCouponListClick Enter")
        if (this.radio === coupon.userCouponCode) {
          this.radio = ''
          this.usedCoupon = null;
        } else {
          this.radio = coupon.userCouponCode
          this.usedCoupon = coupon;
          this.showCoupon = false
        }
        this.$log(this.usedCoupon)
        // this.lastRadio = this.radio
        // this.$log(this.radio)
      },

      onCouponLoad(index) {
        this.$log("onCouponLoad:" + index)
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          if (that.couponTypes[index].total == -1 || that.couponTypes[index].total > that.couponTypes[index].list
            .length) {
            that.couponTypes[index].loading = true;
            let options = {
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
        if (this.invoiceTitleType != "personal" && (this.invoiceEnterpriseName.length == 0 || this
            .invoiceEnterpriseNumber.length == 0)) {
          this.$toast("请正确填写企业名称与纳税人识别号!")
          return
        }
        if (this.invoiceReceiverMobile.length == 0 || this.invoiceReceiverEmail.length == 0) {
          this.$toast("请正确填写收票人信息!")
          return
        }
        const invoice = {
          "invoiceType": this.invoiceType,
          "invoiceTitleType": this.invoiceTitleType,
          "invoiceEnterpriseName": this.invoiceEnterpriseName,
          "invoiceEnterpriseNumber": this.invoiceEnterpriseNumber,
          "invoiceReceiverMobile": this.invoiceReceiverMobile,
          "invoiceReceiverEmail": this.invoiceReceiverEmail
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
        this.$log("countDownS_cb Enter ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        let found = -1;
        for (let i = 0; i < this.payCarList.length; i++) {
          if (this.payCarList[i].product.baseInfo.skuId == k.product.baseInfo.skuId) {
            found = i;
          }
        }
        this.$log(k)
        if (found != -1) {
          this.payCarList[found].product.promotionInfo.promotionState = Util.getPromotionState(this, k.product
            .promotionInfo)
          this.savePayList()
        }
      },
      countDownE_cb(index, k) {
        this.$log("countDownE_cb Enter ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        let found = -1;
        for (let i = 0; i < this.payCarList.length; i++) {
          if (this.payCarList[i].product.baseInfo.skuId == k.product.baseInfo.skuId) {
            found = i;
          }
        }
        if (found != -1) {
          this.payCarList[found].product.promotionInfo.promotionState = Util.getPromotionState(this, k.product
            .promotionInfo)
          let len = this.payCarList[found].product.promotionInfo.promotion.length;
          this.payCarList[found].product.promotionInfo.promotion.splice(0, len);
          this.savePayList()
        }
      },

      See(e) {
        this.$log("jump to:" + e)
        //window.location.href = e
        window.location.replace(e)
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

      updateUsedAddress() {
        this.$log("updateUsedAddress Enter!")
        let address = {};
        let list = this.$store.state.appconf.addressList;
        let id = this.$store.state.appconf.usedAddressId;
        if (id == undefined) {
          id = -1
        }
        try {
          this.$log("@@@@@@@@@@@@@@@@@@@@@@@")
          this.$log(id)
          if (id == -1) {
            if (this.addressCount > 0) {
              for (let i = 0; i < list.length; i++) {
                this.$log(list[i])
                if (list[i].status == 1) {
                  id = list[i].id;
                  address = list[i]
                  break;
                }
              }
              if (id == -1) {
                id = list[0].id;
                address = list[0]
              }
            }
          } else {
            if (this.addressCount > 0) {
              let found = -1;
              for (let i = 0; i < list.length; i++) {
                if (id == list[i].id) {
                  found = i;
                  break;
                }
              }
              if (found != -1) {
                address = list[found]
              } else {
                id = list[0].id
                address = list[0]
              }
            }
          }
        } catch (e) {}
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
        this.usedRegionId = Util.getRegionId(this, this.usedAddress.provinceName, this.usedAddress.cityName, this
          .usedAddress.countyName)
        this.$log(this.usedAddress)
        this.$log("usedRegionId:" + this.usedRegionId)
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
        } catch (e) {}
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
        let couponInfo = this.getUsedCouponDetail4Order(this.usedCoupon)
        this.$log("couponInfo:")
        this.$log(couponInfo)
        this.arregationList.forEach(item => {
          if (item.goods.length > 0) {
            let skus = []
            let amount = item.freight;
            let unitsAmount = item.freight;
            let promotionDiscountOfMerchant = 0;
            item.goods.forEach(sku => {
              if (sku.valid) {
                if (sku.product.goodsInfo.type != undefined && sku.product.goodsInfo.type != 0) {
                  this.hasVirtualGoods = true
                }
                let promotionId = 0
                if (sku.product.promotionInfo.promotionState == 1) {
                  promotionId = sku.product.promotionInfo.promotion[0].id
                }
                //SKU 单价为货物原价 - 活动优惠价格
                let unitPrice = parseFloat(sku.product.goodsInfo.dprice).toFixed(2)
                let salePrice = unitPrice;
                let skuCouponDiscount = 0;
                if (this.usedCoupon != null) {
                  if (couponInfo != null) {
                    for (let i = 0; i < couponInfo.merchants.length; i++) {
                      for (let j = 0; j < couponInfo.merchants[i].skus.length; j++) {
                        if (couponInfo.merchants[i].skus[j].mpu === sku.product.goodsInfo.mpu) {
                          salePrice = couponInfo.merchants[i].skus[j].salePrice;
                          skuCouponDiscount = couponInfo.merchants[i].skus[j].skuCouponDiscount
                          break;
                        }
                      }
                    }
                  }
                }
                let promotionDiscount = (sku.checkedPrice - sku.product.goodsInfo.dprice)
                amount += sku.checkedPrice * sku.product.baseInfo.count
                unitsAmount += unitPrice * sku.product.baseInfo.count
                promotionDiscountOfMerchant += promotionDiscount
                skus.push({
                  "skuId": sku.product.baseInfo.skuId,
                  "mpu": sku.product.baseInfo.mpu,
                  "merchantId": sku.product.baseInfo.merchantId,
                  "num": sku.product.baseInfo.count,
                  "checkedPrice": sku.checkedPrice,
                  "unitPrice": unitPrice,
                  "salePrice": salePrice,
                  "promotionId": promotionId,
                  "promotionDiscount": promotionDiscount.toFixed(2),
                  "skuCouponDiscount": skuCouponDiscount,
                  "type": sku.product.goodsInfo.type == undefined ? 0 : sku.product.goodsInfo.type
                })
              }
            })
            //APP ID 10:无锡市民卡 (2位) + CITY ID (3位)+ 商户 ID (2位)+ 用户ID (8位)
            // let usrId = this.prefixInteger(user.userId, 8);
            let tradeNo = this.$api.APP_ID + locationCode.cityId + item.merchantCode + user.userId

            let couponDiscountOfMerchant = 0;
            let found = -1;
            if (couponInfo != null) {
              for (let i = 0; i < couponInfo.merchants.length; i++) {
                if (couponInfo.merchants[i].merchantNo === item.merchantCode) {
                  found = i;
                  break;
                }
              }
            }
            if (found != -1) {
              couponDiscountOfMerchant = couponInfo.merchants[found].couponDiscountOfMerchant;
            }
            this.$log("unitsAmount:" + unitsAmount)
            let saleAmount = parseFloat((unitsAmount - couponDiscountOfMerchant).toFixed(2));
            merchants.push({
              "tradeNo": tradeNo, //主订单号 = APP ID (2位)+ CITY ID (3位) + 商户ID (2位) + USER ID (8位)
              "merchantNo": item.merchantCode, //商户号
              "merchantId": item.merchantId,
              "payment": "01", //支付方式， 现金支付
              "servFee": item.freight, //运费
              "amount": amount, //应给商户的实际总价
              "saleAmount": saleAmount, //用户支付给商户的实际总价 = 单品salePrice*number + 运费
              "type": 1, //订单类型 0: 实时式订单  1: 预占型订单
              "skus": skus
            })
          }
        })
        let companyCustNo = "11"
        if (this.$api.IS_GAT_APP) {
          if (this.$api.APP_ID === '10') {
            companyCustNo = "1001"
          } else if (this.$api.APP_ID === '09') {
            companyCustNo = "1002"
          }
        }
        let options = {
          "openId": user.userId,
          "companyCustNo": companyCustNo,
          "receiverId": receiverId, //接收地址ID
          "regionId": this.usedRegionId,
          "remark": "", //用户自填字段，比如周末不配送
          "invoiceType": invoiceType,
          "invoiceTitleName": invoiceTitleName,
          "invoiceEnterpriseNumber ": invoiceEnterpriseNumber,
          "merchants": merchants
        }

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
        let returnUrl = ""
        if (this.$api.IS_GAT_APP) {
          if (this.$api.APP_ID === '10') {
            returnUrl = "https://gatsn.weesharing.com/pay/cashering";
          } else if (this.$api.APP_ID === '09') {
            returnUrl = "https://gatzy.weesharing.com/pay/cashering";
          }


          let options = {
            "iAppId": this.$api.APP_ID,
            "tAppId": this.$api.T_APP_ID,
            "openId": user.openId,
            "appId": this.$api.APP_ID,
            "merchantNo": merchantNo,
            "orderNos": orderNos,
            "goodsName": "商品支付订单",
            "amount": pAnOrderInfo.orderAmount,
            "returnUrl": returnUrl,
          }
          that.$log("预下单:" + JSON.stringify(options))
          that.$api.xapi({
            method: 'post',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/payment/gat',
            data: options,
          }).then((response) => {
            that.$log("预下单返回 :" + JSON.stringify(response.data))
            if (response.data.data.result != undefined) {
              let urlEncode = response.data.data.result.urlEncode;
              this.See(urlEncode)
            }
          }).catch(function (error) {
            that.$log(error)
          })
        } else {
          let options = {
            "iAppId": this.$api.APP_ID,
            "tAppId": this.$api.T_APP_ID,
            "openId": user.userId,
            "appId": this.$api.APP_ID,
            "merchantNo": merchantNo,
            "orderNos": orderNos,
            "goodsName": "商品支付订单",
            "amount": pAnOrderInfo.orderAmount,
            "returnUrl": returnUrl,
          }
          that.$log("预下单:" + JSON.stringify(options))
          that.$api.xapi({
            method: 'post',
            baseURL: this.$api.SSO_BASE_URL,
            url: '/payment',
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
              //  that.$jsbridge.call("dredgeWallet", walletInfo);
            } else {
              if (response.data.data.result != undefined) {
                let orderNo = response.data.data.result.orderNo
                let outTradeNo = response.data.data.result.outTradeNo
                pAnOrderInfo['orderNo'] = orderNo
                pAnOrderInfo['outTradeNo'] = outTradeNo
                that.$log("openCashPage:" + JSON.stringify(pAnOrderInfo))
                if (this.$api.APP_ID == '14') {
                  this.wkycCasher(pAnOrderInfo);
                } else {
                  // that.$jsbridge.call("openCashPage", pAnOrderInfo);
                  this.$router.replace({
                    name: "收银台页",
                    params: {
                      orderInfo: pAnOrderInfo
                    }
                  })
                }

              }
            }
          }).catch(function (error) {
            that.$log(error)
          })
        }
      },

      isValidOrder(options) {
        this.$log("isValidOrder:" + JSON.stringify(options))
        let count = 0;
        options.merchants.forEach(merchant => {
          count += merchant.skus.length;
        })
        if (count > 0)
          return true;
        return false;
      },
      onSubmit() {
        let that = this
        that.$log("onSubmit Enter!!!")
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          let event = "userId=" + user.userId + "&" + "dataTime:" + new Date().getTime()
          // window._hmt.push(['_trackEvent', '下订单', 'click', event]);
          let receiverId = this.$store.state.appconf.usedAddressId;
          that.$log("onSubmit receiverId is:" + receiverId)
          if (receiverId == undefined || receiverId == -1) {
            this.$dialog.alert({
              title: '请检查收件人信息是否已经填写',
            }).then(() => {})
          } else {
            try {
              let options = this.getComposedOrderOption(userInfo, receiverId);
              this.$log(JSON.stringify(options))
              if (this.isValidOrder(options)) {
                if (options != null) {
                  this.isOnSummitting = true;
                  that.$api.xapi({
                    method: 'post',
                    baseURL: this.$api.ORDER_BASE_URL,
                    url: '/order',
                    data: options,
                  }).then((response) => {
                    that.$log("onSubmit:" + JSON.stringify(response.data));
                    if (response.data.code === 200) {
                      let result = response.data.data.result;
                      that.$log("result:" + JSON.stringify(result))
                      if (result.length > 0) {
                        let orderNo = ""
                        let amount = 0;
                        let merchantNo = ""
                        let orderNos = ""
                        this.$log(result.length)
                        this.$log(result[0].tradeNo)
                        if (result != undefined && result.length > 0 && result[0].tradeNo.length > 8) {
                          let len = result[0].tradeNo.length;
                          orderNos = JSON.stringify(result[0].tradeNo.substr(len - 8)).replace(/\"/g, "");
                          if (options.merchants.length == 1) { //单商户
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
                            "orderNo": '', // orderNo,
                            "orderAmount": parseInt((amount * 100).toFixed(0)), //分
                            "openId": user.openId,
                            "businessType": "11",
                            "hasVirtualGoods": this.hasVirtualGoods
                          }
                          if (that.pageAction == "direct") {
                            this.$store.commit('SET_PAY_DIRECT_PRODUCT', '')
                          } else if (that.pageAction == "pickupGoods") {
                            this.$store.commit('SET_PICKUP_PRODUCTS_INFO', '')
                          } else {
                            that.deleteOrderedGoodsInCar();
                          }
                          that.openCashPage(user, merchantNo, orderNos, pAnOrderInfo)
                          setTimeout(() => {
                            that.isOnSummitting = false;
                          }, 1500);
                        } else {
                          that.$log("can not get correct orderNo");
                          that.$toast("获取订单失败")
                          that.isOnSummitting = false;
                        }
                      } else {
                        that.$log("can not get correct orderNo");
                        that.$toast("获取订单失败")
                        that.isOnSummitting = false;
                      }
                    } else {
                      that.$toast(response.data.msg)
                      that.isOnSummitting = false;
                    }


                  }).catch(function (error) {
                    that.$log(error)
                    that.isOnSummitting = false;
                  })

                }
              } else {
                this.$log("无效的订单")
                this.$toast("无效的订单")
              }
            } catch (e) {}
          }
        } else {
          this.$dialog.alert({
            title: '未获取到用户信息，请检查用户是否已经登录',
          }).then(() => {})
        }

      },
      getPlatformFreightPay() {
        this.$log("getPlatformFreightPay Enter @@@@@@@@@@@@@@@@@@@@")
        /////////////查询平台运费////////////////////////
        let that = this;
        let all = 0;
        let options = [];
        let locationCode = this.getLocationCode()
        this.arregationList.forEach(item => {
          if (item.price > 0 && item.merchantId != 2) { //aoyi
            let mpuParams = []
            item.goods.forEach(goods => {
              if (goods.valid) {
                mpuParams.push({
                  mpu: goods.product.baseInfo.mpu,
                  num: goods.product.baseInfo.count
                })
              }
            })
            options.push({
              merchantId: item.merchantId,
              provinceId: locationCode.provinceId,
              totalPrice: item.price,
              mpuParams: mpuParams
            })
          }
        })
        that.$log("options is:" + JSON.stringify(options))
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.FREIGHTS_URL,
          url: '/ship',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          this.$log("平台运费  result is:" + JSON.stringify(result));
          result.forEach(iFreight => {
            this.arregationList.forEach(item => {
              if (item.price > 0 && item.merchantId != 2) {
                if (iFreight.merchantId === item.merchantId) {
                  item.freight = parseFloat(iFreight.shipPrice);
                }
              }
            })
          });
          this.upDatefreightPay();
          that.isOtherDataLoaded = true;
        }).catch(function (error) {
          that.$log(error)
          that.$log("无法获取到运费")
          that.isOtherDataLoaded = true;
          that.upDatefreightPay();
        })
      },
      getAoyifreightPay() {
        this.$log("getAoyifreightPay Enter @@@@@@@@@@@@@@@@@@@@")
        /////////////查询运费////////////////////////
        let that = this;
        let all = 0;
        let carriges = [];
        let options = {
          "carriages": carriges,
        }
        this.arregationList.forEach(item => {
          if (item.price > 0 && item.merchantId == 2) { //aoyi
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
          this.upDatefreightPay();
          this.isAoyiDataLoaded = true
          this.$log("page loading end");
          if (this.pageLoadTimerId != -1) {
            clearTimeout(this.pageLoadTimerId)
          }
        }).catch(function (error) {
          that.$log(error)
          that.isAoyiDataLoaded = true
          that.$log("pageLoading:  error,loading is:" + that.$store.state.appconf.pageLoading)
          that.$log("无法获取到运费")
          that.upDatefreightPay();
          if (that.pageLoadTimerId != -1) {
            clearTimeout(that.pageLoadTimerId)
          }
        })
      },
      getUserCouponList() {
        this.onCouponLoad(0);
      },
      async getCarList() {
        this.$log("carList Enter !!!!!!!!!")
        let that = this;
        let inventorySkus = [];
        let skus = [];

        let inventorySkusOfZy = [];
        let skusOfZy = [];

        let inventorySkusOfYyt = [];
        let skusOfYyt = [];

        this.payCarList = [];
        if (this.pageAction == "direct") {
          let payDirectProduct = this.$store.state.appconf.payDirectProduct;
          //  this.$log("+++++++++++++++++++++");
          //  this.$log(payDirectProduct);
          if (payDirectProduct.length > 0) {
            let item = JSON.parse(payDirectProduct);
            if (item.baseInfo.merchantId === 2) { //aoyi
              inventorySkus.push({
                "skuId": item.baseInfo.skuId,
                "remainNum": item.baseInfo.count,
                "price": item.goodsInfo.price
              })
              skus.push({
                "skuId": item.baseInfo.skuId
              })
            } else if (item.baseInfo.merchantId === 4) { //yytong
              inventorySkusOfYyt.push({
                "skuId": item.baseInfo.skuId,
                "remainNum": item.baseInfo.count
              })
              skusOfYyt.push({
                "skuId": item.baseInfo.skuId
              })
            } else {
              inventorySkusOfZy.push({
                "mpu": item.baseInfo.mpu,
                "remainNum": item.baseInfo.count
              })
              skusOfZy.push({
                "mpu": item.baseInfo.mpu
              })
            }
            this.payCarList.push({
              "product": item,
              "valid": true,
              "checkedPrice": item.goodsInfo.checkedPrice != undefined ? item.goodsInfo.checkedPrice : item
                .goodsInfo.price
            })
          }
        } else if (this.pageAction == "pickupGoods") {
          let pickupProdInfo = this.$store.state.appconf.pickupProdInfo
          if (pickupProdInfo != undefined) {
            if (pickupProdInfo.list != undefined) {
              pickupProdInfo.list.forEach(item => {
                if (item.baseInfo.merchantId === 2) { //aoyi
                  inventorySkus.push({
                    "skuId": item.baseInfo.skuId,
                    "remainNum": item.baseInfo.count,
                    "price": item.goodsInfo.price
                  })
                  skus.push({
                    "skuId": item.baseInfo.skuId
                  })
                } else if (item.baseInfo.merchantId === 4) { //yytong
                  inventorySkusOfYyt.push({
                    "skuId": item.baseInfo.skuId,
                    "remainNum": item.baseInfo.count
                  })
                  skusOfYyt.push({
                    "skuId": item.baseInfo.skuId
                  })
                } else {
                  inventorySkusOfZy.push({
                    "mpu": item.baseInfo.mpu,
                    "remainNum": item.baseInfo.count
                  })
                  skusOfZy.push({
                    "mpu": item.baseInfo.mpu
                  })
                }
                this.payCarList.push({
                  "product": item,
                  "valid": true,
                  "checkedPrice": item.goodsInfo.checkedPrice != undefined ? item.goodsInfo.checkedPrice :
                    item
                    .goodsInfo.price
                })
              })
            }
            this.usedCoupon = pickupProdInfo.coupon
            this.$log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            this.$log(this.usedCoupon)
          }

        } else {
          this.selectedCarList.forEach(item => {
            // this.$log(item)
            if (item.baseInfo.merchantId === 2) { //aoyi
              inventorySkus.push({
                "skuId": item.baseInfo.skuId,
                "remainNum": item.baseInfo.count,
                "price": item.goodsInfo.price
              })
              skus.push({
                "skuId": item.baseInfo.skuId
              })
            } else if (item.baseInfo.merchantId === 4) { //yytong
              inventorySkusOfYyt.push({
                "skuId": item.baseInfo.skuId,
                "remainNum": item.baseInfo.count
              })
              skusOfYyt.push({
                "skuId": item.baseInfo.skuId
              })
            } else {
              inventorySkusOfZy.push({
                "mpu": item.baseInfo.mpu,
                "remainNum": item.baseInfo.count
              })
              skusOfZy.push({
                "mpu": item.baseInfo.mpu
              })
            }
            if (item.promotionInfo.promotion != null && item.promotionInfo.promotion.length > 0) {
              item.promotionInfo.promotionState = Util.getPromotionState(this, item.promotionInfo);
            }
            //////////////////
            this.payCarList.push({
              "product": item,
              "valid": true,
              "checkedPrice": item.goodsInfo.price
            })
          })
        }
        this.$log("paylist:")
        this.$log(this.payCarList)
        let locationCode = this.getLocationCode()

        this.savePayList();
        this.getUserCouponList();

        if (this.$api.IS_GAT_APP) {
          if (skus.length > 0) { //has aoyi product           //////////////////////查询库存//////////////////
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
              //获取运费
              this.getAoyifreightPay(); //获取奥弋商品库存
            }).catch(function (error) {
              that.$log(error)
              that.isAoyiDataLoaded = true;
              that.getAoyifreightPay();
              that.$log("page loading end");
              if (that.pageLoadTimerId != -1) {
                clearTimeout(that.pageLoadTimerId)
              }
            })
          } else {
            this.isAoyiDataLoaded = true;
          }
          if (skusOfZy.length > 0) { //other merchant
            let options = {
              "inventories": inventorySkusOfZy
            }
            this.$api.xapi({
              method: 'post',
              baseURL: this.$api.PRODUCT_BASE_URL,
              url: '/prod/inventory/self',
              data: options,
            }).then((response) => {
              let result = response.data.data.result;
              this.$log("自营库存 result is:" + JSON.stringify(result));
              result.forEach(item => {
                for (let i = 0; i < this.payCarList.length; i++) {
                  if (this.payCarList[i].product.baseInfo.mpu === item.mpu) {
                    if ("1" === item.state) {
                      this.payCarList[i].valid = true
                    } else {
                      this.payCarList[i].valid = false
                    }
                  }
                }
              })
              this.getPlatformFreightPay();
            }).catch(function (error) {})
            this.getPlatformFreightPay(); //获取平台商品库存
            this.$log("page loading end");
            if (this.pageLoadTimerId != -1) {
              clearTimeout(this.pageLoadTimerId)
            }
          } else {
            this.isOtherDataLoaded = true;
          }
        } else {
          try {
            if (skus.length > 0) {
              let options = {
                "cityId": locationCode.cityId,
                "countyId": locationCode.countyId,
                "skus": inventorySkus,
              }
              let ret = await this.getAoyiInventory(options);
              this.$log("$$$$$$$$$$$$$$$$")
              this.$log(ret)
              if (ret.data.code == 200) {
                let result = ret.data.data.result;
                this.$log("奥弋库存 result is:" + JSON.stringify(result));
                result.forEach(item => {
                  for (let i = 0; i < this.payCarList.length; i++) {
                    if (this.payCarList[i].product.baseInfo.mpu === item.mpu) {
                      if ("1" === item.state) {
                        this.payCarList[i].valid = true
                      } else {
                        this.payCarList[i].valid = false
                      }
                    }
                  }
                })
              }
            }
            if (skusOfZy.length > 0) {
              let options = {
                "inventories": inventorySkusOfZy
              }
              let ret = await this.getPlatformInventory(options);
              this.$log("^^^^^^^^^^^^^^")
              this.$log(ret)
              if (ret.data.code == 200) {
                let result = ret.data.data.result;
                this.$log("自营库存 result is:" + JSON.stringify(result));
                result.forEach(item => {
                  for (let i = 0; i < this.payCarList.length; i++) {
                    if (this.payCarList[i].product.baseInfo.mpu === item.mpu) {
                      if ("1" === item.state) {
                        this.payCarList[i].valid = true
                      } else {
                        this.payCarList[i].valid = false
                      }
                    }
                  }
                })
              }
            }
            if (skusOfYyt.length > 0) {
              let codesArray = []
              skusOfYyt.forEach(sku => {
                codesArray.push(sku.skuId)
              })
              let codes = codesArray.join(",");
              try {
                let response = await this.getYytongInventory(codes);
                this.$log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                this.$log(response)
                if (response.data.code === 200) {
                  let ret = response.data.data.skuInvList;
                  ret.forEach(item => {
                    for (let i = 0; i < this.payCarList.length; i++) {
                      if (this.payCarList[i].product.baseInfo.skuId === item.code) {
                        this.$log(this.payCarList[i].product.baseInfo.count)
                        if (item.inventoryCount < this.payCarList[i].product.baseInfo.count) {
                          this.payCarList[i].valid = false
                        } else {
                          this.payCarList[i].valid = true
                        }
                      }
                    }
                  })
                }
              } catch (e) {}
            }
            if (this.pageAction != "pickupGoods") {
              let ret = await this.getAllasPlatformFreight()
              this.$log(ret)
              if (ret.data.code == 200) {
                let result = ret.data.data.result
                if (result.totalPrice > 0) {
                  result.priceBeans.forEach(iFreight => {
                    this.arregationList.forEach(item => {
                      if (item.price > 0 && item.merchantId != 2) {
                        if (iFreight.merchantId === item.merchantId) {
                          item.freight = parseFloat(iFreight.shipPrice);
                        }
                      } else if (item.price > 0 && item.merchantId == 2) {
                        if (iFreight.merchantCode === item.merchantCode) {
                          item.freight = parseFloat(iFreight.shipPrice);
                        }
                      }
                    })
                  });
                }
              }
            }

            this.upDatefreightPay()
            that.isAoyiDataLoaded = true
            that.isOtherDataLoaded = true
            if (that.pageLoadTimerId != -1) {
              clearTimeout(that.pageLoadTimerId)
            }
          } catch (error) {
            that.$log(error)
            that.isAoyiDataLoaded = true
            that.isOtherDataLoaded = true
            if (that.pageLoadTimerId != -1) {
              clearTimeout(that.pageLoadTimerId)
            }
          }
        }
      },

      getAllasPlatformFreight() {
        this.$log("getAllasPlatformFreight Enter @@@@@@@@@@@@@@@@@@@@@@")
        let that = this;
        let all = 0;
        let locationCode = this.getLocationCode()
        let totalPrice = 0;
        let merchantInfos = []
        this.arregationList.forEach(item => {
          let mpuParams = []
          item.goods.forEach(goods => {
            if (goods.valid) {
              totalPrice += goods.product.goodsInfo.dprice * goods.product.baseInfo.count
              mpuParams.push({
                mpu: goods.product.baseInfo.mpu,
                num: goods.product.baseInfo.count
              })
            }
          })
          if (mpuParams.length > 0) {
            let merchantCode = ""
            if (item.merchantId == 2) {
              merchantCode = item.merchantCode
            }
            merchantInfos.push({
              merchantId: item.merchantId,
              merchantCode: merchantCode,
              mpuParams: mpuParams
            })
          }
        })
        let options = {
          provinceId: locationCode.provinceId,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
          merchantInfos: merchantInfos
        }
        that.$log("options is:" + JSON.stringify(options))
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.FREIGHTS_URL,
          url: '/ship/carriage',
          data: options,
        })
      },

      getAoyiInventory(options) {
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.PRODUCT_BASE_URL,
          url: '/prod/inventory',
          data: options,
        })
      },

      getPlatformInventory(options) {
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.PRODUCT_BASE_URL,
          url: '/prod/inventory/self',
          data: options,
        })
      },

      getYytongInventory(codes) {
        return this.$api.xapi({
          method: 'post',
          baseURL: this.$api.AOYIS_CONFIG_URL,
          url: '/star/product/inventory',
          data: {
            codes: codes
          }
        })
      },

      editAddressOrList() {
        this.$log("addressCount:" + this.addressCount)
        if (this.addressCount) { //go to Address List
          this.$router.push({
            name: '地址列表页'
          })
        } else { //没有Address //go to Address edit
          this.$router.push({
            name: '地址页'
          })
        }
      },

      getLocationCode() {
        //let code = {"provinceId": "100", "cityId": "510", "countyId": "06"}//江苏无锡市滨湖区
        let code = {
          "provinceName": "上海",
          "provinceId": "20",
          "cityName": "上海市",
          "cityId": "021",
          "countyName": "徐汇区",
          "countyId": "03"
        }
        if ( /*送货地址*/ JSON.stringify(this.usedAddress) != "{}") {
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
      min-height: 100vh;
      top: 0px;
      background-color: #f8f8f8;
      padding-bottom: 50px;

      .box {
        padding-top: 1.8em;
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

            >span {
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

                >span {
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
          border-radius: 10px;

          .van-actionsheet {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            min-height: 500px;
            background-color: #f8f8f8;
          }

          .van-cell {
            background-color: white;
            margin-top: -1px;
          }

          .invoice_layout {
            width: 100%;
            text-align: center;
            font-weight: bolder;
            background-color: white;

            .invoiceTip {
              background-color: #F9E6E6;
              border-radius: 30px;
              padding: 5px 15px;
              margin: 10px;
              color: #E06558;
              .fz(font-size, 25);
              font-weight: lighter;
              text-align: left;
            }

            .invoiceTypeBox {
              display: flex;
              flex-direction: column;
              justify-items: left;
            }

            .invoiceTitleBox {
              display: flex;
              flex-direction: column;
              justify-items: left;
            }

            .invoiceReceiver {
              display: flex;
              flex-direction: column;
              justify-items: left;
            }

            .enterpriseInfo {
              margin-left: 10px;
              margin-right: 10px;
            }

            .invoiceReceiverInfo {
              margin-left: 10px;
              margin-right: 10px;
            }

            .tip {
              margin: 1.2em;
              .fz(font-size, 25);
              text-align: left;
            }

            .RadioStyle {
              display: flex;
              margin-left: 10px;

              input {
                display: none
              }

              label {
                color: #8c8c8c;
                border: 1px solid #8c8c8c;

                padding: 2px 10px 2px 5px;
                line-height: 28px;
                min-width: 90px;
                text-align: center;
                float: left;
                border-radius: 30px;
                font-weight: lighter;
                .fz(font-size, 25)
              }

              input:checked+label {
                color: #E06558;
                border: 1px solid #E06558;
              }
            }

            .section-title {
              background-color: #ffffff;
              text-align: left;
              font-weight: bold;
              margin: 1em;
              .fz(font-size, 30);
              color: #000000;
            }

            .footer_layout {
              margin: 1em;
            }
          }

          .coupon_layout {
            font-weight: bold;

            .couponTip {
              display: flex;
              height: 2em;
              background-color: #f8f8f8;
              width: 100%;

              .tipLeft {
                width: 30%;
                text-align: left;
                .fz(font-size, 24);
                margin: 5px;
              }

              .tipRight {
                width: 70%;
                text-align: right;
                color: #8c8c8c;
                .fz(font-size, 20);
                margin: 8px 5px;
              }
            }

            .hasCoupon {
              .couponList {
                display: flex;
                flex-direction: column;
                background-color: #f8f8f8;

                .coupon {
                  background-color: white;
                  display: flex;
                  color: black;
                  position: relative;
                  padding-left: .5rem;
                  padding-right: .5rem;
                  margin: .5rem;
                  /** 这里不能用百分号，因为百分号是分别相对宽和高计算的，会导致弧度不同  */
                  border-top-right-radius: .3rem;
                  border-bottom-right-radius: .3rem;
                  overflow: hidden;

                  .coupon-white {
                    background-color: white;
                  }

                  .coupon-yellow {
                    background-color: #F39B00;
                  }

                  .coupon-white-gradient {
                    background-image: linear-gradient(150deg, #FFFFFF 50%, #FFFFFFD8 50%);
                  }

                  .coupon-yellow-gradient {
                    background-image: linear-gradient(150deg, #F39B00 50%, #F39B00D8 50%);
                  }

                  .coupon-red-gradient {
                    background-image: linear-gradient(150deg, #D24161 50%, #D24161D8 50%);
                  }

                  .coupon-green-gradient {
                    background-image: linear-gradient(150deg, #7EAB1E 50%, #7EAB1ED8 50%);
                  }

                  .coupon-blue-gradient {
                    background-image: linear-gradient(150deg, #50ADD3 50%, #50ADD3D8 50%);
                  }

                  .coupon-main {
                    display: flex;
                    flex-direction: row;
                    width: 90%;

                    .coupon-img {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                      width: 25%;
                      position: relative;

                      img {
                        display: inline-block;
                        width: 100%;
                      }
                    }

                    .coupon-info-right-dashed {
                      border-right: 2px dashed #c8c9cc;
                    }

                    .coupon-info-right-solid {
                      border-right: 2px solid white;
                    }

                    /* 使用两个边框为圆角的白色div制造半圆缺角，有个缺点是这个缺角必须与背景色相同（clip-path不好弄） */

                    .coupon-hole::before,
                    .coupon-hole::after {
                      content: '';
                      width: 1rem;
                      height: 1rem;
                      background-color: #f8f8f8;
                      border-radius: 50%;
                      position: absolute;
                      right: -.5rem;
                    }

                    .coupon-info {
                      padding: 0.5rem 0.5rem 0.5rem;
                      width: 65%;
                      position: relative;
                    }

                    .coupon-info::before {
                      top: -.5rem;
                    }

                    .coupon-info::after {
                      bottom: -.5rem;
                    }

                    .coupon-info>div {
                      margin-bottom: .2rem;
                    }

                    .coupon-desc {
                      margin-left: 3px;
                      min-height: 1em;
                      .fz(font-size, 25);
                      font-weight: lighter;
                      color: #323233;
                    }

                    .coupon-price {
                      font-size: 150%;
                      font-weight: bold;
                      color: #FF4444;
                    }

                    .coupon-price>span {
                      font-size: 60%;
                      font-weight: normal;
                    }

                    .coupon-expire-date {
                      margin-left: 5px;
                      .fz(font-size, 22);
                      font-weight: lighter;
                      color: #8c8c8c;
                    }

                    .coupon-progress {
                      margin-top: 10px;
                    }

                    .coupon-action {
                      .fz(font-size, 25)
                    }

                    .coupon-suppler {

                      span {
                        background-color: #ff4444;
                        padding: 2px 5px;
                        color: white;
                        border-radius: 8px;
                        .fz(font-size, 25);
                      }

                      i {
                        .fz(font-size, 28);
                      }
                    }

                  }

                  .coupon-get {
                    padding: .5rem;
                    /** 这里使用flex是为了让文字居中 */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    width: 12%;
                    position: relative;
                    .fz(font-size, 25);
                  }

                  .coupon-get-already::after {
                    content: '';
                    width: 5rem;
                    height: 5rem;
                    background-size: 5rem 5rem;
                    background-image: url('data:image/png;base64,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');
                    position: absolute;
                    top: -1rem;
                    right: -1rem;
                  }
                }

                /* 左边框的波浪 */

                .coupon-wave-left::before,
                .coupon-wave-right::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  height: 100%;
                  width: 14px;
                  background-image: radial-gradient(#f8f8f8 0, #f8f8f8 4px, transparent 4px);
                  /** 如果只设置为半径的两倍(直径)，那么半圆之间没有类似堤岸的间隔 */
                  background-size: 14px 14px;
                  background-position: 0 2px;
                  background-repeat: repeat-y;
                  z-index: 1;
                }

                .coupon-wave-left::before {
                  left: -7px;
                }

                .coupon-wave-right::after {
                  right: -7px;
                }


                /*.coupon-item {
                  margin: 5px;
                }

                .coupon-item .nick {
                  color: #fff;
                }

                .coupon-item .validDate {
                  color: #fff;
                  .fz(font-size, 25);
                }

                .coupon-item .coupon-money {
                  width: 100%;
                  display: -webkit-box;
                  display: -webkit-flex;
                  display: flex;
                  font-size: 1.2rem;
                  align-items: center;
                }

                .coupon-item .coupon-money em {
                  font-size: 3.8rem;
                }

                .coupon-item .coupon-money .lay:last-child {
                  flex: 1;
                  padding: 0 3%;
                  line-height: 1.66rem;
                }

                .couponStyle {
                  width: 100%;
                  height: 8rem;
                  position: relative;
                  margin: 5% 0;
                  display: -webkit-box;
                  display: -webkit-flex;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #fff;
                  border: 1px solid #E5004F;
                }

                .couponStyle .info-box {
                  -webkit-box: 1;
                  -webkit-flex: 1;
                  flex: 1;
                  padding: 0 2% 0 6%;
                  position: relative;
                }

                .couponStyle {
                  background-color: #FFAA00;
                  -webkit-border-radius: 1rem;
                  border-radius: 1rem;
                  border: none;
                  color: #fff;
                }

                .couponStyle .get-btn {
                  width: 28%;
                  height: 7rem;
                  position: relative;
                  -webkit-perspective: 180;
                  perspective: 180;
                }

                .couponStyle .get-btn:after {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: #F8B551;
                  transform: rotateY(-28deg);
                  z-index: 1;
                  -webkit-border-radius: .66rem;
                  border-radius: .66rem;
                  -webkit-box-shadow: -3px 0 8px #793030;
                  box-shadow: -3px 0 8px #793030;
                }

                .couponStyle .get-btn span {
                  width: 4rem;
                  word-break: break-all;
                  font-size: 1.8rem;
                  color: #454545;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  -webkit-transform: translate(-30%, -50%);
                  transform: translate(-30%, -50%);
                  z-index: 3;
                }

                !* 已领取 *!

                .couponStyle.have, .couponStyle.have .get-btn:after, .style-six.have, .style-seven.have {
                  background-color: #c1c1c1;
                }

                .couponStyle.have .get-btn:after {
                  -webkit-box-shadow: -3px 0 8px #8c8c8c;
                  box-shadow: -3px 0 8px #8c8c8c;
                }

                .couponStyle.have .get-btn span {
                  width: 5rem;
                  font-size: 1.5rem;
                  color: #fff;
                }*/
              }
            }

            .noCoupon {
              width: 100%;
              background-color: #f8f8f8;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: Center;
              height: 400px;

              img {
                height: 130px;
                width: 130px;
              }

              span {
                margin: 2vw;
              }

              .noCoupon_line1 {
                font-weight: lighter;
                color: black;
                .fz(font-size, 35);
              }

              .noCoupon_line2 {
                font-weight: lighter;
                color: #8c8c8c;
                .fz(font-size, 28);
              }

            }
          }

          .van-radio-group {
            background-color: #f8f8f8;

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
                margin-left: 10px;
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

              .cardStepper {
                margin-right: -5px;
                margin-top: -15px;
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
