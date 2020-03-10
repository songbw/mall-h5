<template lang="html">
  <section class="main">
    <div class="noneInfo" v-if="loading">
      <v-loading></v-loading>
    </div>
    <div v-else class="listBody">
      <van-tabs v-model="active" sticky :swipe-threshold=swipeThreshold swipeabl>
        <van-tab v-for="(item,type) in couponTypes" :title=item.title :key="type">
          <div v-for="(k,index) in currentCardList" :key="index" v-if="currentCardList.length > 0">
            <div style="margin:10px">
              <v-coupon :config="couponStyleConfig">
                <div class="content">
                  <div class="upper">
                    <van-col span="7">
                      <div class="price">
                        <p v-if="k.status == 6||k.status == 7" class="grayColor"><span>￥</span>{{k.cardInfo.amount}}</p>
                        <p v-else><span>￥</span>{{k.cardInfo.amount}}</p>
                      </div>
                    </van-col>
                    <van-col span="12">
                      <div class="info">
                        <div class="title">
                          <span>{{k.cardInfo.name}}</span>
                        </div>
                        <div class="Number">
                          <span>券码: {{k.card}}</span>
                        </div>
                      </div>
                    </van-col>
                    <van-col span="5">
                      <div class="action">
                        <img v-if="k.status == 6" :src="cardUsed">
                        <img v-else-if="k.status == 7" :src="cardOvertime">
                        <van-button v-else size="mini" type="danger" round :disabled="k.status == 5"
                          @click="onUseBtnClick(k)">
                          立即使用</van-button>
                      </div>
                    </van-col>
                  </div>
                  <div class="footer">
                    <span>截至日期: {{formatTime(k.endTime)}}</span>
                    <van-icon v-if="k.status == 6||k.status == 7" style="float: right;margin: 2px 10px" name="delete"
                      @click="onDeleteCardBtnClick(k,index)"></van-icon>
                  </div>
                </div>
              </v-coupon>
            </div>
          </div>
          <div class="emptyBox" v-if="currentCardList.length == 0">
            <img :src=empty_bg>
            <span>您还没有相关记录</span>
          </div>
        </van-tab>
      </van-tabs>

    </div>
  </section>
</template>

<script>
  import Loading from '@/common/_loading.vue'
  import Util from "@/util/common";


  export default {
    components: {
      'v-loading': Loading
    },


    computed: {
      currentCardList() {
        if (this.cardList.length > 0) {
          switch (this.active) {
            case 0:
              return this.cardList.filter((item) => {
                return item.status < 6
              })
            case 1:
              return this.cardList.filter((item) => {
                return item.status == 6
              })
            case 2:
              return this.cardList.filter((item) => {
                return item.status == 7
              })
            default:
              return []
          }
        } else {
          return []
        }
      },
    },

    data() {
      return {
        loading: true,
        cardList: [],
        active: 0,
        swipeThreshold: 5,
        empty_bg: require('@/assets/icons/ico_empty_box.png'),
        cardUsed: "https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_used.png",
        cardOvertime: "https://mall-h5-1258175138.cos.ap-chengdu.myqcloud.com/ico_overtime.png",
        couponTypes: [{
            "title": "未使用",
          },
          {
            "title": "已使用",
          },
          {
            "title": "已过期",
          },
        ],
        couponStyleConfig: {
          width: 200,
          height: 125,
          cutPosition: 90, // 裁切口的位置
          borderRadius: 15, // 卡券四个角的圆角半径
          borderColor: '#ffffff', // 边框颜色
          borderWidth: 0.5, // 边框粗细
          borderOpcity: 1, // 边框透明度
          borderDash: null, // 边框虚线数组, 直线是 null, 虚线的话给一个数组,如[2,2]
          showLine: true, // 是否显示分割线
          lineColor: '#888888', // 分割线颜色
          lineWidth: 0.2, // 分割线粗细
          lineOpcity: 1, // 分割线透明度
          lineDash: [3, 5], // 分割线虚线数组, 同 边框虚线数组
          lineOffset: 5, // 分割线跟卡券两侧的距离, 为 0 则相连
          cutRadius: 10, // 裁切口的半径
          cutSlope: 1.5, // 裁切口的弧度
          background: '#ffffff' // 背景颜色, 优先级低于 slot 的背景
        }
      }
    },

    async created() {
      let userInfo = this.$store.state.appconf.userInfo;
      if (!Util.isUserEmpty(userInfo)) {
        try {
          let user = JSON.parse(userInfo);
          let response = await this.getCardList(user.userId)
          if (response.data.code == 200) {
            this.cardList = response.data.data.result;
            //this.$log(this.cardList)
          }
        } catch (e) {

        }
      }
      this.$log("xxxxxxxxxxxxxxxxxx")
      this.$log(window.screen.width)
      this.couponStyleConfig.width = window.screen.width - 20;
      this.loading = false
    },

    methods: {
      getCardStatusDesc(status) {
        switch (status) {
          case 1:
            return "状态: 已创建";
          case 2:
            return "状态: 已激活";
          case 3:
            return "状态: 已绑定";
          case 4:
            return "状态: 已兑换";
          case 5:
            return "状态: 已占用 ";
          case 6:
            return "状态: 已使用";
          case 7:
            return "状态: 已过期";
        }
      },

      onDeleteCardBtnClick(k, index) {
        this.$log("onDeleteCardBtnClick Enter")
        let that = this
        this.$dialog.confirm({
          message: '确定删除该提货券?'
        }).then(() => {
          that.$api.xapi({
            method: 'delete',
            baseURL: this.$api.EQUITY_BASE_URL,
            url: '/card/delete',
            params: {
              id: k.id
            }
          }).then((response) => {
            if (response.data.code == 200) {
              let found = -1;
              for (let i = 0; i < this.cardList.length; i++) {
                if (this.cardList[i].id === k.id) {
                  found = i;
                  break;
                }
              }
              if (found != -1) {
                this.cardList.splice(found, 1);
              }

            }
          }).catch(function (error) {
            that.$log(error)
          })
        }).catch(() => {});
      },
      onUseBtnClick(k) {
        this.$log("onUseBtnClick Enter")
        this.$log(k)
        this.$router.push({
          path: "/user/billoflading",
          query: {
            id: k.card
          }
        });
      },
      formatTime(timeString) {
        if (timeString == null)
          return null
        return this.$moment(timeString).format('YYYY/MM/DD HH:mm:ss')
      },
      getCardList(userId) {
        this.$log("getCardList Enter")
        return this.$api.xapi({
          method: 'get',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/card/find',
          params: {
            openId: userId,
          }
        })
      },
    }
  }

</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .main {
    width: 100%;
    height: 100%;
    top: 0px;

    .listBody {
      width: 100%;
      height: 100%;
      top: 0px;
      background-color: #f8f8f8;

      .card {
        margin: 10px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); //设置两层阴影
      }

      .header {
        background-color: white;
        color: black;
        padding: 10px;

        .title {
          width: 100%;
          .fz(font-size, 40)
        }

        .Number {
          text-align: center;
          letter-spacing: 2px;
          padding: 0px 0px 10px 0px;
          .fz(font-size, 35);
        }

        .price {
          text-align: center;
          padding: 10px 0px 10px 0px;
          .fz(font-size, 80);

          span {
            .fz(font-size, 30);
          }

        }

        .footer {
          width: 100%;
          .fz(font-size, 24)
        }


      }

      .container {
        background-color: #4CAF50;
      }
    }

    .content {
      padding: 10px;
      display: flex;
      flex-direction: column;

      .upper {
        height: 80px;
        width: 100%;

        .price {
          .fz(font-size, 56);
          line-height: 80px;
          color: #ff4444;

          span {
            .fz(font-size, 35);
          }

          .grayColor {
            color: #888888
          }
        }

        .info {
          padding: 15px 0px;
          height: 80px;
          align-items: center;

          .title {
            .fz(font-size, 35);
            color: #000000
          }

          .Number {
            margin-top: 5px;
            .fz(font-size, 18);
            color: #888888
          }
        }

        .action {
          line-height: 80px;
          margin-left: 6px;
          text-align: center;
          align-items: center;
          justify-items: center;

          .van-button {
            width: 100%;
            margin-right: 2px;
          }

          img {
            width: 100%;
            display: inline-block;
          }

        }

      }

      .footer {
        height: 30px;
        width: 100%;
        margin-top: 10px;
        .fz(font-size, 24)
      }
    }

    /*     .van-button {
      background: rgb(36, 138, 49);
      border: none;

      &--large {
        width: 100%;
        height: 30px;
        line-height: 40px;
      }
    } */

    .emptyBox {
      width: 100%;
      display: flex;
      flex-flow: column;
      text-align: center;
      justify-content: center;
      padding-top: 100px;

      img {
        margin: 0 auto;
        height: 100px;
        width: 100px;
      }
    }


  }

</style>
