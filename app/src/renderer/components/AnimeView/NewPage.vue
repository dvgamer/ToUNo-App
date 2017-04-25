<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th style="width:5%" class="text-center">#</th>
        <th style="width:10%" class="text-center">Episodes</th>
        <th style="width:40%">Folder Name</th>
        <th style="width:30%" class="text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="anime in Items" @click="onGetItem(anime)" :class="{ 'disabled' : !!anime.id }">
        <td class="text-center" style="padding-top:12px;">
          <div v-if="!anime.id">
            <i
              v-if="!anime.prepare"
              :style="{ color: anime.duplicate ? '#F7BA2A' : anime.anilist && anime.verify ? '#13CE66':'#e2e2e2', 'font-size': '2.1rem' }" 
              :class="['fa', anime.duplicate ? 'fa-info-circle' : anime.anilist && anime.verify? 'fa-check-circle-o':'fa-times-circle-o']">
            </i>
            <i v-else style="color: #F7BA2A" name="loading"></i>
          </div>
          <span v-else>{{getIndex(anime)}}</span>
        </td>
        <td class="text-center" style="padding-top:15px;">{{getEpisodes(anime)}}</td>
        <td>
          <div v-if="getIndex(anime) === getIndex(rowItem) && !getAnime && !EventSave && anime.verify" style="height:30px">
            <input
              type="text"
              class="form-control input-sm"
              placeholder="Search name anime"
              @change="onChangeName"
              :value="anime.name" />
          </div>
          <div v-else style="height:30px">
            <input
              type="text" readonly
              class="form-control form-invisible input-sm" 
              :value="anime.name" />
            <div style="font-size:0.8rem"><b>{{getName(anime)}}</b></div>
          </div>
        </td>
        <td class="text-center" style="padding-top:15px;">
          action
        </td>
      </tr>
      <tr v-if="Items.length == 0" class="transection">
        <td colspan="6">No Transection</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="6">Total anime {{$store.state.anime.items.length}} items.</td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
  import { ipcRenderer as ipc } from 'electron'
  import async from 'async-q'
  import Q from 'q'

  import axios from '../../../lib/axios'
  import store from 'renderer/vuex/store'

  export default {
    store,
    data () {
      return {
        action: {
          search: false,
          save: false
        },
        getAnime: null,
        rowItem: { anime: [] }
      }
    },
    methods: {
      getIndex (item) {
        return (this.$store.state.anime.items || []).indexOf(item)
      },
      getName (item) {
        return this.filterAnime(item).title_romaji || (item.anime.length ? `Found ${item.anime.length}` : '')
      },
      getEpisodes (item) {
        let episode = this.filterAnime(item).total_episodes
        return episode === item.files.length ? episode : `${item.files.length}${episode ? ` (${episode})` : ''}`
      },
      filterAnime (item) {
        let anime = item.anime.filter(a => a.id === item.anilist)[0] || {}
        return anime || {}
      },
      logicAnimeName (name) {
        return name.replace(/\[.*?\]|\(.*?\)|\{.*?\}|/ig, '').trim().match(/[A-Z0-9]+/ig).join(' ')
      },
      logicAnimeCheck (item) {
        let vm = this
        if (item.anime.length === 1) {
          vm.$store.commit('anime-set_anilist', { index: vm.getIndex(item), id: item.anime[0].id })
        } else if (item.anime.length > 1) {
          let getName = vm.logicAnimeName(item.name)
          item.anime.forEach(list => {
            if (getName.toLowerCase() === list.title_romaji.toLowerCase()) {
              vm.$store.commit('anime-set_anilist', { index: vm.getIndex(item), id: list.id })
            }
          })
        }
      },
      onItems (value, row) {
        console.log(value, row)
        return false
      },
      onSearchItems () {
        let all = []
        let vm = this
        vm.EventSearch = true
        vm.rowItem = { anime: [] }
        vm.Items.forEach((item) => {
          let index = vm.getIndex(item)
          all.push(() => {
            let def = Q.defer()
            if (item.verify) {
              vm.$store.commit('anime-prepare', index)

              let getName = vm.logicAnimeName(item.name)
              axios({ method: 'post', url: `/anilist/search/${getName}` }).then(res => {
                console.log('search', res.data)
                vm.$store.commit('anime-load_list', { index: index, item: res.data })
                if (!item.anilist) vm.logicAnimeCheck(item)
                def.resolve()
              })
            } else {
              def.resolve()
            }
            return def.promise
          })
        })
        async.series(all).then(() => {
          vm.$store.commit('anime-prepare')
          vm.EventSearch = false
        }).catch(err => {
          console.log(err)
        })
      },
      onSaveItems () {
        let vm = this
        let all = []

        vm.save = true
        vm.rowItem = { anime: [] }
        vm.Items.forEach((item) => {
          if (item.verify && item.anilist) {
            let index = vm.getIndex(item)
            let getAnime = {
              id: null,
              anilist_id: item.anilist,
              path: item.path,
              files: item.files
            }
            all.push(() => {
              // console.log('setAnime', getAnime)
              vm.$store.commit('anime-prepare', index)
              return axios({
                method: 'post',
                data: getAnime,
                url: `/anilist/save`,
                json: true
              }).then(res => {
                if (!res.data.error) {
                  getAnime = res.data
                  getAnime.id = !res.data.found ? res.data.id : ''

                  vm.$store.commit('anime-save', {
                    id: getAnime.id,
                    index: index,
                    duplicate: res.data.found,
                    name: getAnime.romaji
                  })
                  return getAnime
                } else {
                  throw new Error('Server Save anime error: ' + res.data.error)
                }
              })
            })
          }
        })

        async.series(all).then(anime => {
          vm.$store.commit('anime-prepare')
          vm.$store.commit('anime-cb', () => {
            let aWait = false
            vm.Items.forEach(item => {
              if (!item.id || item.duplicate) aWait = true
            })
            if (aWait) vm.save = false
          })

          ipc.send('SERVER_SAVED_ANIME', anime)
          console.log('onSaved done.')
        }).catch(err => {
          vm.save = false
          console.log('onSaved', err)
        })
      },
      onToggle (item) {
        this.$store.commit('anime-set_verify', this.getIndex(item))
      },
      onSelectAnime () {
        this.dialogVisible = true
      },
      onGetAnime (val) {
        if (val) this.$store.commit('anime-set_anilist', { index: this.getIndex(this.rowItem), id: val.id })
        this.dialogVisible = false
      },
      onGetItem (row) {
        if (!this.EventSearch && !row.id) this.rowItem = row
      },
      onChangeName (e) {
        if (e.target.value) {
          this.$store.commit('anime-folder_name', { index: this.getIndex(this.rowItem), name: e.target.value })
          e.target.focus()
        }
      }
    },
    computed: {
      Items: {
        get: function () {
          let anime = this.$store.state.anime.items || []
          let INDEX = 0
          let LIMIT = 50
          return anime.filter((item) => {
            let check = false
            if (INDEX < LIMIT && !item.saved) {
              INDEX++
              check = true
            }
            return check
          })
        }
      },
      EventSave: {
        set (val) {
          this.$store.commit('anime-action', { save: val })
        },
        get () {
          return this.$store.state.anime.action.save
        }
      },
      EventSearch: {
        set (val) {
          this.$store.commit('anime-action', { search: val })
        },
        get () {
          return this.$store.state.anime.action.search
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
.form-invisible, .form-invisible:focus {
  height: 20px;
  padding: 0px;
  line-height: 1;
  border: none;
  background: transparent;
  background-color: transparent !important;
  outline: none;
  box-shadow: none;
}
.table-hover > tbody > tr.transection:hover {
    background-color: #FFF;
} 
.table-hover > tbody > tr.transection td {
  text-align: center;
  font-size: 17px;
  color: #CCC;
  padding: 10px 0px;
} 
</style>
