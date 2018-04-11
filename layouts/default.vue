<template>
  <div id="app"> 
    <div class="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">  <!-- v-if="$store.getters.onLoaded"> -->
        <ul class="navbar-nav mr-auto">
          <nuxt-link to="/" tag="li" active-class="active" class="nav-item" exact>
            <a class="nav-link"><i class="fas fa-home"></i> <span> DASHBOARD</span></a>
          </nuxt-link>
          <nuxt-link :to="{ name: 'anime-list' }" tag="li" active-class="active" class="nav-item" exact>
            <a class="nav-link"><i class="fas fa-list"></i> <span> ANIME</span></a>
          </nuxt-link>
        </ul>
        <ul class="nav navbar-nav navbar-right">  <!-- v-if="!$store.getters.offline"> -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>
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