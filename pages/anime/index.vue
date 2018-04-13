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
            <b-dropdown-item @click="onToggleView">{{ anime.newView ? 'NEW ANIME' : 'ALL ANIME' }}</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
          </b-dropdown>
          <b-button v-if="!anime.newView"><i class="fas fa-search"></i> Scan Folder</b-button>
          <b-btn v-if="!anime.newView" variant="success"><i class="fas fa-cloud-upload-alt"></i></b-btn>
          <b-input-group v-if="anime.newView">
            <b-form-input ref="btnSearch" size="sm" maxlength="50"
              placeholder="Search" style="padding-right: 26px;"></b-form-input>
            <b-input-group-append>
              <i class="fas fa-search"></i>
            </b-input-group-append>
          </b-input-group>
        </b-button-group>
      </b-form>
    </b-col>

    <b-col v-if="!anime.newView">
      <b-modal centered ref="modalAdd" hide-footer title="Choose Directory Anime" :no-fade="true"
        @shown="onInitNewAnime" :no-close-on-backdrop="true" :no-close-on-esc="true" :no-enforce-focus ="true">
        <b-form>
          <b-form-group horizontal label="Folder Name:" label-for="txtFolderName" maxCols="36" label-cols="10" label-class="text-sm-right"
            description="Optional, Default is Generate folder group name.">
            <b-form-input ref="txtFolderName" id="txtFolderName" type="text" placeholder="Anime-01" 
              @keydown.enter.native="onBowseNext" :disabled="anime.newWait" v-model="anime.newName"></b-form-input>
          </b-form-group>
          <b-form-group horizontal label="Folder:" label-for="txtFolderPath" maxCols="36" label-cols="10" label-class="text-sm-right">
            <b-input-group>
              <b-form-input id="txtFolderPath" type="text" placeholder="Directory path" 
                :disabled="true" v-model="anime.newPath"></b-form-input>
              <b-input-group-append>
                <b-btn variant="outline-warning" @click="onBowse">Browse</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-form>
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
      <b-card v-if="anime.newView" class="card-table">
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
  </b-row>
</div>

</template>

<script>
export default {
  data () {
    return {
      anime: {
        newView: true,
        newWait: false,
        newName: '',
        newPath: '',
        group: [],
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
    onInitNewAnime () {
      this.anime.newWait = true
      this.anime.newName = ''
      this.anime.newPath = ''
      this.$refs.txtFolderName.focus()
    },
    onToggleView () {
      this.anime.newView = !this.anime.newView
      this.breadcrumb[0].text = this.anime.newView ? 'All Anime' : 'New Anime'
    },
    onAnimeSearch () {
      console.log('submit')
    },
    onBowseNext () {
      if (this.anime.newName.trim() !== '') this.onBowse()
    },
    onBowse () {
      console.log('onBowse', this.anime.newName)
    }
  },
  created () {
    let vm = this
    vm.$nextTick(() => {
      if (vm.anime.newView) vm.$refs.btnSearch.focus()
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