<template lang="html">
  <div class="addressList">
    <v-header>
      <h1 slot="title">用户地址</h1>
    </v-header>
    <van-address-list
      v-model="chosenAddressId"
      :list="addresslist"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    />
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
        console.log("addresslist Enter")
        let list = []
        let id = this.$store.state.appconf.usedAddressId;
        this.chosenAddressId = -1;
        try {
          if(id != undefined || id != -1) {
            this.$store.state.appconf.addressList.forEach(item => {
              console.log("my address:" + JSON.stringify(item))
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
                  address: (item.receiverName != null ? item.receiverName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null ? item.address : "")
                })
              }
            })
          } else {
            this.$store.state.appconf.addressList.forEach(item => {
              console.log("my address:" + JSON.stringify(item))
              if (item.state != 1) {
                list.push({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.proviceName != null ? item.proviceName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null? item.address:"")
                })
              } else {
                this.chosenAddressId = item.id
                list.unshift({
                  id: item.id,
                  name: item.receiverName,
                  tel: item.mobile,
                  address: (item.receiverName != null ? item.receiverName : "") +
                    (item.cityName != null ? item.cityName : "") +
                    (item.countyName != null ? item.countyName : "") +
                    (item.address != null? item.address:"")
                })
              }
            })
          }
        } catch (e) {
        }
        console.log("list.length:" + list.length + ",this.chooseAddressId:" + this.chosenAddressId)
        if (list.length > 0 && this.chosenAddressId == -1) {
          this.chosenAddressId = list[0].id
          this.$store.commit('SET_USED_ADDRESS_ID', this.chosenAddressId);
        }
        console.log("chosenAddressId:" + this.chosenAddressId)
        return list;
      },


    },
    methods: {
      onAdd() {
        // Toast('新增地址');
        this.$router.push({name: '地址页'})
      },

      onEdit(item, index) {
        this.$router.push({path: '/car/address/'+item.id})
      },

      onSelect(item,index) {
        try {
          this.$store.state.appconf.addressList.forEach(address => {
            if (item.id == address.id) {
              this.$store.commit('SET_USED_ADDRESS_ID', address.id);
              this.$router.push({name:"支付页"});
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

  }
</style>
