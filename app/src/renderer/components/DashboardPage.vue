<template>
  <el-row>
    <el-col :span="24" class="panel-main">
      <img src="./assets/logo.png" alt="electron-vue">
      <h1>Welcome.</h1>
    </el-col>
  </el-row>
</template>

<script>
  import store from 'renderer/vuex/store'
  export default {
    store,
    name: 'dashboard-page',
    data () {
      return {
      }
    },
    methods: {
    },
    created () {
      if (this.$store.getters.offline && !this.$store.getters.alert) {
        this.$store.commit('LOADED')
        this.$message({
          showClose: false,
          message: 'Oops, anilist.co server down or authication fail.',
          type: 'error'
        })
      }
    }
  }
</script>

<style scoped>
  .el-menu-main {
    width: 280px;
    height: 100%;
  }
  img {
    width: 450px;
  }
</style>
