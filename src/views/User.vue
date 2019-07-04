<template lang="html">
  <div class="user">
    <v-header class="header" >
      <h1 slot="title">我的</h1>
    </v-header>
    <div class="userMain">
      <div class='box'>
        <header class="userHeader" @click="onUserInfoClick()">
          <div class="header-icon">
          <!--  <span class="icon2-user"></span>-->
            <img :src="avatarDefaultImg">
          </div>
          <span v-if="user.nickname !=undefined && user.nickname.length > 0">{{user.nickname}}</span>
          <span v-else>登录/注册</span>
          <van-icon name="arrow"/>
        </header>
      </div>
      <div class="userBody">
        <div class="orderListBox">
          <div>
            <van-cell value="全部订单" is-link @click=onOrderListBarClick(0)>
              <template slot="title">
                <span class="orderListTitle">我的订单</span>
              </template>
            </van-cell>
          </div>
          <div class="orderCategory">
            <van-row type="flex" justify="space-between">
              <van-col
                v-for="(item,index) in orderbars"
                :key="index"
              >
                <div class="orderCategoryBar" @click=onOrderListBarClick(item.key)>
                  <img :src=" item.img">
                  <span>{{item.title}}</span>
                </div>

              </van-col>
            </van-row>
          </div>

        </div>
        <div class="couponBox">
          <div>
            <van-cell value="更多" is-link to="/user/couponList">
              <template slot="title">
                <span class="couponTitle">我的优惠券</span>
              </template>
            </van-cell>
          </div>
          <div class="couponCategory">
            <img :src="couponCenterImg" @click="onCouponCenterClick()">
          </div>

        </div>
        <div class="settingsBox">
          <van-cell title="地址管理" is-link :to="{ name: '地址列表页'}">
          </van-cell>
          <van-cell title="关于我们" is-link>
          </van-cell>
        </div>

        <div class="recommendedBox">

        </div>
        <div class="userfooter"/>
      </div>
    </div>

    <v-footer></v-footer>
  </div>
</template>

<script>
  import Header from '@/common/_header.vue'
  import Baseline from '@/common/_baseline.vue'
  import Footer from '@/common/_footer.vue'

  export default {
    components: {
      'v-header': Header,
      'v-baseline': Baseline,
      'v-footer': Footer
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 3);
      })
    },
    created() {
      let userInfo = this.$store.state.appconf.userInfo;
      let that = this
      if (!this.isUserEmpty(userInfo)) {
        let user = JSON.parse(userInfo);
        this.$api.xapi({
          method: 'get',
          baseURL: this.$api.SSO_BASE_URL,
          url: '/user',
          params: {
            openId: user.userId,
          }
        }).then((response) => {
          let user = response.data.data.user;

          if (user != null) {
            this.$log("xxxxxxxxxxxxxxxxxx")
            this.user = user;
            this.$log(this.user)
            this.$log(this.user.nickname);
          }
        }).catch(function (error) {
          //alert(error)
          that.$log(error)
          that.pageloading = false;
        })
      } else {
        //goto register UI
      }

    },
    data() {
      return {
        orderbars: [
          {
            title: "待支付",
            key: 1,
            img: require('@/assets/icons/ico_to_be_paid.png'),
          },
          {
            title: "待收货",
            key: 2,
            img: require('@/assets/icons/ico_goods_to_be_receive.png'),
          },
          {
            title: "已完成",
            key: 3,
            img: require('@/assets/icons/ico_complete_order.png'),
          },
          {
            title: "已取消",
            key: 4,
            img: require('@/assets/icons/ico_order_cancel.png')
          }
        ],
        couponCenterImg: require('@/assets/icons/ico_couponCenter.png'),
        avatarDefaultImg: require('@/assets/icons/ico_avatar.png'),
        user:{}
      }
    },
    methods: {
      isUserEmpty(userInfo) {
        return (userInfo == undefined || userInfo.length === 0)
      },
      onOrderListBarClick(type) {
        //订单类型
        this.$log("onOrderListBarClick:" + type);
        this.$store.commit('SET_CURRENT_ORDER_LIST_INDEX', type);
        this.$router.push({name: '订单列表页'})
      },
      onCouponCenterClick() {
        this.$log("onCouponCenterClick Enter")
        this.$router.push("/user/couponCenter")
      },
      onUserInfoClick() {
        this.$log("onUserInfoClick Enter")
        this.$router.push({
          name: "我的信息",
          params: {
            user: this.user
          }
        })
      }

    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';
  @import '../assets/user/icon/carstyle.css';


  .user {
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: #f8f8f8;

    .userMain {
      .box {
        position: relative;
        width: 100%;
        line-height: 15vw;
        background-color:  #FF4444;

        .userHeader {
          width: 100%;
          line-height: 15vw;
          background-size: auto 100%;
          padding: 3.2vw 0;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;

          .header-icon {
            margin-left: 5vw;
            img{
              display: inline-block;
              background-color: white;
              border-radius: 50%;
              height: 50px;
              width: 50px;
            }
          }

          > span {
            margin-left: 3.2vw;
            .fz(font-size, 30);
            color: #ffffff;
            letter-spacing: .2vw;
          }

          .van-icon{
            float: right;
            color: white;
          }
        }
      }

      .box:after {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -20px;
        content: ' ';
        height: 20px;
        width: 100%;
        border-radius: 0 0 90% 90%;
        background-color:  #FF4444;
        overflow: hidden;
      }

      .userBody {
        margin-top: 10vw;
        width: 100%;
        height: 100%;


        .orderListBox {
          margin: 10px;
          background-color: white;
          border: 4px solid white;
          border-radius: 10px;

          .orderListTitle {
            margin: 8px;
            .fz(font-size, 30);
            font-weight: bold;
          }


          .orderCategory {
            align-items: center;
            text-align: center;
            margin: 10px;

            .van-col {
              .orderCategoryBar {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: Center;

                img {
                  margin: 1px;
                  height: 20px;
                  width: 25px;
                }

                span {
                  margin: 5px;
                  .fz(font-size, 25);
                }
              }

            }
          }

        }

        .couponBox {
          margin: 10px;
          padding: 10px;
          background-color: white;
          border: 4px solid white;
          border-radius: 10px;

          .couponTitle {
            .fz(font-size, 30);
            font-weight: bold;
          }

          .couponCategory {
            align-items: center;
            text-align: center;
            margin-top: 10px;

            img {
              width: 100%;
              display: inline-block;
            }
          }

        }

        .settingsBox {
          margin: 10px;
          padding: 10px;
          background-color: white;
        }
      }
    }
  }

</style>
