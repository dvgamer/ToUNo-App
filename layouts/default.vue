<template>
<div>
  <b-navbar toggleable="sm">
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item to="/" :disabled="!$store.state.initApp" :exact="true">
          <i class="fas fa-home"></i> <span> Dashboard</span>
        </b-nav-item>
        <b-nav-item to="/anime" :disabled="!$store.state.initApp">
          <i class="fas fa-list"></i> <span> Anime</span>
        </b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown :disabled="!$store.state.initApp" right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <i class="fas fa-wrench"></i> <span> Tools</span>
          </template>
          <b-dropdown-item to="/tools/rename" href="#">Regex Rename</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>

  <b-container fluid style="padding:0 .8em">
    <b-row>
      <b-col>
        <nuxt/>
      </b-col>
    </b-row> 
  </b-container>
</div>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
.breadcrumb {
  margin-top: -10px;
  margin-left: -13px;
  margin-right: -12px;
  background-color: #FFF;
  border-bottom: #e6e6e6 1px solid;
}
.navbar {
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: #303642;
  margin-bottom: 0.6em;
  .navbar-nav {
    > .nav-item > .nav-link {
      color: #8f9297;
      padding: 12px 36px;
      &.active {
        color: #FFF;
        background-color: #272b34;
      }
      &.disabled {
        cursor: default;
        color: #6c778f;
      }
    }
    .b-nav-dropdown {
      > .nav-link[aria-expanded=true] {
        background-color: #272b34;
      }
      .dropdown-menu {
        margin-top: -1px;
        background-color: #303642;
        > .dropdown-item {
          color: #8f9297;
          &:hover, &:active, &:focus {
            color: #e2e2e2;
            background-color: transparent;
          }
        }
      }

    }

  }
}
</style>

