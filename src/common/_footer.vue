<template>
  <div class="navigationBar">
    <van-tabbar v-model="active" class="active_tab">
      <van-tabbar-item
        v-for="(item,index) in tabbars"
        :key="index"
        @click="tab(index,item.name)"
      >
        <span :class="currIndex == index ? active:''">{{item.title}}</span>
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? item.active : item.normal">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: "tabbar",
    data() {
      return {
        currIndex: 0,
        active: 0,
        tabbars: [
          {
            name: "/",
            title: "首页",
            normal: require('@/assets/icons/ico_home_default.png'),
            active: require('@/assets/icons/ico_home_active.png')
          },
          {
            name: "/category",
            title: "分类",
            normal: require('@/assets/icons/ico_classification.png'),
            active: require('@/assets/icons/ico_classification_active.png')
          },
          {
            name: "/car",
            title: "购物车",
            normal: require('@/assets/icons/ico_shopping_cart.png'),
            active: require('@/assets/icons/ico_shopping_cart_active.png')
          },
          {
            name: "/car/oderList",
            title: "我的订单",
            normal: require('@/assets/icons/ico_my.png'),
            active: require('@/assets/icons/ico_my_active.png')
          }
        ]
      };
    },
    mounted() {
      this.$log("active:" + this.active);
      this.$log("currentIndex:"+this.currIndex)
    },
    methods: {
      tab(index, val) {
        this.currIndex = index;
        this.$store.commit('SET_CURRENT_NAVI_INDEX', this.currIndex);
        this.$router.push(val);
      }
    }
  };
</script>

<style lang="less" scoped>
  .navigationBar{
    .active_tab img {
      width: 26px;
      height: 26px;
    }

    .van-tabbar-item--active {
      color: #f0cb92;
    }
  }

</style>
