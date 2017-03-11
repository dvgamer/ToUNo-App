<template>
  <div class="panel-center">
    <img src="./assets/logo.png" alt="electron-vue">
    <h1 v-text="process"></h1>
  </div>
</template>
<script>
  // import { shell } from 'electron'
  import localforage from 'localforage'

  import store from 'renderer/vuex/store'
  import axios from '../../lib/axios'
  export default {
    store,
    name: 'loading-page',
    data () {
      return {
        process: 'CHECK AUTH...'
      }
    },
    methods: {
      handleSelect2 () {

      }
    },
    created () {
      let vm = this
      return axios({ method: 'post', url: '/anilist' }).then(res => {
        if (res.data.token) {
          return localforage.setItem('anilist-token', res.data).then(() => { return res.data })
        } else {
          // shell.openExternal('https://touno.co/auth/anilist')
          throw new Error(`RESTART NOW`)
        }
      }).then(data => {
        console.log('Connecting... [SUCCESS]')
        vm.process = `UPDATE TOKEN...`
      }).then(data => {
        store.commit('ONLINE', true)
        this.$router.push('dashboard')
      }).catch(err => {
        console.log('Connecting... [FAIL]')
        vm.process = `OFFLINE MODE...`
        store.commit('ONLINE', false)
        this.$router.push('dashboard')
        vm.process = `${typeof err.response === 'object' ? `SERVER DOWN ${err.response.status}` : err}`
      })
    }
  }
</script>

<style scoped>
  .panel-center {
    text-align: center;
    width: 500px;
    height: 160px;
    position: absolute;
    top: calc(50% - 80px);
    left: calc(50% - 250px);
  }
  img {
    width: 450px;
  }
</style>
