<template lang="html">
  <div class="huiyu">
    <div class="balanceBox">
      <div class="amountBox">
        <span class="amount">{{accountLoaded?accountBalance:'--'}}</span>
        <span class="info">账户余额(元)</span>
      </div>
    </div>
    <div class="accountBox">
      <van-cell title="交易记录" is-link @click="onAccountRecordBtnClick">
        <img slot="icon" :src="icon_record" />
      </van-cell>
    </div>
  </div>
</template>

<script>
  import Util from '@/util/common'

  export default {
    data() {
      return {
        icon_record: require('@/assets/icons/ico_huiyuRecord.png'),
        accountBalance: 0,
        accountLoaded: false,
      }
    },

    created() {
      this.$log("huiyu created Enter")
      this.loadData()
    },

    methods: {
      async loadData() {
        this.$log("loadData Enter")
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          try {
            let user = JSON.parse(userInfo);
            let response = await this.getUserDetail(user)
            this.$log(response.data)
            if (response.data.code == 200) {
              let userDetail = response.data.data.user
              this.$log(userDetail.telephone)
              if (userDetail.telephone != undefined && userDetail.telephone.length > 0) {
                this.getAccountBalace(userDetail.telephone)
              } else {}
            }
          } catch (error) {
            //ignore
          }
        }
      },
      getUserDetail(user) {
        this.$log("getUserDetail Enter")
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/user',
          params: {
            iAppId: this.$api.APP_ID,
            openId: user.openId,
          }
        })
      },
      onAccountRecordBtnClick() {
        this.$log("onAccountRecordBtnClick Enter")
      },
      getAccountBalace(mobile) {
        let that = this
        this.$api.xapi({
          method: 'get',
          baseURL: this.$api.VENDOR_URL,
          url: '/welfare/employees/accounts/byPhone',
          params: {
            phone: mobile
          }
        }).then((response) => {
          that.$log(response.data)
        }).catch(function (error) {
          that.$log(error.response)
          that.$toast(error.response.data.message)
        })
      }
    },
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .huiyu {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .balanceBox {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 150px;
      background: linear-gradient(to left, #FA897A, #FB5F5F);

      .amountBox {
        display: flex;
        flex-direction: column;
        padding-left: 15px;

        .amount {
          color: white;
          font-size: 50px;
          font-weight: bold;
        }

        .info {
          color: white;
          font-size: 15px;
        }
      }
    }

    .accountBox {
      .van-cell {
        padding: 10pt 10pt;
        font-size: 15px;
        color: #333333;
        font-weight: 600;

        img {
          height: 20px;
          width: 22px;
          margin: 3px 10px 3px 3px
        }

      }
    }

  }

</style>
