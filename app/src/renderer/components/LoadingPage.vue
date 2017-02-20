<template>
  <div class="panel-center">
    <img src="./assets/logo.png" alt="electron-vue">
    <h1 v-text="process"></h1>
  </div>
</template>
<script>
  import { shell } from 'electron'
  import moment from 'moment'
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
      localforage.getItem('anilist-token').then(data => {
        if (data && data.expires && moment(data.expires * 1000) > moment()) {
          return data
        } else {
          return axios({ url: '/anilist/login' }).then(res => {
            if (res.data && res.data.expires) {
              return localforage.setItem('anilist-token', res.data).then(() => { return res.data })
            } else {
              shell.openExternal('https://touno.co/auth/anilist')
              throw new Error(`RESTART NOW`)
            }
          })
        }
      }).then(data => {
        vm.process = `UPDATE TOKEN...`
        store.commit('loading')
        this.$router.push('dashboard')
      }).catch(err => {
        vm.process = `${typeof err.response === 'object' ? `SERVER DOWN ${err.response.status}` : err}`
      })
      // setTimeout(() => {
      //   store.commit('loading')
      //   this.$router.push('dashboard')
      // }, 3000)
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
