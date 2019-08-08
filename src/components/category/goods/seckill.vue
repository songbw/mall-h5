<template lang="html">
  <div class="seckill">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">凤巢秒杀</h1>
    </v-header>

    <div class="seckillBody">
      <div class="seckillNavTitle">
        <div v-for="(item,type) in seckillTypes" :key="type" class="seckilltab" @click="onTabClick(type)">
          <div class="tab-item">
            <span :class="active == type? 'title_active' : 'title_norm'">{{item.title}}</span>
            <span :class="active == type? 'title_active' : 'title_norm'">xxxx</span>
          </div>
        </div>
        <div>
        </div>
      </div>
      <div class="seckillBody">
        <div v-for="(k,index) in seckillTypes" :key="index">
          <div v-if="active===index">
            {{index}}
          </div>
        </div>
      </div>
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
      onTabClick(type) {
        this.$log("tab:"+type)
        this.active = type
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";
  .seckill{
    .seckillBody {
      .seckillNavTitle{
        display: flex;
        justify-items: center;
        .seckilltab{
          display: flex;
          justify-content: center;
          align-items: Center;
          width: 50%;
          background-color: #ff4444;
          color: #ffaaaa;
        }
        .tab-item{
          display: flex;
          flex-direction: column;
          align-items: Center;
          height: 40px;
        }
        .title_active {
          color: white;
        }
        .title_norm{
          color: #ffaaaa;
        }

      }
    }
  }

</style>
