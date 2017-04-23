<template>
  <div>
    <img class="bg01" src="./assets/bg-01.png">
    <img class="bg02" src="./assets/bg-02.png">
    <div class="panel-center">
      <img class="logo" src="./assets/kem-store.png">
      <div class="preload-text">{{process}}</div>
    </div>
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
      console.log('Loading')
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
  img.logo {
    width: 450px;
  }
  img.bg01, img.bg02 {
    position: absolute;
  }
  img.bg01 {
  bottom: 0px;
  left: 40px;
  }
  img.bg02 {
    width: 560px;
    top:0px;
    right: 0px;
  }
  .preload-text {
    font-size: 1.8rem;
    font-family: "Segoe UI";
    font-weight: bold;
    margin-top: 23px;
    color: #24688a;
  }
</style>
