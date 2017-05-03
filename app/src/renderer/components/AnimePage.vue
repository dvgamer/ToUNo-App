<template>
  <div class="row">
    <div class="col-sm-4" style="padding-left:30px;">
      <form v-if="anime_view">
        <div class="form-group-icon">
          <input type="text" class="form-control" placeholder="Search">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
      </form>
      <form v-else>
        <button v-if="!$store.getters.offline" 
          :disabled="EventSave || EventSearch || $store.state.anime.source.length == 0" 
          :class="['btn', $store.state.anime.source.length > 0 ? 'btn-info' : '' ]"
          icon="search" 
          :loading="EventSearch" 
          @click="onSearchItems">
          <i class="fa fa-search" aria-hidden="true"></i> Search Anime
        </button>
        <button 
          :disabled="EventSave || EventSearch || $store.state.anime.source.length == 0"
          :class="['btn', $store.state.anime.source.length > 0 ? 'btn-warning' : '' ]"
          icon="upload" 
          :loading="EventSave" 
          @click="onSaveItems">
          <i class="fa fa-cloud-upload" aria-hidden="true"></i> Save Anime
        </button>
      </form>
    </div>
    <div class="col-sm-8" style="padding-right:30px;"> 
      <v-model :show="anime_dialog_new" :loading="wait"
      :yes="wait ? 'Please wait...' : 'Scan directory'" no="Cancel" :on-no="dialogClose" :on-yes="onAddAnime">
        <form class="form-horizontal" slot="body">
          <div class="form-group name">
            <label class="col-sm-3 control-label" for="txtName">Folder Name</label>
            <div class="col-sm-8">
              <input type="text" :disabled="wait" class="form-control" id="txtName" v-model="dialog.name" placeholder="Anime-01">
              <p class="help-block">Optional, Default is Generate folder group name.</p>
            </div>
          </div>
          <div class="form-group folder"> 
            <label class="col-sm-3 control-label" for="txtFolder">Folder</label>
            <div class="col-sm-8">
              <div class="input-group">
                <input :disabled="wait" type="text" class="form-control" id="txtFolder" v-model="setPath" placeholder="Directory path">
                <span class="input-group-btn">
                  <button class="btn btn-default" :disabled="wait" type="button" @click="onBrowse">Browse</button>
                </span>
              </div><!-- /input-group -->
            </div> 
          </div>
        </form>
      </v-model>
      <div class="btn-group pull-right" role="group" style="margin-left:15px;">
        <button type="button" @click="modeAdd" class="btn" :class="!anime_view ? 'btn-info':''">
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        </button>
        <button type="button" @click="modeView" class="btn" :class="anime_view ? 'btn-info':''">
          <i class="fa fa-list" aria-hidden="true"></i>
        </button>
      </div>
      <div class="btn-group pull-right" role="group">
        <button :disabled="EventSave || EventSearch" type="button" class="btn btn-primary" @click="dialogOpen">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>
        </button>
        <button type="button" 
          :disabled="EventSave || EventSearch || $store.state.anime.source.length == 0" 
          :class="['btn', $store.state.anime.source.length > 0 ? 'btn-primary' : '' ]" @click="onRefresh">
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="col-sm-12 main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import { ipcRenderer as ipc } from 'electron'
  import async from 'async-q'
  import Q from 'q'

  import axios from '../../lib/axios'
  import store from 'renderer/vuex/store'

  ipc.on('CLIENT_GET_FOLDER_ANIME', (e, path) => {
    console.log('CLIENT_GET_FOLDER_ANIME')
    store.commit('anime-loadding')
    if (path && path[0]) {
      store.commit('anime-set_path', path[0])
    }
  })

  ipc.on('CLIENT_GET_LIST_ANIME', (e, data) => {
    console.log('CLIENT_GET_LIST_ANIME')
    if (data.found) {
      store.commit('anime-new_dialog', false)
      store.commit('anime-mode-view', false)
      store.commit('anime-add_items', data.items)
    } else {
      // store.commit('anime-message', {
      //   message: 'anime folder is not found.',
      //   type: 'warning'
      // })
    }
  })

  ipc.on('CLIENT_SAVED_ANIME', (e, event) => {
    if (event.success) {
      store.commit('anime-cb')
    } else {
      console.log('verify-anime saved fail.')
    }
  })

  export default {
    name: 'dashboard-page',
    store,
    data: () => {
      return {
        dialog: {
          open: false,
          name: ''
        }
      }
    },
    methods: {
      getIndex (item) {
        return (this.$store.state.anime.items || []).indexOf(item)
      },
      onBrowse () {
        this.$store.commit('anime-loadding')
        ipc.send('SERVER_GET_FOLDER_ANIME')
        console.log('SERVER_GET_FOLDER_ANIME')
      },
      onAddAnime () {
        this.$store.commit('anime-loadding')
        this.$router.push({ name: 'anime-new' })
        ipc.send('SERVER_GET_LIST_ANIME', this.setPath)
        console.log('SERVER_GET_LIST_ANIME')
      },
      modeAdd () {
        this.$store.commit('anime-mode-view', false)
        this.$router.push({ name: 'anime-new' })
      },
      modeView () {
        this.$store.commit('anime-mode-view', true)
        this.$router.push({ name: 'anime-list' })
      },
      dialogOpen () {
        this.setPath = ''
        if (this.wait) this.$store.commit('anime-loadding')
        this.anime_dialog_new = true
      },
      dialogClose () {
        this.anime_dialog_new = false
      },
      getName (item) {
        return this.filterAnime(item).title_romaji || (item.anime.length ? `Found ${item.anime.length}` : '')
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
              console.log(index, getName)
              axios({ method: 'post', url: `/anilist/search/${getName}` }).then(res => {
                console.log('POST /', res)
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
          vm.EventSearch = false
          vm.$store.commit('anime-prepare')
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
            if (aWait) vm.EventSave = false
          })

          ipc.send('SERVER_SAVED_ANIME', anime)
          console.log('onSaved done.')
        }).catch(err => {
          vm.EventSave = false
          console.log('onSaved', err)
        })
      },
      onRefresh () {
        console.log('onRefresh', this.$store.state.anime.source.length)
      }
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
      },
      wait: {
        get () {
          return this.$store.state.anime.loadding
        }
      },
      setPath: {
        get () {
          return this.$store.state.anime.path || ''
        },
        set (nVal) {
          this.$store.commit('anime-set_path', nVal)
        }
      },
      anime_dialog_new: {
        get () {
          return this.$store.state.anime.dialog
        },
        set (nVal) {
          this.$store.commit('anime-new_dialog', nVal)
        }
      },
      anime_view: {
        get () {
          return this.$store.state.anime.viewer
        },
        set (nVal) {
          this.$store.commit('anime-mode-view', nVal)
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
      if (!this.anime_view) {
        this.$router.push({ name: 'anime-new' })
      } else {
        this.$router.push({ name: 'anime-list' })
      }
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
    padding: 15px;
    width: 100%;
  }
  .panel {
    border-right: none;
    border-left: none; 
  }
  .panel, .table thead tr, .table thead th {
    border-radius: 0px !important;
  }
  .fa-list {
    font-size: 1.35rem;
  }
  .btn[disabled] {
    cursor: default;
    color: inherit;
  }
</style>
