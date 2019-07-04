<template>
  <div class="navigationBar">
    <van-tabbar v-model="active" class="active_tab">
      <van-tabbar-item
        v-for="(item,index) in tabbars"
        :key="index"
        @click="tab(index,item.name)"
      >
        <span :class="currIndex == index? 'title_active' : 'title_norm'">{{item.title}}</span>
        <template slot="icon">
          <img :src="currIndex == index ? item.active : item.normal">
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
            name: "/user",
            title: "我的",
            normal: require('@/assets/icons/ico_my.png'),
            active: require('@/assets/icons/ico_my_active.png')
          }
        ]
      };
    },

    computed: {
      currIndex() {
        return this.$store.state.appconf.currentNaviIndex
      }
    },

    methods: {
      tab(index, val) {
        let lastIndex = this.$store.state.appconf.currentNaviIndex;
        this.$store.commit('SET_CURRENT_NAVI_INDEX', index);
        if(lastIndex === 0) {
          this.$router.push(val);
        } else {
          this.$router.replace(val);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .navigationBar {
    .active_tab img {
      width: 1.2em;
      height: 1.2em;
    }

    .title_active {
      color: #FF4444;
    }
    .title_norm{
      color: black;
    }
  }

</style>
