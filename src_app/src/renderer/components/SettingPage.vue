<template>
  <div class="row" style="margin:0px 15px">
    <div class="col-sm-12">
      <div class="panel panel-default">
        <div class="panel-body">
          data
        </div>
      </div>
    </div>
  </div class="row">
</template>

<script>
  import store from 'renderer/vuex/store'
  export default {
    store,
    name: 'setting-page',
    data () {
      return {
      }
    },
    methods: {
    },
    created () {
      console.log('Dashboard')
    }
  }
</script>

<style scoped>
</style>
