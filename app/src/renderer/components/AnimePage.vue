<template>
  <div>
    <div class="el-col el-menu">
      <el-menu default-active="anime" style="height:100%" @select="onSelect">
        <el-menu-item index="anime"><i :class="anime_name?'el-icon-edit':'el-icon-plus'">
          </i><span v-text="anime_name?'Find Item':'New Item'"></span>
        </el-menu-item>
        <hr style="border-top-color: rgba(0, 0, 0, 0.05);">
      </el-menu>
    </div>
    <div class="el-col el-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store'
  export default {
    name: 'dashboard-page',
    store,
    methods: {
      onSelect (route, keyPath) {
        this.$router.push({ name: this.anime_name ? 'anime-list' : 'anime-new' })
      }
    },
    computed: {
      anime_name () {
        return this.$store.state.anime.saved
      }
    },
    created () {
    }
  }
</script>

<style scoped>
  .el-menu {
    width: 280px;
    height: 100%;
    float:left;
  }
  .el-main {
    height: calc(100% - 90px);
    padding: 15px;
    width: calc(100% - 310px);
    float:left;
    overflow-y: scroll;
  }
  img {
    width: 450px;
  }
</style>
