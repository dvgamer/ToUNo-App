<template>
  <div>
    <el-row style="margin-bottom:10px;">
      <el-col :span="12" >
        <el-button v-if="!$store.getters.offline" :disabled="action.save" type="info" icon="search" :loading="action.search" @click="onSearchItems">Search Anime</el-button>
        <el-button :disabled="action.search" type="warning" icon="upload" :loading="action.save" @click="onSaveItems">Save Anime</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-pagination
          style="display: inline-block;"
          :current-page="1"
          :page-size="20"
          :page-sizes="[20, 30, 40, 50]"
          layout="sizes, total"
          :total="$store.state.anime.items.length">
        </el-pagination>
        <el-button-group v-if="Items.length">
          <el-button :disabled="action.save || action.search" type="danger" :plain="true" @click="onRefresh">
            <i class="fa fa-refresh" aria-hidden="true"></i>
          </el-button>
          <el-button :disabled="action.save || action.search" type="success" :plain="true" @click="onAdd">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </el-button>
        </el-button-group>
        <el-button v-else :disabled="action.save || action.search" type="success" :plain="true" @click="onAdd">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="Items"
          column-key="index"
          highlight-current-row
          :row-class-name="function(row,i){ return row.id ? 'disabled' : '' }"
          @row-click="onGetItem"
          style="width: 100%">
          <el-table-column
            type="varify"
            align="center"
            width="40">
            <template scope="scope">
              <div v-if="!scope.row.id">
                <el-icon
                  v-if="!scope.row.prepare"
                  :style="{ color: scope.row.duplicate ? '#F7BA2A' : scope.row.anilist && scope.row.verify ? '#13CE66':'#e2e2e2' }" 
                  :name="scope.row.duplicate ? 'information' : scope.row.anilist && scope.row.verify? 'circle-check':'circle-cross'">
                </el-icon>
                <el-icon v-else style="color: #F7BA2A" name="loading"></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Episodes"
            width="95">
            <template scope="scope">
              <div>{{getEpisodes(scope.row)}}</span></div>
            </template>
          </el-table-column>
          <el-table-column
            label="Name">
            <template scope="scope">
              <div v-if="getIndex(scope.row) === getIndex(rowItem) && !getAnime && !action.save && scope.row.verify" style="height:41px;margin-top: 6px;">
                <el-input
                  placeholder="Search name anime"
                  @change="onChangeName"
                  :value="scope.row.name">
                </el-input>
              </div>
              <div v-else style="height:47px">
                <div>{{scope.row.name}}</div>
                <div style="font-size:0.8rem"><b>{{getName(scope.row)}}</b></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :context="_self"
            align="left"
            width="140">
            <template scope="scope">
              <div v-if="!action.search && !action.save && !scope.row.id">
                <el-button
                  size="small"
                  :type="!scope.row.verify?'':'danger'"
                  @click="onToggle(scope.row)">
                  <i class="fa" :class="!scope.row.verify?'fa-undo':'fa-ban'" aria-hidden="true"></i>
                </el-button>
                <el-button
                  v-if="(scope.row.anime || []).length"
                  size="small"
                  type="success"
                  @click="onSelectAnime">
                  <i class="fa fa-th-list" aria-hidden="true"></i>
                </el-button>
                <el-button
                  v-if="scope.row.duplicate"
                  size="small"
                  type="success">
                  <i class="fa fa-folder-open" aria-hidden="true"></i>
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
          :title="'Anime Folder -- ['+(rowItem.path || '')+']'" 
          v-model="dialogVisible">
          <el-table 
          highlight-current-row
          @row-click="onGetAnime"
          :data="(rowItem || { anime: [] }).anime">
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
        <el-dialog
          @close="onGetAnime"
          :show-close="!$store.state.anime.loadding"
          :close-on-click-modal="!$store.state.anime.loadding"
          :close-on-press-escape="!$store.state.anime.loadding"
          title="Anime Scan Directory -- add item lists" 
          v-model="anime_dialog_new">
          <el-form label-position="top" label-width="100px">
            <el-form-item>
              <el-input
                placeholder="Path anime folder"
                icon="upload2"
                v-model="setPath"
                :on-icon-click="onAddBrowse">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                :loading="$store.state.anime.loadding"
                @click="onAddAnime">{{$store.state.anime.loadding ? 'Please wait...' : 'Scan directory'}}</el-button>
            </el-form-item> 
          </el-form>
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

  ipc.on('CLIENT_GET_FOLDER_ANIME', (e, path) => {
    store.commit('APP-PAUSE')
    if (path && path[0]) {
      store.commit('anime-set_path', path[0])
    }
  })

  ipc.on('CLIENT_GET_LIST_ANIME', (e, data) => {
    store.commit('anime-loadding')
    if (data.found) {
      store.commit('anime-new_dialog', false)
      store.commit('anime-add_items', data.items)
    } else {
      store.commit('anime-message', {
        message: 'anime folder is not found.',
        type: 'warning'
      })
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
    store,
    data () {
      return {
        action: {
          search: false,
          save: false
        },
        dialogVisible: false,
        getAnime: null,
        rowItem: { anime: [] }
      }
    },
    computed: {
      setPath: {
        get: function () {
          return this.$store.state.anime.path || ''
        },
        set: function (nVal) {
          this.$store.commit('anime-set_path', nVal)
        }
      },
      anime_dialog_new: {
        get: function () {
          return this.$store.state.anime.dialog
        },
        set: function (nVal) {
          this.$store.commit('anime-new_dialog', nVal)
        }
      },
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
    created: () => {

    },
    methods: {
      getIndex (item) {
        return (this.$store.state.anime.items || []).indexOf(item)
      },
      onAdd () {
        this.anime_dialog_new = true
        this.setPath = ''
      },
      onRefresh () {
        this.$store.commit('anime_reset')
        this.$router.push({ name: 'anime-new' })
      },
      onAddAnime () {
        this.$store.commit('anime-loadding')
        // {
        // //       message: 'Warning, this is a warning message.',
        // //       type: 'warning'
        // //     }
        // vm.$store.commit('anime_cb', (found) => {
        //   if (!found) {
        //     vm.$message()
        //   }
        // })
        ipc.send('SERVER_GET_LIST_ANIME', this.setPath)
      },
      onAddBrowse () {
        if (!this.$store.state.anime.loadding) {
          this.$store.commit('APP-PAUSE')
          ipc.send('SERVER_GET_FOLDER_ANIME')
        }
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
        vm.action.search = true
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
          vm.action.search = false
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
              console.log('setAnime', getAnime)
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
        if (!this.search && !row.id) this.rowItem = row
      },
      onChangeName (val) {
        if (val) this.$store.commit('anime-folder_name', { index: this.getIndex(this.rowItem), name: val })
      }
    }
  }
</script>
<style>
  tr.disabled { color: #dfe6ec; }
  .el-button--small {
    margin-left: 0px !important;
    padding: 4px 5px;
  }
  .el-button--small > span > i {
    font-size: 1.2em;
  }
  .el-table td > .cell {
    padding-left: 4px;
    padding-right: 4px;
  }

</style>
