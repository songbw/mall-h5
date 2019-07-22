<template lang="html">
  <div class="wrap" :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}">
    <van-swipe :autoplay="4000">
      <van-swipe-item v-for="(k,index) in datas.list" :key="index">
        <img :src="k.imageUrl" @click="onClick(k.targetUrl)">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
  import Util from '@/util/common'

  export default {
    props: ['datas', 'mBackgroundColor'],
    methods: {
      See(e) {
        window.location.href = e
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      gotoPromotionPage(promotionId) {
        this.$log("gotoPromotionPage:"+promotionId)
        this.$router.push({path: '/category/goods/promotion/' + promotionId});
      },
      gotoGoodsPage(mpu) {
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            baseURL: this.$api.PRODUCT_BASE_URL,
            url: '/prod',
            params: {
              mpu: mpu,
            }
          }).then((res) => {
            this.updateCurrentGoods(res.data.data.result);
            this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {

        }
      },
      onClick(targetId) {
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({path: '/index/' + id});
        } else if (targetId.startsWith("route://")) {
          let target = targetId.substr(8);
          let paths = target.split("/");
          this.$log(paths);
          if (paths[0] === 'category') {
            this.$router.push({path: '/category'})
          } else  if (paths[0] === 'coupon_center') {
            this.$router.push({path:'/user/couponCenter'})
          } else if (paths[0] === 'commodity') {
            try {
              if (paths[1] != null)
                this.gotoGoodsPage(paths[1]);
            } catch (e) {
            }
          } else if (paths[0] === 'promotion') {
            try {
              if (paths[1] != null) {
                //this.gotoGoodsPage(paths[1]);
                //this.$log("promotion:"+paths[1])
                this.gotoPromotionPage(paths[1]);
              }
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
          let userInfo = this.$store.state.appconf.userInfo;
          if (!Util.isUserEmpty(userInfo)) {
            let user = JSON.parse(userInfo);
            targetId +=  "?open_id="+user.userId+"&return_url="+window.location.href;
            this.$log(targetId)
          }
          this.See(targetId);
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  .wrap{
    .van-swipe {
      width: 100%;
      border-radius: 10px;
      a, img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

</style>
