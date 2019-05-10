<template lang="html">
  <div class="user">
    <v-header class="header" :goback="false">
      <h1 slot="title">我的</h1>
    </v-header>
    <div class="userMain">
      <div class='box'>
        <header class="userHeader">
          <div class="header-icon">
            <span class="icon2-user"></span>
          </div>
          <span>登录/注册</span>
        </header>
      </div>
      <div class="userBody">
        <div class="orderListBox">
          <div>
            <van-cell value="全部订单" is-link to="/car/orderList">
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
                <img :src=" item.img">
                <span>{{item.title}}</span>
              </van-col>
            </van-row>
          </div>

        </div>
        <div class="couponBox">
          <div>
            <van-cell value="更多" is-link>
              <template slot="title">
                <span class="couponTitle">我的优惠券</span>
              </template>
            </van-cell>
          </div>
          <div class="couponCategory">
            <img :src="couponCenterImg">
          </div>

        </div>
        <div class="settingsBox">
          <van-cell title="地址管理" is-link>
          </van-cell>
          <van-cell title="关于我们"  is-link>
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
      next(vm=>{
        vm.$store.commit('SET_CURRENT_NAVI_INDEX', 3);
      })
    },
    data() {
      return {
        orderbars: [
          {
            title: "待支付",
            img: require('@/assets/icons/ico_to_be_paid.png'),
          },
          {
            title: "待收货",
            img: require('@/assets/icons/ico_goods_to_be_receive.png'),
          },
          {
            title: "已完成",
            img: require('@/assets/icons/ico_complete_order.png'),
          },
          {
            title: "已取消",
            img: require('@/assets/icons/ico_order_cancel.png')
          }
        ],
        couponCenterImg:  require('@/assets/icons/ico_couponCenter.png'),
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
    .userMain{
      background-color: #f8f8f8;
      z-index: -1;
      .box {
        position: relative;
        width: 100%;
        height: 100px;
        background-color: #DEBA6F;
        .userHeader {
          width: 100%;
          height: 100px;
          background-size: auto 100%;
          padding: 3.2vw 0;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;

          .header-icon {
            border: .4vw solid #ffffff;
            background-color: @cl;
            margin-left: 4vw;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 14vw;
            height: 14vw;
            line-height: 16vw;
            text-align: center;
            border-radius: 50%;

            span {
              .fz(font-size, 54);

              &::before {
                color: #ffffff;
              }
            }
          }

          > span {
            margin-left: 3.2vw;
            .fz(font-size, 30);
            color: #ffffff;
            letter-spacing: .2vw;
          }
        }
      }
      .box:after {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -50px;
        content: ' ';
        height: 50px;
        width: 140%;
        left: -20%;
        border-radius: 0 0 90% 90%;
        background-color: #DEBA6F;
      }
      .userBody {
        margin-top: 70px;
        width: 100%;
        height: 100%;


       .orderListBox {
         margin: 10px;
         background-color:white;
         border: 4px solid white;
         border-radius: 10px;

         .orderListTitle{
           margin: 8px;
           .fz(font-size, 30);
           font-weight: bold;
         }

         .orderCategory {
           align-items: center;
           text-align: center;
           margin: 10px;
           .van-col {
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

       .couponBox {
         margin: 10px;
         padding: 10px;
         background-color:white;
         border: 4px solid white;
         border-radius: 10px;

         .couponTitle{
           .fz(font-size, 30);
           font-weight: bold;
         }

         .couponCategory {
           align-items: center;
           text-align: center;
           margin-top: 10px;
           img{
             width: 100%;
             display: inline-block;
           }
         }

       }

       .settingsBox {
         margin: 10px;
         padding: 10px;
         background-color:white;
       }
      }
      .userfooter {
        height: 10vh;
        background-color: #f8f8f8;
      }
    }
  }

</style>
