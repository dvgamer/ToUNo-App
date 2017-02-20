<template>
  <div id="app">
    <div class="header">
      <el-col v-if="!$store.state.loading">
        <el-menu class="nav-top" theme="dark" default-active="dashboard" mode="horizontal" @select="onSelect">
          <el-menu-item index="dashboard">Dashboard</el-menu-item>
          <el-menu-item index="loading">Loading</el-menu-item>
          <el-submenu index="3">
            <template slot="title">Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store'
  export default {
    store,
    data () {
      return {
        count: 0
      }
    },
    methods: {
      onSelect (route, keyPath) {
        // console.log(route, keyPath)
        this.$router.push(route)
      },
      handleSelect2 () {

      }
    },
    created () {
      this.$router.push('loading')
    }
  }
</script>

<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }
  /*#app { width: 100%; height: 100%; }*/
  body {
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
  }
  #app { 
    width: 100%;
    height: 100%;
    overflow: hidden; 
  }
  .nav-top {
    border-radius: 0px;
  }
  .container {
    padding-top: 60px;
    padding-bottom: 25px;
    height: calc(100% - 60px);
  }
  .footer {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 10px;
    background-color: #d6d6d6;
    font-size: 11px;
    font-weight: bold;
    color: #585858;
  }
  .el-menu-item > a {
    text-decoration: none;
  }
</style>
