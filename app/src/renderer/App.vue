<template>
  <div id="app"> 
    <div class="header">
      <nav class="navbar navbar-default navbar-fixed-top" v-if="$store.getters.onLoaded">
        <div class="container-fluid">
          <ul class="nav navbar-nav">
            <li :class="{ 'active': $route.name == 'dashboard' }"><a href="#dashboard">DASHBOARD</a></li>
            <li :class="{ 'active': $route.name == 'anime-list' }"><a href="#list">ANIME</a></li>
            <li :class="{ 'active': $route.name == 'setting' }"><a href="#setting">SETTING</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li :class="{ 'active': $route.name == 'sign' }" v-if="!$store.getters.offline"><a href="#sign"><i class="fa fa-sign-in" aria-hidden="true"></i> SIGN IN</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <router-view></router-view>
    <div class="footer"></div>
  </div>
</template>

<script>
  // v-loading.body="$store.getters.onWait"
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
        this.$router.push({ name: route })
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

  .header {
    height: 60px;
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

</style>
