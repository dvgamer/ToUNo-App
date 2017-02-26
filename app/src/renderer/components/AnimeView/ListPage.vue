<template>
  <div>
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" >
        <el-button v-if="!ApplyAll" type="info" icon="search" :loading="search" @click="onSearchItems">Search Anime</el-button>
        <el-button v-else type="primary" icon="upload" @click="onSaved">Save Anime</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="Items"
          highlight-current-row
          @current-change="onGetItem"
          style="width: 100%">
          <el-table-column
            type="varify"
            width="40">
            <template scope="scope">
              <el-icon 
                :style="{ color: scope.row.anime.length ? '#11c350':'#e2e2e2' }" 
                :name="scope.row.anime.length ? 'circle-check':'circle-cross'">
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column
            label="Name">
            <template scope="scope">
              <el-input
                v-if="scope.$index == rowItem.index"
                size="small"
                placeholder="Search name anime"
                @change="onChangeName"
                :value="scope.row.name">
              </el-input>
              <span v-else v-text="scope.row.name"></span>
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
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :title="'Anime ' + (rowItem.name || '')" 
          v-model="dialogVisible">
          <el-table 
          highlight-current-row
          @current-change="onGetAnime"
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
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="onConfirmAnime">Confirm</el-button>
          </span>
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
        rowAnime: {},
        rowItem: { anime: [] }
      }
    },
    computed: {
      Items () {
        let anime = this.$store.state.anime.saved.items
        return anime
      },
      ApplyAll () {
        let success = true
        this.Items.forEach(item => {
          if (!item.anilist || item.anime.length > 1) {
            success = false
          }
        })
        return success
      }
    },
    methods: {
      onSelectItem () {
        this.dialogVisible = false
      },
      onGetAnime (val) {
        this.rowAnime = val
      },
      onGetItem (val) {
        if (!this.search && !val.anime.length) this.rowItem = val
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
              axios({ method: 'post', url: `/anilist/${getName}` }).then(res => {
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
      onChangeName (val) {
        this.$store.commit('anime_change_folder', { index: this.rowItem.index, name: val })
      },
      onSaved () {

      },
      onToggle (index) {
        this.$store.commit('anime_remove_items', index)
      },
      onSelectAnime (index) {
        this.dialogVisible = true
        this.rowAnime = null
      },
      onConfirmAnime () {
        this.dialogVisible = false
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
