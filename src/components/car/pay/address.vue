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
  import Util from '@/util/common'

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
     // this.test();
      this.showHeader = this.$api.HAS_HEADER;
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
      }
    },
    methods: {
/*       testGetCode(province,city,county) {
       // this.$log("省:"+province+",市:"+city+",县:"+county)
        let options = {
          "country": "中国",
          "province": province,
          "city": city,
          "county": county
        }
        return  this.$api.xapi({
          method: 'post',
          baseURL: this.$api.ORDER_BASE_URL,
          url: '/address/code',
          data: options,
        })
      },
      async test() {
       // this.$log(areaList.city_list)
       // this.$log(areaList.county_list)
       // this.$log(areaList.province_list)
        let province_name = "";
        let city_name = "";
        let county_name = "";
        for (var province_key in areaList.province_list) {
          let code = province_key
          province_name = areaList.province_list[province_key]
          for (var city_key in areaList.city_list) {
            if (city_key.substr(0, 2) == code.substr(0, 2)) {
              code = city_key
              city_name = areaList.city_list[city_key]
              for (var county_key in areaList.county_list) {
                if (county_key.substr(0, 4) == code.substr(0, 4) ) {
                  code = county_key
                  county_name = areaList.county_list[county_key];
                  try{
                   // this.$log("省ID:"+province_key+",省:"+province_name+",市ID:"+city_key+",市:"+city_name+",县ID:"+county_key+",县:"+county_name)
                    this.$log(county_key+" "+county_name+" "+city_key+" "+city_name+" "+province_key+" "+province_name)
                    let result =  await  this.testGetCode(province_name,city_name,county_name)
                    let code = result.data.data.code
                 //   this.$log(code)
                    if(code.countyId.length == 0) {
                      this.$log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    }
                  } catch (e) {
                    console.log("################################")
                    console.log(e)
                  }
                }
              }
            }
          }
        }
      },*/
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
            if (!Util.isUserEmpty(userInfo)) {
              let user = JSON.parse(userInfo);
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
            if (!Util.isUserEmpty(userInfo)) {
              let user = JSON.parse(userInfo);
              this.$store.commit('SET_USED_ADDRESS_ID', id);
              if (!receiverInfo.tel.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
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
        if (!recerverInfo.tel.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
          this.$toast("请输入正确的电话号码")
          return
        }
        this.$log("receiverInfo.name.length:"+recerverInfo.name.length)
        if(recerverInfo.name.length > 8) {
          this.$toast("收件人姓名长度不要超过8个字")
          return
        }
        if( !recerverInfo.name.match("^[\u4e00-\u9fa5_a-zA-Z0-9]+$")) {
          this.$toast("请输入正确的姓名")
          return
        }
        this.$log("receiverInfo.addressDetail:"+recerverInfo.addressDetail)
        if(recerverInfo.addressDetail.match("^[0-9]*$")) {
          this.$toast("收件人地址不能全是数字")
          return
        }
        if(recerverInfo.addressDetail.length > 100) {
          this.$toast("收件人详细地址不能超过100字")
          return
        }
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
