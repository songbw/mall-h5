<template lang="html">
  <section class="main">
    <div class="noneInfo" v-if="loading">
      <v-loading></v-loading>
    </div>
    <div v-else class="listBody">
      <van-tabs v-model="active" sticky :swipe-threshold=swipeThreshold swipeabl>
        <van-tab v-for="(item,type) in couponTypes" :title=item.title :key="type">
          <div v-for="(k,index) in currentCardList" :key="index" v-if="currentCardList.length > 0">
            <div class="card">
              <div class="header">
                <div class="title">
                  <span>{{k.cardInfo.name}}</span>
                  <van-icon style="float: right" name="delete" @click="onDeleteCardBtnClick(k,index)"></van-icon>
                  </van-button>
                </div>
                <div class="price">
                  <p><span>￥</span>{{k.cardInfo.amount}}</p>
                </div>
                <div class="Number">
                  <span></span>{{k.card}}</span>
                </div>
                <div class="footer">
                  <span>{{getCardStatusDesc(k.status)}}</span>
                  <span style="float: right">截至日期: {{formatTime(k.endTime)}}</span>
                </div>
              </div>
              <div class="container" v-if="active == 0">
                <van-button size="large" :disabled="k.status == 5" type="primary" @click="onUseBtnClick(k)">立即使用
                </van-button>
              </div>
            </div>
          </div>
          <div v-else>
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
        that.$api.xapi({
          method: 'delete',
          baseURL: this.$api.EQUITY_BASE_URL,
          url: '/card/delete',
          params:{
            id: k.id
          }
        }).then((response) => {
          if (response.data.code == 200) {
            this.cardList.splice(index, 1);
          }
        }).catch(function (error) {
          that.$log(error)
        })

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

    .van-button {
      background: rgb(36, 138, 49);
      border: none;

      &--large {
        width: 100%;
        height: 40px;
        line-height: 40px;
      }
    }

  }

</style>
