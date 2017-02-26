<template>
  <div>
    <el-row style="margin-bottom:10px;">
      <el-col :span="24">
        <el-button type="primary" icon="search" @click="onSearchItems">Search Anime</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="$store.state.anime.saved.items"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <p v-for="file in props.row.files" v-text="file.name"></p>
            </template>
          </el-table-column>
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
            property="name"
            label="Name">
            <template scope="scope">
              <span v-if="scope.row.verify" v-text="scope.row.name"></span>
              <el-input
                v-else
                size="small"
                placeholder="Search name"
                v-model="scope.row.name">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            property="files.length"
            align="center"
            label="Items"
            width="120">
          </el-table-column>
          <el-table-column
            :context="_self"
            align="right"
            width="85">
            <template scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import moment from 'moment'
  import localforage from 'localforage'
  import async from 'async-q'
  import Q from 'q'

  import axios from '../../../lib/axios'
  import store from 'renderer/vuex/store'

  export default {
    store,
    data () {
      return {
        currentRow: null
      }
    },
    computed: {
    },
    methods: {
      handleCurrentChange (val) {
        this.currentRow = val
      },
      onSearchItems () {
        axios({ method: 'post', url: '/anilist/login' }).then(res => {
          if (res.data && res.data.expires) {
            return localforage.setItem('anilist-token', res.data).then(() => { return res.data })
          }
        }).then(data => {
          let all = []
          this.$store.state.anime.saved.items.forEach(item => {
            all.push(() => {
              var def = Q.defer()
              axios({
                method: 'post',
                url: `https://anilist.co/api/anime/search/${item.name}/?full_page=true`
              }).then(res => {
                console.log(res.data)
                def.resolve()
              })
              return def.promise
            })
          })
          async.series(all).then(results => {

          })
        }).catch(err => {
          console.log(err)
        })
      },
      handleDelete (index, row) {
        this.$store.commit('anime_remove_items', index)
        console.log(this.$store.state.anime.saved.items[index])
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
