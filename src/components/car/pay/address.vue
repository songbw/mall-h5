<template lang="html">

  <div class="address">
    <v-header v-if="showHeader">
      <h1 slot="title">地址编辑</h1>
    </v-header>
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-set-default
      :show-delete="this.$route.params.id != 'new'"
      save-button-text="保存并使用"
      @save="onSave"
      @delete="onDelete"
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
        showHeader: true,
        areaList,
        addressInfo: {},
        //searchResult: []
      }
    },
    created() {
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
      let id = this.$route.params.id
      if (id != "new") {
        //获取id 相关的地址数据
        let list = this.$store.state.appconf.addressList;

        for (let i = 0; i < list.length; i++) {
          if (list[i].id == id) {
            let addressCode = this.getAddressCode(list[i].provinceName, list[i].cityName, list[i].countyName)
            this.addressInfo = {
              "name": list[i].receiverName,
              "tel": list[i].mobile,
              "country": "",
              "areaCode": addressCode,
              "postalCode": list[i].zip,
              "addressDetail": list[i].address,
              "isDefault": (list[i].status == 1)
            }
            break;
          }
        }
        try {

        } catch (e) {

        }
      }
    },
    methods: {
      isUserEmpty(userInfo) {
        return (userInfo == undefined || JSON.stringify(userInfo) == "{}")
      },
      getAddressCode(province, city, county) {
        let code = ""
        for (var key in areaList.province_list) {
          if (areaList.province_list[key] == province) {
            code = key
            break;
          }
        }

        for (var key in areaList.city_list) {
          if (key.substr(0, 2) == code.substr(0, 2) && areaList.city_list[key] == city) {
            code = key
            break;
          }
        }

        for (var key in areaList.county_list) {
          if (key.substr(0, 4) == code.substr(0, 4) && areaList.county_list[key] == county) {
            code = key
            break;
          }
        }
        return code
      },

      saveReceiverAddress(receiverInfo, addressCode) {
        let id = this.$route.params.id
        if (id == 'new') {
          try {
            let userInfo = this.$store.state.appconf.userInfo
            if (!this.isUserEmpty(userInfo)) {
              let user = JSON.parse(userInfo);
              if (!receiverInfo.tel.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
                this.$toast("请输入正确的电话号码")
                return
              }
              let options = {
                "openId": user.userId,
                "receiverName": receiverInfo.name,
                "mobile": receiverInfo.tel,
                "provinceId": addressCode.provinceId,
                "cityId": addressCode.cityId,
                "countyId": addressCode.countyId,
                "address": receiverInfo.addressDetail,
                "zip": addressCode.zipCode,
                "status": receiverInfo.isDefault ? 1 : 0
              }
              this.$api.xapi({
                method: 'post',
                baseURL: this.$api.ORDER_BASE_URL,
                url: '/receiver',
                data: options,
              }).then((response) => {
                let id = response.data.data.result;
                this.$store.commit('SET_USED_ADDRESS_ID', id);
                let list = this.$store.state.appconf.addressList;
                let address = {
                  "id": id,
                  "openId": user.userId,
                  "receiverName": receiverInfo.name,
                  "telephone": null,
                  "mobile": receiverInfo.tel,
                  "email": null,
                  "provinceId": addressCode.provinceId,
                  "provinceName": receiverInfo.province,
                  "cityId": addressCode.cityId,
                  "cityName": receiverInfo.city,
                  "countyId": addressCode.countyId,
                  "countyName": receiverInfo.county,
                  "townId": null,
                  "address": receiverInfo.addressDetail,
                  "zip": addressCode.zipCode,
                  "remark": null,
                  "status": receiverInfo.isDefault ? 1 : 0,
                  "createdAt": "",
                  "updatedAt": ""
                }
                list.push(address)
                this.$store.commit('SET_ADDRESS_LIST', list);
                //this.$router.replace({ name: '支付页' })
                //this.$router.replace({path: '/car/pay'})
                this.$router.go(-1);
              }).catch(function (error) {
                console.log(error)
              })
            }
          } catch (e) {
          }
        } else {
          try {
            let userInfo = this.$store.state.appconf.userInfo
            if (!this.isUserEmpty(userInfo)) {
              let user = JSON.parse(userInfo);
              this.$store.commit('SET_USED_ADDRESS_ID', id);
              if (!receiverInfo.tel.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
                this.$log("xxxxxxxxxxxxxxxxxxxxxxxxxx")
                this.$toast("请输入正确的电话号码")
                return
              }
              let options = {
                "id": id,
                "receiverName": receiverInfo.name,
                "mobile": receiverInfo.tel,
                "provinceId": addressCode.provinceId,
                "cityId": addressCode.cityId,
                "countyId": addressCode.countyId,
                "address": receiverInfo.addressDetail,
                "zip": addressCode.zipCode,
                "status": receiverInfo.isDefault ? 1 : 0
              }

              this.$api.xapi({
                method: 'put',
                baseURL: this.$api.ORDER_BASE_URL,
                url: '/receiver',
                data: options,
              }).then((response) => {
                let result = response.data.data.result;
                this.$store.commit('SET_USED_ADDRESS_ID', id);
                let list = this.$store.state.appconf.addressList;
                let address = {
                  "id": id,
                  "openId": user.userId,
                  "receiverName": receiverInfo.name,
                  "telephone": null,
                  "mobile": receiverInfo.tel,
                  "email": null,
                  "provinceId": addressCode.provinceId,
                  "provinceName": receiverInfo.province,
                  "cityId": addressCode.cityId,
                  "cityName": receiverInfo.city,
                  "countyId": addressCode.countyId,
                  "countyName": receiverInfo.county,
                  "townId": null,
                  "address": receiverInfo.addressDetail,
                  "zip": addressCode.zipCode,
                  "remark": null,
                  "status": receiverInfo.isDefault ? 1 : 0,
                  "createdAt": "",
                  "updatedAt": ""
                }
                //list.push(address)
                let found = -1;
                for (let i = 0; i < list.length; i++) {
                  if (list[i].id == id) {
                    found = i;
                  }
                }
                if (found != -1) {
                  list.splice(found, 1);
                  list.push(address);
                  this.$store.commit('SET_ADDRESS_LIST', list);
                }
                //this.$router.replace({path: '/car/pay'})
                this.$router.go(-1);
              }).catch(function (error) {
                console.log(error)
              })
            }
          } catch (e) {
            console.log("error:" + e)
          }
        }
      },
      onDelete(info) {
        let id = this.$route.params.id
        let list = this.$store.state.appconf.addressList;
        let found = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i].id == id) {
            found = i;
            break;
          }
        }
        if (found != -1) {
          list.splice(found, 1);//如果是删除选中地址，怎么办？
          this.$store.commit('SET_ADDRESS_LIST', list);
          this.$api.xapi({
            method: 'delete',
            baseURL: this.$api.ORDER_BASE_URL,
            url: '/receiver',
            params: {
              id: id,
            }
          }).then((response) => {
            this.$router.go(-1)
          }).catch(function (error) {
            console.log(error)
          })
        }
      },
      onSave(recerverInfo) {
        //首先获取地址编码
        let options = {
          "country": recerverInfo.country,
          "province": recerverInfo.province,
          "city": recerverInfo.city,
          "county": recerverInfo.county
        }

        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/address/code',
          data: options,
        }).then((response) => {
          let code = response.data.data.code;
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
