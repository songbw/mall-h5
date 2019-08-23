<template lang="html">
  <section class="couponCenter">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">领券中心</h1>
    </v-header>
    <div class="couponCenterBody">
      <div class="couponCenterMain">
        <div v-if="launchedLoading">
          <v-loading></v-loading>
        </div>
        <div v-else>
          <div v-if="couponTypes.length > 0">
            <van-tabs sticky
                      v-model="active"
                      @click="onClick"
                      :swipe-threshold=swipeThreshold swipeable
                      :ellipsis=false>
              <van-tab v-for="(item,type) in couponTypes" :title=item.title :key="type">
                <van-list v-model="item.loading"
                          :finished="item.finished"
                          @load="onLoad(active)">
                  <div class="couponList">
                    <div class="coupon coupon-white" v-for="(k,i) in item.list" :key="i">
                      <div class="coupon-main">
                        <div class="coupon-img">
                          <img :src="k.imageUrl.length?k.imageUrl: couponImg">
                        </div>
                        <div class="coupon-info coupon-hole coupon-info-right-dashed">
                          <div class="coupon-price">
                            <span v-if="k.rules.couponRules.type !=2" style="margin-right: -7px">￥</span>
                            {{formateCouponPrice(k.rules.couponRules)}}
                            <span>{{formateCouponDetail(k.rules.couponRules)}}</span>
                          </div>
                          <div class="coupon-desc">{{formateCouponDescription(k)}}</div>
                          <div class="coupon-expire-date">
                            {{formatEffectiveDateTime(k.effectiveStartDate,k.effectiveEndDate)}}
                          </div>
<!--                          <div class="coupon-progress">
                            <van-progress
                              color="#f44"
                              :percentage=formateReleasePercentage(k)
                            />
                          </div>-->
                        </div>
                      </div>
                      <div v-if="isCouponUptoLimited(k,i)" class="coupon-get  coupon-get-already"
                           @click="onConponUseClick(k,i)">
                        <div>
                          <span class="coupon-action" style="margin-top:50px;" v-if="k.url != undefined && k.url.length > 0">立即使用</span>
                        </div>
                      </div>
                      <div v-else class="coupon-get" @click="onConponCollectClick(k,i)">
                        <div>
                          <van-circle
                            :value="formateReleasePercentage(k)"
                            color="#FF4444"
                            fill="#fff"
                            size="55px"
                            layer-color="#cccccc"
                            :text="formateReleasePercentageText(k)"
                            :rate="100"
                            :speed="100"
                            :stroke-width="50"/>
                        </div>
                        <div>
                          <span class="coupon-action" v-if="formateReleasePercentage(k) < 100" style="margin-top:5px;">立即领取</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </van-list>
              </van-tab>
            </van-tabs>
          </div>
          <div class="noCoupon" v-else>
            <img :src="icon_noCoupon">
            <span class="noCoupon_line1">很遗憾</span>
            <span class="noCoupon_line2">暂时还没有可领取优惠券</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'
  import Loading from '@/common/_loading.vue'
  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      'v-footer': Footer,
      'v-loading': Loading,
    },

    data() {
      return {
        active: 0,
        swipeThreshold: 5,
        couponImg: require('@/assets/icons/ico_coupon.png'),
        couponTypes: [],
        couponCenterHeaderImg: require('@/assets/icons/ico_couponCenterHeader.jpg'),
        icon_noCoupon: require('@/assets/icons/ico_noCoupon.png'),
        headerColor: "#FFFFFF",
        reload: false,
        showHeader: true,
        launchedLoading: false,
      }
    },

    beforeCreate() {
      this.$log("beforeCreate Enter xxxx");
      let that = this;
      this.launchedLoading = true;
      that.$api.xapi({
        method: 'get',
        baseURL: this.$api.EQUITY_BASE_URL,
        url: '/coupon/activeCategories',
      }).then((response) => {
        let result = response.data.data.result;
        that.$log(result)
        let tags = result.tags;
        if (tags != null) {
          tags.forEach(item => {
            let type = {
              "title": item.name,
              "type": "tag",
              "id": item.id,
              "list": [],
              "total": -1,
              "pageNo": 1,
              "status": -1,
              "loading": false,
              "finished": false,
            }
            that.couponTypes.push(type);
          })
        }
        let categories = result.categorys;
        categories.forEach(item => {
          if (item.id != null && item.name != null) {
            let type = {
              "title": item.name,
              "type": "category",
              "id": item.id,
              "list": [],
              "total": -1,
              "pageNo": 1,
              "status": -1,
              "loading": false,
              "finished": false,
            }
            that.couponTypes.push(type);
          }
        })
        that.$log(that.couponTypes)
        this.launchedLoading = false;
      }).catch(function (error) {
        that.$log(error)
        this.launchedLoading = false;
      })
    },

    created() {
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
    },

    methods: {
      See(e) {
        window.location.href = e
      },
      gotoGoodsPage(mpu) {
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.PRODUCT_BASE_URL,
            url: '/prod',
            params: {
              mpu: mpu,
            }
          }).then((res) => {
            this.updateCurrentGoods(res.data.data.result);
            this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {

        }
      },

      isCouponUptoLimited(k, i) {
        if (k.userCollectNum < k.rules.perLimited)
          return false;
        return true;
      },
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },

      resetCouponTypeList() {
        /*        for(let i = 0 ; i< this.couponTypes.length ; i++) {
                  this.couponTypes[i].list.splice(0,1);
                }
                this.couponTypes.splice(0,1);*/
        for (let i = 0; i < this.couponTypes.length; i++) {
          this.couponTypes[i].list = [];
          this.couponTypes[i].total = -1;
          this.couponTypes[i].status = -1;
          this.couponTypes[i].pageNo = 1;
          this.couponTypes[i].loading = false;
          this.couponTypes[i].finished = false;
        }
      },
      onClick(index, title) {
        this.$log("onClick Enter, index is:" + index + ",title is:" + title)
        this.onLoad(index)
      },

      onLoad(index) {
        this.$log("onLoad:" + index)
        let that = this
        this.$log(this.reload)
        if (this.reload) {
          this.resetCouponTypeList();
          this.reload = false;
        }
        this.$log(that.couponTypes[index])
        if (that.couponTypes[index].total == -1 || that.couponTypes[index].total > that.couponTypes[index].list.length) {
          that.couponTypes[index].loading = true;
          let params = {
            offset: that.couponTypes[index].pageNo++,
            limit: 5,
          }
          let userInfo = this.$store.state.appconf.userInfo;
          if (!that.isUserEmpty(userInfo)) {
            let user = JSON.parse(userInfo);
            params["userOpenId"] = user.userId
          }
          that.$log(that.couponTypes[index])
          if (that.couponTypes[index].type == 'category') {
            params["categoryId"] = that.couponTypes[index].id
            params["categoryName"] = that.couponTypes[index].title
          }
          if (that.couponTypes[index].type == 'tag') {
            params["tagId"] = that.couponTypes[index].id
            params["tagName"] = that.couponTypes[index].title
          }
          that.$api.xapi({
            method: 'get',
            baseURL: this.$api.EQUITY_BASE_URL,
            url: '/coupon/activeCoupon',
            params: params
          }).then((response) => {
            let result = response.data.data.result;
            // that.$log(result)
            that.couponTypes[index].total = result.total;
            if (result.list == undefined || result.list.length == 0) {
              that.couponTypes[index].loading = false;
              that.couponTypes[index].finished = true;
            } else {
              result.list.forEach(item => {
                that.couponTypes[index].list.push(item);
              })
              that.couponTypes[index].loading = false;
              if (that.couponTypes[index].list.length >= that.couponTypes[index].total) {
                that.couponTypes[index].finished = true;
              }
            }
          }).catch(function (error) {
            that.$log(error)
            that.couponTypes[index].loading = false;
            that.couponTypes[index].finished = true;
          })
        }

      },
      getCouponClick() {
        this.$log("getCouponClick Enter")
      },

      isCouponActivied(couponInfo) {
        this.$log(couponInfo)
        let ret = "";
        let startTime = new Date(couponInfo.effectiveStartDate.replace(/-/g,'/')).getTime()
        let endTime = new Date(couponInfo.effectiveEndDate.replace(/-/g,'/')).getTime()
        let current = new Date().getTime()
        if (current < startTime) {
          ret = "优惠券活动未开始"//券活动未开始
        } else if (current <= endTime) {
          ret = "success" //活动开始
        } else {
          ret = "优惠券已无效"// 活动已经结束
        }
        return ret
      },

      onConponUseClick(couponInfo, i) {
        this.$log("onConponUseClick Enter")
        let ret = this.isCouponActivied(couponInfo);
        if (ret == "success") {
          let url = couponInfo.url;
          if (url.startsWith("aggregation://")) {
            let id = url.substr(14);
            this.$router.push({path: '/index/' + id});
          } else if (url.startsWith("route://")) {
            let target = url.substr(8);
            let paths = target.split("/");
            this.$log(paths);
            if (paths[0] === 'category') {
              this.$router.push({path: '/category'})
            } else if (paths[0] === 'commodity') {
              try {
                if (paths[1] != null)
                  this.gotoGoodsPage(paths[1]);
              } catch (e) {
              }
            } else if (paths[0] === 'listing') {
              switch (couponInfo.rules.scenario.type) {
                case 1: {
                  let coupon = {
                    "couponInfo": couponInfo
                  }
                  this.$store.commit('SET_CURRENT_COUPON_PAGE_INFO', JSON.stringify(coupon));
                  this.$router.push("/user/couponListActivity");
                  return;
                }
                case 2: {
                  this.$router.push({path: "/category"});
                  return
                }
                case 3: {
                  this.$router.push({path: "/category/" + couponInfo.rules.scenario.categories[0]});
                  return
                }
                default: {
                  if (url.startsWith("http://") || url.startsWith("http://")) {
                    this.See(url);
                  }
                  return
                }
              }
            }
          } else if (url.startsWith("http://") || url.startsWith("http://")) {
            this.See(url);
          }
        } else {
          if (ret.length > 0) {
            this.$toast(ret)
          }
        }

      },

      onConponCollectClick(coupon, i) {
        this.$log("onConponCollectClick Enter");
        this.$log(coupon)
        let that = this
        let userInfo = this.$store.state.appconf.userInfo;
        that.$log(userInfo)
        if (!that.isUserEmpty(userInfo) &&
          coupon.releaseTotal > coupon.releaseNum) {
          let user = JSON.parse(userInfo);
          let options = {
            // userOpenId:"1044391000fd194ab888b1aa81c03c3710",//user.userId,
            userOpenId: user.userId,
            code: coupon.rules.code
          }
          that.$api.xapi({
            method: 'post',
            baseURL: this.$api.EQUITY_BASE_URL,
            url: '/coupon/collect',
            data: options,
          }).then((response) => {
            let result = response.data.data;
            that.$log(result)
            that.$log(that.couponTypes[that.active].list[i])
            that.couponTypes[that.active].list[i].userCollectNum = result.couponCollectNum;
            that.couponTypes[that.active].list[i].releaseNum++;
            that.reload = true;
          }).catch(function (error) {
            that.$log(error)
          })
        }
      },
      formateCouponPrice(rules) {
        switch (rules.type) {
          case 0://满减券
            return rules.fullReduceCoupon.reducePrice.toFixed(2);
          case 1://代金券
            return rules.cashCoupon.amount.toFixed(2);
          case 2://折扣券
            return rules.discountCoupon.discountRatio * 10 + ' 折';
          case 3://服务券
            this.$log(rules)
            return rules.serviceCoupon.price.toFixed(2)
          default:
            return ""
        }
      },

      formateCouponDescription(couponInfo) {
        switch (couponInfo.rules.scenario.type) {
          case 1:
            return "仅限某些指定的商品可用";
          case 2:
            return "全场商品可用";
          case 3:
            return "仅限定某些品牌类商品可用";
          default:
            return "限提供所描述特定的服务可用"
        }
      },

      formateCouponDetail(rules) {
        switch (rules.type) {
          case 0://满减券
            return '满' + rules.fullReduceCoupon.fullPrice + '元可用';
          case 1://代金券
            return '代金券';
          case 2://折扣券
            if (rules.discountCoupon.fullPrice > 0) {
              return '满' + rules.discountCoupon.fullPrice + '元可用';
            } else {
              return '折扣券 ';
            }
          default:
            return ""
        }
      },
      formateReleasePercentage(coupon) {
        if (coupon.releaseTotal == 0)
          return 100;
        let percentage = (Math.round(coupon.releaseNum / coupon.releaseTotal * 10000) / 100.00);
        return percentage;
      },
      formateReleasePercentageText(coupon) {
        if (coupon.releaseTotal == 0)
          return '已领取'+'100%';
        let percentage = (Math.round(coupon.releaseNum / coupon.releaseTotal * 10000) / 100.00);
        return '已领取'+percentage+'%';
      },
      formatEffectiveDateTime(effectiveStartDate, effectiveEndDate) {
        return this.$moment(effectiveStartDate).format('YYYY.MM.DD') + ' - ' + this.$moment(effectiveEndDate).format('YYYY.MM.DD');
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';
  @import '../../assets/user/icon/carstyle.css';

  .couponCenter {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .couponCenterBody {
      .couponCenterHeader {
        img {
          width: 100%;
          display: inline-block;
        }
      }

      .couponCenterMain {
        width: 100%;

        .noCoupon {
          width: 100%;
          margin-top: 100px;
          background-color: #f8f8f8;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: Center;

          img {
            height: 130px;
            width: 130px;
          }

          span {
            margin: 2vw;
          }

          .noCoupon_line1 {
            font-weight: lighter;
            color: black;
            .fz(font-size, 35);
          }

          .noCoupon_line2 {
            font-weight: lighter;
            color: #8c8c8c;
            .fz(font-size, 28);
          }

        }

        .couponList {
          display: flex;
          flex-direction: column;
          background-color: #f8f8f8;

          .coupon {
            background-color: white;
            display: flex;
            color: black;
            position: relative;
            padding-left: .5rem;
            padding-right: .5rem;
            margin: .5rem;
            /** 这里不能用百分号，因为百分号是分别相对宽和高计算的，会导致弧度不同  */
            border-top-right-radius: .3rem;
            border-bottom-right-radius: .3rem;
            overflow: hidden;

            .coupon-white {
              background-color: white;
            }

            .coupon-yellow {
              background-color: #F39B00;
            }

            .coupon-white-gradient {
              background-image: linear-gradient(150deg, #FFFFFF 50%, #FFFFFFD8 50%);
            }

            .coupon-yellow-gradient {
              background-image: linear-gradient(150deg, #F39B00 50%, #F39B00D8 50%);
            }

            .coupon-red-gradient {
              background-image: linear-gradient(150deg, #D24161 50%, #D24161D8 50%);
            }

            .coupon-green-gradient {
              background-image: linear-gradient(150deg, #7EAB1E 50%, #7EAB1ED8 50%);
            }

            .coupon-blue-gradient {
              background-image: linear-gradient(150deg, #50ADD3 50%, #50ADD3D8 50%);
            }

            .coupon-main {
              display: flex;
              flex-direction: row;
              width: 90%;

              .coupon-img {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                width: 25%;
                position: relative;

                img {
                  display: inline-block;
                  width: 100%;
                }
              }

              .coupon-img-allreleased::before {
                content: '';
                width: 5rem;
                height: 5rem;
                background-size: 5rem 5rem;
                background-image: url('data:image/png;base64,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');
                position: absolute;
                top: -1rem;
                left: -1rem;
              }

              .coupon-info-right-dashed {
                border-right: 2px dashed #c8c9cc;
              }

              .coupon-info-right-solid {
                border-right: 2px solid white;
              }

              /* 使用两个边框为圆角的白色div制造半圆缺角，有个缺点是这个缺角必须与背景色相同（clip-path不好弄） */

              .coupon-hole::before, .coupon-hole::after {
                content: '';
                width: 1rem;
                height: 1rem;
                background-color: #f8f8f8;
                border-radius: 50%;
                position: absolute;
                right: -.5rem;
              }

              .coupon-info {
                padding: 0.5rem 0.5rem 0.5rem;
                width: 65%;
                position: relative;
              }

              .coupon-info::before {
                top: -.5rem;
              }

              .coupon-info::after {
                bottom: -.5rem;
              }

              .coupon-info > div {
                margin-bottom: .2rem;
              }

              .coupon-desc {
                margin-left: 3px;
                min-height: 1em;
                .fz(font-size, 22);
                font-weight: lighter;
                color: #323233;
              }

              .coupon-price {
                font-size: 120%;
                font-weight: bold;
                color: #FF4444;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
              }

              .coupon-price > span {
                font-size: 60%;
                margin-left: .5rem;
                font-weight: normal;
              }

              .coupon-expire-date {
                margin-top: 5px;
                margin-left: 5px;
                .fz(font-size, 22);
                font-weight: lighter;
                color: #8c8c8c;
              }

              .coupon-progress {
                margin-top: 10px;
              }
              .coupon-suppler {
                display: flex;
                .fz(font-size, 25);
                .coupon-name{
                  width: 60%;
                  min-width: 100px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  word-break: break-all;
                }
                .supply-name{
                  margin-right: 5px;
                  text-align: center;
                  span {
                    width: 80%;
                    margin-top: 1px;
                    background-color: #ff4444;
                    color: white;
                    padding: 1px 5px 2px 5px;
                    border-radius: 8px;
                    .fz(font-size, 20);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    word-break: break-all;
                    margin-left: 5px;
                  }
                }
              }
            }

            .coupon-get {
              padding: .2rem;
              /** 这里使用flex是为了让文字居中 */
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              width: 18%;
              position: relative;
              .fz(font-size, 25);

              .coupon-action {
                .fz(font-size, 20);
                background-color: #FF4444;
                color: white;
                padding: 2px;
                border-radius: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
              }
            }

            .coupon-get > .coupon-desc {
              font-size: 150%;
              margin-bottom: .5rem;
              font-weight: bold;
            }

            .coupon-get-already::after {
              content: '';
              width: 4.8rem;
              height: 4.8rem;
              background-size: 4.8rem 4.8rem;
              background-image: url('data:image/png;base64,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');
              position: absolute;
              top: -1.8rem;
              right: -1rem;
            }
          }

          /* 左边框的波浪 */

          .coupon-wave-left::before, .coupon-wave-right::after {
            content: '';
            position: absolute;
            top: 0;
            height: 100%;
            width: 14px;
            background-image: radial-gradient(#f8f8f8 0, #f8f8f8 4px, transparent 4px);
            /** 如果只设置为半径的两倍(直径)，那么半圆之间没有类似堤岸的间隔 */
            background-size: 14px 14px;
            background-position: 0 2px;
            background-repeat: repeat-y;
            z-index: 1;
          }

          .coupon-wave-left::before {
            left: -7px;
          }

          .coupon-wave-right::after {
            right: -7px;
          }


          /*.coupon-item {
            margin: 5px;
          }

          .coupon-item .nick {
            color: #fff;
          }

          .coupon-item .validDate {
            color: #fff;
            .fz(font-size, 25);
          }

          .coupon-item .coupon-money {
            width: 100%;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            font-size: 1.2rem;
            align-items: center;
          }

          .coupon-item .coupon-money em {
            font-size: 3.8rem;
          }

          .coupon-item .coupon-money .lay:last-child {
            flex: 1;
            padding: 0 3%;
            line-height: 1.66rem;
          }

          .couponStyle {
            width: 100%;
            height: 8rem;
            position: relative;
            margin: 5% 0;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border: 1px solid #E5004F;
          }

          .couponStyle .info-box {
            -webkit-box: 1;
            -webkit-flex: 1;
            flex: 1;
            padding: 0 2% 0 6%;
            position: relative;
          }

          .couponStyle {
            background-color: #FFAA00;
            -webkit-border-radius: 1rem;
            border-radius: 1rem;
            border: none;
            color: #fff;
          }

          .couponStyle .get-btn {
            width: 28%;
            height: 7rem;
            position: relative;
            -webkit-perspective: 180;
            perspective: 180;
          }

          .couponStyle .get-btn:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #F8B551;
            transform: rotateY(-28deg);
            z-index: 1;
            -webkit-border-radius: .66rem;
            border-radius: .66rem;
            -webkit-box-shadow: -3px 0 8px #793030;
            box-shadow: -3px 0 8px #793030;
          }

          .couponStyle .get-btn span {
            width: 4rem;
            word-break: break-all;
            font-size: 1.8rem;
            color: #454545;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-30%, -50%);
            transform: translate(-30%, -50%);
            z-index: 3;
          }

          !* 已领取 *!

          .couponStyle.have, .couponStyle.have .get-btn:after, .style-six.have, .style-seven.have {
            background-color: #c1c1c1;
          }

          .couponStyle.have .get-btn:after {
            -webkit-box-shadow: -3px 0 8px #8c8c8c;
            box-shadow: -3px 0 8px #8c8c8c;
          }

          .couponStyle.have .get-btn span {
            width: 5rem;
            font-size: 1.5rem;
            color: #fff;
          }*/
        }

      }
    }
  }
</style>
