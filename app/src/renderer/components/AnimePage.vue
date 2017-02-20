<template>
  <div>
    <div class="el-col el-menu">
      <el-menu default-active="anime-new" style="height:100%" @select="onSelect">
        <el-menu-item index="anime-new"><i class="el-icon-plus"></i>New Item</el-menu-item>
        <hr style="border-top-color: rgba(0, 0, 0, 0.05);">
        <el-submenu index="list">
          <template slot="title"><i class="el-icon-message"></i>Items</template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item one</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>
    <div class="el-col el-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dashboard-page',

    methods: {
      onSelect (route, keyPath) {
        this.$router.push({ name: route })
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
