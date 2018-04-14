<template>
<div>
  <b-row>
    <b-col>
      <b-breadcrumb :items="breadcrumb"/>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form @submit.prevent="onAnimeSearch">
        <b-button-group>
          <b-dropdown variant="warning" left>
            <template slot="button-content"><i class="fas fa-bars"></i></template>
            <b-dropdown-item @click="onToggleView">{{ $store.state.newAnime ? 'NEW ANIME' : 'ALL ANIME' }}</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
          </b-dropdown>
          <b-button v-if="!$store.state.newAnime" @click="onScanAnimeFolder"><i class="fas fa-search"></i> Scan Folder</b-button>
          <b-btn v-if="!$store.state.newAnime" variant="success"><i class="fas fa-cloud-upload-alt"></i></b-btn>
          <b-input-group v-if="$store.state.newAnime">
            <b-form-input ref="btnSearch" size="sm" maxlength="50"
              placeholder="Search" style="padding-right: 26px;"></b-form-input>
            <b-input-group-append>
              <i class="fas fa-search"></i>
            </b-input-group-append>
          </b-input-group>
        </b-button-group>
      </b-form>
    </b-col>

    <b-col v-if="!$store.state.newAnime">

      <b-modal centered ref="modalAdd" hide-footer title="Choose Directory Anime" :no-fade="true" 
        :hide-header-close="anime.newWait" :no-close-on-backdrop="true"
        @shown="onInitNewAnime" :no-close-on-esc="true" :no-enforce-focus ="true">
        <b-form>
          <b-form-group horizontal label="Folder Name:" label-for="txtFolderName" maxCols="36" label-cols="10" label-class="text-sm-right"
            description="Optional, Default is Generate folder group name.">
            <b-form-input ref="txtFolderName" id="txtFolderName" type="text" placeholder="Anime-01" 
              :state="IsVerifyName" @keydown.enter.native="onBowseNext" :disabled="anime.newWait" v-model="anime.newName"></b-form-input>
          </b-form-group>
          <b-form-group horizontal label="Folder:" label-for="txtFolderPath" maxCols="36" label-cols="10" label-class="text-sm-right">
            <b-input-group>
              <b-form-input id="txtFolderPath" type="text" placeholder="Directory path" :disabled="anime.newWait"
                :readonly="true" :state="IsVerifyFolder" v-model="anime.newPath"></b-form-input>
              <b-input-group-append>
                <b-btn variant="outline-warning" @click="onBowse" :disabled="anime.newWait">Browse</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-form>
      </b-modal>

      <b-modal centered ref="modalProgress" hide-footer title="Please wait..." :hide-header-close="true" 
        :no-fade="true" :no-close-on-backdrop="false" :no-close-on-esc="true" :no-enforce-focus="true">
        <div>
          <b-progress variant="success" :value="getProgressAllMin" :max="getProgressAllMax"></b-progress>
          <b-progress variant="info" :value="getProgressMin" :max="getProgressMax" style="margin-top:6px;"></b-progress>
          <h6 v-text="getProgressText" style="color: #999; font-size: 0.8em;"></h6>
        </div>
      </b-modal>

      <b-button-toolbar style="display: block;">
        <b-button-group class="mx-1 float-right">
          <b-btn variant="info">
            <i class="fas fa-list"></i>
          </b-btn>
          <b-btn variant="info">
            <i class="fas fa-sync-alt"></i>
          </b-btn>
        </b-button-group>
        <b-button-group class="mx-1 float-right">
          <b-btn v-b-modal.modal-center @click="() => $refs.modalAdd.show()" variant="info">
            <i class="fas fa-plus-circle"></i>
          </b-btn>
        </b-button-group>
      </b-button-toolbar>
    </b-col>
  </b-row>
  <b-row style="margin-top: 15px;">
    <b-col>
      <b-card v-if="$store.state.newAnime" class="card-table">
        <b-table :striped="!!anime.listItems.length" :small="true" :hover="!!anime.listItems.length" :items="anime.listItems" 
          :fields="anime.listFields" :sort-by.sync="anime.listSortBy" :sort-desc.sync="anime.listSortDesc" :show-empty="true" 
          empty-text="Please add folder for scan new anime.">
            <col slot="table-colgroup" style="width:5%">
            <col slot="table-colgroup" style="width:10%">
            <col slot="table-colgroup" style="width:40%">
            <col slot="table-colgroup" style="width:5%">
            <col slot="table-colgroup" style="width:15%">
            <col slot="table-colgroup" style="width:10%">
          </b-table>
      </b-card>
      <b-card v-else class="card-table">
        <b-table :striped="!!anime.newItems.length" :small="true" :hover="!!anime.newItems.length" :items="anime.newItems" 
          :fields="anime.newFields" :sort-by.sync="anime.newSortBy" :sort-desc.sync="anime.newSortDesc" :show-empty="true" 
          empty-text="Please add folder for scan new anime.">
            <col slot="table-colgroup" style="width:5%"/>
            <col slot="table-colgroup" style="width:10%"/>
            <col slot="table-colgroup" style="width:55%"/>
            <col slot="table-colgroup" style="width:15%"/>
          </b-table>
      </b-card>
    </b-col>
    <nuxt />
  </b-row>
</div>

</template>

<script>
import { ipcRenderer as ipc } from 'electron'

export default {
  data () {
    return {
      progress: {
        text: 'Initialize...',
        total: 0
      },
      anime: {
        validate: {
          name: null,
          folder: null
        },
        newWait: false,
        newView: true,
        newWait: false,
        newName: '',
        newPath: '',
        groupFolder: [],
        listSortBy: 'id',
        listSortDesc: false,
        listFields: [
          { key: 'id', label: '#', sortable: true },
          { key: 'episode', label: 'Episodes', sortable: true, 'class': 'text-center' },
          { key: 'romanji', label: 'Romanji', sortable: true },
          { key: 'type', label: 'Type', sortable: true, 'class': 'text-center' },
          { key: 'airing', label: 'Airing', sortable: true },
          { key: 'status', label: 'Status', sortable: true, 'class': 'text-center' }
        ],
        listItems: [
        ],
        listSortBy: 'id',
        listSortDesc: false,
        newFields: [
          { key: 'id', label: '#', sortable: true, 'class': 'text-center' },
          { key: 'episode', label: 'Episodes', sortable: false, 'class': 'text-center' },
          { key: 'folderName', label: 'Folder Name', sortable: true },
          { key: 'action', label: '', sortable: false }
        ],
        newItems: [
        ]
      },
      breadcrumb: [
        {
          text: 'All Anime',
          active: true
        }
      ]
    }
  },
  methods: {
    getVerifyFolder () {
      for (var i = 0; i < this.anime.groupFolder.length; i++) {
        if (this.anime.newPath === this.anime.groupFolder[i].folder) {
          this.anime.validate.folder = false
          break
        }
      }
      return (this.anime.newPath && this.anime.validate.folder === null) || this.anime.newPath === ''
    },
    getVerifyName () {
      if (this.anime.newName.trim() !== '') {
        for (var i = 0; i < this.anime.groupFolder.length; i++) {
          if (this.anime.newName.trim() === this.anime.groupFolder[i].name) {
            this.anime.validate.name = false
            break
          }
        }
      }
      return this.anime.validate.name === null || this.anime.newName.trim() === ''
    },
    onInitNewAnime () {
      this.anime.newWait = false
      this.anime.newName = ''
      this.anime.newPath = ''
      this.$refs.txtFolderName.focus()
    },
    onToggleView () {
      this.$store.commit('toggleNewAnime')
      this.breadcrumb[0].text = this.$store.state.newAnime ? 'All Anime' : 'New Anime'
    },
    onAnimeSearch () {
      console.log('submit')
    },
    onBowseNext () {
      if (this.anime.newName.trim() !== '') this.onBowse()
    },
    onBowse () {
      this.anime.validate.name = null
      this.anime.validate.folder = null
      this.anime.newWait = true
      ipc.send('DIALOG_OPEN_FOLDER')
    },
    onScanAnimeFolder () {
      this.$refs.modalProgress.show()
    }
  },
  computed: {
    IsVerifyFolder () {
      return this.getVerifyFolder() ? null : false
    },
    IsVerifyName () {
      return this.getVerifyName() ? null : false
    },
    getProgressText () {
      return this.progress.text
    },
    getProgressAllMin () {
      return 0
    },
    getProgressAllMax () {
      return 0
    },
    getProgressMin () {
      return 0
    },
    getProgressMax () {
      return 0
    }
  },
  created () {
    let vm = this
    vm.$nextTick(() => {
      if (vm.$store.state.newAnime) vm.$refs.btnSearch.focus()
    })
    ipc.removeAllListeners('DIALOG_OPEN_FOLDER')
    ipc.on('DIALOG_OPEN_FOLDER', (e, data) => {
      vm.anime.newWait = false
      if (data) {
        vm.anime.newName = vm.anime.newName || data.name
        vm.anime.newPath = data.path
        if (vm.getVerifyFolder() && vm.getVerifyName()) {
          vm.anime.groupFolder.push({
            name: vm.anime.newName,
            folder: data.path
          })
          vm.anime.validate.name = null
          vm.anime.validate.folder = null
          vm.$refs.modalAdd.hide()
        } else {
          vm.anime.validate.folder = false
          console.log('validate.folder', vm.anime.validate.folder)
        }
      }
    })
  }
}
</script>
<style lang="scss">
.input-group {
  .input-group-append {
    > .svg-inline--fa {
      z-index: 4;
      margin: auto;
      margin-left: -22px;
      color: #a2a2a2;
    }
  }
}
.card-table {
  .card-body {
    padding: 0px;
    > .table {
      margin-bottom: 0px;
    }
  }
}
</style>