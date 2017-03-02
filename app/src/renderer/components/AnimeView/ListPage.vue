<template>
  <div>
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" >
        <el-button v-if="!$store.getters.offline" type="info" icon="search" :loading="search" @click="onSearchItems">Search Anime</el-button>
        <el-button type="warning" icon="upload" :loading="save" @click="onSaved">Save Anime</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="Items"
          column-key="index"
          highlight-current-row
          @current-change="onGetItem"
          style="width: 100%">
          <el-table-column
            type="varify"
            width="40">
            <template scope="scope">
              <el-icon 
                :style="{ color: scope.row.anilist ? '#11c350':'#e2e2e2' }" 
                :name="scope.row.anilist ? 'circle-check':'circle-cross'">
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column
            label="Name">
            <template scope="scope">
              <div v-if="scope.$index === rowItem.index && !getAnime" style="height:41px;margin-top: 6px;">
                <el-input
                  placeholder="Search name anime"
                  @change="onChangeName"
                  :value="scope.row.name">
                </el-input>
              </div>
              <div v-else style="height:47px">
                <div>{{scope.row.name}}</div>
                <div style="font-size:0.8rem"><b>{{getAnimePossible(scope.row)}}</b></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            property="files.length"
            align="center"
            label="Items"
            width="80">
          </el-table-column>
          <el-table-column
            property="anime.length"
            align="center"
            label="Anime"
            width="80">
          </el-table-column>
          <el-table-column
            :context="_self"
            align="center"
            width="95">
            <template scope="scope">
              <div v-if="!search">
                <el-button
                  v-if="!scope.row.anime.length"
                  size="small"
                  :type="!scope.row.verify?'':'danger'"
                  @click="onToggle(scope.$index)"
                  v-text="!scope.row.verify?'UNDO':'DELETE'">
                </el-button>
                <el-button
                  v-else
                  size="small"
                  type="success"
                  @click="onSelectAnime(scope.$index)"
                  v-text="'SELECT'">
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          size="full"
          @close="onGetAnime"
          :show-close="true"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :title="'Anime Folder -- ['+(rowItem.name || '')+']'" 
          v-model="dialogVisible">
          <el-table 
          highlight-current-row
          @row-click="onGetAnime"
          :data="rowItem.anime">
            <el-table-column property="title_romaji" width="113">
              <template scope="scope">
                <img :src="scope.row.image_url_med" width="93" height="132">
              </template>
            </el-table-column>
            <el-table-column label="Name">
              <template scope="scope">
                <p><b>English:</b> {{scope.row.title_english}}</p>
                <p><b>Romanji:</b> {{scope.row.title_romaji}}</p>
                <p><b>Japanese:</b> {{scope.row.title_japanese}}</p>
                <p><b>Type:</b> {{scope.row.type}}</p>
                <p><b>start_date:</b> {{scope.row.start_date}}</p>
                <p><b>season:</b> {{scope.row.season}}</p>
                <p><b>total_episodes:</b> {{scope.row.total_episodes}}</p>
                <p><b>airing_status:</b> {{scope.row.airing_status}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { ipcRenderer as ipc } from 'electron'
  import async from 'async-q'
  import Q from 'q'

  import axios from '../../../lib/axios'
  import store from 'renderer/vuex/store'

  ipc.on('saved-anime', (e, event) => {
    console.log('saved-anime', event)
  })

  export default {
    store,
    data () {
      return {
        dialogVisible: false,
        search: false,
        save: false,
        getAnime: null,
        rowItem: { anime: [] }
      }
    },
    computed: {
      Items () {
        let anime = this.$store.state.anime.saved.items
        return anime
      }
    },
    methods: {
      getAnimePossible (item) {
        let vm = this
        let getName = 'NONE'
        if (item.anilist) {
          for (let index in item.anime) {
            if (item.anime[index].id === item.anilist) {
              getName = item.anime[index].title_romaji
              break
            }
          }
        } else if (item.anime.length === 1) {
          vm.$store.commit('anime_anilist', { index: item.index, id: item.anime[0].id })
          getName = item.anime[0].title_romaji
        } else if (item.anime.length > 1) {
          let getName = (item.name).replace(/\[.*?\]/ig, '').trim().match(/[A-Z0-9\s]+/ig).join('').trim()
          item.anime.forEach(list => {
            if (getName.toLowerCase() === list.title_romaji.toLowerCase()) {
              vm.$store.commit('anime_anilist', { index: item.index, id: list.id })
              getName = list.title_romaji
            }
          })
        }
        return getName
      },
      onSearchItems () {
        let all = []
        let vm = this
        vm.search = true
        vm.rowItem = { anime: [] }
        vm.Items.forEach((item, index) => {
          all.push(() => {
            let def = Q.defer()
            if (!item.anilist || !item.anime.length) {
              let getName = (item.name).replace(/\[.*?\]/ig, '').trim().match(/[A-Z0-9\s]+/ig).join('').trim()
              axios({ method: 'post', url: `/anilist/search/${getName}` }).then(res => {
                vm.$store.commit('anime_search', { index: index, item: res.data })
                def.resolve()
              })
            } else {
              def.resolve()
            }
            return def.promise
          })
        })
        async.series(all).then(() => {
          vm.search = false
        }).catch(err => {
          console.log(err)
        })
      },
      onSaved () {
        let vm = this
        let all = []

        vm.save = true
        vm.Items.forEach(item => {
          if (item.anilist) {
            let getAnime = {
              id: null,
              index: item.index,
              path: item.path,
              anime: item.anime.filter(list => { return list.id === item.anilist })[0].id,
              files: item.files
            }

            all.push(() => {
              return axios({ method: 'post', data: getAnime, url: `/anilist/save`, json: true }).then(res => {
                // this.$store.commit('anime_anilist', {
                //   index: item.index,
                //   id: res.data.id
                // })
                getAnime.id = res.data.id
                getAnime.name = res.data.name
                getAnime.thumb = res.data.thumb
                return getAnime
              })
            })
          }
        })

        async.series(all).then(anime => {
          vm.save = false
          ipc.send('save-anime', anime)
          console.log('onSaved done.')
        }).catch(err => {
          vm.save = false
          console.log('onSaved', err)
        })
      },
      onToggle (index) {
        this.$store.commit('anime_remove_items', index)
      },
      onSelectAnime (index) {
        this.dialogVisible = true
      },
      onGetAnime (val) {
        if (val) this.$store.commit('anime_anilist', { index: this.rowItem.index, id: val.id })
        this.dialogVisible = false
      },
      onGetItem (val) {
        if (!this.search) this.rowItem = val
      },
      onChangeName (val) {
        if (val) this.$store.commit('anime_change_folder', { index: this.rowItem.index, name: val })
      }
    }
  }
</script>
<style scoped>
  a {
    color: rgb(50, 174, 110);
    text-decoration: none;
  }

  a:hover {
    color: rgb(40, 56, 76);
  }

  ul {
    list-style-type: none;
    margin-top: 10px;
  }

  li { display: inline-block; }
</style>
