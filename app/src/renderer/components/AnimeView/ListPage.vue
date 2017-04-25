<template>
<div>
  <table class="table" style="margin-bottom: 0px;">
    <colgroup>
      <col style="width:5%">
      <col style="width:10%">
      <col style="width:40%">
      <col style="width:5%">
      <col style="width:15%">
      <col style="width:10%">
    </colgroup>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center">Episodes</th>
        <th>Romanji</th>
        <th class="text-center">Type</th>
        <th class="text-center">Start</th>
        <th class="text-center">Status</th>
      </tr>
    </thead>
  </table>

  <div class="table-limit">
    <table class="table table-striped table-hover" style="margin: -1px 0;">
      <colgroup>
        <col style="width:5%">
        <col style="width:10%">
        <col style="width:40%">
        <col style="width:5%">
        <col style="width:15%">
        <col style="width:10%">
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
          <td class="text-center" style="padding-top:15px;">
            action
          </td>
        </tr>
        <tr v-if="Items.length == 0" class="transection">
          <td colspan="4"><span>No Transection</span></td>
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
  import localforage from 'localforage'

  // import axios from '../../../lib/axios'
  import store from 'renderer/vuex/store'

  export default {
    store,
    data () {
      return {
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
      }
    },
    computed: {
      Items () {
        localforage.getItem('ANIME-SAVE')
        return []
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
</style>
