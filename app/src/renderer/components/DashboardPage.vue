<template>
  <div class="row" style="margin:0px 15px">
    <div class="col-sm-8">
      <div class="panel panel-default">
        <div class="panel-body">
          data
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div class="panel panel-info">
        <div class="panel-heading">Panel heading without title</div>
        <div class="panel-body">
          Panel content
        </div>
      </div>
    </div>
  </div class="row">
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
      console.log('Dashboard')
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
