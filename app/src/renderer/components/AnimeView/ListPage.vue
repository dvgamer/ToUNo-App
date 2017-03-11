<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col class="demo-block demo-box" style="width:600px;">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import { ipcRenderer as ipc } from 'electron'
  // import axios from '../../../lib/axios'
  import store from 'renderer/vuex/store'

  export default {
    store,
    data () {
      return {
      }
    },
    methods: {

    },
    created () {
    },
    destroyed () {
      // this.$store.commit('setSource', '')
    }
  }
</script>

<style scoped>

</style>
