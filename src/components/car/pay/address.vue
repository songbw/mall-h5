<template lang="html">

  <div class="address">
    <v-header>
      <h1 slot="title">地址编辑</h1>
    </v-header>
    <van-address-edit
      :area-list="areaList"
      show-postal
      show-delete
      show-set-default
      show-search-result
      :search-result="searchResult"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
    />
  </div>
</template>

<script>
  import Util from '../../../util/common'
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header
    },
    data() {
      return {
        areaList,
        searchResult: []
      }
    },

    computed: {

    },
    mounted() {

    },

    beforeCreate() {

    },

    methods: {
      onSave() {
        Toast('save');
      },
      onDelete() {
        Toast('delete');
      },
      onChangeDetail(val) {
        if (val) {
          this.searchResult = [{
            name: '黄龙万科中心',
            address: '杭州市西湖区'
          }];
        } else {
          this.searchResult = [];
        }
      }
    }

  }
</script>

<style lang="less" scoped>
  @import "../../../assets/fz.less";

</style>
