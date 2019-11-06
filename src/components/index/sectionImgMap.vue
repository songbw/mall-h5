<template lang="html">
  <section class="imgMap">
    <img :src="this.datas.settings.imageUrl" :usemap=mapName :ref="this.datas.settings.imageKey" @load="imgload">
    <map :name="this.datas.settings.imageKey">
      <div v-for="(k,index) in this.datas.list" :key="index">
          <area shape="rect" :coords=getCoords(k) @click="onClick(k)" alt="Sun">
      </div>
    </map>
  </section>
</template>

<script>
  export default {
    props: {
      datas: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        screenWidth: document.body.clientWidth,
        mapName:'',
        imageWidth: 0,
        imageHeight: 0,
        //coords:"0,0,100,100"
        coordsArray:[],
      }
    },
    created() {
      this.$log(this.datas);
      this.$log(this.datas.settings.imageUrl)
      this.mapName = "#"+this.datas.settings.imageKey
    },

    methods: {
      See(e) {
        window.location.href = e
      },
      updateCurrentGoods(goods) {
        this.$store.commit('SET_CURRENT_GOODS', JSON.stringify(goods));
      },
      gotoPromotionPage(promotionId) {
        this.$router.push({path: '/category/goods/promotion/' + promotionId});
      },
      gotoGoodsPage(mpu) {
        this.$router.push({path:"/detail",query:{
            mpu:mpu
          }});
/*        try {
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

        }*/
      },
      imgload(){
        this.$log(this.datas.settings.imageKey)
        this.imageWidth = this.$refs[this.datas.settings.imageKey].offsetWidth;
        this.imageHeight =  this.$refs[this.datas.settings.imageKey].offsetHeight;
        this.$log("imageWidth:"+this.imageWidth);
        this.$log("imageHeight:"+this.imageHeight);
      },
      getCoords(k) {
        let x1 = k.area.leftPer * this.imageWidth;
        let y1 = k.area.topPer * this.imageHeight;
        let x2 = x1 + k.area.widthPer*this.imageWidth
        let y2 = y1 + k.area.heightPer * this.imageHeight;
        let coords =  x1+","+y1+","+x2+","+y2;
        return coords;
      },
      onClick(k) {
        this.$log("onClick Enter")
        let targetId = k.targetUrl;
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
          } else if( paths[0] === 'promotion') {
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
          this.See(targetId);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .imgMap{
    img {
      width: 100%;
      display: inline-block;
    }
  }

</style>
