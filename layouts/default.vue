<template>
  <div id="app"> 
    <div class="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">  <!-- v-if="$store.getters.onLoaded"> -->
        <ul class="navbar-nav mr-auto">
          <router-link :to="{ name: 'dashboard' }" tag="li" active-class="active" class="nav-item" exact>
            <a class="nav-link"><i class="fas fa-home"></i> <span> DASHBOARD</span></a>
          </router-link>
          <router-link :to="{ name: 'anime-list' }" tag="li" active-class="active" class="nav-item" exact>
            <a class="nav-link"><i class="fas fa-list"></i> <span> ANIME</span></a>
          </router-link>
          <router-link :to="{ name: 'setting' }" tag="li" active-class="active" class="nav-item" exact>
            <a class="nav-link"><i class="fas fa-cogs"></i> <span> SETTING</span></a>
          </router-link>
        </ul>
        <ul class="nav navbar-nav navbar-right">  <!-- v-if="!$store.getters.offline"> -->
          <li :class="{ 'active': $route.name == 'sign' }"><a href="#sign"><i class="fas fa-user-circle"></i> SIGN IN</a></li>
        </ul>
      </nav>
    </div>
    <nuxt/>
    <div class="footer"></div>
  </div>
</template>
<script>
export default {

}
</script>