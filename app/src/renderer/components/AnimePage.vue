<template>
  <div class="row">
    <div class="col-sm-4" style="padding-left:30px;">
      <form class="">
        <div class="form-group-icon">
          <input type="text" class="form-control" placeholder="Search">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
      </form>
    </div>
    <div class="col-sm-8" style="padding-right:30px;">
      <v-model :show="dialog.new" yes="Add" no="Cancel" :on-no="dialogClose" :on-yes="dialogClose">
      </v-model>
      <div class="btn-group pull-right" role="group" aria-label="...">
        <button type="button" class="btn btn-default" @click="dialogOpen"><i class="fa fa-plus-circle" aria-hidden="true"></i></button>
        <button type="button" class="btn btn-default"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
      </div>
    </div>
    <div class="col-sm-12 main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import store from 'renderer/vuex/store'
  export default {
    name: 'dashboard-page',
    store,
    data: () => {
      return {
        dialog: {
          new: false
        }
      }
    },
    methods: {
      dialogOpen () {
        this.dialog.new = true
      },
      dialogClose () {
        this.dialog.new = false
      }
    },
    computed: {
    },
    created () {
    }
  }
</script>

<style scoped>
  .form-group-icon > input {
    padding: 8px 24px 8px 12px;
    line-height: 3;
  }
  .form-group-icon > i {
    position: absolute;
    top: 0px;
    right: 23px;
    margin-top: 11px;
  }

  .row > .menu {
    width: 220px;
    height: 100%;
    float:left;
  }
  .row > .main {
    height: calc(100% - 90px);
    padding: 15px;
    width: 100%;
    float:left;
    overflow-y: scroll;
  }
  .panel {
    border-right: none;
    border-left: none; 
  }
  .panel, .table thead tr, .table thead th {
    border-radius: 0px !important;
  }
</style>
