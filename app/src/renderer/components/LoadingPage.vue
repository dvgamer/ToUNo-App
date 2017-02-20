<template>
  <div class="panel-center">
    <img src="./LandingPageView/assets/logo.png" alt="electron-vue">
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
          console.log('req', data)
        } else {
          return axios({
            method: 'post',
            url: '/anilist/login'
          }).then(res => {
            console.log('req', res.data)
            if (res.data.access_token) {
              return localforage.setItem('anilist-token', res.data)
            } else {
              shell.openExternal('https://touno.co/auth/anilist')
              vm.process = `RESTART NOW...`
            }
          }).catch(err => {
            err = typeof err.response === 'object' ? err.response.status : err
            vm.process = `SERVER DOWN ${err}`
          })
        }
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
