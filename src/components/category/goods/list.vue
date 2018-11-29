<template lang="html">
  <div class="detaillist">
    <v-header>
      <h1 slot="title">商品列表</h1>
    </v-header>
    <van-list v-model="loading"
              :finished="finished"
              @load="onLoad">
      <li v-for="k in list" :key="k.id" style="list-style: none">
        <router-link :to="{name:'详情页',query: {'goods': k}}">
          <van-card
            :price="k.price"
            desc=""
            :title="k.brand+ ' '+ k.name + ' '+ k.model"
            :thumb="k.image"
            centered>
          </van-card>
        </router-link>
      </li>
    </van-list>
  </div>
</template>

<script>
  import Util from '../../../util/common'
  import Header from '@/common/_header.vue'

  export default {
    data() {
      return {
        category: "",
        pageNo: 1,
        total: -1,
        result: {},
        list: [],
        loading: false,
        finished: false
      }
    },


    components: {
      'v-header': Header
    },

    methods: {
      onLoad() {
        this.category = this.$route.query.category;
        //category= options.category;
        console.log("category :" + this.category);
        console.log("onLoad Enter，this.list.length:" + this.list.length + "this.total:" + this.total)
        if (this.total == -1 || this.total > this.list.length) {
          let options = {
            "category": this.category,
            "pageNo": this.pageNo++
          }
          console.log("options:" + JSON.stringify(options));
          this.$api.xapi({
            method: 'post',
            url: '/prod/all',
            data: options,
          }).then((response) => {
            this.result = response.data.data.result;
            this.total = this.result.total;
            console.log("total is:" + this.total);
            this.result.list.forEach(item => {
              this.list.push(item);
            })
            this.loading = false;
            if (this.list.length >= this.total)
              this.finished = true;
          }).catch(function (error) {
            console.log(error)
            this.finished = true;
          })
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

  .detaillist {
    width: 100%;
    background-color: #f7f7f7;

    .pay-address {
      background-color: #fff;
      border-bottom: 1 * 10vw/75 solid #dedede;
      padding: 30 * 10vw/75;

      > div {
        display: -webkit-flex;
        display: -ms-flex;
        display: flex;
        justify-content: space-between;

        p {
          color: #868686;
          .fz(font-size, 32px);
        }
      }

      > p {
        .fz(font-size, 28px);
        color: #868686;
        padding-top: 30 * 10vw/75;
        letter-spacing: 3 * 10vw/75;
        line-height: 45 * 10vw/75;
      }
    }
  }
</style>
