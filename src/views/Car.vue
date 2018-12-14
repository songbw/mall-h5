<template lang="html">

  <div class="car">
    <!-- slot分发内容 让子组件混合父组件的内容 -->
    <v-header>
      <h1 slot="title">购物车</h1>
    </v-header>
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <mt-cell-swipe
        v-for="(k,index) in carList"
        :right="[{content: '删除',style: { background: 'red', color: '#fff'},
           handler: function(){ onDeleteBtnClick(k,index) }}]">
        <div slot="title">
          <van-checkbox
            v-model="k.choose"
            class="checkedBox"
            @change="singleChecked(index,k)">
          </van-checkbox>
        </div>
        <van-card
          :price="k.product.price"
          :title="k.product.brand+ ' '+ k.product.name + ' '+ k.product.model"
          :thumb="k.product.image">
          <div slot="footer">
            <van-stepper v-model="k.count" @change="onCountChange(k.id,k.product.skuid,k.count)"/>
          </div>
        </van-card>
      </mt-cell-swipe>
    </van-list>
    <!-- 根据购物车是否有商品加载不同的组件 -->
    <!--
    <v-something v-if="list.length > 0"/>
    <v-nothing v-else/>
    -->
    <v-footer/>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Nothing from '@/components/car/nothing.vue'
  import Something from '@/components/car/something.vue'
  import Footer from '@/components/car/footer.vue'

  export default {
    data() {
      return {
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        carList: [],
        loading: false,
        finished: false,
        selStateInCarList: []
      }
    },

    created() {
      window.onUserInfoLoaded = this.onUserInfoLoaded;
    },

    methods: {
      onDeleteBtnClick(k, index) {
        console.log("onDeleteBtnClick id:" + k.id + ",index:" + index)
        this.carList.splice(index, 1);
        this.$api.xapi({
          method: 'delete',
          url: '/cart',
          params: {
            id: k.id,
          }
        }).then((response) => {
          console.log("response is:" + JSON.stringify(response))
        }).catch(function (error) {
          console.log(error)
        })
      },

      onCountChange(id, skuid, count) {
        console.log("onCountChange id:" + id + ",skuid:" + skuid + ",count:" + count)
        //change carlist
        let options = {
          "id": id,
          "count": count
        }
        //console.log("options:" + JSON.stringify(options));
        this.$api.xapi({
          method: 'put',
          url: '/cart/num',
          data: options,
        }).then((response) => {
          console.log("response is:" + JSON.stringify(response));
          if (response.data.code == 200) {
            console.log("change goods count success!")
          } else {
            console.log("network issue when change goods count!")
          }
        }).catch(function (error) {
          console.log(error)
          this.finished = true;
        })
      },

      loadCartListBy(user) {
        let userInfo = JSON.parse(user);
        if (this.total == -1 || this.total > this.list.length) {
          let options = {
            "openId": userInfo.userId,
            "pageNo": this.pageNo++
          }
          console.log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/cart/all',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            //console.log("list is:" + JSON.stringify(this.result.list));
            this.result.list.forEach(item => {
              this.list.push(item);
              this.getSkuIynfoBy(item,userInfo);
            })
            this.loading = false;
            if (this.list.length >= this.total)
              this.finished = true;
          }).catch(function (error) {
            console.log(error)
            this.finished = true;
          })
        }
      },

      onLoad() {
        let user = this.$store.state.appconf.userInfo;
        if (user != null && user.length > 0) {
          this.loadCartListBy(user);
        } else {
          this.getUserInfo();
        }
      },

      getUserInfo() {
        let method = "send";
        let action = "getUserInfo";
        let params = {"callback": "onUserInfoLoaded", "action": action};//android接收参数，json格式
        window.jsInterface.invokeMethod(method, [JSON.stringify(params)]);
      },

      onUserInfoLoaded(userInfo) {
        console.log("UserInfo:" + JSON.stringify(userInfo));
        this.$store.commit('SET_USER', JSON.stringify(userInfo));
        let user = JSON.stringify(userInfo);
        if (user != null || user.length > 0) {
          this.loadCartListBy(user);
        }
      },

      isInSelectedCarlist(id,user) {
        this.selStateInCarList =  this.$store.state.appconf.selStateInCarList
        let choose = true;
        let found = false;
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == id && this.selStateInCarList[i].userId == user.userId)
          {
             choose = this.selStateInCarList[i].choose;
             found = true;
             break;
          }
        }
        if (!found) {
          this.selStateInCarList.push({"userId":user.userId,"id":id,"choose":true,"isDel":0});
          this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
        }
        return choose;
      },

      getSkuIynfoBy(item,user) {
        this.$api.xapi({
          method: 'get',
          url: '/prod',
          params: {
            id: item.skuId,
          }
        }).then((res) => {
          //console.log("product info:"+JSON.stringify( res.data.data.result));
          let product = res.data.data.result;
          let choose = this.isInSelectedCarlist(item.id,user)
          this.carList.push(
            {
              "userId":user.userId,
              "product": product,
              "count": item.count,
              "id": item.id,
              "choose": choose
            })
        }).catch((error) => {
          console.log(error)
        })
      },

      onClose(clickPosition, instance) {
        switch (clickPosition) {
          case 'right':
            break;
        }
      },

      singleChecked(index,k) {
        console.log("index:"+index+",k.choose:"+k.choose)
        //update selStateInCarList
        this.selStateInCarList =  this.$store.state.appconf.selStateInCarList
        for (let i = 0; i < this.selStateInCarList.length; i++) {
          if (this.selStateInCarList[i].id == k.id && this.selStateInCarList[i].userId == k.userId)
          {
            this.selStateInCarList[i].choose = k.choose;
            break;
          }
        }
        this.$store.commit('SET_SELECTED_CARLIST', this.selStateInCarList);
        console.log("selStateInCarList:"+JSON.stringify(this.selStateInCarList))
      }

    },
    components: {
      'v-header': Header,
      'v-nothing': Nothing,
      'v-something': Something,
      'v-footer': Footer
    },
  }

</script>

<style lang="less" scoped>
  @import "../assets/fz.less";

  .car {
    width: 100%;
    padding-bottom: 14vw;

    .checkBox-con {
      padding: 0.6rem;
    }

    .checkedBox {

    }

    .swipe-cell-rightbtn {

    }

    .van-card__footer > div {
      display: flex !important;
      align-items: center;
      justify-content: space-around;
    }

  }
</style>
