<template lang="html">
  <section>
    <header>
      <van-icon name="arrow-left" size="1em" @click="$router.go(-1)" slot="left"/>
      <van-search
        background = #ffffff
        v-model="value"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        slot="Title"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </header>
    <h1 class="hotSearchtitle">
      热门搜索
    </h1>  

    <ul class="contaner">
      <li class="item" v-for="(k,index) in hotSearch"  @click="onClick(k)" :key="index">
        <van-button round type="default">
          {{k}}
        </van-button>
      </li>
    </ul>

  </section>

</template>

<script>
  export default {
    data() {
      return {
        value:"",
        hotSearch: []
      }
    },
    beforeCreate()  {
      this.$api.xapi({
        method: 'get',
        url: '/tags'
      }).then((response) => {
        let words = response.data.data.cdnUrl.work;
        this.extractWord(words);
      }).catch(function (error) {
        alert(error)
      })
    },

    methods: {
      extractWord(words) {
        if (words != null && words.length > 0) {
          let wordArray = words.split(":");
          if (wordArray.length > 0) {
            wordArray.forEach(word => {
              if(word != null && word.length >0) {
                this.hotSearch.push(word)
              }
            })
          }
        }
      },

      onSearch() {
        console.log("value:"+this.value);
        this.requestSearch(this.value);
      },

      requestSearch(word) {
        if(word != null && word.length > 0)
          this.$router.replace({path:"/category/goods/list",query: {'search': word}})
      },

      onClick(word) {
        console.log("onClick:"+word);
        this.requestSearch(word);
      }

    }

  }
</script>

<style lang="less" scoped>
  @import '../assets/fz.less';
  @import '../assets/index/style.css';

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .van-search {
      width: 100%;
    }
  }

  .hotSearchtitle {
    .bt();
    text-align: left;
    .fz(font-size, 30);
    font-weight: bold;
    position: relative;
    background-color: #ffffff;
    padding-left: 10px;
    padding-top: 10px;
  }

  hotSearch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .van-search {
      width: 100%;
    }
  }

  .item {
    font-size: 40px;
    display: inline-block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 8px;
    margin-left: 5px;
  }
</style>
