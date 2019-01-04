<template lang="html">
  <aside class="aside">
    <ul>
      <li v-for="(k,i) in datas" @click='changeTabIndex(i)'>
        <router-link :to="{path:'/category/'+k.categoryName.replace(/\//g, '-')}"  :class='{active:i==tabIndex}' replace>
          {{k.categoryName}}
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
  export default {
    props: {
      datas: {
        type: Array,
        default: function () {
          return []
        }
      }
    },

    computed: {
      tabIndex() {
        return this.$store.state.category.tabIndex
      }
    },
    methods: {
      changeTabIndex(i) {
        this.$store.commit('CHANGE_TABINDEX', i)
      }
    }
  }
</script>

<style lang="less" scoped>
  .aside {
    flex: 3.2;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: gold;

    &::-webkit-scrollbar {
      display: none
    }

    > ul {
      height: 100%;
      width: 100%;

      li {
        text-align: center;
        background: whitesmoke;

        a {
          display: block;
          padding: 4vw 4vw 4vw 2vw;
          position: relative;
          font-size: 12px;
        }

        .active {
          position: relative;
          font-size: 12px;
          font-weight: bold;
          color: #f44336;
          background: #ffffff;

          &::before {
            width: 3px;
            height: 28px;
            content: "";
            position: absolute;
            left: 0px;
            top: 50%;
            margin-top: -14px;
            background-color: firebrick;
          }
        }
      }
    }
  }
</style>
