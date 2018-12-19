<template lang="html">

  <div class="pay">
    <v-header>
      <h1 slot="title">确认订单</h1>
    </v-header>

    <div class="contact-address-card">
      <van-row type="flex">
        <van-col span="22">
          <van-row type="flex">
            <van-cell
              title="收货人: 周俊  13810864380">
            </van-cell>
          </van-row>
          <van-row type="flex">
            <van-cell
              title="地址:北京顺义牡丹苑13号楼1门1101室">
            </van-cell>
          </van-row>
        </van-col>
        <van-col span="2">
          <van-icon class="contact-edit" name="arrow" size="20px" @click="editAddressOrList"/>
        </van-col>
      </van-row>
    </div>
    <div class="address-line"></div>
    <div class="pay-info">
      <van-cell title="支付方式:" value="现金支付">
        <van-icon slot="right-icon" name="edit" style="margin-left: 24px" size="20px"/>
      </van-cell>
      <van-cell title="发票:" value="普票(商品明细-个人)">
        <van-icon slot="right-icon" name="edit" style="margin-left: 24px" size="20px"/>
      </van-cell>
    </div>

    <div class="pay-product">
      <li v-for="k in payCarList">
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
    </div>

    <!--
    <footer class="pay-footer" ontouchstrat="" @click="payConfirm">
      <span>立即支付</span>
    </footer>
    -->
    <van-submit-bar
      :price="allpay"
      button-text="提交订单"
      @submit="onSubmit"
    />

    <!--
    <h3 class="pay-allpay">总需要支付 : <i>￥</i><span>{{allpay}}</span></h3>
    <footer class="pay-footer" ontouchstrat="" @click="payConfirm">
      <span>立即支付</span>
    </footer>
    -->
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        addressCount: 0,
        payCarList: []
      }
    },

    computed: {
      //
      locationCode() {
        let code = {"provinceId": "10", "cityId": "010", "district": "00"}
        if (/*送货地址*/this.$store.state.appconf.addressCode != undefined) {
          code = this.$store.state.appconf.addressCode;
        } else if (this.$store.state.appconf.locationCode != undefined) {
          code = this.$store.state.appconf.locationCode;
        }
        return code
      },

      selectedCarList() {
        let selectCarList = [];
        let user = JSON.parse(this.$store.state.appconf.userInfo);
        if (user != undefined) {
          this.$store.state.appconf.selStateInCarList.forEach(item => {
            if (item.userId == user.userId && item.choose) {
              selectCarList.push(item);
            }
          })
        }
        console.log("selectedCarList is:" + JSON.stringify(selectCarList));
        return selectCarList;
      },

      // 商品价格总和
      allpay() {
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
      }
    },
    mounted() {
      // 防止页面刷新后数据丢失
      /*    if (this.$store.state.detail.selectedList == '') {
            this.$store.commit('SET_SELECTEDLIST')
          }*/
    },

    beforeCreate() {
      console.log("pay page mounted Enter")
      try {
        if (this.$store.state.appconf.addressCode == undefined ||
          JSON.stringify(this.$store.state.appconf.addressCode) == "{}") {
          let userInfo = this.$store.state.appconf.userInfo;
          console.log("userInfo:" + userInfo)
          if (userInfo != undefined) {
            let user = JSON.parse(userInfo)
            let options = {
              "openId": user.userId,
              "pageNo": 1,
              "pageSize": "20",
            }
            console.log("options:" + JSON.stringify(options));
            this.$api.xapi({
              method: 'post',
              url: '/receiver/all',
              data: options,
            }).then((response) => {
              let result = response.data.data.result;
              console.log("result is:" + JSON.stringify(result));
              this.addressCount = result.total;
              if (this.addressCount == 0) {
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
            }).catch(function (error) {
              console.log(error)
            })
          } else {
            console.log("ERROR!!, not get UserInfo in Pay page")
          }
        } else {
          console.log("pay page mounted:" + JSON.stringify(this.$store.state.appconf.addressCode))
        }
      } catch (e) {
        console.log(e)
      }
    },

    created() {
      this.getCarList()
    },

    methods: {
      onSubmit() {
        console.log("onSubmit Enter!!!")
      },
      getCarList() {
        console.log("carList Enter !!!!!!!!!")
        let skus = [];
        this.payCarList = [];
        this.selectedCarList.forEach(item => {
          skus.push({"skuId": item.skuId})
          this.payCarList.push({"product": item, "valid": true, "checkedPrice": item.price})
        })
        //////////////////////查询库存//////////////////
        let options = {
          "cityId": this.locationCode.cityId,
          "skus": skus,
        }
        console.log("options:" + JSON.stringify(options));
        this.$api.xapi({
          method: 'post',
          url: '/prod/inventory',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          result.forEach(item => {
            for (let i = 0; i < this.payCarList.length; i++) {
              if (this.payCarList[i].product.skuId == item.skuId && 0 === parseInt(item.state)) {
                this.payCarList[i].valid = true
              }
            }
          })
        }).catch(function (error) {
          console.log(error)
        })
        //////////////////////查询价格//////////////////
        options = {
          "cityId": this.locationCode.cityId,
          "skus": skus,
        }
        console.log("options:" + JSON.stringify(options));
        this.$api.xapi({
          method: 'post',
          url: '/prod/price',
          data: options,
        }).then((response) => {
          let result = response.data.data.result;
          console.log("价格 result is:" + JSON.stringify(result));
          result.forEach(item => {
            for (let i = 0; i < this.payCarList.length; i++) {
              console.log("价格:" + JSON.stringify(item) + ",i:" + i + ",this.payCarList[i].skuId:" + this.payCarList[i].product.skuId)
              if (this.payCarList[i].product.skuId == item.skuId) {
                console.log("价格 change true");
                this.payCarList[i].checkedPrice = item.price
              }
            }
          })
          console.log("this.payCarList:" + JSON.stringify(this.payCarList));
        }).catch(function (error) {
          console.log(error)
        })

        /////////////查询运费////////////////////////
        /* options = {
           "cityId": this.locationCode.cityId,
           "skus": freightSkus,
         }
         console.log("options:" + JSON.stringify(options));
         this.$api.xapi({
           method: 'post',
           url: '/prod/carriage',
           data: options,
         }).then((response) => {
           let result = response.data.data.result;
           console.log("运费 result is:" + JSON.stringify(result));
         }).catch(function (error) {
           console.log(error)
         })*/
      },
      editAddressOrList() {
        if (this.addressCount) { //go to Address List
        } else { //没有Address //go to Address edit
          this.$router.push({name: '地址页'})
        }
      },

      getLocationCode() {
        let code = {"provinceId": "10", "cityId": "010", "district": "08"}
        if (/*送货地址*/this.this.$store.state.appconf.addressCode != undefined) {
          code = this.this.$store.state.appconf.addressCode;
        } else if (this.this.$store.state.appconf.locationCode != undefined) {
          code = this.$store.state.appconf.locationCode;
        }
        return code
      },
      /*    checkStorage() {

            let skus =  [{"skuId":"20000579"},{"skuId":"20001234"},{"skuId":"20000028"}]
            let options = {
              "provinceId":"10",
              "cityId":"010",
              "district":"08",
              "skus": skus
            }
            console.log("options:" + JSON.stringify(options));
            this.$api.xapi({
              method: 'post',
              url: '/prod/inventory',
              data: options,
            }).then((response) => {
              let result = response.data.data.result;
              console.log("result is:" + JSON.stringify(result));
            }).catch(function (error) {
              console.log(error)
            })
          },*/
      payConfirm() {
        /*      if (this.carList) { //还未提交了订单,数据还未清空
                MessageBox
                  .confirm(
                    `确定支付${this.allpay}元`
                  )
                  .then(action => { //点击成功执行这里的函数
                    this.confirm = false;
                    this.$store.commit('SET_LOADING', true);
                    this.$store.dispatch('resetCarList'); //重置购物车（用unSelectedList替换）
                    this.$store.dispatch('resetCount'); //重置购物车数量
                    setTimeout(() => {
                      this.$store.commit('SET_LOADING', false); //关闭loading
                      this.confirm = true; //支付完成后切换视图
                    }, 300)
                  }, function (err) {
                    //点击取消执行这里的函数
                  });
              } else { //提交了订单,数据清空
                alert('请勿重复提交订单')
              }*/

      }
    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .pay {
    width: 100%;
    padding-bottom: 2vw;

    .pay-info {
      background-color: #fff;
      padding-Top: 2vw;
      padding-bottom: 2vw;
    }

    .pay-product {
      background-color: #fff;
      overflow: auto;
      padding-bottom: 14vw;

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

    .pay-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding-bottom: 14vw;

      span {
        display: block;
        width: 85%;
        background-color: #fd729c;
        border-radius: 1.3vw;
        color: #fff;
        font-size: 17px;
        padding: 4vw;
        margin: 0 auto;
        text-align: center;

        &:active {
          background-color: @cl;
        }
      }
    }

    .contact-edit {
      padding: 20px 0;
      text-align: center;
      color: #000000;
      line-height: 30px;
      .fz(font-size, 40);
    }

    .pay-confirm {
      padding: 20px 0;
      background-color: @cl;
      text-align: center;
      color: #fff;
      line-height: 30px;
      .fz(font-size, 40);
    }

    /*    .van-contact-card {
          padding: 15px;

          .van-cell__value {
            margin-left: 5px;
            line-height: 20px;
            display: inline-block;
            vertical-align: middle;
          }

          &--add {
            .van-cell__value {
              line-height: 40px;
            }

            .van-cell__left-icon {
              color: blue;
              font-size: 40px;
            }
          }

          &::before {
            content: '';
            left: 0;
            right: 0;
            bottom: 0;
            height: 2px;
            position: absolute;
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
        }*/

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

    .contact-address-card {
    }
  }
</style>
