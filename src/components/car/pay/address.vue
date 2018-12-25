<template lang="html">

  <div class="address">
    <v-header>
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
        areaList,
        addressInfo: {},
        //searchResult: []
      }
    },
    created() {
      let id = this.$route.params.id
      console.log("id:" + id)
      if (id != "new") {
        console.log("id:" + id)
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
              "isDefault": (list[i].state == 1)
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
      getAddressCode(province, city, county) {
        console.log("province:" + province + ",city:" + city + ",county:" + county)
        // console.log("areaList:"+JSON.stringify(areaList))
        let code = ""
        for (var key in areaList.province_list) {
          if (areaList.province_list[key] == province) {
          //  console.log("key:" + key + ",value:" + areaList.province_list[key])
            code = key
            break;
          }
        }
        // console.log("code:"+code)
        for (var key in areaList.city_list) {
          if (key.substr(0, 2) == code.substr(0, 2) && areaList.city_list[key] == city) {
          //  console.log("key:" + key + ",value:" + areaList.city_list[key])
            code = key
            break;
          }
        }
        //console.log("code:"+code)

        for (var key in areaList.county_list) {
          if (key.substr(0, 4) == code.substr(0, 4) && areaList.county_list[key] == county) {
          //  console.log("key:" + key + ",value:" + areaList.county_list[key])
            code = key
            break;
          }
        }
        return code
      },

      saveReceiverAddress(receiverInfo, addressCode) {
        console.log("saveReceiverAddress Enter")
        let id = this.$route.params.id
        if (id == 'new') {
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
              "status":receiverInfo.isDefault?1:0
            }
            console.log("options:" + JSON.stringify(options));
            this.$api.xapi({
              method: 'post',
              url: '/receiver',
              data: options,
            }).then((response) => {
              let id = response.data.data.result;
              console.log("saved id is:" + JSON.stringify(id));
              this.$store.commit('SET_USED_ADDRESS_ID', id);
              let list = this.$store.state.appconf.addressList;
              let address = {
                "id":id,
                "openId":user.userId,
                "receiverName":receiverInfo.name,
                "telephone":null,
                "mobile":receiverInfo.tel,
                "email":null,
                "provinceId":addressCode.provinceId,
                "provinceName":receiverInfo.province,
                "cityId":addressCode.cityId,
                "cityName":receiverInfo.city,
                "countyId":addressCode.countyId,
                "countyName":receiverInfo.county,
                "townId":null,
                "address":receiverInfo.addressDetail,
                "zip":addressCode.zipCode,
                "remark":null,
                "status":receiverInfo.isDefault?1:0,
                "createdAt":"",
                "updatedAt":""
              }
              list.push(address)
              this.$store.commit('SET_ADDRESS_LIST', list);

              this.$router.push({ name: '支付页' })
            }).catch(function (error) {
              console.log(error)
            })
          } catch (e) {
          }
        } else {
          try {
            let user = JSON.parse(this.$store.state.appconf.userInfo);
            this.$store.commit('SET_USED_ADDRESS_ID', id);
            let options = {
              "id":id,
              "receiverName": receiverInfo.name,
              "mobile": receiverInfo.tel,
              "provinceId": addressCode.provinceId,
              "cityId": addressCode.cityId,
              "countyId": addressCode.countyId,
              "address": receiverInfo.addressDetail,
              "zip": addressCode.zipCode,
              "status":receiverInfo.isDefault?1:0
            }
            console.log("saveReceiverAddress 3")
            console.log("options:" + JSON.stringify(options));
            this.$api.xapi({
              method: 'put',
              url: '/receiver',
              data: options,
            }).then((response) => {
              let result = response.data.data.result;
              console.log("update result id is:" + JSON.stringify(result));
              this.$store.commit('SET_USED_ADDRESS_ID', id);
              let list = this.$store.state.appconf.addressList;
              let address = {
                "id":id,
                "openId":user.userId,
                "receiverName":receiverInfo.name,
                "telephone":null,
                "mobile":receiverInfo.tel,
                "email":null,
                "provinceId":addressCode.provinceId,
                "provinceName":receiverInfo.province,
                "cityId":addressCode.cityId,
                "cityName":receiverInfo.city,
                "countyId":addressCode.countyId,
                "countyName":receiverInfo.county,
                "townId":null,
                "address":receiverInfo.addressDetail,
                "zip":addressCode.zipCode,
                "remark":null,
                "status":receiverInfo.isDefault?1:0,
                "createdAt":"",
                "updatedAt":""
              }
              //list.push(address)
              let found = -1;
              for (let i = 0 ; i < list.length; i++) {
                if(list[i].id == id) {
                  found = i;
                }
              }
              if(found != -1) {
                list.splice(found,1);
                list.push(address);
                this.$store.commit('SET_ADDRESS_LIST', list);
              }

              this.$router.push({ name: '支付页' })
            }).catch(function (error) {
              console.log(error)
            })
          } catch (e) {
            console.log("error:"+e)
          }
        }
      },
      onDelete(info) {
        let id = this.$route.params.id
        console.log("info:" + JSON.stringify(info) + ",id:" + id);
        let list = this.$store.state.appconf.addressList;
        let found = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i].id == id) {
            found = i;
            break;
          }
        }
        if (found != -1) {
          console.log("list:" + JSON.stringify(list))
          list.splice(found, 1);//如果是删除选中地址，怎么办？
          this.$store.commit('SET_ADDRESS_LIST', list);
          this.$api.xapi({
            method: 'delete',
            url: '/receiver',
            params: {
              id: id,
            }
          }).then((response) => {
            //console.log("response is:" + JSON.stringify(response))
            console.log("delete success")
            this.$router.go(-1)
          }).catch(function (error) {
            console.log(error)
          })
        }
      },
      onSave(recerverInfo) {
        console.log("recerverInfo:" + JSON.stringify(recerverInfo));
        console.log("addressInfo" + JSON.stringify(this.addressInfo));
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
