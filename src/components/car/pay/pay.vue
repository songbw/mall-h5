<template lang="html">
  <section>
    <v-loading v-if="pageloading"></v-loading>
    <div class="pay" v-else>
      <v-header>
        <h1 slot="title">确认订单</h1>
      </v-header>
      <div class="contact-address-card" @click="editAddressOrList">
        <van-row type="flex">
          <van-col span="22">
            <div v-if="addressCount == 0" class="contact-edit">
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
      </div>

      <div class="pay-product">
        <li v-for="item in arregationList" style="list-style: none">
          <div v-if="item.goods.length > 0" class="supplyer">
            <van-cell :title=item.supplyerName icon="shop"/>
            <ul>
              <li v-for="(k,i) in item.goods" :key='i'>
                <van-card
                  :tag="k.valid?'':'无货'"
                  :price="k.checkedPrice"
                  :title="k.product.desc"
                  :num="k.product.count"
                  :thumb="k.product.image">
                  <div slot="footer">
                    <span style="color: #f44336" v-if="!k.valid">无效商品，不记入订单</span>
                  </div>
                </van-card>
              </li>
            </ul>
            <span>合计价格: {{item.price}}元</span>
            <span> 运费: {{item.freight}}元</span>
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
  </section>

</template>

<script>
  import Header from '@/common/_header.vue'
  import Loading from '@/common/_loading.vue'

  export default {
    components: {
      'v-header': Header,
      'v-loading': Loading
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
        invoiceDetail:''

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
        if (!this.isUserEmpty(userInfo)) {
          let user = JSON.parse(userInfo);
          this.$store.state.appconf.selStateInCarList.forEach(item => {
            if (item.userId == user.userId && item.choose) {
              selectCarList.push(item);
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
            price:0,
            freight: 0
          },
          {
            "supplyer": "60",
            "supplyerName": "京东",
            goods: [],
            price:0,
            freight: 0
          },
          {
            "supplyer": "10",
            "supplyerName": "商城自营",
            goods: [],
            price:0,
            freight: 0
          },

        ]
        let allPayList = this.$store.state.appconf.payList;

        try {
          allPayList.forEach(item => {
            if (item.product.skuId.startsWith("20")) {//苏宁易购
              payList[0].goods.push(item);
            } else if (item.product.skuId.startsWith("30")) {//唯品会
              payList[1].goods.push(item);
            } else if (item.product.skuId.startsWith("50")) {//天猫精选
              payList[2].goods.push(item);
            } else if (item.product.skuId.startsWith("60")) {//京东
              payList[3].goods.push(item);
            } else { //商城自营
              payList[4].goods.push(item);
            }
          })
          payList.forEach (supplyer => {
            let all = 0;
            supplyer.goods.forEach(item =>{
              console.log("item:"+JSON.stringify(item))
              if (item.valid) {
                all += item.checkedPrice * item.product.count
              }
            })
            supplyer.price = all;
          })
        } catch (e) {
        }
        return payList;
      },

      // 商品价格总和
      productPay() {
        let all = 0;
        try {
          this.payCarList.forEach(item => {
            if (item.valid) {
              all += item.checkedPrice * item.product.count * 100 //分
            }
          })
        } catch (e) {
        }
        return all
      },

      tip() {
        return '商品总价:' + parseFloat(this.productPay / 100)+ '元   合计运费:' + this.freight + '元'
      },

      allpay() {
        return this.productPay + this.freight * 100;
      }
    },

    created() {
      const invoiceInfo = this.$store.state.appconf.invoice;
      console.log("created:" + invoiceInfo )
      if (invoiceInfo != undefined && invoiceInfo.length > 0) {
        try {
          const invoice = JSON.parse(invoiceInfo);
          if(invoice.invoiceType === "eInvoice") {
            this.invoiceDetail += "电子普票";
          }
          if (invoice.invoiceTitleType === "personal") {
            this.invoiceDetail += "(个人)";
          } else {
            this.invoiceDetail += "(企业)";
          }

        } catch (e) {
          console.log("invoice:"+e);
        }
      } else {
        const invoice = {
          "invoiceType":"eInvoice",
          "invoiceTitleType":"personal",
          "invoiceEnterpriseName":"",
          "invoiceEnterpriseNumber":""
        }
        this.$store.dispatch('setInvoicdInfo', JSON.stringify(invoice));
        this.invoiceDetail = "电子普票-个人";
      }
      setTimeout(() => {
        this.$store.commit('SET_PAGE_LOADING', false);
        console.log("pageLoading:  10s end")
      }, 10000);
    },

    beforeCreate() {
      console.log("pay page mounted Enter")
      this.$store.commit('SET_PAGE_LOADING', true);
      console.log("pageLoading:  start" + this.$store.state.appconf.pageLoading)
      try {
        let userInfo = this.$store.state.appconf.userInfo;
        console.log("userInfo:" + userInfo)
        if (!(userInfo == undefined || JSON.stringify(userInfo) == "{}")) {
          let user = JSON.parse(userInfo)
          let options = {
            "openId": user.userId,
            "pageNo": 1,
            "pageSize": "20",
          }
          // console.log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/receiver/all',
            data: options,
          }).then((response) => {
            let result = response.data.data.result;
            this.addressCount = result.total;
            if (this.addressCount == 0) {
              this.addressEmptyInfo = "您的收获地址为空，点此添加收货地址";

              this.updateUsedAddress();
              this.getCarList();
            } else {
              console.log("ADDRESS LIST is:" + JSON.stringify(result.list))
              this.$store.commit('SET_ADDRESS_LIST', result.list);
              this.updateUsedAddress();
              this.getCarList();
            }
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          console.log("ERROR!!, not get UserInfo in Pay page")
        }
      } catch (e) {
        console.log(e)
      }
    },

    beforeDestroy() {
      this.$dialog.close();
    },

    methods: {
      aggregationPayList() {
        this.$store.commit('SET_PAY_LIST', this.payCarList);
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || JSON.stringify(userInfo) == "{}")
      },
      updateUsedAddress() {
        console.log("updateUsedAddress Enter!")
        let address = {};
        let list = this.$store.state.appconf.addressList;
        console.log("list:" + JSON.stringify(list))
        let id = this.$store.state.appconf.usedAddressId;
        console.log("updateUsedAddress id:" + id)
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

      onSubmit() {
        console.log("onSubmit Enter!!!")
        this.$router.push({name: "收银台页"})
      },
      getfreightPay() {
        /////////////查询运费////////////////////////
        let all = 0;
        let freightSkus = []
        this.payCarList.forEach(item => {
          if (item.valid)
            freightSkus.push({"skuId": item.skuId, "piece": item.count})
        })

        let options = {
          "amount": this.productPay / 100,
        }

        this.$api.xapi({
          method: 'post',
          url: '/prod/carriage',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          console.log("运费 result is:" + JSON.stringify(result));
          this.freight = result
          this.aggregationPayList();
          this.$store.commit('SET_PAGE_LOADING', false);
          console.log("page loading end");
        }).catch(function (error) {
          console.log(error)
          this.aggregationPayList();
          this.$store.commit('SET_PAGE_LOADING', false);
          console.log("page loading error");
        })
      },
      getCarList() {
        console.log("carList Enter !!!!!!!!!")
        let inventorySkus = [];
        let skus = [];
        this.payCarList = [];
        this.selectedCarList.forEach(item => {
          inventorySkus.push({"skuId": item.skuId, "remainNum": item.count})
          skus.push({"skuId": item.skuId})
          this.payCarList.push({"product": item, "valid": true, "checkedPrice": item.price})
        })
        let locationCode = this.getLocationCode()
        //////////////////////查询库存//////////////////
        let options = {
          "cityId": locationCode.cityId,
          "countyId": locationCode.countyId,
          "skus": inventorySkus,
        }
        //console.log("options:" + JSON.stringify(options));
        this.$api.xapi({
          method: 'post',
          url: '/prod/inventory',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          console.log("库存 result is:" + JSON.stringify(result));
          result.forEach(item => {
            for (let i = 0; i < this.payCarList.length; i++) {
              if (this.payCarList[i].product.skuId == item.skuId && 0 === parseInt(item.state)) {
                this.payCarList[i].valid = true
              }
            }
          })
          //////////////////////查询价格//////////////////
          options = {
            "cityId": locationCode.cityId,
            "skus": skus,
          }
          // console.log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/prod/price',
            data: options,
          }).then((response) => {
            let result = response.data.data.result;
            console.log("价格 result is:" + JSON.stringify(result));
            result.forEach(item => {
              for (let i = 0; i < this.payCarList.length; i++) {
                // console.log("价格:" + JSON.stringify(item) + ",i:" + i + ",this.payCarList[i].skuId:" + this.payCarList[i].product.skuId)
                if (item != null && this.payCarList[i].product.skuId == item.skuId) {
                  //console.log("价格 change true");
                  this.payCarList[i].checkedPrice = item.price
                }
              }
            })
            // console.log("this.payCarList:" + JSON.stringify(this.payCarList));
            //开始聚合不同商家
            this.aggregationPayList();
            this.getfreightPay();
          }).catch(function (error) {
            console.log(error)
          })
        }).catch(function (error) {
          console.log(error)
        })

      },
      editAddressOrList() {
        console.log("addressCount:" + this.addressCount)
        if (this.addressCount) { //go to Address List
          this.$router.push({name: '地址列表页'})
        } else { //没有Address //go to Address edit
          this.$router.push({name: '地址页'})
        }
      },

      getLocationCode() {
        let code = {"provinceId": "10", "cityId": "010", "district": "00"}
        if (/*送货地址*/JSON.stringify(this.usedAddress) != "{}") {
          code = this.usedAddress;
        } else if (this.$store.state.appconf.locationCode != undefined) {
          code = this.$store.state.appconf.locationCode;
        }
        return code
      },
    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .pay {
    background-color: #dddddd;
    width: 100%;
    padding-bottom: 2vw;

    .custom-text {
      text-align: left;
      .fz(font-size, 30px);
    }

    .pay-info {
      margin-top: 15px;
      background-color: #fff;
      padding-Top: 2vw;
      padding-bottom: 2vw;
    }

    .pay-product {
      overflow: auto;
      padding-bottom: 14vw;
      margin-top: 5px;

      li {
        list-style: none;
      }
    }

    .pay-allpay {
      text-align: right;
      margin-top: 6vw;
      padding: 4vw 5vw;
      .fz(font-size, 32px);
      color: #999999;
      background-color: #fff;

      i,
      span {
        color: @cl;
      }
    }
  }

  .contact-edit {
    padding: 20px 0;
    text-align: center;
    color: #000000;
    line-height: 30px;
    .fz(font-size, 30);
  }

  .pay-confirm {
    padding: 20px 0;
    background-color: @cl;
    text-align: center;
    color: #fff;
    line-height: 30px;
    .fz(font-size, 40);
  }

  .address-line {
    content: '';
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: repeating-linear-gradient(
      -45deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      blue 0,
      blue 45%,
      transparent 0,
      transparent 50%
    );
    background-size: 80px;
  }

  .pay-footer {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
  }

  .supplyer {
    margin-top: 10px;
    background-color: white;
    span {
      padding: 20px 0;
      margin-left: 10px;
      line-height: 40px;
      font-weight: bold;
      .fz(font-size, 30);
    }

  }
</style>
