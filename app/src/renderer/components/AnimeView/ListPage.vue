<template>
  <div>
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" >
        <el-button v-if="!$store.getters.offline" type="info" icon="search" :loading="search" @click="onSearchItems">Search Anime</el-button>
        <el-button type="warning" icon="upload" @click="onSaved">Save Anime</el-button>
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
              <div v-if="scope.$index === rowItem.index && getAnime === 'false'" style="height:41px;margin-top: 6px;">
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
          :show-close="true"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :title="'Anime ' + (rowItem.name || '')" 
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
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import async from 'async-q'
  import Q from 'q'

  import axios from '../../../lib/axios'
  import store from 'renderer/vuex/store'

  export default {
    store,
    data () {
      return {
        dialogVisible: false,
        search: false,
        getAnime: false,
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
          let getName = (item.name).match(/[A-Z0-9\s]+/ig).join('')
          item.anime.forEach(list => {
            if (getName === list.title_romaji) {
              vm.$store.commit('anime_anilist', { index: item.index, id: list.id })
              getName = list.title_romaji
            }
          })
        }
        return getName
      },
      onSelectItem () {
        this.dialogVisible = false
      },
      onGetAnime (val) {
        this.$store.commit('anime_anilist', { index: this.rowItem.index, id: val.id })
        this.dialogVisible = false
      },
      onGetItem (val) {
        this.getAnime = false
        if (!this.search) this.rowItem = val
      },
      onChangeName (val) {
        this.$store.commit('anime_change_folder', { index: this.rowItem.index, name: val })
      },
      onSearchItems () {
        let all = []
        let vm = this
        vm.search = true
        vm.rowItem = { anime: [] }
        vm.Items.forEach((item, index) => {
          all.push(() => {
            let def = Q.defer()
            if (item.verify && !item.anime.length) {
              let getName = (item.name).match(/[A-Z0-9\s]+/ig).join('')
              axios({ method: 'post', url: `/anilist/search/${getName}` }).then(res => {
                console.log(index, res.data.length, item.name)
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
        let all = []
        let vm = this
        // [.ShellClassInfo]
        // ConfirmFileOp=0
        // NoSharing=1
        // IconFile=Folder.ico
        // IconIndex=0
        // InfoTip=Some sensible information.
        let iniDesktop = {
          '.ShellClassInfo': {
            ConfirmFileOp: 0,
            NoSharing: 1,
            IconFile: 'AnimeImage.bmp',
            IconIndex: 0,
            InfoTip: 'value'
          },
          'ToUNo-Anime': {
            id: ''
          }
        }
        vm.Items.forEach((item, index) => {
          all.push(() => {
            let def = Q.defer()
            axios({
              method: 'post',
              form: { },
              url: `/anilist/save`
            }).then(res => {
              console.log(index, res.data.length, item.name)
              vm.$store.commit('anime_search', { index: index, item: res.data })
              def.resolve()
            })
            return def.promise
          })
        })
        async.series(all).then(() => {
          console.log(iniDesktop)
        }).catch(err => {
          console.log(err)
        })
      },
      onToggle (index) {
        this.$store.commit('anime_remove_items', index)
      },
      onSelectAnime (index) {
        this.dialogVisible = true
        this.getAnime = true
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
