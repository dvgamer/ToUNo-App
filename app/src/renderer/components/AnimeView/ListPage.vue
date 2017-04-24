<template>
  <div class="container">
    <div class="panel panel-default">
      <table class="table table-hover table-condensed">
        <thead>
          <tr>
            <th style="width:5%" class="text-center">#</th>
            <th style="width:10%" class="text-center">Episodes</th>
            <th style="width:40%">Romanji</th>
            <th style="width:5%" class="text-center">Type</th>
            <th style="width:15%" class="text-center">Start</th>
            <th style="width:10%" class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">1</td>
            <td class="text-center">12</td>
            <td>Zero kara Hajimeru Mahou no Sho</td>
            <td class="text-center">TV</td>
            <td class="text-center">Apr 10, 2017</td>
            <td class="text-center">Airing</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6">sss</td>
          </tr>
        </tfoot>
      </table>
    </div> 
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
    computed: {
      Items: {
        get: function () {
          let anime = this.$store.state.anime.items || []
          let INDEX = 0
          let LIMIT = 20
          return anime.filter((item) => {
            let check = false
            if (INDEX < LIMIT && !item.saved) {
              INDEX++
              check = true
            }
            return check
          })
        }
      }
    },
    created () {
    },
    destroyed () {
      // this.$store.commit('setSource', '')
    }
  }
</script>

<style>
.table > tbody td {
  font-size: 12px;
}
.container {
  padding-right: 0px;
}
</style>
