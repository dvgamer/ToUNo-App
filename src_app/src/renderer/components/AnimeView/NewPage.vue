<template>
<div>
  <table class="table" style="margin-bottom: 0px;">
    <colgroup>
      <col style="width:5%"/>
      <col style="width:10%"/>
      <col style="width:55%"/>
      <col style="width:15%"/>
    </colgroup>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center">Episodes</th>
        <th>Folder Name</th>
        <th class="text-center">Action</th>
      </tr>
    </thead>
  </table>
  <div class="table-limit table-new">
    <table class="table table-striped table-hover" style="margin: -1px 0;">
      <colgroup>
        <col style="width:5%"/>
        <col style="width:10%"/>
        <col style="width:55%"/>
        <col style="width:15%"/>
      </colgroup>
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
          <td class="text-center">
            <div v-if="!EventSearch && !EventSave && !anime.id">
              <button
                :class="['btn','btn-sm', !anime.verify ? 'btn-default' : 'btn-danger' ]"
                size="small"
                @click="onToggle(anime)">
                <i class="fa" :class="!anime.verify?'fa-undo':'fa-ban'" aria-hidden="true"></i>
              </button>
              <button
                v-if="(anime.anime || []).length"
                :class="['btn','btn-sm', 'btn-success']"
                @click="onSelectAnime">
                <i class="fa fa-th-list" aria-hidden="true"></i>
              </button>
              <button
                v-if="anime.duplicate"
                :class="['btn','btn-sm', 'btn-success']">
                <i class="fa fa-folder-open" aria-hidden="true"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="Items.length == 0" class="transection">
          <td colspan="6"><span>No Transection</span></td>
        </tr>
      </tbody>
    </table>
  </div>
  <table class="table" style="margin-top: 0px;">
    <tfoot>
      <tr>
        <td>Total anime {{$store.state.anime.items.length}} items.</td>
      </tr>
    </tfoot>
  </table>
</div>
</template>

<script>
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
        let anime = null
        if (item.anime.length) anime = item.anime.filter(a => a.id === item.anilist)[0] || {}
        return anime || {}
      },
      onItems (value, row) {
        console.log(value, row)
        return false
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

<style scope>
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
.table-limit {
  height: calc(100vh - 182px);
  overflow-y: scroll;
  overflow-x: none;
}
.table > tbody {
  height: 400px;
  color: #000;
}
.table > tbody > tr.transection, .table > tbody > tr.transection:hover {
    background-color: #f9f9f9 !important;
} 
.table > tbody > tr.transection td {
  text-align: center;
  font-size: 17px;
  color: #CCC;
  padding: 10px 0px;
  height: calc(100vh - 181px);
  vertical-align: middle;
}
.table.table-new .btn-sm {
  padding: 0px 4px !important;
  font-size: 1.3rem !important;
}
.table.table-new .input-sm {
  height: 21px !important;
  padding: 2px 2px !important;
}
</style>
