<template lang="html">
  <div class="addressList">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">用户地址</h1>
    </v-header>
    <div class="list-body">
      <van-address-list v-model="chosenAddressId" :list="addresslist" @add="onAdd" @edit="onEdit" @select="onSelect">
        <div class="noContext" slot="top" v-if="loadedAddressList && addresslist.length == 0">
          <img :src="icon_noContext" alt="">
          <span class="noContext_line1">您还没有收货地址!</span>
        </div>
      </van-address-list>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Util from '@/util/common'

  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        showHeader: true,
        chosenAddressId: '-1',
        disabledList: [],
        loadedAddressList: false,
        icon_noContext: require('@/assets/icons/ico_empty_box.png'),
      }
    },
    computed: {
      addresslist() {
        this.$log("addresslist Enter")
        let list = []
        let id = this.$store.state.appconf.usedAddressId;
        if (id == undefined) {
          id = -1
        }
        this.$log(this.$store.state.appconf.usedAddressId)
        this.chosenAddressId = -1;
        try {
          if (id != -1) {
            this.$store.state.appconf.addressList.forEach(item => {
              this.$log(item)
              if (item.id != id) {
                list.push({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.provinceName != null ? item.provinceName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null ? item.address : "")
                })
              } else {
                this.chosenAddressId = item.id
                list.unshift({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.provinceName != null ? item.provinceName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null ? item.address : "")
                })
              }
            })
          } else {
            this.$store.state.appconf.addressList.forEach(item => {
              this.$log(item)
              if (item.status != 1) {
                list.push({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.provinceName != null ? item.provinceName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null ? item.address : "")
                })
              } else {
                this.chosenAddressId = item.id
                list.unshift({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.provinceName != null ? item.provinceName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null ? item.address : "")
                })
              }
            })
          }
        } catch (e) {}
        if (list.length > 0 && this.chosenAddressId == -1) {
          this.chosenAddressId = list[0].id
          this.$store.commit('SET_USED_ADDRESS_ID', this.chosenAddressId);
        }
        this.$log(list)
        this.loadedAddressList = true
        return list;
      },
    },
    beforeCreate() {
      let that = this;
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
          this.$api.xapi({
            method: 'post',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/receiver/all',
            data: options,
          }).then((response) => {
            let result = response.data.data.result;
            this.addressCount = result.total;
            if (this.addressCount != 0) {
              this.$store.commit('SET_ADDRESS_LIST', result.list);
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
    created() {
      this.showHeader = this.$api.HAS_HEADER;
    },
    methods: {
      onAdd() {
        // Toast('新增地址');
        let userInfo = this.$store.state.appconf.userInfo;
        if (!Util.isUserEmpty(userInfo)) {
          this.$router.push({name: '地址页'})
        } else {
          this.$toast("没有用户信息，请先登录")
        }
      },

      onEdit(item, index) {
        this.$router.push({
          path: '/car/address/' + item.id
        })
      },

      onSelect(item, index) {
        try {
          this.$store.state.appconf.addressList.forEach(address => {
            if (item.id == address.id) {
              this.$store.commit('SET_USED_ADDRESS_ID', address.id);
              //this.$router.replace({name:"支付页"});
              this.$router.go(-1);
            }
          })
        } catch (e) {

        }
      }
    }
  }

</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .addressList {
    width: 100%;
    height: 100%;

    .header {
      width: 100%;
    }

    .list-body {
      .noContext {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;
        height: 500px;

        img {
          height: 130px;
          width: 130px;
        }

        span {
          margin: 2vw;
        }

        .noContext_line1 {
          font-weight: lighter;
          color: black;
          .fz(font-size, 35);
        }
      }
    }
  }

</style>
