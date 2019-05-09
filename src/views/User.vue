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
            <span>我的订单</span>
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

      </div>
    </div>
<!--    <div class='box'>
      <header class="userHeader">
        <div class="header-icon">
          <span class="icon2-user"></span>
        </div>
        <span>登录/注册</span>
      </header>
      <div class="userBody">
        <div class="orderListBox">
        <span>xxxx</span>
        </div>

      </div>
    </div>-->





    <!--   <div class="main">
          <router-link class="my-indent" :to="{ name: ''}">
            <span class="my-indent-left">我的订单</span>
            <div class="my-indent-right">
              <span>全部订单</span>
              <i class="icon-go"></i>
            </div>
          </router-link>

          <section class="my-pay">
            <router-link :to="{ name: ''}">
              <span class="icon2-money"></span>
              <p>代付款</p>
            </router-link>
            <router-link :to="{ name: ''}">
              <span class="icon2-thecar"></span>
              <p>待收货</p>
            </router-link>
            <router-link :to="{ name: ''}">
              <span class="icon2-fixed"></span>
              <p>退换修</p>
            </router-link>

          </section>

          <section class="my-vip">
            <router-link class="my-vip-top ho" :to="{ name: ''}">
              <div class="my-vip-top-div">
                    <span class="icon2-vip">
                        <span class="path1"></span><span class="path2"></span><span class="path3"></span><span
                      class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span
                      class="path8"></span><span class="path9"></span>
                    </span>
              </div>
              <p>
                <span>会员福利</span><i class="icon-go"></i>
              </p>
            </router-link>
            <router-link class="my-vip-bottom ho" :to="{ name: ''}">
              <div>
                <span class="icon2-money"></span>
              </div>
              <p>
                <span>我的优惠</span><i class="icon-go"></i>
              </p>
            </router-link>
          </section>

          <section class="my-service">
            <router-link class="my-service-top" :to="{ name: ''}">
              <div>
                        <span class="icon2-service">
                            <span class="path1"></span><span class="path2"></span><span class="path3"></span>
                        </span>
              </div>
              <p>
                <span>服务中心</span><i class="icon-go"></i>
              </p>
            </router-link>
            <router-link class="my-service-bottom" :to="{ name: ''}">
              <div>
                <span class="icon2-milogo"></span>
              </div>
              <p>
                <span>电商之家</span><i class="icon-go"></i>
              </p>
            </router-link>
          </section>

          <section class="my-settle">
            <router-link :to="{ name: ''}" class="my-settle-top">
              <div>
                <span class="icon2-f"></span>

              </div>

              <p>
                <span>F码通道</span><i class="icon-go"></i>
              </p>
            </router-link>
            <router-link :to="{ name: ''}" class="my-settle-bottom">
              <div>
                <span class="icon2-settle"></span>
              </div>
              <p>
                <span>设置</span><i class="icon-go"></i>
              </p>
            </router-link>
          </section>

        </div>
        <v-footer></v-footer>-->
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
          },
          {
            title: "全部",
            img: require('@/assets/icons/ico_order_default.png')
          }
        ]
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
        z-index: -1;
        content: ' ';
        height: 100px;
        width: 140%;
        left: -20%;
        border-radius: 0 0 90% 90%;
        background-color: #DEBA6F;
      }
     .userBody {
        margin-top: 52px;
        width: 100%;
        height: 100vh;

       .orderListBox {

         padding: 10px;
         background-color: #f8f8f8;
         border: 4px solid white;
         border-radius: 10px;

         .orderCategory {
           align-items: center;
           text-align: center;
           margin-top: 10px;
           .van-col {
             display: flex;
             flex-direction: column;
             justify-content: center;
             align-items: Center;
             img {
               margin: 1px;
               height: 25px;
               width: 30px;
             }

             span {
               margin: 5px;
             }
           }
         }

       }
      }

    }


    .main {
      width: 100%;

      .my-indent {
        width: 100%;
        display: block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #333;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        padding: 0 5vw;
        height: 15vw;
        line-height: 15vw;
        background-color: #fff;
        .bd();

        &:active {
          background-color: rgb(224, 227, 230)
        }

        .my-indent-right {
          span {
            display: inline-block;
            .fz(font-size, 28);
            color: rgba(0, 0, 0, .4);
            position: relative;
          }

          i {
            position: relative;
            top: .8vw;
          }
        }
      }

      .my-pay {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        padding: 2vw 0;
        background-color: #fff;
        .bd();

        > a {
          display: block;
          width: 33.33%;
          color: #999;
          text-align: center;

          > span {
            .fz(font-size, 50);
            margin-top: 2.3vw;
            display: block;
            text-align: center;
          }

          p {
            padding: 2.3vw 0;
            text-align: center;
          }
        }
      }

      .my-vip, .my-service, .my-settle {
        width: 100%;
        .mt();
        .bd();
        .bt();

        > a {
          background-color: #fff;
          display: block;
          width: 100%;
          display: -ms-flex;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          height: 15vw;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          padding: 0 6vw;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;

          &:active {
            background-color: rgb(224, 227, 230);
          }

          > div {
            -ms-flex: 2;
            -webkit-box-flex: 2;
            flex: 2;
            padding-top: 1.3vw;
          }

          .my-vip-top-div {
            padding-top: 0;
          }

          > p {
            -ms-flex: 10;
            -webkit-box-flex: 10;
            flex: 10;
            position: relative;

            &:active {
              background-color: rgb(224, 227, 230);
            }

            i {
              position: absolute;
              right: 0;
              top: .4vw;
            }
          }
        }

      }
    }
  }

  /*图标大小不一，重新定义*/

  .icon-go {
    .fz(font-size, 36);

    &::before {
      color: #aba8a8;
    }
  }

  [class^="icon2-"],
  [class*=" icon2-"] {
    .fz(font-size, 50);
  }

  .icon2-service {
    .fz(font-size, 34);
  }

</style>
