<template lang="html">
  <section class="submain" :style="{'background-color': mBackgroundColor}">
    <v-header :mBackgroundColor="this.mHeader.backgroundColor" v-if="showHeader">
      <h1 slot="title">{{title}}</h1>
    </v-header>
    <div v-if="showDetail">
      <div v-if="pageloading">
        <v-loading></v-loading>
      </div>
      <div :style="{'background-color': mBackgroundColor}" v-else class="home-body">
        <div v-if="this.mHeader.backgroundColor != null">
          <div class='box' :style="{'background-color': this.mHeader.backgroundColor}">
            <van-search placeholder="搜索您感兴趣的商品"
                        shape="round"
                        :background=this.mHeader.backgroundColor
                        readonly
                        @click="onSearchInputClick()"
                        v-if="this.mHeader.showSearchBar"/>
          </div>
          <div class="box_after" :style="{'background-color': this.mHeader.backgroundColor}"></div>
        </div>
        <div :class="this.mHeader.backgroundColor == null?'': 'index_main_50px' ">
          <div v-for="item in datas">
            <div v-if="item.type==='0'" style="margin-left: 5px;margin-right: 5px; border-radius: 10px">
              <v-swiper :datas="item.data"/>
            </div>
            <div v-else-if="item.type==='1'" style="margin-left: 5px;margin-right: 5px;">
              <v-service :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
            <div v-else-if="item.type==='2'" style="margin-left: 5px;margin-right: 5px;">
              <v-sectionSquared :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
            <div v-else-if="item.type==='3'" style="margin-left: 5px;margin-right: 5px;">
              <v-sectionSlide :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
            <div v-else-if="item.type==='7'"
                 :class="item.data.settings.hasMargin == undefined || item.data.settings.hasMargin?'ltRtMargin':''">
              <v-imgmap :datas="item.data"/>
            </div>
            <div v-else-if="item.type==='4'">
              <v-sectionGoods :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
              <div>
                <img :src="icon_shopCart"
                     @click="gotoShoppingCart()"
                     style="width: 3rem;height: 3rem;position: fixed;bottom: 2rem;right: .5rem;z-index: 9999;"/>
              </div>
            </div>
            <div v-else-if="item.type==='6'">
              <v-sectionCoupon :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
            <div v-else-if="item.type==='8'">
              <v-sectionCompBox :datas="item.data" :mBackgroundColor="mBackgroundColor"></v-sectionCompBox>
            </div>
            <div v-else-if="item.type==='9'" style="margin-left: 5px;margin-right: 5px;">
              <v-sectionListSlide :datas="item.data" :mBackgroundColor="mBackgroundColor"/>
            </div>
          </div>
        </div>
        <v-baseline v-if="this.showFooter" :datas="this.footerText"  :style="{'background-color': mBackgroundColor}"></v-baseline>
        <div v-else  :style="{'background-color': mBackgroundColor,'height':'5em'} "></div>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Swiper from '@/components/index/swiper.vue'
  import sectionService from '@/components/index/sectionService.vue'
  import sectionSquared from '@/components/index/sectionSquared.vue'
  import sectionSlide from '@/components/index/sectionSlide.vue'
  import sectionGoods from '@/components/index/sectionGoods.vue'
  import sectionImgMap from '@/components/index/sectionImgMap.vue'
  import sectionCoupon from '@/components/index/sectionCoupon.vue'
  import sectionCompBox from '@/components/index/sectionCompBox.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'
  import Loading from '@/common/_loading.vue'

  import {configWechat} from '@/util/wechat'
  import wx from 'weixin-js-sdk'
  import Util from '@/util/common'
  //import { Toast } from 'mint-ui'
  export default {
    components: {
      'v-header': Header,
      'v-swiper': Swiper,
      'v-service': sectionService,
      'v-sectionSquared': sectionSquared,
      'v-sectionSlide': sectionSlide,
      'v-sectionGoods': sectionGoods,
      'v-baseline': Baseline,
      'v-footer': Footer,
      'v-loading': Loading,
      'v-imgmap': sectionImgMap,
      'v-sectionCoupon': sectionCoupon,
      'v-sectionCompBox': sectionCompBox
    },
    watch: {
      '$route'(to, from) {
        let that = this
        if (to.name === '活动页') {
          let id = this.$route.params.id;
          console.log("活动页:" + id)
          if(from.name == '活动页' || from.name == '首页') {
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 20);
          }
          this.pageloading = true;
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.AGGREGATION_BASE_URL,
            url: '/aggregation/findById',
            params: {
              id: id
            },
          }).then((response) => {
            this.title = response.data.data.result.name;
            let jsonString = response.data.data.result.content
            this.datas = JSON.parse(jsonString);
            for (let i = 0; i < this.datas.length; i++) {
              if (this.datas[i].type === '4')
                this.datas[i].data.id = id;
            }
            this.mBackgroundColor = response.data.data.result.backgroundColor
            if (response.data.data.result.header != undefined) {
              let header = JSON.parse(response.data.data.result.header)
              this.mHeader = header
              if(header.showFooter != undefined) {
                this.showFooter =  header.showFooter
                this.footerText = header.footerText
              }
            }
            this.pageloading = false;
          }).catch(function (error) {
            alert(error)
            that.pageloading = false;
          })

        }
      }
    },
    data() {
      return {
        showDetail: false,
        datas: {},
        loading: true,
        pageloading: true,
        title: '',
        mBackgroundColor: '#FFFFFF',
        showFooter: false,
        footerText: '----我是有底线的-----',
        mHeader: {
          backgroundColor: '#FFFFFF',
          showSearchBar: false
        },
        showHeader: true,
        icon_shopCart: require('@/assets/icons/ico_cart-circle.png'),
      }
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        setTimeout(() => {
          if(from.name == '活动页' || from.name == '首页') {
            window.scrollTo(0, 0);
          }
        }, 20);
      })
    },

    beforeCreate() {
      let id = this.$route.params.id;
      let that = this
      this.pageloading = true;
      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.AGGREGATION_BASE_URL,
        url: '/aggregation/findById',
        params: {
          id: id
        },
      }).then((response) => {
        this.title = response.data.data.result.name;
        // const pako = require('pako');
        //const jsonString = pako.inflate(response.data.data.result.content, {to: 'string'})
        let jsonString = response.data.data.result.content
        this.datas = JSON.parse(jsonString);
        // this.$log(response.data.data.result)
        for (let i = 0; i < this.datas.length; i++) {
          if (this.datas[i].type === '4')
            this.datas[i].data.id = id;
        }
        this.$log(this.datas)
        this.mBackgroundColor = response.data.data.result.backgroundColor
        if (response.data.data.result.header != undefined) {
          let header = JSON.parse(response.data.data.result.header)
          this.mHeader = header
          if(header.showFooter != undefined) {
            this.showFooter =  header.showFooter
            this.footerText = header.footerText
          }
        }
        this.pageloading = false;
      }).catch(function (error) {
        alert(error)
        that.pageloading = false;
      })
    },

    created() {
      this.showHeader = this.$api.HAS_HEADER;
      //this.wechatShareConfig()
      if (this.$api.APP_ID == '01') {
        let code = this.$route.query.code;
        if (code != undefined) {
          this.thirdPartyLogin(code)
          this.showDetail = true;
        } else {
          this.redirectOrNot();
        }
      } else {
        this.showDetail = true;
      }
    },

    methods: {
      thirdPartLogined(openId, accessToken) {
        let that = this;
        this.$api.xapi({
          method: 'post',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/sso/thirdLogin',
          data: {
            iAppId: this.$api.APP_ID,
            accessToken: accessToken,
            openId: openId,
          }
        }).then((response) => {
          let rt = response.data.data.result
          this.$log("local information:" + JSON.stringify(rt));
          if (rt.token != null) {
            that.$store.commit('SET_TOKEN', rt.token);
            this.$log("setToken:" + rt.token)
            let data = this.$md5(rt.token)
            if (rt.newUser) {
              data = "1" + data
            } else {
              data = "0" + data
            }
            this.$log(data)
            that.$store.commit('SET_GUYS_INFO', data);
          }
        }).catch(function (error) {
          that.$log(error)
        })
      },
      thirdPartyLogin(authCode) {
        let that = this;
        let url = ""
        let params = null
        if (this.$api.APP_ID == '01') {
          url = '/sso/thirdParty/token/wx';
          params = {
            iAppId: this.$api.APP_ID,
            code: authCode,
          }
        } else if (this.$api.IS_GAT_APP) {
          url = '/sso/thirdParty/token/gat';
          params = {
            iAppId: this.$api.APP_ID,
            initCode: authCode,
          }
        }
        this.$log("url:" + url)
        this.$log(params)
        if (url.length > 0 && params != null) {
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.SSO_BASE_URL,
            url: url,
            params: params
          }).then((response) => {
            let rt = response.data.data.result
            that.$log("rt:" + JSON.stringify(rt));
            let openId = rt.openId;
            let accessToken = rt.accessToken;
            if (openId != undefined) {
              let userId = that.$api.APP_ID + openId;
              let userInfo = {
                openId: openId,
                accessToken: rt.accessToken,
                userId: userId
              }
              that.$log("userInfo  is:" + JSON.stringify(userInfo));
              that.$store.commit('SET_USER', JSON.stringify(userInfo));
              that.thirdPartLogined(openId, accessToken)
            }
          }).catch(function (error) {
            that.$log(error)
          })
        }
      },
      redirectOrNot() {
        let userInfo = this.$store.state.appconf.userInfo;
        if (Util.isUserEmpty(userInfo)) {
          let _url = ''
          if (window.__wxjs_is_wkwebview === true) {
            _url = window.location.href.split('#')[0] || window.location.href
          } else {
            _url = window.location.href
          }
          let url = "https://" + window.location.host + window.location.pathname
          let encodeURL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            this.$api.T_APP_ID +
            "&redirect_uri=" +
            encodeURIComponent(url) +
            window.location.search +
            "&response_type=code&scope=snsapi_base&state=0102#wechat_redirect"
          this.$log(encodeURL)
          window.location.replace(encodeURL)
          setTimeout(() => {
            this.showDetail = true;
          }, 2000);
        } else {
          this.showDetail = true;
        }
      },
      wechatShareConfig() {
        this.$log('shareConfig Enter')
        if(this.$api.APP_ID === '01') {
          try{
            configWechat(this, () => {
              wx.hideOptionMenu()
            })
          } catch (e) {
          }
        }
      },
      gotoShoppingCart() {
        this.$log("gotoShoppingCart Enter")
        this.$router.push({name: '购物车页'})
      },
      gotoOrderList() {
        this.$log("gotoOrderList Enter")
        this.$router.push({name: '订单列表页'})
      },
      onSearchInputClick() {
        this.$log("onSearchInputClick")
        this.$router.push({name: '搜索页'})
      }
    }
  }
</script>


<style lang="less" scoped>
  .submain {
    width: 100%;
    height: 100%;
    padding-bottom: 4vw;
    background-color: #F8FCFF;

    .home-body {
      width: 100%;
      height: 100%;
      top: 0px;
      background-color: #f8f8f8;

      .box {
        position: relative;
        width: 100%;
        line-height: 15vw;
        background-color: #ff4444;
      }

      .box_after {
        bottom: -60px;
        height: 60px;
        border-radius: 0 0 30% 30%;
        background-color: #ff4444;
        overflow: hidden;
        z-index: -1;
      }

      .index_main_50px {
        margin-top: -50px;
      }

      .index_main_60px {
        margin-top: -60px;
      }

      .ltRtMargin {
        margin-left: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
