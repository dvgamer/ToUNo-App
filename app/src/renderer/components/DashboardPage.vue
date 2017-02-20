<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-menu default-active="2" class="el-menu-main">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>Navigator One</template>
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
        <el-menu-item index="2"><i class="el-icon-menu"></i>Navigator Two</el-menu-item>
        <el-menu-item index="3"><i class="el-icon-setting"></i>Navigator Three</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="16">
      <img src="./LandingPageView/assets/logo.png" alt="electron-vue">
      <h1>Welcome.</h1>
      <current-page></current-page>
      <versions></versions>
      <links></links>
    </el-col>
  </el-row>
</template>

<script>
  import CurrentPage from './LandingPageView/CurrentPage'
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  export default {
    components: {
      CurrentPage,
      Links,
      Versions
    },
    name: 'dashboard-page'
  }
</script>

<style scoped>
  .el-menu-main {
    width: 280px;
  }
  img {
    width: 450px;
  }
</style>
