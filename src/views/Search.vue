<template lang="html">
  <section class="search">
    <header v-if="showHeader">
      <van-icon class="arrowback" name="arrow-left" size="1.2em" @click="$router.go(-1)" slot="left"
        v-if="showBackArrow" />
      <form action="" style="width: 100%">
        <van-search background=#ffffff v-model="value" placeholder="请输入搜索关键词" show-action @search="onSearch"
          slot="Title" type="search" maxlength="16">
          <div slot="action" @click="onSearch">搜索</div>
        </van-search>
      </form>
    </header>

    <div v-if="historyList.length > 0" class="historySchHeader">
      <h1 class="Searchtitle" style="width:100%">
        搜索历史
      </h1>
      <div class="deleteBox">
        <van-icon name="delete" @click="deleteAllHistory()"></van-icon>
      </div>
    </div>


    <ul class="contaner" v-if="historyList.length > 0">
      <li class="item" v-for="(k,index) in historyList" @click="onClick(k)" :key="index">
        <van-button round type="default">
          {{k.keyword}}
        </van-button>
      </li>
    </ul>

    <div class="hotSchHeader" v-if="hotSearch.length > 0">
      <h1 class="Searchtitle">
        热搜榜
      </h1>  
      <img :src="icon_hotFire" alt="">
    </div>


    <ul class="hotContaner" v-if="hotSearch.length > 0">
      <li class="hotItem" v-for="(k,index) in hotSearch" @click="onClick(k)" :key="index">
        <span>{{k}}</span>
      </li>
    </ul>

    <div style="padding:10px"></div>

  </section>

</template>

<script>
  import {
    configWechat
  } from '@/util/wechat'
  import wx from 'weixin-js-sdk'
  import Util from '@/util/common'

  export default {
    data() {
      return {
        value: "",
        hotSearch: [],
        historyList: [],
        showHeader: true,
        showBackArrow: false,
        icon_hotFire: require('@/assets/icons/ico_hotFire.png'),
      }
    },
    beforeCreate() {
      this.$api.xapi({
        method: 'get',
        baseURL: this.$api.ES_BASE_URL,
        url: '/es/prod/top'
      }).then((response) => {
        this.$log(response)
        if (response.data.data != null) {
          let words = response.data.data;
          this.extractWord(words);
        }
      }).catch(function (error) {
        alert(error)
      })
    },

    created() {
      if (this.$api.IS_GAT_APP) {
        this.showBackArrow = false;
      }
      this.wechatShareConfig()
      let historyList = Util.getLocal("searchHistory")
      if (historyList != undefined) {
        this.historyList = historyList
      }
    },

    methods: {
      deleteAllHistory() {
        this.historyList = []
        Util.setLocal(this.historyList, 'searchHistory', false);
      },
      wechatShareConfig() {
        this.$log('shareConfig Enter')
        // if (this.$api.APP_ID === '01') {
        if (this.$api.PLATFORM_ID === this.$api.PLATFORM_TYPE.isFcWxPub) {
          try {
            configWechat(this, () => {
              wx.hideOptionMenu()
            })
          } catch (e) {

          }
        }
      },
      extractWord(words) {
        if (words != null && words.length > 0) {
          words.forEach(item => {
            this.hotSearch.push(item.work)
          })
          /*           let wordArray = words.split(":");
                    if (wordArray.length > 0) {
                      wordArray.forEach(word => {
                        if (word != null && word.length > 0) {
                          this.hotSearch.push(word)
                        }
                      })
                    } */
        }
      },

      onSearch() {
        console.log("value:" + this.value);
        this.requestSearch(this.value);
      },

      requestSearch(word) {
        if (word != null && word.length > 0) {
          let found = -1
          for (let i = 0; i < this.historyList.length; i++) {
            if (this.historyList[i].keyword === word) {
              found = i;
              break;
            }
          }
          if (found != -1) {
            this.historyList.splice(found, 1)
          }
          if (this.historyList.length < 10) {
            let item = {
              keyword: word,
              updateTime: new Date().getTime()
            }
            this.historyList.push(item)
            this.historyList.sort(function (a, b) {
              return b.updateTime - a.updateTime
            })
          } else {
            this.$log("history:", this.historyList)
            this.historyList[9].keyword = word
            this.historyList[9].updateTime = new Date().getTime()
            this.historyList.sort(function (a, b) {
              return b.updateTime - a.updateTime
            })
          }
        }
        Util.setLocal(this.historyList, 'searchHistory', false);
        this.$router.replace({
          path: "/category/goods/list",
          query: {
            'search': word
          }
        })
      },

      onClick(word) {
        console.log("onClick:" + word);
        this.requestSearch(word);
      }

    }

  }

</script>

<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  .search {
    width: 100%;
    height: 100%;
    top: 0px;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .arrowback {
        margin-left: 0.8em;
      }

      .van-search {
        width: 100%;
      }
    }

    .historySchHeader {
      display: flex;
      width: 100%;

      .deleteBox {
        position: relative;
        top: 10px;
        right: 10px;
      }
    }

    .hotSchHeader {
      display: flex;

      img {
        padding: 10px 5px;
        width: 20px;
        height: 20px;
      }
    }

    .Searchtitle {
      text-align: left;
      .fz(font-size, 30);
      font-weight: bold;
      position: relative;
      color: #000000;
      background-color: #ffffff;
      padding-left: 15px;
      padding-top: 10px;
    }

    .contaner {
      padding-left: 10px;

      li {
        text-decoration: none;
        list-style: none;
      }
    }

    .hotContaner {
      width: 100%;
      display: -ms-flex;
      display: -webkit-box;
      display: -ms-flexbox;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: flex-start;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      overflow: hidden;

      .hotItem {
        width: 47%;
        .fz(font-size, 30);
        color: #000000;

        span {
          margin: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-break: break-all;
        }
      }
    }



    .item {
      font-size: 40px;
      display: inline-block;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      margin-left: 5px;

      .van-button {
        background-color: #F5F5F5;
        border: none;
        height: 30px;
        line-height: 20px;
      }
    }
  }

</style>
