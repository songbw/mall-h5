<template lang="html">
  <div class="addressList">
    <v-header class="header">
      <h1 slot="title">用户地址</h1>
    </v-header>
    <div class="list-body">
      <van-address-list
        v-model="chosenAddressId"
        :list="addresslist"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      />
    </div>
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
        chosenAddressId: '-1',
        disabledList: []
      }
    },
    computed: {
      addresslist() {
        this.$log("addresslist Enter")
        let list = []
        let id = this.$store.state.appconf.usedAddressId;
        this.chosenAddressId = -1;
        try {
          if (id != undefined || id != -1) {
            this.$store.state.appconf.addressList.forEach(item => {
              if (item.id != id) {
                list.push({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.proviceName != null ? item.proviceName : "") +
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
                  address: (item.proviceName != null ? item.proviceName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null ? item.address : "")
                })
              }
            })
          } else {
            this.$store.state.appconf.addressList.forEach(item => {
              if (item.state != 1) {
                list.push({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.proviceName != null ? item.proviceName : "") +
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
                  address: (item.proviceName != null ? item.proviceName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null ? item.address : "")
                })
              }
            })
          }
        } catch (e) {
        }
        if (list.length > 0 && this.chosenAddressId == -1) {
          this.chosenAddressId = list[0].id
          this.$store.commit('SET_USED_ADDRESS_ID', this.chosenAddressId);
        }
        this.$log(list)
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
    methods: {
      onAdd() {
        // Toast('新增地址');
        this.$router.push({name: '地址页'})
      },

      onEdit(item, index) {
        this.$router.push({path: '/car/address/' + item.id})
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
  .addressList {
    width: 100%;
    height: 100%;
    .header{
      width:100%;
      position:fixed;
      z-index:5;
      top:0;
    }
    .list-body{
      padding-top: 2.3em;
    }
  }
</style>
