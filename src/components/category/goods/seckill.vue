<template lang="html">
  <div class="seckill">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">凤巢秒杀</h1>
    </v-header>

    <div class="seckillBody">
      <van-tabs v-model="active"
                @click="onClick"
                swipeabl
                background="#FF4444">
        <van-tab v-for="(item,type) in seckillTypes" :key="type" >
          <div slot="title">
            <div>选项</div>
          </div>
          内容 {{ item.title }}
        </van-tab>
      </van-tabs>
    </div>
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

    created() {
      if (this.$api.APP_ID === "10") {
        this.showHeader = false;
      }
    },
    data() {
      return {
        showHeader: true,
        active:0,
        seckillTypes: [
          {
            "title": "08:00",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "12:00",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "16:00",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "loading": false,
            "finished": false,
          },
          {
            "title": "20:00",
            "list": [],
            "total": -1,
            "pageNo": 1,
            "loading": false,
            "finished": false,
          },
        ],
      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  .seckill{
    .seckillBody {
      .van-tabs {
        &__nav {
          background-color: #1989fa;
        }
      }
    }
  }

</style>
