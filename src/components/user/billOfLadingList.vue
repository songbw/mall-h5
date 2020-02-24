<template lang="html">
  <section class="main">
    <div class="noneInfo" v-if="loading">
      <v-loading></v-loading>
    </div>
    <div v-else class="listBody">
      <div v-for="" v-if="cardList.length > 0">

      </div>
      <div v-else>
         
      </div>
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

    data() {
      return {
        loading: true,
        cardList: []
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


  }

</style>
