<template>
  <div id="app"> 
    <div class="header">
      <nav class="navbar navbar-default navbar-fixed-top" v-if="$store.getters.onLoaded">
        <div class="container-fluid">
          <ul class="nav navbar-nav">
            <router-link :to="{ name: 'dashboard' }" tag="li" active-class="active" exact-active-class="active">
              <a href="#"><i class="fa fa-home" aria-hidden="true"></i> <span>DASHBOARD</span></a>
            </router-link>
            <router-link :to="{ name: 'anime' }" tag="li" active-class="active" exact-active-class="active">
              <a href="#"><i class="fa fa-list" aria-hidden="true"></i> <span>ANIME</span></a>
            </router-link>
            <router-link :to="{ name: 'setting' }" tag="li" active-class="active" exact-active-class="active">
              <a href="#"><i class="fa fa-cogs" ar ia-hidden="true"></i> <span>SETTING</span></a>
            </router-link>
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
  
  i.fa-home {
    font-size: 1.8rem;
  }
  i.fa-list {
    font-size: 1.4rem;
    margin-top: 3px;
  }
  i.fa-cogs {
    font-size: 1.6rem;
  }

  .nav li a span {
    margin-left: 3px;
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
