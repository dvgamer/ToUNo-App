<template>
  <el-row>
    <el-col :span="24" class="panel-main">
      <img src="./assets/logo.png" alt="electron-vue">
      <h1>Welcome.</h1>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'dashboard-page'
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
