<template>
  <div id="app" v-loading.body="$store.getters.onWait">
    <div class="header">
      <el-col v-if="$store.getters.onLoaded">
        <el-menu class="nav-top" theme="dark" default-active="dashboard" mode="horizontal" @select="onSelect">
          <el-menu-item index="dashboard">DASHBOARD</el-menu-item>
          <el-menu-item index="anime">ANIME</el-menu-item>
          <el-submenu index="option">
            <template slot="title"><i class="el-icon-setting"></i>SETTING</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
          </el-submenu>
          <el-menu-item v-if="!$store.getters.offline" class="btn-sign" index="sign" >SIGN IN</el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <router-view class="container"></router-view>
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
        if (route === 'anime') {
          this.$router.push({ name: this.$store.state.anime.saved ? 'anime-list' : 'anime-new' })
        } else {
          this.$router.push({ name: route })
        }
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

  * {
    margin: 0;
    padding: 0;
  }
  html,
  body { height: 100%; }
  body {
    display: flex;
    font-family: 'Lato', Helvetica, sans-serif;
  }
  #app { 
    width: 100%;
    height: 100%;
    overflow: hidden; 
  }
  .nav-top, .el-alert.offline {
    border-radius: 0px;
    z-index: 1;
  }
  .header {
    height: 60px;
  }
  .container {
    background-color: #FFF;
    height: calc(100% - 5px);
  }
  .panel-main.el-col {
    padding: 25px;
  }
  .footer {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 5px;
    background-color: #324157;
    font-size: 11px;
    font-weight: bold;
    color: #585858;
  }
  .el-menu-item > a {
    text-decoration: none;
  }
  .el-menu-item.btn-sign {
    float: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .el-menu-item.btn-sign:hover {
    border-bottom: 5px solid #FF4949;
  }

</style>
