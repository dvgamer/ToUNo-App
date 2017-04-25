<template>
  <div class="row">
    <div class="col-sm-4" style="padding-left:30px;">
      <form v-if="anime_view">
        <div class="form-group-icon">
          <input type="text" class="form-control" placeholder="Search">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
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
                <input readonly :disabled="wait" type="text" class="form-control" id="txtFolder" v-model="setPath" placeholder="Folder">
                <span class="input-group-btn">
                  <button class="btn btn-default" :disabled="wait" type="button" @click="onBrowse">Browse</button>
                </span>
              </div><!-- /input-group -->
            </div> 
          </div>
        </form>
      </v-model>
      <div class="btn-group pull-right" role="group" style="margin-left:15px;">
        <button type="button" :disabled="!anime_view" @click="modeAdd" class="btn btn-info">
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        </button>
        <button type="button" :disabled="anime_view" @click="modeView" class="btn btn-info">
          <i class="fa fa-list" aria-hidden="true"></i>
        </button>
      </div>
      <div class="btn-group pull-right" role="group">
        <button :disabled="EventSave || EventSearch" type="button" class="btn" @click="dialogOpen">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>
        </button>
        <button :disabled="EventSave || EventSearch" type="button" class="btn" @click="onRefresh">
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
  import store from 'renderer/vuex/store'
  import localforage from 'localforage'

  ipc.on('CLIENT_GET_FOLDER_ANIME', (e, path) => {
    store.commit('anime-loadding')
    if (path && path[0]) {
      store.commit('anime-set_path', path[0])
    }
  })

  ipc.on('CLIENT_GET_LIST_ANIME', (e, data) => {
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
      onBrowse () {
        this.$store.commit('anime-loadding')
        ipc.send('SERVER_GET_FOLDER_ANIME')
      },
      onAddAnime () {
        this.$store.commit('anime-loadding')
        ipc.send('SERVER_GET_LIST_ANIME', this.setPath)
      },
      modeAdd () {
        this.$store.commit('anime-mode-view', false)
        this.$router.push('new')
      },
      modeView () {
        this.$store.commit('anime-mode-view', true)
        this.$router.push('list')
      },
      dialogOpen () {
        if (this.wait) this.$store.commit('anime-loadding')
        this.anime_dialog_new = true
      },
      dialogClose () {
        this.anime_dialog_new = false
      },
      onRefresh () {
        this.anime_dialog_new = false
      }
    },
    computed: {
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
      localforage.getItem('key').then(value => {
        console.log(value)
      })
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
  .folder input {
    background-color: #FFF;
  }
  .fa-list {
    font-size: 1.35rem;
  }
  .btn[disabled] {
    background-color: #cecece;
    background-image: none;
    color: #636363;
    border-color: #636363;
    cursor: default;
  }
</style>
