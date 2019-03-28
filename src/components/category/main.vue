<router-view name="modal"/>
<template lang="html">
  <div class="main">
    <h1 class="class1-title">
      {{_datas.title}}
    </h1>  
    <li v-for="item in subClassData" style="list-style: none">
      <h1 class="class2-title">
        {{item.categoryName}}
      </h1>
      <ul class="class3-list">
        <li v-for="(k,i) in item.subs" :key='i'>
          <router-link :to="{name:'商品列表页',query: {'category': k.categoryId.toString()}}">
            <img v-lazy="k.categoryIcon">
          </router-link>
          <span>
            {{k.categoryName}}
          </span>
        </li>
      </ul>
    </li>
  </div>
</template>

<script>
  export default {
    props: {
      datas: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    data() {
      return {
        subClassData: [],
      }
    },
    computed: {
      // 获取当前aside栏选择的是第几个
      tabIndex() {
        return this.$store.state.category.tabIndex
      },
      _datas() {
        const _datas = {
          title: ''
        }
        if (this.datas.length > 0) {
          let categoryId = this.datas[this.tabIndex]["categoryId"];
          this.$api.xapi({
            method: 'get',
            url: 'category/allsub',
            params: {
              id: categoryId,
            }
          }).then((res) => {
            this.subClassData = res.data.data.list;
          }).catch((error) => {
            console.log(error)
          })
          _datas.title = this.datas[this.tabIndex].categoryName;
        }

        return _datas;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .main {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    flex: 9.8;
    height: 100%;

    &::-webkit-scrollbar {
      display: none;
    }

    > h2 {
      font-size: 24px;
      padding: 2vw 4vw;
      color: #333;
      letter-spacing: 2px;
      background-color: rgb(247, 247, 247);
    }

    > ul {
      width: 100%;
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      background-color: rgb(247, 247, 247);

      li {
        background-color: rgb(247, 247, 247);
        width: 33%;
        text-align: center;

        a {
          color: #666;
          display: block;

          img {
            display: block;
            width: 60%;
            margin: 4vw auto;
          }

          span {
            text-align: center;
          }
        }
      }
    }

    .class3-list {
      width: 100%;
      display: -ms-flex;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: flex-start;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      overflow: hidden;

      li {
        width: 33%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0 3vw;
        display: flex;
        flex-flow: column;
        height: 7em;

        > a {
          display: block;
          width: 100%;
          position: relative;

          img {
            display: block;
            width: 100%;
            height: 4em;
          }

          p {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 1.2vw 2vw;
          }
        }

        > h3 {
          padding-top: 3vw;
          .fz(font-size, 40);
        }

        > span {
          .fz(font-size, 25);
          display: inline-block;
          padding-bottom: 3vw;
          text-align: center;
        }
      }
    }

    .class1-title {
      .bt();
      text-align: center;
      .fz(font-size, 35);
      font-weight: bold;
      padding: 2vw;
      position: relative;
      background-color: #ffffff;
    }

    .class2-title {
      text-align: left;
      .fz(font-size, 30);
      padding: 2vw;
      position: relative;
      background-color: #ffffff;
      font-weight: bold;
    }
  }


</style>
