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
        let list = []
        try {
          this.$store.state.appconf.addressList.forEach(item => {
            console.log("my address:" + JSON.stringify(item))
            if (item.state != 1) {
              list.push({
                id: item.id,
                name: item.receiverName,
                tel: item.mobile,
                address: (item.receiverName != null ? item.receiverName : "") +
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
          console.log("list.length:" + list.length + ",this.chooseAddressId:" + this.chosenAddressId)
          if (list.length > 0 && this.chosenAddressId == -1) {
            this.chosenAddressId = list[0].id
          }
          console.log("chosenAddressId:" + this.chosenAddressId)
        } catch (e) {
        }
        return list;
      },


    },
    methods: {
      onAdd() {
        // Toast('新增地址');
        this.$router.push({name: '地址页'})
      },

      onEdit(item, index) {
        console.log("item:" + JSON.stringify(item) + ",index:" + index+"path:"+"/car/addressList/${item.id}")
        //this.$router.push({path: '/car/pay'})
        this.$router.push({path: '/car/addressList/'+item.id})
      }
    }
  }
</script>

<style lang="less" scoped>
  .addressList {

  }
</style>
