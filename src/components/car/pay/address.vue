<template lang="html">

  <div class="address">
    <v-header>
      <h1 slot="title">地址编辑</h1>
    </v-header>
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-set-default
      save-button-text = "保存并使用"
      @save="onSave"
    />
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import areaList from '@/assets/area.js'

  export default {
    components: {
      'v-header': Header
    },
    data() {
      return {
        areaList,
        addressInfo: {},
        //searchResult: []
      }
    },
    created() {
      let id = this.$route.params.id
      if (id != "new") {
        console.log ("id:"+id)
        //获取id 相关的地址数据
        try {

        } catch (e) {

        }
      }
    },
    methods: {
      saveReceiverAddress(receiverInfo, addressCode) {
        try {
          let user = JSON.parse(this.$store.state.appconf.userInfo);
          let options = {
            "openId": user.userId,
            "receiverName": receiverInfo.name,
            "mobile": receiverInfo.tel,
            "provinceId": addressCode.provinceId,
            "cityId": addressCode.cityId,
            "countyId": addressCode.countyId,
            "address": receiverInfo.addressDetail,
            "zip": addressCode.zipCode,
          }
          console.log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/receiver',
            data: options,
          }).then((response) => {
            let result = response.data.data.result;
            console.log("saved id is:" + JSON.stringify(result));
            this.$store.commit('SET_USED_ADDRESS_ID', result);
          }).catch(function (error) {
            console.log(error)
          })
        } catch (e) {

        }

      },
      onSave(recerverInfo) {
        console.log("recerverInfo:" + JSON.stringify(recerverInfo));
       // this.$store.commit('SET_ADDRESS', recerverInfo);
        //首先获取地址编码
        let options = {
          "country": recerverInfo.country,
          "province": recerverInfo.province,
          "city": recerverInfo.city,
          "county": recerverInfo.county
        }
        console.log("options:" + JSON.stringify(options));
        this.$api.xapi({
          method: 'post',
          url: '/address/code',
          data: options,
        }).then((response) => {
          let code = response.data.data.code;
          console.log("AddressCode result is:" + JSON.stringify(code));
         // this.$store.commit('SET_ADDRESS_CODE', code);
          //保存接收者地址到网络
          this.saveReceiverAddress(recerverInfo, code);
        }).catch(function (error) {
          console.log(error)
        })
      },
    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

</style>
